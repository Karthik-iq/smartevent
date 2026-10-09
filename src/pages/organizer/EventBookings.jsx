import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Card } from '../../components/Card';
import { Table } from '../../components/Table';
import { StatusBadge } from '../../components/StatusBadge';

export function EventBookings() {
  const { bookings, events, users, currentUser } = useAppContext();
  const [searchParams] = useSearchParams();
  const initialEventId = searchParams.get('eventId') || 'All';

  const [searchTerm, setSearchTerm] = useState('');
  const [eventFilter, setEventFilter] = useState(initialEventId);

  const orgEvents = useMemo(() => events.filter(e => e.organizerId === currentUser.id), [events, currentUser.id]);
  const orgEventIds = useMemo(() => orgEvents.map(e => e.id), [orgEvents]);

  const filteredBookings = useMemo(() => {
    return bookings
      .filter(b => orgEventIds.includes(b.eventId))
      .map(b => {
        const event = orgEvents.find(e => e.id === b.eventId) || {};
        const user = users.find(u => u.id === b.userId) || {};
        return {
          ...b,
          eventName: event.name || 'Unknown',
          userName: user.name || 'Unknown',
          userEmail: user.email || 'Unknown'
        };
      })
      .filter(b => {
        const matchesEvent = eventFilter === 'All' || b.eventId.toString() === eventFilter.toString();
        const matchesSearch = 
          b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesEvent && matchesSearch;
      })
      .sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
  }, [bookings, orgEventIds, orgEvents, users, eventFilter, searchTerm]);

  const columns = [
    { header: 'Booking ID', accessor: 'id', render: (b) => <span className="font-mono text-xs text-slate-500">{b.id}</span> },
    { header: 'User', accessor: 'userName', render: (b) => (
      <div>
        <p className="font-medium text-slate-900">{b.userName}</p>
        <p className="text-xs text-slate-500">{b.userEmail}</p>
      </div>
    )},
    { header: 'Event', accessor: 'eventName', render: (b) => <span className="font-medium text-slate-900 truncate block max-w-[200px]">{b.eventName}</span> },
    { header: 'Tickets', accessor: 'tickets', render: (b) => <span className="font-semibold text-slate-700">{b.tickets}</span> },
    { header: 'Amount', accessor: 'amount', render: (b) => <span className="font-bold text-primary-600">₹{b.amount}</span> },
    { header: 'Date', accessor: 'bookingDate' },
    { header: 'Status', accessor: 'status', render: (b) => <StatusBadge status={b.status === 'CONFIRMED' ? 'COMPLETED' : 'CANCELLED'} /> },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Event Bookings</h1>
      
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search by Booking ID, Name, or Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div className="md:w-64">
            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="All">All Events</option>
              {orgEvents.map(e => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
          </div>
        </div>

        <Table columns={columns} data={filteredBookings} emptyMessage="No bookings found matching your criteria." />
      </Card>
    </div>
  );
}
