'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Save, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuthStore } from '@/lib/stores/authStore';
import { useUIStore } from '@/lib/stores/uiStore';
import { StudentUser, TeacherUser, AdminUser } from '@/types';

// Validation schemas for different user types
const studentProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  enrollmentNumber: z.string().min(1, 'Enrollment number is required'),
  stream: z.string().min(1, 'Course/Branch is required'),
  year: z.number().min(1).max(4),
  semester: z.number().min(1).max(8),
});

const teacherProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  department: z.string().min(1, 'Department is required'),
  designation: z.string().min(1, 'Designation is required'),
  officeRoom: z.string().optional(),
});

const adminProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  role: z.string().min(1, 'Role is required'),
});

type StudentProfileData = z.infer<typeof studentProfileSchema>;
type TeacherProfileData = z.infer<typeof teacherProfileSchema>;
type AdminProfileData = z.infer<typeof adminProfileSchema>;

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user, updateUser } = useAuthStore();
  const { addNotification } = useUIStore();
  const [loading, setLoading] = useState(false);

  const getSchema = () => {
    switch (user?.role) {
      case 'student':
        return studentProfileSchema;
      case 'teacher':
        return teacherProfileSchema;
      case 'admin':
        return adminProfileSchema;
      default:
        return studentProfileSchema;
    }
  };

  const getDefaultValues = () => {
    if (!user) return {};
    
    switch (user.role) {
      case 'student':
        const studentUser = user as StudentUser;
        return {
          name: studentUser.name || '',
          email: studentUser.email || '',
          username: studentUser.email?.split('@')[0] || '',
          enrollmentNumber: studentUser.studentId || '',
          stream: studentUser.stream || '',
          year: studentUser.year || 1,
          semester: studentUser.semester || 1,
        };
      case 'teacher':
        const teacherUser = user as TeacherUser;
        return {
          name: teacherUser.name || '',
          email: teacherUser.email || '',
          username: teacherUser.email?.split('@')[0] || '',
          department: teacherUser.department || '',
          designation: 'Professor',
          officeRoom: '',
        };
      case 'admin':
        const adminUser = user as AdminUser;
        return {
          name: adminUser.name || '',
          email: adminUser.email || '',
          username: adminUser.email?.split('@')[0] || '',
          role: 'Administrator',
        };
      default:
        return {};
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm({
    resolver: zodResolver(getSchema()),
    defaultValues: getDefaultValues()
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update user data
    updateUser(data);
    
    setLoading(false);
    onClose();
    
    addNotification({
      title: 'Profile Updated',
      message: 'Your profile has been successfully updated.',
      type: 'success'
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <User className="w-5 h-5 mr-2" />
            Edit Profile
          </DialogTitle>
        </DialogHeader>
        
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Common Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                {...register('name')}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message as string}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                {...register('email')}
                type="email"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message as string}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                {...register('username')}
                placeholder="Enter your username"
              />
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username.message as string}</p>
              )}
            </div>
          </div>

          {/* Role-specific Fields */}
          {user.role === 'student' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="enrollmentNumber">Enrollment Number</Label>
                <Input
                  {...register('enrollmentNumber')}
                  placeholder="Enter your enrollment number"
                />
                {errors.enrollmentNumber && (
                  <p className="text-sm text-red-500">{errors.enrollmentNumber.message as string}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="stream">Course/Branch</Label>
                <Select onValueChange={(value) => setValue('stream', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Information Technology">Information Technology</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Mechanical">Mechanical</SelectItem>
                    <SelectItem value="Civil">Civil</SelectItem>
                  </SelectContent>
                </Select>
                {errors.stream && (
                  <p className="text-sm text-red-500">{errors.stream.message as string}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Select onValueChange={(value) => setValue('year', parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1st Year</SelectItem>
                      <SelectItem value="2">2nd Year</SelectItem>
                      <SelectItem value="3">3rd Year</SelectItem>
                      <SelectItem value="4">4th Year</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.year && (
                    <p className="text-sm text-red-500">{errors.year.message as string}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="semester">Semester</Label>
                  <Select onValueChange={(value) => setValue('semester', parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5,6,7,8].map(sem => (
                        <SelectItem key={sem} value={sem.toString()}>
                          Semester {sem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.semester && (
                    <p className="text-sm text-red-500">{errors.semester.message as string}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {user.role === 'teacher' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select onValueChange={(value) => setValue('department', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Information Technology">Information Technology</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Mechanical">Mechanical</SelectItem>
                    <SelectItem value="Civil">Civil</SelectItem>
                  </SelectContent>
                </Select>
                {errors.department && (
                  <p className="text-sm text-red-500">{errors.department.message as string}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Select onValueChange={(value) => setValue('designation', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select designation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Professor">Professor</SelectItem>
                    <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                    <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                    <SelectItem value="Lecturer">Lecturer</SelectItem>
                  </SelectContent>
                </Select>
                {errors.designation && (
                  <p className="text-sm text-red-500">{errors.designation.message as string}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="officeRoom">Office Room (Optional)</Label>
                <Input
                  {...register('officeRoom')}
                  placeholder="e.g., Room 301, CS Building"
                />
              </div>
            </div>
          )}

          {user.role === 'admin' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role/Privileges</Label>
                <Input
                  {...register('role')}
                  value="Administrator"
                  disabled
                  className="bg-gray-100 dark:bg-gray-800"
                />
                <p className="text-xs text-gray-500">Role cannot be changed</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
}