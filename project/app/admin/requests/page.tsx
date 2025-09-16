'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Search, 
  Filter, 
  Check, 
  X, 
  Clock,
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useMockApi } from '@/lib/hooks/useMockApi';
import { useUIStore } from '@/lib/stores/uiStore';

export default function RequestsPage() {
  const { getFacultyRequests, loading } = useMockApi();
  const { addNotification } = useUIStore();
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const data = await getFacultyRequests();
        setRequests(data);
      } catch (error) {
        console.error('Failed to load requests:', error);
      }
    };
    loadRequests();
  }, []);

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.reason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const requestStats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length
  };

  const handleApprove = (requestId) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'approved' } : req
    ));
    addNotification({
      title: 'Request Approved',
      message: 'Faculty request has been approved successfully.',
      type: 'success'
    });
  };

  const handleReject = (requestId) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'rejected' } : req
    ));
    addNotification({
      title: 'Request Rejected',
      message: 'Faculty request has been rejected.',
      type: 'info'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-orange-500" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
              Faculty Requests
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Review and manage faculty leave and special class requests
            </p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Total Requests',
              value: requestStats.total.toString(),
              icon: FileText,
              color: 'text-blue-600',
              bgColor: 'bg-blue-100 dark:bg-blue-900/20'
            },
            {
              title: 'Pending',
              value: requestStats.pending.toString(),
              icon: Clock,
              color: 'text-orange-600',
              bgColor: 'bg-orange-100 dark:bg-orange-900/20'
            },
            {
              title: 'Approved',
              value: requestStats.approved.toString(),
              icon: CheckCircle,
              color: 'text-green-600',
              bgColor: 'bg-green-100 dark:bg-green-900/20'
            },
            {
              title: 'Rejected',
              value: requestStats.rejected.toString(),
              icon: XCircle,
              color: 'text-red-600',
              bgColor: 'bg-red-100 dark:bg-red-900/20'
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search by teacher name or reason..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Requests List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Requests</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {filteredRequests.map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                              {request.teacherName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {request.teacherName}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {request.requestType === 'leave' ? 'Leave Request' : 'Special Class Request'}
                              </p>
                            </div>
                            <Badge className={getStatusColor(request.status)}>
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(request.status)}
                                <span className="capitalize">{request.status}</span>
                              </div>
                            </Badge>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>Date: {new Date(request.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>Submitted: {new Date(request.submittedAt).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Reason:
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {request.reason}
                            </p>
                          </div>

                          {request.affectedClasses && (
                            <div className="mb-4">
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Affected Classes:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {request.affectedClasses.map((className, idx) => (
                                  <Badge key={idx} variant="outline">
                                    {className}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {request.status === 'pending' && (
                          <div className="flex items-center space-x-2 ml-4">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Check className="w-4 h-4 mr-1" />
                                  Approve
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Approve Request</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <p>Are you sure you want to approve this request from {request.teacherName}?</p>
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Add approval note (optional):</label>
                                    <Textarea placeholder="Add any additional notes..." />
                                  </div>
                                  <div className="flex justify-end space-x-3">
                                    <Button variant="outline">Cancel</Button>
                                    <Button onClick={() => handleApprove(request.id)}>
                                      Approve Request
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>

                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                  <X className="w-4 h-4 mr-1" />
                                  Reject
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Reject Request</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <p>Are you sure you want to reject this request from {request.teacherName}?</p>
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Reason for rejection:</label>
                                    <Textarea placeholder="Please provide a reason for rejection..." />
                                  </div>
                                  <div className="flex justify-end space-x-3">
                                    <Button variant="outline">Cancel</Button>
                                    <Button variant="destructive" onClick={() => handleReject(request.id)}>
                                      Reject Request
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>

            {['pending', 'approved', 'rejected'].map(status => (
              <TabsContent key={status} value={status} className="space-y-4">
                {requests.filter(r => r.status === status).map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                                {request.teacherName.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                  {request.teacherName}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {request.requestType === 'leave' ? 'Leave Request' : 'Special Class Request'}
                                </p>
                              </div>
                              <Badge className={getStatusColor(request.status)}>
                                <div className="flex items-center space-x-1">
                                  {getStatusIcon(request.status)}
                                  <span className="capitalize">{request.status}</span>
                                </div>
                              </Badge>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span>Date: {new Date(request.date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Clock className="w-4 h-4" />
                                <span>Submitted: {new Date(request.submittedAt).toLocaleDateString()}</span>
                              </div>
                            </div>

                            <div className="mb-4">
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Reason:
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {request.reason}
                              </p>
                            </div>

                            {request.affectedClasses && (
                              <div>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  Affected Classes:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {request.affectedClasses.map((className, idx) => (
                                    <Badge key={idx} variant="outline">
                                      {className}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {request.status === 'pending' && (
                            <div className="flex items-center space-x-2 ml-4">
                              <Button variant="outline" size="sm" onClick={() => handleApprove(request.id)}>
                                <Check className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleReject(request.id)}>
                                <X className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}