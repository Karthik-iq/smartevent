import { createContext, useContext, useState, useEffect } from 'react';
import { initialEvents } from '../data/events';
import { initialUsers } from '../data/users';
import { initialBookings } from '../data/bookings';
import { useToast } from './ToastContext';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('sm_events');
    return saved ? JSON.parse(saved) : initialEvents;
  });
  
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('sm_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('sm_bookings');
    return saved ? JSON.parse(saved) : initialBookings;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('sm_currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const { addToast } = useToast();

  useEffect(() => {
    localStorage.setItem('sm_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('sm_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('sm_currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('sm_currentUser');
    }
  }, [currentUser]);

  const login = (role) => {
    let user;
    if (role === 'USER') user = users.find(u => u.id === 1);
    if (role === 'ORGANIZER') user = users.find(u => u.id === 101);
    if (role === 'ADMIN') user = users.find(u => u.id === 999);
    
    if (user) {
      setCurrentUser(user);
      addToast(`Logged in as ${role}`);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    addToast('Logged out successfully');
  };

  const addEvent = (eventData) => {
    const newEvent = {
      ...eventData,
      id: Date.now(),
      ticketsSold: 0,
      organizerId: currentUser.id,
      status: 'UPCOMING'
    };
    setEvents(prev => [newEvent, ...prev]);
  };

  const updateEvent = (id, eventData) => {
    setEvents(prev => prev.map(ev => ev.id === parseInt(id) ? { ...ev, ...eventData } : ev));
  };

  const cancelEvent = (id) => {
    setEvents(prev => prev.map(ev => ev.id === parseInt(id) ? { ...ev, status: 'CANCELLED' } : ev));
  };

  const bookTicket = (eventId, quantity, total) => {
    const event = events.find(e => e.id === parseInt(eventId));
    if (!event) return false;

    const newBooking = {
      id: `BK${Date.now()}`,
      userId: currentUser.id,
      eventId: event.id,
      tickets: parseInt(quantity),
      amount: total,
      bookingDate: new Date().toISOString().split('T')[0],
      status: 'CONFIRMED'
    };

    setBookings(prev => [newBooking, ...prev]);
    setEvents(prev => prev.map(ev => {
      if (ev.id === event.id) {
        return { ...ev, ticketsSold: ev.ticketsSold + parseInt(quantity) };
      }
      return ev;
    }));
    return true;
  };

  const value = {
    events,
    users,
    bookings,
    currentUser,
    login,
    logout,
    addEvent,
    updateEvent,
    cancelEvent,
    bookTicket
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
