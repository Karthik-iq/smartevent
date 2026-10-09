import { useMemo } from 'react';
import { CalendarDays, Ticket, IndianRupee, Users, TrendingUp } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { DashboardCard } from '../../components/DashboardCard';
import { Table } from '../../components/Table';
import { StatusBadge } from '../../components/StatusBadge';
import { Card } from '../../components/Card';

export function OrganizerDashboard() {
  const { events, bookings, currentUser } = useAppContext();

  const orgEvents = useMemo(() => events.filter(e => e.organizerId === currentUser.id), [events, currentUser.id]);
  const orgEventIds = useMemo(() => orgEvents.map(e => e.id), [orgEvents]);
  const orgBookings = useMemo(() => bookings.filter(b => orgEventIds.includes(b.eventId)), [bookings, orgEventIds]);

  const metrics = useMemo(() => {
    let totalTicketsSold = 0;
    let totalRevenue = 0;
    let totalTickets = 0;

    orgEvents.forEach(e => {
      totalTicketsSold += e.ticketsSold;
      totalTickets += e.totalTickets;
    });

    orgBookings.forEach(b => {
      if (b.status === 'CONFIRMED') {
        totalRevenue += b.amount;
      }
    });

    return {
      totalEvents: orgEvents.length,
      totalTicketsSold,
      remainingTickets: totalTickets - totalTicketsSold,
      totalRevenue,
      totalBookings: orgBookings.length
    };
  }, [orgEvents, orgBookings]);

  const recentBookings = useMemo(() => {
    return [...orgBookings]
      .sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate))
      .slice(0, 5)
      .map(b => ({
        ...b,
        eventName: events.find(e => e.id === b.eventId)?.name || 'Unknown'
      }));
  }, [orgBookings, events]);

  const eventPerformance = useMemo(() => {
    return orgEvents.map(e => {
      const eBookings = orgBookings.filter(b => b.eventId === e.id);
      const revenue = eBookings.reduce((sum, b) => b.status === 'CONFIRMED' ? sum + b.amount : sum, 0);
      return {
        id: e.id,
        name: e.name,
        status: e.status,
        ticketsSold: e.ticketsSold,
        remaining: e.totalTickets - e.ticketsSold,
        revenue,
        bookingsCount: eBookings.length,
        soldPercentage: e.totalTickets > 0 ? (e.ticketsSold / e.totalTickets) * 100 : 0
      };
    }).sort((a, b) => b.soldPercentage - a.soldPercentage).slice(0, 5);
  }, [orgEvents, orgBookings]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Organizer Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <DashboardCard 
          title="Total Events" 
          value={metrics.totalEvents} 
          icon={CalendarDays}
          colorClass="bg-primary-50 text-primary-600"
        />
        <DashboardCard 
          title="Tickets Sold" 
          value={metrics.totalTicketsSold} 
          icon={Ticket}
          colorClass="bg-accent-50 text-accent-600"
        />
        <DashboardCard 
          title="Remaining Tickets" 
          value={metrics.remainingTickets} 
          icon={Users}
          colorClass="bg-secondary-50 text-secondary-600"
        />
        <DashboardCard 
          title="Total Revenue" 
          value={`₹${metrics.totalRevenue}`} 
          icon={IndianRupee}
          colorClass="bg-emerald-50 text-emerald-600"
        />
        <DashboardCard 
          title="Total Bookings" 
          value={metrics.totalBookings} 
          icon={TrendingUp}
          colorClass="bg-indigo-50 text-indigo-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Event Performance */}
        <div className="lg:col-span-2">
          <Card className="p-6 h-full flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Event Performance</h3>
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Event</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Sold/Rem</th>
                    <th className="px-4 py-3 font-semibold text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {eventPerformance.length > 0 ? eventPerformance.map((ep) => (
                    <tr key={ep.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-medium text-slate-900 truncate max-w-[150px]">{ep.name}</td>
                      <td className="px-4 py-3"><StatusBadge status={ep.status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-700">{ep.ticketsSold} <span className="font-normal text-slate-400">/ {ep.remaining}</span></span>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1">
                            <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: `${ep.soldPercentage}%` }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-900">₹{ep.revenue}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="px-4 py-8 text-center text-slate-500">No events found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Recent Bookings */}
        <div className="lg:col-span-1">
          <Card className="p-6 h-full">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Bookings</h3>
            <div className="space-y-4">
              {recentBookings.length > 0 ? recentBookings.map((b) => (
                <div key={b.id} className="flex justify-between items-start border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-semibold text-sm text-slate-900 line-clamp-1">{b.eventName}</p>
                    <p className="text-xs text-slate-500">{b.bookingDate} • {b.tickets} tickets</p>
                  </div>
                  <span className="font-bold text-sm text-primary-600 ml-2">₹{b.amount}</span>
                </div>
              )) : (
                <p className="text-slate-500 text-sm text-center py-4">No recent bookings.</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
