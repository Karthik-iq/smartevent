import { useMemo } from 'react';
import { Users, CalendarDays, Ticket, IndianRupee, TrendingUp } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { DashboardCard } from '../../components/DashboardCard';
import { Card } from '../../components/Card';
import { StatusBadge } from '../../components/StatusBadge';

export function AdminDashboard() {
  const { events, bookings, users } = useAppContext();

  const metrics = useMemo(() => {
    let totalRevenue = 0;
    let totalTicketsSold = 0;
    
    bookings.forEach(b => {
      if (b.status === 'CONFIRMED') {
        totalRevenue += b.amount;
        totalTicketsSold += b.tickets;
      }
    });

    return {
      totalUsers: users.length,
      totalEvents: events.length,
      totalBookings: bookings.length,
      totalTicketsSold,
      totalRevenue
    };
  }, [events, bookings, users]);

  const recentEvents = useMemo(() => {
    return [...events].sort((a, b) => b.id - a.id).slice(0, 5);
  }, [events]);

  const recentBookings = useMemo(() => {
    return [...bookings].sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate)).slice(0, 5);
  }, [bookings]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Platform Overview</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <DashboardCard title="Total Users" value={metrics.totalUsers} icon={Users} colorClass="bg-blue-50 text-blue-600" />
        <DashboardCard title="Total Events" value={metrics.totalEvents} icon={CalendarDays} colorClass="bg-primary-50 text-primary-600" />
        <DashboardCard title="Total Bookings" value={metrics.totalBookings} icon={Ticket} colorClass="bg-accent-50 text-accent-600" />
        <DashboardCard title="Tickets Sold" value={metrics.totalTicketsSold} icon={TrendingUp} colorClass="bg-indigo-50 text-indigo-600" />
        <DashboardCard title="Total Revenue" value={`₹${metrics.totalRevenue}`} icon={IndianRupee} colorClass="bg-emerald-50 text-emerald-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Events</h3>
          <div className="space-y-4">
            {recentEvents.map(e => (
              <div key={e.id} className="flex justify-between items-center border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden mr-3">
                    <img src={e.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 line-clamp-1">{e.name}</p>
                    <p className="text-xs text-slate-500">{e.date} • {e.location}</p>
                  </div>
                </div>
                <StatusBadge status={e.status} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Bookings</h3>
          <div className="space-y-4">
            {recentBookings.map(b => (
              <div key={b.id} className="flex justify-between items-center border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="font-mono text-xs text-slate-500">{b.id}</p>
                  <p className="font-semibold text-slate-900">{b.tickets} tickets</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary-600">₹{b.amount}</p>
                  <p className="text-xs text-slate-500">{b.bookingDate}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
