import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, UserCog, ShieldAlert } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

export function Login() {
  const [selectedRole, setSelectedRole] = useState(null);
  const { login, currentUser } = useAppContext();
  const navigate = useNavigate();

  // If already logged in, redirect
  if (currentUser) {
    if (currentUser.role === 'USER') navigate('/events');
    if (currentUser.role === 'ORGANIZER') navigate('/organizer');
    if (currentUser.role === 'ADMIN') navigate('/admin');
  }

  const handleLogin = () => {
    if (!selectedRole) return;
    
    if (login(selectedRole)) {
      if (selectedRole === 'USER') navigate('/events');
      if (selectedRole === 'ORGANIZER') navigate('/organizer');
      if (selectedRole === 'ADMIN') navigate('/admin');
    }
  };

  const roles = [
    { id: 'USER', label: 'User', icon: User, desc: 'Browse and book events' },
    { id: 'ORGANIZER', label: 'Organizer', icon: UserCog, desc: 'Create and manage events' },
    { id: 'ADMIN', label: 'Admin', icon: ShieldAlert, desc: 'Platform oversight' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center">
          <div className="bg-primary-600 p-3 rounded-xl shadow-lg shadow-primary-500/30">
            <Calendar className="h-10 w-10 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome to Smart Event
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Discover. Experience. Celebrate.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="p-8">
          <h3 className="text-lg font-medium text-slate-900 mb-6 text-center">Select your role to continue</h3>
          
          <div className="space-y-4 mb-8">
            {roles.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;
              
              return (
                <div
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-primary-600 bg-primary-50' 
                      : 'border-slate-200 hover:border-primary-300 hover:bg-slate-50'
                  }`}
                >
                  <div className={`p-2 rounded-lg mr-4 ${isSelected ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className={`font-semibold ${isSelected ? 'text-primary-900' : 'text-slate-900'}`}>{role.label}</h4>
                    <p className={`text-sm ${isSelected ? 'text-primary-700' : 'text-slate-500'}`}>{role.desc}</p>
                  </div>
                  {isSelected && (
                    <div className="ml-auto">
                      <div className="w-5 h-5 rounded-full bg-primary-600 border-4 border-primary-200"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <Button 
            className="w-full h-12 text-lg"
            onClick={handleLogin}
            disabled={!selectedRole}
          >
            Continue to {selectedRole ? roles.find(r => r.id === selectedRole).label : 'Dashboard'}
          </Button>
          
          <p className="mt-6 text-center text-xs text-slate-500">
            This is a frontend-only demonstration. No real authentication is performed.
          </p>
        </Card>
      </div>
    </div>
  );
}
