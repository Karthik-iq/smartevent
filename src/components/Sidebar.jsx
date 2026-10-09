import { Link, useLocation } from 'react-router-dom';
import { Calendar, LayoutDashboard, CalendarPlus, CalendarDays, Ticket, Users, BarChart3, LogOut } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export function Sidebar({ isOpen, onClose }) {
  const { currentUser, logout } = useAppContext();
  const location = useLocation();

  if (!currentUser) return null;

  const getLinks = () => {
    if (currentUser.role === 'ORGANIZER') {
      return [
        { name: 'Dashboard', path: '/organizer', icon: LayoutDashboard },
        { name: 'Create Event', path: '/organizer/create-event', icon: CalendarPlus },
        { name: 'Manage Events', path: '/organizer/events', icon: CalendarDays },
        { name: 'Event Bookings', path: '/organizer/bookings', icon: Ticket },
      ];
    }
    if (currentUser.role === 'ADMIN') {
      return [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { name: 'Users', path: '/admin/users', icon: Users },
        { name: 'Events', path: '/admin/events', icon: CalendarDays },
        { name: 'Bookings', path: '/admin/bookings', icon: Ticket },
        { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
      ];
    }
    return [];
  };

  const links = getLinks();
  const homePath = currentUser.role === 'ORGANIZER' ? '/organizer' : '/admin';

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-screen w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center px-6 border-b border-slate-800">
            <Link to={homePath} className="flex items-center font-bold text-xl tracking-tight text-white" onClick={onClose}>
              <Calendar className="mr-2 h-6 w-6 text-primary-500" />
              SMART EVENT
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <div className="px-4 mb-6">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                {currentUser.role} PANEL
              </p>
              <div className="flex items-center space-x-3 bg-slate-800/50 p-3 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center font-bold text-sm">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                </div>
              </div>
            </div>

            <nav className="px-2 space-y-1">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={onClose}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-primary-600 text-white' 
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-primary-200' : 'text-slate-400'}`} />
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="p-4 border-t border-slate-800">
            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-300 rounded-lg hover:bg-slate-800 hover:text-danger-400 transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5 text-slate-400" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
