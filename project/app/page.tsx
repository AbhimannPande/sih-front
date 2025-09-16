'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { 
  Calendar, 
  Users, 
  BookOpen, 
  Clock, 
  ArrowRight, 
  Star, 
  Shield, 
  Zap,
  GraduationCap,
  UserCheck,
  Settings,
  CheckCircle,
  Bell,
  BarChart3,
  Sparkles,
  Brain,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

const roleCards = [
  {
    role: 'student',
    title: 'Student Portal',
    description: 'Access your class schedules, exam dates, and faculty information',
    icon: GraduationCap,
    color: 'from-blue-500 to-cyan-500',
    features: ['View Timetables', 'Exam Schedules', 'Faculty Directory', 'Class Updates']
  },
  {
    role: 'teacher',
    title: 'Faculty Dashboard',
    description: 'Manage your classes, submit requests, and view your schedule',
    icon: UserCheck,
    color: 'from-green-500 to-emerald-500',
    features: ['Class Management', 'Leave Requests', 'Schedule View', 'Student Lists']
  },
  {
    role: 'admin',
    title: 'Administrator Panel',
    description: 'Complete control over timetables, faculty, and system management',
    icon: Settings,
    color: 'from-purple-500 to-violet-500',
    features: ['Timetable Generation', 'Faculty Management', 'Analytics', 'System Control']
  }
];

const features = [
  {
    icon: Brain,
    title: 'Smart Timetabling',
    description: 'AI-powered scheduling with automatic conflict detection and optimization for maximum efficiency'
  },
  {
    icon: Users,
    title: 'Role-Based Access',
    description: 'Customized dashboards and features tailored for students, teachers, and administrators'
  },
  {
    icon: Zap,
    title: 'Real-Time Updates',
    description: 'Instant notifications for schedule changes, announcements, and important updates'
  },
  {
    icon: Globe,
    title: 'Seamless Management',
    description: 'Unified platform for exam coordination, class management, and academic administration'
  }
];

// Floating 3D Background Elements
const FloatingElements = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Floating Geometric Shapes */}
    <motion.div
      className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-2xl backdrop-blur-sm"
      animate={{
        y: [0, -20, 0],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
    
    <motion.div
      className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full backdrop-blur-sm"
      animate={{
        y: [0, 30, 0],
        x: [0, -10, 0],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 1
      }}
    />
    
    <motion.div
      className="absolute bottom-40 left-1/4 w-12 h-12 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-lg backdrop-blur-sm"
      animate={{
        y: [0, -15, 0],
        rotate: [0, -90, 0],
      }}
      transition={{
        duration: 7,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 2
      }}
    />
    
    <motion.div
      className="absolute top-1/3 right-1/4 w-8 h-8 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full backdrop-blur-sm"
      animate={{
        y: [0, 25, 0],
        x: [0, 15, 0],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 0.5
      }}
    />
    
    {/* Gradient Waves */}
    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-300/10 to-purple-300/10 rounded-full blur-3xl" />
    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-green-300/10 to-blue-300/10 rounded-full blur-3xl" />
  </div>
);

export default function HomePage() {
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | 'admin' | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative">
      <FloatingElements />
      
      {/* Header */}
      <header className="relative z-10 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EduScheduler
            </span>
          </Link>
          
          <Link href="/login">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
              Sign Up
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
              Smart Classroom &
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Timetable Management
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              AI-powered scheduling for students, teachers, and administrators with conflict detection and real-time updates.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" className="px-12 py-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl">
                    Get Started
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl text-center mb-4">Choose Your Role</DialogTitle>
                  </DialogHeader>
                  <div className="grid md:grid-cols-3 gap-4">
                    {roleCards.map((card) => (
                      <motion.div
                        key={card.role}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-200">
                          <CardHeader className="text-center pb-3">
                            <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                              <card.icon className="w-6 h-6 text-white" />
                            </div>
                            <CardTitle className="text-lg">{card.title}</CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <p className="text-sm text-gray-600 mb-4">{card.description}</p>
                            <Link href={`/login?role=${card.role}`}>
                              <Button className="w-full" variant="outline">
                                Continue as {card.title.split(' ')[0]}
                              </Button>
                            </Link>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button size="lg" variant="outline" className="px-12 py-4 text-lg border-2 hover:bg-gray-50 dark:hover:bg-gray-800">
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
            >
              {[
                { number: '1000+', label: 'Students' },
                { number: '50+', label: 'Teachers' },
                { number: '15+', label: 'Departments' },
                { number: '99.9%', label: 'Uptime' }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Everything you need to manage
              <span className="block text-gray-600 dark:text-gray-300">your institution</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Powerful features designed to streamline your educational operations
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="text-xl mb-3">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-700 border-2 border-blue-100 dark:border-gray-600 shadow-2xl">
              <CardContent className="p-12">
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Join EduScheduler and manage your academic journey with ease
                </h3>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                  One platform for students, teachers, and administrators. Experience the future of educational management.
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg" className="px-16 py-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl">
                      Get Started
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-2xl text-center mb-4">Choose Your Role</DialogTitle>
                    </DialogHeader>
                    <div className="grid md:grid-cols-3 gap-4">
                      {roleCards.map((card) => (
                        <motion.div
                          key={card.role}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-200">
                            <CardHeader className="text-center pb-3">
                              <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                                <card.icon className="w-6 h-6 text-white" />
                              </div>
                              <CardTitle className="text-lg">{card.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <p className="text-sm text-gray-600 mb-4">{card.description}</p>
                              <Link href={`/login?role=${card.role}`}>
                                <Button className="w-full" variant="outline">
                                  Continue as {card.title.split(' ')[0]}
                                </Button>
                              </Link>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold">EduScheduler</span>
            </div>
            <div className="text-sm text-gray-400">
              © 2024 EduScheduler. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}