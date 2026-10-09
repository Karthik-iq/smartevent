import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, Calendar, IndianRupee } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Table } from '../../components/Table';
import { EmptyState } from '../../components/EmptyState';
import { Card } from '../../components/Card';
import { StatusBadge } from '../../components/StatusBadge';

export function MyBookings() {
  const { bookings, events, currentUser } = useAppContext();
  const navigate = useNavigate();

  const userBookings = useMemo(() => {
    return bookings
      .filter(b => b.userId === currentUser.id)
      .map(booking => {
        const event = events.find(e => e.id === booking.eventId) || {};
        return {
          ...booking,
          eventName: event.name || 'Unknown Event',
          eventDate: event.date || 'Unknown Date',
          location: event.location || 'Unknown Location',
          eventStatus: event.status || 'UNKNOWN',
          eventTicketPrice: event.ticketPrice || 0
        };
      })
      .sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
  }, [bookings, events, currentUser.id]);

  const columns = [
    { header: 'Booking ID', accessor: 'id', render: (b) => <span className="font-mono text-xs text-slate-500">{b.id}</span> },
    { header: 'Event', accessor: 'eventName', render: (b) => (
      <div>
        <p className="font-semibold text-slate-900 line-clamp-1">{b.eventName}</p>
        <p className="text-xs text-slate-500">{b.location}</p>
      </div>
    )},
    { header: 'Event Date', accessor: 'eventDate' },
    { header: 'Tickets', accessor: 'tickets', render: (b) => (
      <span className="inline-flex items-center px-2 py-1 bg-slate-100 rounded-md font-medium text-slate-700">
        <Ticket className="w-3 h-3 mr-1" /> {b.tickets}
      </span>
    )},
    { header: 'Ticket Price', accessor: 'ticketPrice', render: (b) => <span className="text-slate-600">₹{b.eventTicketPrice}</span> },
    { header: 'Total Amount', accessor: 'amount', render: (b) => <span className="font-semibold text-primary-600">₹{b.amount}</span> },
    { header: 'Event Status', accessor: 'eventStatus', render: (b) => <StatusBadge status={b.eventStatus} /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">My Bookings</h1>
        <p className="text-slate-500 mt-2">Manage your event bookings and purchase history.</p>
      </div>

      {userBookings.length > 0 ? (
        <>
          {/* Desktop View */}
          <div className="hidden md:block">
            <Table columns={columns} data={userBookings} />
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-4">
            {userBookings.map(booking => (
              <Card key={booking.id} className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-xs font-mono text-slate-500 block mb-1">{booking.id}</span>
                    <h3 className="font-bold text-slate-900">{booking.eventName}</h3>
                  </div>
                  <StatusBadge status={booking.eventStatus} />
                </div>
                
                <div className="space-y-2 text-sm text-slate-600 mb-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                    {booking.eventDate}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Ticket className="w-4 h-4 mr-2 text-slate-400" />
                      {booking.tickets} Tickets (@ ₹{booking.eventTicketPrice})
                    </div>
                  </div>
                  <div className="flex items-center text-primary-700 font-medium">
                    <IndianRupee className="w-4 h-4 mr-2 text-primary-500" />
                    Total: ₹{booking.amount}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <EmptyState 
          title="No bookings yet"
          message="You haven't booked any events yet. Discover events and book your first ticket!"
          actionText="Browse Events"
          actionPath="/events"
          icon={Ticket}
        />
      )}
    </div>
  );
}
