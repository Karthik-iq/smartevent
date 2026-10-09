import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Card } from '../../components/Card';
import { Table } from '../../components/Table';
import { StatusBadge } from '../../components/StatusBadge';

export function Bookings() {
  const { bookings, events, users } = useAppContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const detailedBookings = useMemo(() => {
    return bookings.map(b => {
      const event = events.find(e => e.id === b.eventId) || {};
      const user = users.find(u => u.id === b.userId) || {};
      const organizer = users.find(u => u.id === event.organizerId) || {};
      
      return {
        ...b,
        eventName: event.name || 'Unknown Event',
        userName: user.name || 'Unknown User',
        userEmail: user.email || '',
        organizerName: organizer.name || 'Unknown Organizer'
      };
    }).sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
  }, [bookings, events, users]);

  const filteredBookings = useMemo(() => {
    return detailedBookings.filter(b => {
      const matchesSearch = 
        b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.userName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || b.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [detailedBookings, searchTerm, statusFilter]);

  const columns = [
    { header: 'Booking ID', accessor: 'id', render: (b) => <span className="font-mono text-xs text-slate-500">{b.id}</span> },
    { header: 'User', accessor: 'userName', render: (b) => (
      <div>
        <p className="font-medium text-slate-900">{b.userName}</p>
        <p className="text-xs text-slate-500">{b.userEmail}</p>
      </div>
    )},
    { header: 'Event & Organizer', accessor: 'eventName', render: (b) => (
      <div>
        <p className="font-medium text-slate-900 truncate max-w-[200px]">{b.eventName}</p>
        <p className="text-xs text-slate-500">by {b.organizerName}</p>
      </div>
    )},
    { header: 'Tickets', accessor: 'tickets', render: (b) => <span className="font-semibold">{b.tickets}</span> },
    { header: 'Amount', accessor: 'amount', render: (b) => <span className="font-bold text-primary-600">₹{b.amount}</span> },
    { header: 'Date', accessor: 'bookingDate' },
    { header: 'Status', accessor: 'status', render: (b) => <StatusBadge status={b.status === 'CONFIRMED' ? 'COMPLETED' : 'CANCELLED'} /> },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Bookings Overview</h1>
      
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search by ID, User, or Event..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="md:w-48 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="All">All Statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <Table columns={columns} data={filteredBookings} />
      </Card>
    </div>
  );
}
