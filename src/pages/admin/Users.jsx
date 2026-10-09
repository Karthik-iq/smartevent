import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Card } from '../../components/Card';
import { Table } from '../../components/Table';

export function Users() {
  const { users, bookings } = useAppContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const usersWithStats = useMemo(() => {
    return users.map(user => {
      const userBookings = bookings.filter(b => b.userId === user.id);
      const ticketsPurchased = userBookings.reduce((sum, b) => b.status === 'CONFIRMED' ? sum + b.tickets : sum, 0);
      return {
        ...user,
        totalBookings: userBookings.length,
        ticketsPurchased
      };
    });
  }, [users, bookings]);

  const filteredUsers = useMemo(() => {
    return usersWithStats.filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter === 'All' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'All' || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [usersWithStats, searchTerm, roleFilter, statusFilter]);

  const columns = [
    { header: 'User ID', accessor: 'id', render: (u) => <span className="font-mono text-xs text-slate-500">{u.id}</span> },
    { header: 'Name', accessor: 'name', render: (u) => <span className="font-semibold text-slate-900">{u.name}</span> },
    { header: 'Email', accessor: 'email', render: (u) => <span className="text-slate-600">{u.email}</span> },
    { header: 'Role', accessor: 'role', render: (u) => (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        u.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-800' :
        u.role === 'ORGANIZER' ? 'bg-primary-100 text-primary-800' :
        'bg-slate-100 text-slate-800'
      }`}>
        {u.role}
      </span>
    )},
    { header: 'Bookings', accessor: 'totalBookings', render: (u) => <span className="font-medium">{u.totalBookings}</span> },
    { header: 'Tickets', accessor: 'ticketsPurchased', render: (u) => <span className="font-medium text-slate-600">{u.ticketsPurchased}</span> },
    { header: 'Status', accessor: 'status', render: (u) => (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        u.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-danger-100 text-danger-800'
      }`}>
        {u.status}
      </span>
    )},
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Users Overview</h1>
      
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-4">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="All">All Roles</option>
              <option value="USER">User</option>
              <option value="ORGANIZER">Organizer</option>
              <option value="ADMIN">Admin</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="All">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>

        <Table columns={columns} data={filteredUsers} />
      </Card>
    </div>
  );
}
