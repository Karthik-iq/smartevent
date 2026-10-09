import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, XCircle, Users } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';

export function ManageEvents() {
  const { events, currentUser, cancelEvent } = useAppContext();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [eventToCancel, setEventToCancel] = useState(null);

  const orgEvents = useMemo(() => {
    return events
      .filter(e => e.organizerId === currentUser.id)
      .filter(e => {
        const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [events, currentUser.id, searchTerm, statusFilter]);

  const handleCancelClick = (event) => {
    setEventToCancel(event);
    setCancelModalOpen(true);
  };

  const confirmCancel = () => {
    if (eventToCancel) {
      cancelEvent(eventToCancel.id);
      addToast('Event cancelled successfully.', 'success');
    }
    setCancelModalOpen(false);
    setEventToCancel(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Manage Events</h1>
        <Button icon={Plus} onClick={() => navigate('/organizer/create-event')}>
          Create Event
        </Button>
      </div>

      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="All">All Statuses</option>
            <option value="UPCOMING">Upcoming</option>
            <option value="ONGOING">Ongoing</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Event</th>
                <th className="px-6 py-4 font-semibold">Date & Location</th>
                <th className="px-6 py-4 font-semibold">Sales</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orgEvents.length > 0 ? orgEvents.map((event) => (
                <tr key={event.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors last:border-0">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-slate-100 overflow-hidden">
                        <img src={event.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{event.name}</p>
                        <p className="text-xs text-slate-500 font-mono">ID: {event.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-slate-900">{event.date}</p>
                    <p className="text-xs text-slate-500">{event.location}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-semibold">{event.ticketsSold} <span className="font-normal text-slate-500">/ {event.totalTickets}</span></span>
                      <span className="text-xs text-primary-600 font-medium">₹{event.ticketsSold * event.ticketPrice}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={event.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => navigate(`/organizer/bookings?eventId=${event.id}`)}
                        className="p-1.5 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="View Bookings"
                      >
                        <Users className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => navigate(`/organizer/events/${event.id}/edit`)}
                        className="p-1.5 text-slate-500 hover:text-secondary-600 hover:bg-secondary-50 rounded-lg transition-colors"
                        title="Edit Event"
                        disabled={event.status === 'CANCELLED'}
                      >
                        <Edit className={`w-5 h-5 ${event.status === 'CANCELLED' ? 'opacity-50' : ''}`} />
                      </button>
                      <button 
                        onClick={() => handleCancelClick(event)}
                        className="p-1.5 text-slate-500 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                        title="Cancel Event"
                        disabled={event.status === 'CANCELLED' || event.status === 'COMPLETED'}
                      >
                        <XCircle className={`w-5 h-5 ${(event.status === 'CANCELLED' || event.status === 'COMPLETED') ? 'opacity-50' : ''}`} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">No events found matching your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4">
          {orgEvents.map((event) => (
            <div key={event.id} className="border border-slate-200 rounded-xl p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="font-semibold text-slate-900">{event.name}</div>
                <StatusBadge status={event.status} />
              </div>
              <div className="text-sm text-slate-600 space-y-1 mb-4">
                <p>{event.date} • {event.location}</p>
                <p>Sold: {event.ticketsSold}/{event.totalTickets} • Rev: ₹{event.ticketsSold * event.ticketPrice}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/organizer/bookings?eventId=${event.id}`)}>
                  Bookings
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1" 
                  onClick={() => navigate(`/organizer/events/${event.id}/edit`)}
                  disabled={event.status === 'CANCELLED'}
                >
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 text-danger-600 hover:bg-danger-50 border-danger-200" 
                  onClick={() => handleCancelClick(event)}
                  disabled={event.status === 'CANCELLED' || event.status === 'COMPLETED'}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Modal 
        isOpen={cancelModalOpen} 
        onClose={() => setCancelModalOpen(false)}
        title="Cancel Event"
      >
        <div className="mb-6">
          <p className="text-slate-600">
            Are you sure you want to cancel <span className="font-bold text-slate-900">{eventToCancel?.name}</span>?
          </p>
          <p className="text-sm text-danger-600 mt-2">
            This action cannot be undone. All bookings will remain but ticket purchasing will be disabled.
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setCancelModalOpen(false)}>Close</Button>
          <Button variant="danger" onClick={confirmCancel}>Confirm Cancellation</Button>
        </div>
      </Modal>
    </div>
  );
}
