import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Card } from '../../components/Card';
import { Table } from '../../components/Table';
import { StatusBadge } from '../../components/StatusBadge';

export function Events() {
  const { events, users } = useAppContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const eventsWithOrganizer = useMemo(() => {
    return events.map(event => {
      const organizer = users.find(u => u.id === event.organizerId);
      return {
        ...event,
        organizerName: organizer ? organizer.name : 'Unknown'
      };
    });
  }, [events, users]);

  const filteredEvents = useMemo(() => {
    return eventsWithOrganizer.filter(event => {
      const matchesSearch = 
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || event.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [eventsWithOrganizer, searchTerm, statusFilter]);

  const columns = [
    { header: 'Event ID', accessor: 'id', render: (e) => <span className="font-mono text-xs text-slate-500">{e.id}</span> },
    { header: 'Event Name', accessor: 'name', render: (e) => <span className="font-semibold text-slate-900 truncate max-w-[200px] block">{e.name}</span> },
    { header: 'Organizer', accessor: 'organizerName' },
    { header: 'Date & Location', accessor: 'date', render: (e) => (
      <div>
        <p className="font-medium">{e.date}</p>
        <p className="text-xs text-slate-500">{e.location}</p>
      </div>
    )},
    { header: 'Tickets', accessor: 'totalTickets', render: (e) => (
      <div>
        <p className="font-semibold">{e.ticketsSold} <span className="font-normal text-slate-500">/ {e.totalTickets}</span></p>
      </div>
    )},
    { header: 'Revenue', accessor: 'revenue', render: (e) => <span className="font-bold text-primary-600">₹{e.ticketsSold * e.ticketPrice}</span> },
    { header: 'Status', accessor: 'status', render: (e) => <StatusBadge status={e.status} /> },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Events Overview</h1>
      
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search by event, organizer, or location..."
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
            <option value="UPCOMING">Upcoming</option>
            <option value="ONGOING">Ongoing</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <Table columns={columns} data={filteredEvents} />
      </Card>
    </div>
  );
}
