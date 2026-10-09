import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Calendar, User, LogOut } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export function Navbar() {
  const { currentUser, logout } = useAppContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = {
    USER: [
      { name: 'Events', path: '/events' },
      { name: 'My Bookings', path: '/my-bookings' },
      { name: 'My Tickets', path: '/my-tickets' },
    ],
    ORGANIZER: [
      { name: 'Dashboard', path: '/organizer' },
      { name: 'Create Event', path: '/organizer/create-event' },
      { name: 'Manage Events', path: '/organizer/events' },
      { name: 'Event Bookings', path: '/organizer/bookings' },
    ],
    ADMIN: [
      { name: 'Dashboard', path: '/admin' },
      { name: 'Users', path: '/admin/users' },
      { name: 'Events', path: '/admin/events' },
      { name: 'Bookings', path: '/admin/bookings' },
      { name: 'Analytics', path: '/admin/analytics' },
    ]
  };

  const links = navLinks[currentUser.role] || [];
  const homePath = currentUser.role === 'USER' ? '/events' : currentUser.role === 'ORGANIZER' ? '/organizer' : '/admin';

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={homePath} className="flex items-center text-primary-600 font-bold text-xl tracking-tight">
              <Calendar className="mr-2 h-6 w-6" />
              SMART EVENT
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {links.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary-600 ${
                  location.pathname === link.path ? 'text-primary-600 border-b-2 border-primary-600' : 'text-slate-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="flex items-center ml-4 pl-4 border-l border-slate-200">
              <span className="text-sm text-slate-500 mr-4 flex items-center">
                <User className="w-4 h-4 mr-1" />
                {currentUser.name}
              </span>
              <button 
                onClick={handleLogout}
                className="text-sm font-medium text-danger-600 hover:text-danger-700 flex items-center"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-500 hover:text-slate-600 p-2"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === link.path ? 'bg-primary-50 text-primary-700' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-danger-600 hover:bg-danger-50"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
