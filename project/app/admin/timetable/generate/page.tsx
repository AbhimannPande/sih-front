'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Calendar, 
  Clock, 
  Users, 
  BookOpen, 
  Plus, 
  Trash2, 
  Download,
  FileText,
  Sparkles,
  ArrowLeft,
  Check,
  AlertCircle
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useMockApi } from '@/lib/hooks/useMockApi';
import { useUIStore } from '@/lib/stores/uiStore';
import { z } from 'zod';

const timetableFormSchema = z.object({
  branch: z.string().min(1, 'Branch is required'),
  semester: z.string().min(1, 'Semester is required'),
  classDuration: z.number().min(30, 'Class duration must be at least 30 minutes').max(180, 'Class duration cannot exceed 180 minutes'),
  lunchDuration: z.number().min(30, 'Lunch duration must be at least 30 minutes').max(120, 'Lunch duration cannot exceed 120 minutes'),
  lunchStartTime: z.string().min(1, 'Lunch start time is required'),
  subjects: z.array(z.object({
    name: z.string().min(1, 'Subject name is required'),
    teacher: z.string().min(1, 'Teacher is required'),
    hoursPerWeek: z.number().min(1, 'Hours per week must be at least 1').max(10, 'Hours per week cannot exceed 10'),
    type: z.enum(['theory', 'lab', 'tutorial'])
  })).min(1, 'At least one subject is required')
});

type TimetableFormData = z.infer<typeof timetableFormSchema>;

const branches = [
  'Computer Science',
  'Information Technology',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering'
];

const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];

const teachers = [
  'Dr. Sarah Wilson',
  'Dr. John Smith',
  'Dr. Emily Brown',
  'Dr. Michael Davis',
  'Dr. Lisa Anderson',
  'Dr. Robert Johnson',
  'Dr. Maria Garcia',
  'Dr. David Lee'
];

const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
];

interface GeneratedTimetable {
  id: string;
  name: string;
  description: string;
  efficiency: number;
  conflicts: number;
  schedule: {
    [day: string]: {
      time: string;
      subject: string;
      teacher: string;
      room: string;
      type: 'theory' | 'lab' | 'tutorial' | 'lunch' | 'break';
    }[];
  };
}

