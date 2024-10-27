import React from 'react';
import { Users, Pill, ShoppingCart, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const Dashboard: React.FC = () => {
  const { user } = useUser();

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {user?.role === 'admin' && (
          <DashboardCard
            to="/employees"
            icon={<Users className="h-6 w-6 text-white" />}
            title="Employees"
            description="Manage pharmacy staff"
            color="bg-blue-500"
          />
        )}
        <DashboardCard
          to="/medicines"
          icon={<Pill className="h-6 w-6 text-white" />}
          title="Medicines"
          description="Manage inventory"
          color="bg-green-500"
        />
        <DashboardCard
          to="/sales"
          icon={<ShoppingCart className="h-6 w-6 text-white" />}
          title="Dispensing"
          description="Process transactions"
          color="bg-yellow-500"
        />
        <DashboardCard
          to="/reports"
          icon={<FileText className="h-6 w-6 text-white" />}
          title="Reports"
          description="View analytics"
          color="bg-purple-500"
        />
      </div>
    </div>
  );
};

const DashboardCard: React.FC<{
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}> = ({ to, icon, title, description, color }) => (
  <Link to={to} className="block">
    <div className={`${color} overflow-hidden shadow rounded-lg`}>
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">{icon}</div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-white truncate">{title}</dt>
              <dd>
                <div className="text-lg font-medium text-white">{description}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  </Link>
);

export default Dashboard;