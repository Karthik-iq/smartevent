import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Calendar as CalendarIcon } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { EventCard } from '../../components/EventCard';
import { Input } from '../../components/Input';
import { EmptyState } from '../../components/EmptyState';

export function Events() {
  const { events } = useAppContext();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priceFilter, setPriceFilter] = useState('All');

  const categories = ['All', 'Technology', 'Music', 'Business', 'Sports', 'Education', 'Entertainment'];
  const statuses = ['All', 'Upcoming', 'Ongoing', 'Completed', 'Cancelled'];
  const prices = ['All', 'Free', 'Under ₹500', '₹500–₹1000', 'Above ₹1000'];

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Search
      const matchesSearch = 
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Category
      const matchesCategory = categoryFilter === 'All' || event.category === categoryFilter;
      
      // Status
      const matchesStatus = statusFilter === 'All' || event.status.toLowerCase() === statusFilter.toLowerCase();
      
      // Price
      let matchesPrice = true;
      if (priceFilter === 'Free') matchesPrice = event.ticketPrice === 0;
      else if (priceFilter === 'Under ₹500') matchesPrice = event.ticketPrice > 0 && event.ticketPrice < 500;
      else if (priceFilter === '₹500–₹1000') matchesPrice = event.ticketPrice >= 500 && event.ticketPrice <= 1000;
      else if (priceFilter === 'Above ₹1000') matchesPrice = event.ticketPrice > 1000;

      return matchesSearch && matchesCategory && matchesStatus && matchesPrice;
    });
  }, [events, searchTerm, categoryFilter, statusFilter, priceFilter]);

  const featuredEvents = events.filter(e => e.status === 'UPCOMING').slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Hero Section */}
      <div className="bg-primary-900 rounded-3xl overflow-hidden shadow-2xl relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=2000&q=80')] opacity-20 bg-cover bg-center"></div>
        <div className="relative z-10 px-6 py-16 sm:px-12 sm:py-24 lg:w-2/3">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-dark tracking-tight mb-4">
            Discover Events That Matter
          </h1>
          <p className="text-lg text-secondary-100 mb-8 max-w-2xl">
            Join thousands of people at the best conferences, concerts, and workshops around the world.
          </p>
          <div className="relative max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-4 border border-transparent rounded-xl leading-5 bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-white sm:text-sm shadow-lg"
              placeholder="Search by event name, location, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <section>
        <div className="flex flex-wrap gap-3">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                categoryFilter === cat 
                  ? 'bg-primary-600 text-white shadow-md' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-primary-300 hover:text-primary-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Events (only show if no search/filter) */}
      {!searchTerm && categoryFilter === 'All' && statusFilter === 'All' && priceFilter === 'All' && featuredEvents.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
            <span className="bg-primary-100 text-primary-700 p-2 rounded-lg mr-3">
              <CalendarIcon className="w-5 h-5" />
            </span>
            Featured Events
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map(event => (
              <EventCard 
                key={event.id} 
                event={event} 
                onView={(id) => navigate(`/events/${id}`)}
                onBook={(id) => navigate(`/events/${id}`)}
              />
            ))}
          </div>
        </section>
      )}

      {/* All Events with Filters */}
      <section>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-slate-900">Explore Events</h2>
          
          <div className="flex flex-wrap gap-4 w-full sm:w-auto">
            <select 
              className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option disabled>Status</option>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            
            <select 
              className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
            >
              <option disabled>Price</option>
              {prices.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map(event => (
              <EventCard 
                key={event.id} 
                event={event} 
                onView={(id) => navigate(`/events/${id}`)}
                onBook={(id) => navigate(`/events/${id}`)}
              />
            ))}
          </div>
        ) : (
          <EmptyState 
            title="No events found"
            message="We couldn't find any events matching your current filters."
            actionText="Clear Filters"
            onAction={() => {
              setSearchTerm('');
              setCategoryFilter('All');
              setStatusFilter('All');
              setPriceFilter('All');
            }}
          />
        )}
      </section>

    </div>
  );
}