export default function TimetableGeneratePage() {
  const router = useRouter();
  const { generateTimetable, loading } = useMockApi();
  const { addNotification } = useUIStore();
  const [currentStep, setCurrentStep] = useState<'form' | 'generating' | 'selection'>('form');
  const [generatedOptions, setGeneratedOptions] = useState<GeneratedTimetable[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<TimetableFormData>({
    resolver: zodResolver(timetableFormSchema),
    defaultValues: {
      classDuration: 60,
      lunchDuration: 60,
      lunchStartTime: '12:00',
      subjects: [
        { name: '', teacher: '', hoursPerWeek: 3, type: 'theory' }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'subjects'
  });

  const onSubmit = async (data: TimetableFormData) => {
    setCurrentStep('generating');
    setProgress(0);

    // Simulate AI generation progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      const options = await generateTimetable(data);
      
      // Complete progress
      setProgress(100);
      setTimeout(() => {
        setGeneratedOptions(options);
        setCurrentStep('selection');
        clearInterval(progressInterval);
      }, 500);

      addNotification({
        title: 'Timetables Generated',
        message: 'AI has generated 3 optimized timetable options for you to choose from.',
        type: 'success'
      });
    } catch (error) {
      clearInterval(progressInterval);
      setCurrentStep('form');
      addNotification({
        title: 'Generation Failed',
        message: 'Failed to generate timetables. Please try again.',
        type: 'error'
      });
    }
  };

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    const selectedTimetable = generatedOptions.find(opt => opt.id === selectedOption);
    if (!selectedTimetable) return;

    // Simulate file download
    const fileName = `timetable_${selectedTimetable.name.toLowerCase().replace(/\s+/g, '_')}.${format}`;
    
    addNotification({
      title: 'Export Started',
      message: `Downloading ${fileName}...`,
      type: 'info'
    });

    // Simulate download delay
    setTimeout(() => {
      addNotification({
        title: 'Export Complete',
        message: `${fileName} has been downloaded successfully.`,
        type: 'success'
      });
    }, 2000);
  };

  const renderFormStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Generate Timetable
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Configure your timetable parameters and let AI create optimized schedules
          </p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <Select onValueChange={(value) => setValue('branch', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch} value={branch}>
                        {branch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.branch && (
                  <p className="text-sm text-red-500">{errors.branch.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Select onValueChange={(value) => setValue('semester', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((semester) => (
                      <SelectItem key={semester} value={semester}>
                        Semester {semester}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.semester && (
                  <p className="text-sm text-red-500">{errors.semester.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Time Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Time Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="classDuration">Class Duration (minutes)</Label>
                <Input
                  {...register('classDuration', { valueAsNumber: true })}
                  type="number"
                  min="30"
                  max="180"
                  step="15"
                  placeholder="60"
                />
                {errors.classDuration && (
                  <p className="text-sm text-red-500">{errors.classDuration.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lunchDuration">Lunch Duration (minutes)</Label>
                <Input
                  {...register('lunchDuration', { valueAsNumber: true })}
                  type="number"
                  min="30"
                  max="120"
                  step="15"
                  placeholder="60"
                />
                {errors.lunchDuration && (
                  <p className="text-sm text-red-500">{errors.lunchDuration.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lunchStartTime">Lunch Start Time</Label>
                <Select onValueChange={(value) => setValue('lunchStartTime', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.lunchStartTime && (
                  <p className="text-sm text-red-500">{errors.lunchStartTime.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subjects Configuration */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Subjects & Teachers
              </CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ name: '', teacher: '', hoursPerWeek: 3, type: 'theory' })}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Subject
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border rounded-lg space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Subject {index + 1}</h4>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Subject Name</Label>
                    <Input
                      {...register(`subjects.${index}.name`)}
                      placeholder="e.g., Data Structures"
                    />
                    {errors.subjects?.[index]?.name && (
                      <p className="text-sm text-red-500">{errors.subjects[index]?.name?.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Teacher</Label>
                    <Select onValueChange={(value) => setValue(`subjects.${index}.teacher`, value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select teacher" />
                      </SelectTrigger>
                      <SelectContent>
                        {teachers.map((teacher) => (
                          <SelectItem key={teacher} value={teacher}>
                            {teacher}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.subjects?.[index]?.teacher && (
                      <p className="text-sm text-red-500">{errors.subjects[index]?.teacher?.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Hours/Week</Label>
                    <Input
                      {...register(`subjects.${index}.hoursPerWeek`, { valueAsNumber: true })}
                      type="number"
                      min="1"
                      max="10"
                      placeholder="3"
                    />
                    {errors.subjects?.[index]?.hoursPerWeek && (
                      <p className="text-sm text-red-500">{errors.subjects[index]?.hoursPerWeek?.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select onValueChange={(value) => setValue(`subjects.${index}.type`, value as 'theory' | 'lab' | 'tutorial')}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="theory">Theory</SelectItem>
                        <SelectItem value="lab">Lab</SelectItem>
                        <SelectItem value="tutorial">Tutorial</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.subjects?.[index]?.type && (
                      <p className="text-sm text-red-500">{errors.subjects[index]?.type?.message}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600" disabled={loading}>
            <Sparkles className="w-5 h-5 mr-2" />
            Generate AI Timetables
          </Button>
        </div>
      </form>
    </motion.div>
  );

  const renderGeneratingStep = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[60vh] space-y-8"
    >
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto">
          <Sparkles className="w-10 h-10 text-white animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          AI is Generating Your Timetables
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md">
          Our advanced AI is analyzing your requirements and creating optimized timetable options...
        </p>
      </div>

      <div className="w-full max-w-md space-y-4">
        <Progress value={progress} className="h-2" />
        <div className="text-center text-sm text-gray-500">
          {progress < 30 && "Analyzing subjects and constraints..."}
          {progress >= 30 && progress < 60 && "Optimizing teacher schedules..."}
          {progress >= 60 && progress < 90 && "Checking for conflicts..."}
          {progress >= 90 && "Finalizing timetable options..."}
        </div>
      </div>
    </motion.div>
  );

  const renderSelectionStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Choose Your Timetable
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            AI has generated 3 optimized options. Select the one that works best for you.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => setCurrentStep('form')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Form
          </Button>
          {selectedOption && (
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => handleExport('pdf')}>
                <Download className="w-4 h-4 mr-2" />
                PDF
              </Button>
              <Button variant="outline" onClick={() => handleExport('excel')}>
                <Download className="w-4 h-4 mr-2" />
                Excel
              </Button>
              <Button variant="outline" onClick={() => handleExport('csv')}>
                <Download className="w-4 h-4 mr-2" />
                CSV
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {generatedOptions.map((option, index) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedOption === option.id 
                  ? 'ring-2 ring-blue-500 border-blue-500' 
                  : 'hover:border-blue-300'
              }`}
              onClick={() => setSelectedOption(option.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    {selectedOption === option.id && (
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    {option.name}
                  </CardTitle>
                  <Badge variant={option.conflicts === 0 ? 'default' : 'destructive'}>
                    {option.efficiency}% Efficient
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {option.description}
                </p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Conflicts:</span>
                    <div className="flex items-center mt-1">
                      {option.conflicts === 0 ? (
                        <Check className="w-4 h-4 text-green-500 mr-1" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500 mr-1" />
                      )}
                      {option.conflicts} issues
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Efficiency:</span>
                    <div className="mt-1">
                      <Progress value={option.efficiency} className="h-2" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Sample Schedule (Monday)</h4>
                  <div className="space-y-1 text-xs">
                    {option.schedule.Monday?.slice(0, 3).map((slot, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{slot.time}</span>
                        <span className="font-medium">{slot.subject}</span>
                      </div>
                    ))}
                    <div className="text-gray-500">+ more...</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
        {/* Generated Timetable Display */}
        {selectedOption && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Generated Timetable - {generatedOptions.find(opt => opt.id === selectedOption)?.name}</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant="default">
                      {generatedOptions.find(opt => opt.id === selectedOption)?.efficiency}% Efficient
                    </Badge>
                    <Badge variant={generatedOptions.find(opt => opt.id === selectedOption)?.conflicts === 0 ? 'default' : 'destructive'}>
                      {generatedOptions.find(opt => opt.id === selectedOption)?.conflicts} Conflicts
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800">
                        <th className="border border-gray-300 p-3 text-left font-semibold min-w-[120px]">
                          Day/Time
                        </th>
                        <th className="border border-gray-300 p-3 text-center font-semibold min-w-[140px]">09:00-10:00</th>
                        <th className="border border-gray-300 p-3 text-center font-semibold min-w-[140px]">10:00-11:00</th>
                        <th className="border border-gray-300 p-3 text-center font-semibold min-w-[140px]">11:00-12:00</th>
                        <th className="border border-gray-300 p-3 text-center font-semibold min-w-[140px]">12:00-13:00</th>
                        <th className="border border-gray-300 p-3 text-center font-semibold min-w-[140px]">13:00-14:00</th>
                        <th className="border border-gray-300 p-3 text-center font-semibold min-w-[140px]">14:00-15:00</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(generatedOptions.find(opt => opt.id === selectedOption)?.schedule || {}).map(([day, slots], dayIndex) => (
                        <motion.tr
                          key={day}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.9 + dayIndex * 0.1 }}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        >
                          <td className="border border-gray-300 p-3 font-semibold bg-gray-50 dark:bg-gray-800">
                            {day}
                          </td>
                          {slots.map((slot, slotIndex) => (
                            <td
                              key={slotIndex}
                              className={`border border-gray-300 p-2 text-center text-sm ${
                                slot.type === 'lunch' 
                                  ? 'bg-orange-50 border-orange-200 text-orange-900' 
                                  : slot.type === 'lab'
                                  ? 'bg-green-50 border-green-200 text-green-900'
                                  : 'bg-blue-50 border-blue-200 text-blue-900'
                              }`}
                            >
                              <div className="space-y-1">
                                <div className="font-semibold">
                                  {slot.subject}
                                </div>
                                {slot.teacher && (
                                  <div className="text-xs opacity-75">
                                    {slot.teacher}
                                  </div>
                                )}
                                {slot.room && (
                                  <div className="text-xs opacity-75">
                                    {slot.room}
                                  </div>
                                )}
                              </div>
                            </td>
                          ))}
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

      {selectedOption && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Alert>
            <Check className="h-4 w-4" />
            <AlertDescription>
              Timetable selected! You can now export it in your preferred format using the buttons above.
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
    </motion.div>
  );

  return (
    <DashboardLayout>
      <AnimatePresence mode="wait">
        {currentStep === 'form' && renderFormStep()}
        {currentStep === 'generating' && renderGeneratingStep()}
        {currentStep === 'selection' && renderSelectionStep()}
      </AnimatePresence>
    </DashboardLayout>
  );
}