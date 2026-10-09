import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

// Layouts
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';

// Pages
import { Login } from '../pages/Login';

// User Pages
import { Events } from '../pages/user/Events';
import { EventDetails } from '../pages/user/EventDetails';
import { MyBookings } from '../pages/user/MyBookings';
import { MyTickets } from '../pages/user/MyTickets';

// Organizer Pages
import { OrganizerDashboard } from '../pages/organizer/OrganizerDashboard';
import { CreateEvent } from '../pages/organizer/CreateEvent';
import { ManageEvents } from '../pages/organizer/ManageEvents';
import { EditEvent } from '../pages/organizer/EditEvent';
import { EventBookings } from '../pages/organizer/EventBookings';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { Users } from '../pages/admin/Users';
import { Events as AdminEvents } from '../pages/admin/Events';
import { Bookings as AdminBookings } from '../pages/admin/Bookings';
import { Analytics } from '../pages/admin/Analytics';
import { useState } from 'react';
import { Menu } from 'lucide-react';

const ProtectedRoute = ({ allowedRole }) => {
  const { currentUser } = useAppContext();
  
  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role !== allowedRole) {
    if (currentUser.role === 'USER') return <Navigate to="/events" replace />;
    if (currentUser.role === 'ORGANIZER') return <Navigate to="/organizer" replace />;
    if (currentUser.role === 'ADMIN') return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

const UserLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col lg:pl-64 transition-all duration-300">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-slate-200 h-16 flex items-center px-4 sticky top-0 z-30">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-slate-500 hover:text-slate-700"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-lg text-primary-600 ml-2 tracking-tight">SMART EVENT</span>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-6xl font-black text-slate-200 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Page Not Found</h2>
      <p className="text-slate-500 text-center max-w-md mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <a href="/" className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
        Go Home
      </a>
    </div>
  );
};

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* USER ROUTES */}
      <Route element={<ProtectedRoute allowedRole="USER" />}>
        <Route element={<UserLayout />}>
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/my-tickets" element={<MyTickets />} />
        </Route>
      </Route>

      {/* ORGANIZER ROUTES */}
      <Route element={<ProtectedRoute allowedRole="ORGANIZER" />}>
        <Route element={<DashboardLayout />}>
          <Route path="/organizer" element={<OrganizerDashboard />} />
          <Route path="/organizer/create-event" element={<CreateEvent />} />
          <Route path="/organizer/events" element={<ManageEvents />} />
          <Route path="/organizer/events/:id/edit" element={<EditEvent />} />
          <Route path="/organizer/bookings" element={<EventBookings />} />
        </Route>
      </Route>

      {/* ADMIN ROUTES */}
      <Route element={<ProtectedRoute allowedRole="ADMIN" />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/analytics" element={<Analytics />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
