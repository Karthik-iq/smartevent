import { useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Card } from '../../components/Card';
import { DashboardCard } from '../../components/DashboardCard';
import { IndianRupee, TrendingUp, Users, Ticket } from 'lucide-react';

export function Analytics() {
  const { events, bookings, users } = useAppContext();

  const metrics = useMemo(() => {
    let totalRevenue = 0;
    let totalTicketsSold = 0;
    let totalEventsCapacity = 0;

    events.forEach(e => totalEventsCapacity += e.totalTickets);

    bookings.forEach(b => {
      if (b.status === 'CONFIRMED') {
        totalRevenue += b.amount;
        totalTicketsSold += b.tickets;
      }
    });

    return {
      revenue: totalRevenue,
      ticketsSold: totalTicketsSold,
      capacity: totalEventsCapacity,
      fillRate: totalEventsCapacity ? ((totalTicketsSold / totalEventsCapacity) * 100).toFixed(1) : 0,
      activeUsers: users.filter(u => u.status === 'ACTIVE').length
    };
  }, [events, bookings, users]);

  const categoryData = useMemo(() => {
    const data = {};
    events.forEach(e => {
      if (!data[e.category]) {
        data[e.category] = { count: 0, revenue: 0, tickets: 0 };
      }
      data[e.category].count += 1;
      data[e.category].tickets += e.ticketsSold;
      data[e.category].revenue += (e.ticketsSold * e.ticketPrice);
    });
    return Object.entries(data).map(([name, stats]) => ({ name, ...stats })).sort((a, b) => b.revenue - a.revenue);
  }, [events]);

  const topEvents = useMemo(() => {
    return [...events]
      .sort((a, b) => (b.ticketsSold * b.ticketPrice) - (a.ticketsSold * a.ticketPrice))
      .slice(0, 5);
  }, [events]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Platform Analytics</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard title="Total Revenue" value={`₹${metrics.revenue}`} icon={IndianRupee} colorClass="bg-emerald-50 text-emerald-600" />
        <DashboardCard title="Tickets Sold" value={metrics.ticketsSold} icon={Ticket} colorClass="bg-primary-50 text-primary-600" />
        <DashboardCard title="Avg. Fill Rate" value={`${metrics.fillRate}%`} icon={TrendingUp} colorClass="bg-indigo-50 text-indigo-600" />
        <DashboardCard title="Active Users" value={metrics.activeUsers} icon={Users} colorClass="bg-blue-50 text-blue-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Performance */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Revenue by Category</h3>
          <div className="space-y-6">
            {categoryData.map(cat => (
              <div key={cat.name}>
                <div className="flex justify-between items-end mb-2">
                  <span className="font-semibold text-slate-700">{cat.name}</span>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 block">₹{cat.revenue}</span>
                    <span className="text-xs text-slate-500">{cat.tickets} tickets across {cat.count} events</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div 
                    className="bg-primary-500 h-2.5 rounded-full" 
                    style={{ width: `${Math.max(5, (cat.revenue / (metrics.revenue || 1)) * 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Events */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Top Performing Events</h3>
          <div className="space-y-4">
            {topEvents.map((event, index) => (
              <div key={event.id} className="flex items-center p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-lg mr-4">
                  #{index + 1}
                </div>
                <div className="flex-1 min-w-0 mr-4">
                  <h4 className="font-bold text-slate-900 truncate">{event.name}</h4>
                  <p className="text-sm text-slate-500 truncate">{event.category}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-emerald-600">₹{event.ticketsSold * event.ticketPrice}</p>
                  <p className="text-xs font-medium text-slate-500">{event.ticketsSold} sold</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
