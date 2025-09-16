'use client';

import { useState } from 'react';
import { 
  mockUsers, 
  mockDashboardStats, 
  mockFacultyRequests, 
  mockTimetables,
  mockSubjects,
  mockTeachers,
  mockExams
} from '@/data/mockData';
import { Role, DashboardStats, FacultyRequest, Timetable, Subject } from '@/types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useMockApi = () => {
  const [loading, setLoading] = useState(false);

  const getDashboardStats = async (role: Role): Promise<DashboardStats> => {
    setLoading(true);
    await delay(800);
    setLoading(false);
    return mockDashboardStats[role];
  };

  const getFacultyRequests = async (): Promise<FacultyRequest[]> => {
    setLoading(true);
    await delay(600);
    setLoading(false);
    return mockFacultyRequests;
  };

  const getTimetables = async (branch?: string, semester?: number): Promise<Timetable[]> => {
    setLoading(true);
    await delay(700);
    setLoading(false);
    
    let filtered = mockTimetables;
    if (branch) {
      filtered = filtered.filter(t => t.branch === branch);
    }
    if (semester) {
      filtered = filtered.filter(t => t.semester === semester);
    }
    
    return filtered;
  };

  const getSubjects = async (): Promise<Subject[]> => {
    setLoading(true);
    await delay(500);
    setLoading(false);
    return mockSubjects;
  };

  const getTeachers = async () => {
    setLoading(true);
    await delay(400);
    setLoading(false);
    return mockTeachers;
  };

  const getExams = async () => {
    setLoading(true);
    await delay(300);
    setLoading(false);
    return mockExams;
  };

  const login = async (email: string, password: string, role: Role) => {
    setLoading(true);
    await delay(1000);
    setLoading(false);
    
    // Simulate authentication
    if (password === 'password123') {
      return mockUsers[role];
    }
    throw new Error('Invalid credentials');
  };

  const register = async (userData: any, role: Role) => {
    setLoading(true);
    await delay(1200);
    setLoading(false);
    
    // Simulate registration
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      ...userData,
      role,
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'
    };
    
    return newUser;
  };

  const submitFacultyRequest = async (request: Omit<FacultyRequest, 'id' | 'status' | 'submittedAt'>) => {
    setLoading(true);
    await delay(800);
    setLoading(false);
    
    return {
      ...request,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending' as const,
      submittedAt: new Date().toISOString()
    };
  };

  const generateTimetable = async (formData: any) => {
    setLoading(true);
    await delay(3000); // Simulate AI processing time
    setLoading(false);
    
    // Generate realistic timetable options based on form data
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
    
    const generateSchedule = (subjects: any[], efficiency: number) => {
      const schedule: any = {};
      
      days.forEach(day => {
        schedule[day] = [];
        timeSlots.forEach((time, index) => {
          if (time === formData.lunchStartTime) {
            schedule[day].push({
              time: `${time} - ${String(parseInt(time.split(':')[0]) + 1).padStart(2, '0')}:00`,
              subject: 'Lunch Break',
              teacher: '',
              room: 'Cafeteria',
              type: 'lunch'
            });
          } else if (subjects.length > 0) {
            const subject = subjects[index % subjects.length];
            schedule[day].push({
              time: `${time} - ${String(parseInt(time.split(':')[0]) + 1).padStart(2, '0')}:00`,
              subject: subject.name || `Subject ${index + 1}`,
              teacher: subject.teacher || 'TBD',
              room: subject.type === 'lab' ? `Lab-${index + 1}` : `Room-${index + 1}`,
              type: subject.type || 'theory'
            });
          }
        });
      });
      
      return schedule;
    };
    
    return [
      {
        id: 'option-1',
        name: 'Balanced Distribution',
        description: 'Evenly distributed subjects across all days with optimal break timing and minimal teacher conflicts.',
        efficiency: 95,
        conflicts: 0,
        schedule: generateSchedule(formData.subjects, 95)
      },
      {
        id: 'option-2',
        name: 'Morning Intensive',
        description: 'Concentrated morning sessions with lighter afternoons, ideal for better student attention.',
        efficiency: 88,
        conflicts: 1,
        schedule: generateSchedule(formData.subjects, 88)
      },
      {
        id: 'option-3',
        name: 'Lab-Theory Optimized',
        description: 'Strategic placement of lab and theory sessions for maximum learning efficiency.',
        efficiency: 92,
        conflicts: 0,
        schedule: generateSchedule(formData.subjects, 92)
      }
    ];
  };

  const checkForClashes = async (timeSlot: any, currentTimetable: any) => {
    await delay(200);
    
    // Mock clash detection logic
    const hasClash = Math.random() > 0.8; // 20% chance of clash
    
    if (hasClash) {
      return {
        hasClash: true,
        clashType: 'teacher_conflict',
        message: 'Teacher has another class at this time'
      };
    }
    
    return { hasClash: false };
  };

  return {
    loading,
    getDashboardStats,
    getFacultyRequests,
    getTimetables,
    getSubjects,
    getTeachers,
    getExams,
    login,
    register,
    submitFacultyRequest,
    generateTimetable,
    checkForClashes
  };
};