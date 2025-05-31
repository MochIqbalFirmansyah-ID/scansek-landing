import { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Activity, TrendingUp, UserPlus, ShoppingBag } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Loader from '../../../components/ui/Loader';

// Mock data
const weeklyData = [
  { day: 'Mon', sugar: 32 },
  { day: 'Tue', sugar: 45 },
  { day: 'Wed', sugar: 38 },
  { day: 'Thu', sugar: 25 },
  { day: 'Fri', sugar: 42 },
  { day: 'Sat', sugar: 60 },
  { day: 'Sun', sugar: 35 },
];

const monthlyData = [
  { name: 'Week 1', sugar: 180 },
  { name: 'Week 2', sugar: 200 },
  { name: 'Week 3', sugar: 190 },
  { name: 'Week 4', sugar: 210 },
];

const sugarSourcesData = [
  { name: 'Processed Foods', value: 45 },
  { name: 'Beverages', value: 30 },
  { name: 'Desserts', value: 15 },
  { name: 'Others', value: 10 },
];

const COLORS = ['#2563eb', '#14b8a6', '#f97316', '#64748b'];

const Overview = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    dailyAvg: '0',
    weeklyTotal: '0',
    monthlyAvg: '0',
    scanCount: '0',
  });

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStats({
        dailyAvg: '42',
        weeklyTotal: '285',
        monthlyAvg: '38',
        scanCount: '124',
      });
      setIsLoading(false);
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <Loader text="Loading dashboard data..." />;
  }

  return (
    <div>
      <PageHeader 
        title={`Welcome back, ${user?.username}!`} 
        description="Here's an overview of your sugar consumption data"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Daily Average"
          value={`${stats.dailyAvg}g`}
          description="of sugar consumption"
          icon={<Activity className="text-primary-600" />}
          trend="up"
          trendValue="12%"
        />
        <StatsCard
          title="Weekly Total"
          value={`${stats.weeklyTotal}g`}
          description="of sugar consumption"
          icon={<TrendingUp className="text-secondary-600" />}
          trend="down"
          trendValue="5%"
        />
        <StatsCard
          title="Monthly Average"
          value={`${stats.monthlyAvg}g`}
          description="per day"
          icon={<ShoppingBag className="text-accent-600" />}
          trend="neutral"
          trendValue=""
        />
        <StatsCard
          title="Total Scans"
          value={stats.scanCount}
          description="food items scanned"
          icon={<UserPlus className="text-success-600" />}
          trend="up"
          trendValue="24%"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Weekly Consumption Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Weekly Sugar Consumption</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sugar" stroke="#2563eb" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Consumption Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Sugar Consumption</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sugar" fill="#14b8a6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Sugar Sources Distribution</h2>
        <div className="h-80 flex justify-center">
          <ResponsiveContainer width="100%" height="100%" maxWidth={500}>
            <PieChart>
              <Pie
                data={sugarSourcesData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {sugarSourcesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
}

const StatsCard = ({ title, value, description, icon, trend, trendValue }: StatsCardProps) => {
  const trendColor = trend === 'up' ? 'text-error-600' : trend === 'down' ? 'text-success-600' : 'text-gray-500';

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className="p-2 bg-gray-100 rounded-md">{icon}</div>
      </div>
      <div className="flex flex-col">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      {trendValue && (
        <div className={`mt-4 ${trendColor} text-sm`}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue} from last week
        </div>
      )}
    </div>
  );
};

export default Overview;