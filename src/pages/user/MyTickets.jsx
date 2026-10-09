import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, Ticket } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { EmptyState } from '../../components/EmptyState';
import { StatusBadge } from '../../components/StatusBadge';

export function MyTickets() {
  const { bookings, events, currentUser } = useAppContext();
  const navigate = useNavigate();

  const userTickets = useMemo(() => {
    return bookings
      .filter(b => b.userId === currentUser.id)
      .map(booking => {
        const event = events.find(e => e.id === booking.eventId) || {};
        return {
          ...booking,
          event
        };
      })
      .filter(b => b.event.id) // Only valid events
      .sort((a, b) => new Date(a.event.date) - new Date(b.event.date));
  }, [bookings, events, currentUser.id]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">My Tickets</h1>
        <p className="text-slate-500 mt-2">Your digital passes for upcoming and past events.</p>
      </div>

      {userTickets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {userTickets.map((ticket) => (
            <div key={ticket.id} className="relative group">
              <div className="absolute inset-0 bg-primary-600 rounded-2xl rotate-1 group-hover:rotate-2 transition-transform opacity-20"></div>
              <div className="relative bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col h-full">
                {/* Ticket Header Image */}
                <div className="h-32 w-full relative bg-slate-100">
                  <img src={ticket.event.image} alt={ticket.event.name} className="w-full h-full object-cover opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                  <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
                    <StatusBadge status={ticket.event.status} />
                    <span className="text-white text-xs font-mono font-medium tracking-wider">#{ticket.id}</span>
                  </div>
                </div>

                {/* Ticket Body */}
                <div className="p-5 flex-grow flex flex-col relative">
                  {/* Perforated border effect */}
                  <div className="absolute top-0 left-0 right-0 h-0 border-t-2 border-dashed border-slate-200 -mt-px"></div>
                  <div className="absolute top-0 left-[-8px] w-4 h-4 rounded-full bg-slate-50 -mt-2 border border-slate-200 border-r-0"></div>
                  <div className="absolute top-0 right-[-8px] w-4 h-4 rounded-full bg-slate-50 -mt-2 border border-slate-200 border-l-0"></div>

                  <h3 className="text-xl font-bold text-slate-900 mb-4 line-clamp-2 mt-2">{ticket.event.name}</h3>
                  
                  <div className="space-y-3 mb-6 text-sm">
                    <div className="flex items-start">
                      <Calendar className="w-4 h-4 mr-3 text-primary-500 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-900">{ticket.event.date}</p>
                        <p className="text-slate-500 text-xs">Date</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="w-4 h-4 mr-3 text-primary-500 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-900">{ticket.event.time}</p>
                        <p className="text-slate-500 text-xs">Time</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 mr-3 text-primary-500 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-900 line-clamp-1">{ticket.event.location}</p>
                        <p className="text-slate-500 text-xs">Location</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Admit</p>
                      <p className="font-bold text-lg flex items-center text-slate-900">
                        {ticket.tickets} {ticket.tickets > 1 ? 'People' : 'Person'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 mb-1">Total</p>
                      <p className="font-bold text-lg text-primary-600">
                        {ticket.amount === 0 ? 'Free' : `₹${ticket.amount}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState 
          title="No tickets found"
          message="Your tickets will appear here after booking an event."
          actionText="Browse Events"
          actionPath="/events"
          icon={Ticket}
        />
      )}
    </div>
  );
}
