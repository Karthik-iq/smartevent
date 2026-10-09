import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Ticket, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/Button';
import { StatusBadge } from '../../components/StatusBadge';
import { Input } from '../../components/Input';
import { Card } from '../../components/Card';

export function EventDetails() {
  const { id } = useParams();
  const { events, bookTicket } = useAppContext();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);

  const event = useMemo(() => events.find(e => e.id === parseInt(id)), [events, id]);

  if (!event) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Event not found</h2>
        <Button onClick={() => navigate('/events')}>Back to Events</Button>
      </div>
    );
  }

  const isSoldOut = event.ticketsSold >= event.totalTickets;
  const isCanceled = event.status === 'CANCELLED';
  const isCompleted = event.status === 'COMPLETED';
  const availableTickets = event.totalTickets - event.ticketsSold;
  
  const canBook = !isSoldOut && !isCanceled && !isCompleted;
  const totalPrice = event.ticketPrice * quantity;

  const handleBook = () => {
    if (!canBook) return;
    
    if (quantity < 1 || quantity > availableTickets) {
      addToast("Invalid ticket quantity.", "error");
      return;
    }

    const success = bookTicket(event.id, quantity, totalPrice);
    if (success) {
      addToast("Ticket booked successfully!");
      navigate('/my-bookings');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button 
        onClick={() => navigate('/events')}
        className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Events
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Section 1: Hero Image */}
        <div className="h-64 sm:h-96 w-full relative">
          <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
          <div className="absolute top-4 right-4 flex space-x-2">
            <StatusBadge status={event.status} />
            <span className="bg-white text-slate-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wide">
              {event.category}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 sm:p-10">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Section 2: Title */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">{event.name}</h1>
              {isCanceled && (
                <div className="bg-danger-50 border-l-4 border-danger-500 p-4 mb-6 rounded-r-md">
                  <p className="text-danger-700 font-medium">
                    This event has been cancelled and ticket booking is no longer available.
                  </p>
                </div>
              )}
            </div>

            {/* Sections 3 & 4: Date, Time, Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start p-4 rounded-xl bg-slate-50 border border-slate-100">
                <Calendar className="w-6 h-6 text-primary-500 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-slate-500">Date & Time</p>
                  <p className="font-semibold text-slate-900">{event.date}</p>
                  <p className="text-sm text-slate-600">{event.time}</p>
                </div>
              </div>
              <div className="flex items-start p-4 rounded-xl bg-slate-50 border border-slate-100">
                <MapPin className="w-6 h-6 text-primary-500 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-slate-500">Location</p>
                  <p className="font-semibold text-slate-900">{event.location}</p>
                </div>
              </div>
            </div>

            {/* Section 5: Description */}
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">About this event</h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{event.description}</p>
            </div>
            
          </div>

          {/* Section 6 & 7: Booking Panel */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24 border-2 border-primary-100 shadow-lg shadow-primary-50">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Booking Details</h3>
              
              <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-100">
                <span className="text-slate-600">Ticket Price</span>
                <span className="text-2xl font-bold text-primary-600">
                  {event.ticketPrice === 0 ? 'Free' : `₹${event.ticketPrice}`}
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Total Capacity</span>
                  <span className="font-medium text-slate-900">{event.totalTickets} tickets</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Available</span>
                  <span className={`font-medium ${availableTickets < 10 && availableTickets > 0 ? 'text-warning-600' : 'text-accent-600'}`}>
                    {availableTickets} tickets
                  </span>
                </div>
              </div>

              {canBook && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Quantity</label>
                    <div className="flex items-center">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-l-lg border border-slate-300 flex items-center justify-center bg-slate-50 text-slate-600 hover:bg-slate-100"
                        disabled={quantity <= 1}
                      >-</button>
                      <input 
                        type="number" 
                        value={quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val)) {
                            setQuantity(Math.min(Math.max(1, val), availableTickets));
                          }
                        }}
                        className="w-full h-10 border-y border-slate-300 text-center focus:outline-none"
                        min="1"
                        max={availableTickets}
                      />
                      <button 
                        onClick={() => setQuantity(Math.min(availableTickets, quantity + 1))}
                        className="w-10 h-10 rounded-r-lg border border-slate-300 flex items-center justify-center bg-slate-50 text-slate-600 hover:bg-slate-100"
                        disabled={quantity >= availableTickets}
                      >+</button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                    <span className="font-bold text-slate-900">Total</span>
                    <span className="text-2xl font-black text-slate-900">
                      ₹{totalPrice}
                    </span>
                  </div>
                </div>
              )}

              <Button 
                className="w-full mt-6 h-12 text-lg" 
                onClick={handleBook}
                disabled={!canBook}
                variant={canBook ? 'primary' : 'secondary'}
                icon={Ticket}
              >
                {isCanceled ? 'Event Cancelled' : 
                 isCompleted ? 'Booking Closed' : 
                 isSoldOut ? 'Sold Out' : 'Book Ticket'}
              </Button>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
