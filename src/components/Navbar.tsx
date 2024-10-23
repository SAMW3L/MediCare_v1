import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Users, Pill, ShoppingCart, FileText, LogOut } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const Navbar: React.FC = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-white font-bold text-lg">PharmaSystem</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <NavLink to="/" icon={<Home className="w-5 h-5 mr-1" />} text="Dashboard" />
                {user?.role === 'admin' && (
                  <NavLink to="/employees" icon={<Users className="w-5 h-5 mr-1" />} text="Employees" />
                )}
                <NavLink to="/medicines" icon={<Pill className="w-5 h-5 mr-1" />} text="Medicines" />
                <NavLink to="/sales" icon={<ShoppingCart className="w-5 h-5 mr-1" />} text="Sales" />
                <NavLink to="/reports" icon={<FileText className="w-5 h-5 mr-1" />} text="Reports" />
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <button
                onClick={handleLogout}
                className="bg-indigo-700 p-1 rounded-full text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
              >
                <LogOut className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink: React.FC<{ to: string; icon: React.ReactNode; text: string }> = ({ to, icon, text }) => (
  <Link
    to={to}
    className="text-gray-300 hover:bg-indigo-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
  >
    {icon}
    {text}
  </Link>
);

export default Navbar;