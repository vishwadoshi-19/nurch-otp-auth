'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Clock, MapPin, User, Calendar } from 'lucide-react';
import { JobCard } from '@/components/dashboard/JobCard';
import { StatusFilter } from '@/components/dashboard/StatusFilter';
import { useAuth } from '@/context/AuthContext';
import LoadingScreen from '@/components/common/LoadingScreen';

const jobs = [
  {
    id: 1,
    patientName: "Sarah Johnson",
    age: 72,
    description: "Post-surgery care and rehabilitation assistance",
    requirements: ["Wound dressing", "Mobility assistance", "Vital monitoring"],
    location: "Green Park, Delhi",
    timing: "9:00 AM - 5:00 PM",
    status: "available"
  },
  {
    id: 2,
    patientName: "Raj Patel",
    age: 65,
    description: "Diabetes management and daily care",
    requirements: ["Blood sugar monitoring", "Medication management", "Diet assistance"],
    location: "Dwarka, Delhi",
    timing: "24-hour care",
    status: "assigned"
  },
  {
    id: 3,
    patientName: "Meera Sharma",
    age: 78,
    description: "Post-stroke recovery and rehabilitation",
    requirements: ["Physical therapy assistance", "Medication management", "Mobility support"],
    location: "Vasant Kunj, Delhi",
    timing: "12-hour care (Day)",
    status: "available"
  },
];

export default function Dashboard() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [clockedIn, setClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<Date | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/sign-in');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return null;
  }

  const filteredJobs = selectedStatus === 'all' 
    ? jobs 
    : jobs.filter(job => job.status === selectedStatus);

  const handleClockIn = () => {
    setClockInTime(new Date());
    setClockedIn(true);
  };

  const handleClockOut = () => {
    setClockedIn(false);
    // Here you would typically save the clock out time to your backend
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Available Assignments</h1>
        <button
          onClick={clockedIn ? handleClockOut : handleClockIn}
          className={`px-6 py-2 rounded-full font-medium ${
            clockedIn 
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            {clockedIn ? 'Clock Out' : 'Clock In'}
          </div>
        </button>
      </div>

      <StatusFilter selectedStatus={selectedStatus} onStatusChange={setSelectedStatus} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filteredJobs.map(job => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}