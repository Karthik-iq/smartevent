import { MapPin, Calendar, Clock, Ticket } from 'lucide-react';
import { Card } from './Card';
import { StatusBadge } from './StatusBadge';
import { Button } from './Button';

export function EventCard({ event, onBook, onView, showBookButton = true, showViewButton = true }) {
  const isSoldOut = event.ticketsSold >= event.totalTickets;
  const isCanceled = event.status === 'CANCELLED';
  const isCompleted = event.status === 'COMPLETED';
  
  let bookText = 'Book Ticket';
  let canBook = true;
  
  if (isCanceled) {
    bookText = 'Event Cancelled';
    canBook = false;
  } else if (isCompleted) {
    bookText = 'Booking Closed';
    canBook = false;
  } else if (isSoldOut) {
    bookText = 'Sold Out';
    canBook = false;
  }

  return (
    <Card className="flex flex-col h-full hover:-translate-y-1 transition-transform duration-300">
      <div className="relative h-48 w-full">
        <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
        <div className="absolute top-2 right-2">
          <StatusBadge status={event.status} />
        </div>
        <div className="absolute top-2 left-2">
          <span className="bg-white/90 backdrop-blur text-primary-700 text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
            {event.category}
          </span>
        </div>
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1">{event.name}</h3>
        
        <div className="space-y-2 mb-4 text-sm text-slate-600">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-slate-400" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-slate-400" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-slate-400" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>
        
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-slate-500 uppercase font-semibold">Price</p>
            <p className="text-lg font-bold text-primary-600">{event.ticketPrice === 0 ? 'Free' : `₹${event.ticketPrice}`}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 uppercase font-semibold">Availability</p>
            <p className={`text-sm font-medium ${isSoldOut ? 'text-danger-500' : 'text-accent-600'}`}>
              {event.totalTickets - event.ticketsSold} / {event.totalTickets}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2 w-full">
          {showViewButton && (
            <Button variant="outline" className="flex-1" onClick={() => onView(event.id)}>
              Details
            </Button>
          )}
          {showBookButton && (
            <Button 
              className="flex-1" 
              onClick={() => onBook(event.id)} 
              disabled={!canBook}
              variant={canBook ? 'primary' : 'secondary'}
            >
              {bookText}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
