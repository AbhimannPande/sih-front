'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Calendar, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Edit, 
  Trash2, 
  Eye, 
  ArrowLeft,
  Clock,
  Users,
  BookOpen,
  MapPin,
  RefreshCw
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import DashboardLayout from '@/components/layouts/DashboardLayout';
import { TimetableLoadingSkeleton } from '@/components/ui/loading-skeleton';
import { useMockApi } from '@/lib/hooks/useMockApi';
import { useUIStore } from '@/lib/stores/uiStore';
import { Timetable } from '@/types';

const branches = [
  'Computer Science',
  'Information Technology',
  'Electronics & Communication', 
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering'
];

const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];

interface TimetableViewProps {
  timetable: Timetable;
}

const TimetableView = ({ timetable }: TimetableViewProps) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const periods = Array.from({ length: timetable.periodsPerDay }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <span className="font-medium text-gray-600">Branch:</span>
          <p className="font-semibold">{timetable.branch}</p>
        </div>
        <div>
          <span className="font-medium text-gray-600">Semester:</span>
          <p className="font-semibold">{timetable.semester}</p>
        </div>
        <div>
          <span className="font-medium text-gray-600">Stream:</span>
          <p className="font-semibold">{timetable.stream}</p>
        </div>
        <div>
          <span className="font-medium text-gray-600">Periods/Day:</span>
          <p className="font-semibold">{timetable.periodsPerDay}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Period</TableHead>
              {days.map((day) => (
                <TableHead key={day} className="text-center min-w-32">
                  {day}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {periods.map((period) => (
              <TableRow key={period}>
                <TableCell className="font-medium text-center">
                  {period}
                  {period === timetable.lunchPeriod && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      Lunch
                    </Badge>
                  )}
                </TableCell>
                {days.map((day) => {
                  const slot = timetable.timeSlots.find(
                    (ts) => ts.day === day && ts.period === period
                  );
                  
                  const isLunch = period === timetable.lunchPeriod;
                  
                  return (
                    <TableCell key={`${day}-${period}`} className="text-center p-2">
                      {isLunch ? (
                        <div className="bg-orange-50 dark:bg-orange-900/20 rounded p-2">
                          <div className="text-sm font-medium text-orange-800 dark:text-orange-200">
                            Lunch Break
                          </div>
                        </div>
                      ) : slot ? (
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-2 space-y-1">
                          <div className="font-semibold text-sm text-blue-900 dark:text-blue-100">
                            {slot.subject?.name || 'Free Period'}
                          </div>
                          {slot.teacher && (
                            <div className="text-xs text-blue-600 dark:text-blue-300">
                              {slot.teacher}
                            </div>
                          )}
                          {slot.room && (
                            <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center justify-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {slot.room}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-gray-50 dark:bg-gray-800 rounded p-2">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Free Period
                          </div>
                        </div>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default function TimetableViewPage() {
  const router = useRouter();
  const { getTimetables, loading } = useMockApi();
  const { addNotification } = useUIStore();
  
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [filteredTimetables, setFilteredTimetables] = useState<Timetable[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [selectedTimetable, setSelectedTimetable] = useState<Timetable | null>(null);

  useEffect(() => {
    loadTimetables();
  }, []);

  useEffect(() => {
    filterTimetables();
  }, [timetables, searchQuery, selectedBranch, selectedSemester]);

  const loadTimetables = async () => {
    try {
      const data = await getTimetables();
      setTimetables(data);
    } catch (error) {
      addNotification({
        title: 'Error',
        message: 'Failed to load timetables',
        type: 'error'
      });
    }
  };

  const filterTimetables = () => {
    let filtered = timetables;

    if (searchQuery) {
      filtered = filtered.filter(
        (tt) =>
          tt.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tt.stream.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedBranch !== 'all') {
      filtered = filtered.filter((tt) => tt.branch === selectedBranch);
    }

    if (selectedSemester !== 'all') {
      filtered = filtered.filter((tt) => tt.semester.toString() === selectedSemester);
    }

    setFilteredTimetables(filtered);
  };

  const handleDelete = async (timetableId: string) => {
    try {
      // Simulate delete API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTimetables(prev => prev.filter(tt => tt.id !== timetableId));
      addNotification({
        title: 'Deleted',
        message: 'Timetable has been deleted successfully',
        type: 'success'
      });
    } catch (error) {
      addNotification({
        title: 'Error',
        message: 'Failed to delete timetable',
        type: 'error'
      });
    }
  };

  const handleExport = (timetable: Timetable, format: 'pdf' | 'excel' | 'csv') => {
    addNotification({
      title: 'Export Started',
      message: `Exporting ${timetable.branch} Semester ${timetable.semester} timetable as ${format.toUpperCase()}...`,
      type: 'info'
    });

    // Simulate export
    setTimeout(() => {
      addNotification({
        title: 'Export Complete',
        message: `Timetable exported successfully`,
        type: 'success'
      });
    }, 2000);
  };

  if (loading && timetables.length === 0) {
    return (
      <DashboardLayout>
        <TimetableLoadingSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Timetable Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              View, manage, and export existing timetables
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <Button variant="outline" onClick={loadTimetables} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Link href="/admin/timetable/generate">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Plus className="w-4 h-4 mr-2" />
                Generate New
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search timetables..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Branch</label>
                  <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                    <SelectTrigger>
                      <SelectValue placeholder="All branches" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Branches</SelectItem>
                      {branches.map((branch) => (
                        <SelectItem key={branch} value={branch}>
                          {branch}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Semester</label>
                  <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                    <SelectTrigger>
                      <SelectValue placeholder="All semesters" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Semesters</SelectItem>
                      {semesters.map((semester) => (
                        <SelectItem key={semester} value={semester}>
                          Semester {semester}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Timetables Grid/List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="grid" className="space-y-6">
            <TabsList>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="table">Table View</TabsTrigger>
            </TabsList>

            <TabsContent value="grid" className="space-y-6">
              {filteredTimetables.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Calendar className="w-16 h-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No timetables found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
                      {searchQuery || selectedBranch !== 'all' || selectedSemester !== 'all'
                        ? 'Try adjusting your filters to see more results.'
                        : 'Get started by generating your first timetable.'}
                    </p>
                    <Link href="/admin/timetable/generate">
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Generate Timetable
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTimetables.map((timetable, index) => (
                    <motion.div
                      key={timetable.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Card className="hover:shadow-lg transition-all duration-200">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{timetable.branch}</CardTitle>
                            <Badge variant="secondary">
                              Sem {timetable.semester}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {timetable.stream} • {timetable.periodsPerDay} periods/day
                          </p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2 text-gray-500" />
                              <span>Created: {new Date(timetable.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center">
                              <BookOpen className="w-4 h-4 mr-2 text-gray-500" />
                              <span>{timetable.timeSlots.filter(ts => ts.subject).length} subjects</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1"
                                  onClick={() => setSelectedTimetable(timetable)}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
                                <DialogHeader>
                                  <DialogTitle>
                                    {timetable.branch} - Semester {timetable.semester}
                                  </DialogTitle>
                                </DialogHeader>
                                {selectedTimetable && (
                                  <TimetableView timetable={selectedTimetable} />
                                )}
                              </DialogContent>
                            </Dialog>

                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Timetable</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete the timetable for {timetable.branch} Semester {timetable.semester}? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(timetable.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>

                          <div className="flex items-center space-x-2 pt-2 border-t">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleExport(timetable, 'pdf')}
                            >
                              <Download className="w-4 h-4 mr-1" />
                              PDF
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleExport(timetable, 'excel')}
                            >
                              <Download className="w-4 h-4 mr-1" />
                              Excel
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="table">
              <Card>
                <CardHeader>
                  <CardTitle>All Timetables</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Branch</TableHead>
                        <TableHead>Semester</TableHead>
                        <TableHead>Stream</TableHead>
                        <TableHead>Periods/Day</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Last Modified</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTimetables.map((timetable) => (
                        <TableRow key={timetable.id}>
                          <TableCell className="font-medium">
                            {timetable.branch}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              Semester {timetable.semester}
                            </Badge>
                          </TableCell>
                          <TableCell>{timetable.stream}</TableCell>
                          <TableCell>{timetable.periodsPerDay}</TableCell>
                          <TableCell>
                            {new Date(timetable.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {new Date(timetable.lastModified).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedTimetable(timetable)}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
                                  <DialogHeader>
                                    <DialogTitle>
                                      {timetable.branch} - Semester {timetable.semester}
                                    </DialogTitle>
                                  </DialogHeader>
                                  {selectedTimetable && (
                                    <TimetableView timetable={selectedTimetable} />
                                  )}
                                </DialogContent>
                              </Dialog>

                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Timetable</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete the timetable for {timetable.branch} Semester {timetable.semester}? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(timetable.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}