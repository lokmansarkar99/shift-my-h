import React, { useState } from 'react';
import { Package, Search, Filter, Calendar, MapPin, User, Truck, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { JobCard } from './JobCard';

// Mock job data
const mockJobs = [
  {
    id: 'J-12345',
    reference: 'SMH-12345',
    customerName: 'John Smith',
    customerPhone: '07700 900123',
    customerEmail: 'john@example.com',
    status: 'completed' as const,
    title: 'House Move',
    service: 'house_move',
    description: 'Full house move with 3 bedrooms',
    pickup: { 
      address: '123 Main St, Glasgow', 
      postcode: 'G12 8QQ',
      city: 'Glasgow'
    },
    delivery: { 
      address: '456 High St, Edinburgh', 
      postcode: 'EH1 1YZ',
      city: 'Edinburgh'
    },
    date: '2025-01-15',
    time: '09:00',
    distance: 65,
    duration: '5h',
    totalVolume: 45,
    vehicle: 'Luton Van',
    crew: 2,
    items: [
      { name: 'Sofa', quantity: 1, volume: 5 },
      { name: 'Bed', quantity: 2, volume: 8 },
    ],
    customerPrice: 450,
    driverPrice: 320,
    platformFee: 130,
    stops: [],
  },
  {
    id: 'J-12346',
    reference: 'SMH-12346',
    customerName: 'Sarah Brown',
    customerPhone: '07700 900456',
    customerEmail: 'sarah@example.com',
    status: 'in-progress' as const,
    title: 'Furniture Delivery',
    service: 'furniture_items',
    description: 'Furniture items delivery',
    pickup: { 
      address: '789 Queen St, Aberdeen', 
      postcode: 'AB10 1XL',
      city: 'Aberdeen'
    },
    delivery: { 
      address: '321 King St, Dundee', 
      postcode: 'DD1 1DB',
      city: 'Dundee'
    },
    date: '2025-01-18',
    time: '10:00',
    distance: 88,
    duration: '2h 30m',
    totalVolume: 25,
    vehicle: 'LWB Van',
    crew: 1,
    items: [
      { name: 'Wardrobe', quantity: 1, volume: 6 },
      { name: 'Table', quantity: 1, volume: 3 },
    ],
    customerPrice: 380,
    driverPrice: 280,
    platformFee: 100,
    driverName: 'David Wilson',
    driverPhone: '07700 900789',
    stops: [],
  },
  {
    id: 'J-12347',
    reference: 'SMH-12347',
    customerName: 'Emma Davis',
    customerPhone: '07700 900789',
    customerEmail: 'emma@example.com',
    status: 'pending' as const,
    title: 'Clearance Service',
    service: 'clearance_removal',
    description: 'Office clearance',
    pickup: { 
      address: '555 Park Ave, Inverness', 
      postcode: 'IV1 1HG',
      city: 'Inverness'
    },
    delivery: { 
      address: '888 Royal Rd, Perth', 
      postcode: 'PH1 5HS',
      city: 'Perth'
    },
    date: '2025-01-20',
    time: '11:00',
    distance: 120,
    duration: '3h',
    totalVolume: 35,
    vehicle: 'Luton Van',
    crew: 2,
    items: [
      { name: 'Office Desk', quantity: 3, volume: 9 },
      { name: 'Filing Cabinet', quantity: 2, volume: 4 },
    ],
    customerPrice: 520,
    driverPrice: 380,
    platformFee: 140,
    stops: [],
  },
];

export function JobsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredJobs = mockJobs.filter((job) => {
    const matchesSearch = 
      job.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.pickup.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.delivery.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockJobs.length,
    completed: mockJobs.filter(j => j.status === 'completed').length,
    inProgress: mockJobs.filter(j => j.status === 'in-progress').length,
    pending: mockJobs.filter(j => j.status === 'pending').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Jobs Management</h1>
          <p className="text-slate-600 mt-1">Manage and monitor all jobs</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2">
          <Package className="w-5 h-5" />
          Create Job
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Jobs</p>
              <p className="text-3xl font-bold mt-1">{stats.total}</p>
            </div>
            <Package className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Completed</p>
              <p className="text-3xl font-bold mt-1">{stats.completed}</p>
            </div>
            <CheckCircle className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">In Progress</p>
              <p className="text-3xl font-bold mt-1">{stats.inProgress}</p>
            </div>
            <Clock className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Pending</p>
              <p className="text-3xl font-bold mt-1">{stats.pending}</p>
            </div>
            <AlertCircle className="w-12 h-12 opacity-80" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by job ID, customer, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none appearance-none bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} onClick={() => console.log('View job:', job.id)} />
          ))
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No jobs found</h3>
            <p className="text-slate-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}