import { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, ArcElement } from 'chart.js';
import { toast } from 'react-toastify';
import { CalendarRange } from 'lucide-react';

import PageHeader from '../components/PageHeader';
import Loader from '../../../components/ui/Loader';
import { fetchStatisticsData, SugarStatisticsData } from '../../../services/statisticsService';
import { fetchUsers } from '../../../services/userService';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Statistics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<{id: string, name: string}[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [dateRange, setDateRange] = useState({
    from: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    to: format(new Date(), 'yyyy-MM-dd'),
  });
  const [statistics, setStatistics] = useState<SugarStatisticsData | null>(null);
  
  // Fetch users and initial statistics
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Fetch users
        const userData = await fetchUsers();
        const userOptions = userData.map(user => ({
          id: user.id,
          name: user.username,
        }));
        setUsers(userOptions);
        
        // Fetch statistics data
        const statsData = await fetchStatisticsData(selectedUser, dateRange.from, dateRange.to);
        setStatistics(statsData);
      } catch (error) {
        toast.error('Failed to load statistics data');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Fetch statistics when filters change
  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true);
      try {
        const statsData = await fetchStatisticsData(selectedUser, dateRange.from, dateRange.to);
        setStatistics(statsData);
      } catch (error) {
        toast.error('Failed to load statistics data');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Only fetch if we have initial data
    if (users.length > 0) {
      loadStats();
    }
  }, [selectedUser, dateRange]);
  
  // Handle user selection change
  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUser(e.target.value);
  };
  
  // Handle date range change
  const handleDateRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };
  
  // Define chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  
  return (
    <div>
      <PageHeader 
        title="Sugar Consumption Statistics"
        description="View detailed statistics and trends of sugar consumption"
      />
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="user-select" className="block text-sm font-medium text-gray-700 mb-1">
              Select User
            </label>
            <select
              id="user-select"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
              value={selectedUser}
              onChange={handleUserChange}
            >
              <option value="all">All Users</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <input
                  type="date"
                  name="from"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                  value={dateRange.from}
                  onChange={handleDateRangeChange}
                  max={dateRange.to}
                />
              </div>
              <div className="relative">
                <input
                  type="date"
                  name="to"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                  value={dateRange.to}
                  onChange={handleDateRangeChange}
                  min={dateRange.from}
                  max={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="py-20">
          <Loader />
        </div>
      ) : statistics ? (
        <div className="space-y-6">
          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <StatCard 
              title="Average Daily Consumption"
              value={`${statistics.dailyAverage}g`}
              description="of sugar per day"
              color="primary"
            />
            <StatCard 
              title="Total Consumption"
              value={`${statistics.totalConsumption}g`}
              description="during selected period"
              color="secondary"
            />
            <StatCard 
              title="Highest Day"
              value={`${statistics.maxDailyConsumption}g`}
              description={`on ${format(new Date(statistics.maxConsumptionDate), 'PP')}`}
              color="accent"
            />
          </div>
          
          {/* Daily Consumption Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Daily Sugar Consumption</h2>
            <div className="h-80">
              {statistics.dailyConsumption.length > 0 ? (
                <Line
                  data={{
                    labels: statistics.dailyConsumption.map(d => format(new Date(d.date), 'MMM d')),
                    datasets: [
                      {
                        label: 'Sugar (g)',
                        data: statistics.dailyConsumption.map(d => d.sugarAmount),
                        borderColor: '#2563eb',
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        fill: true,
                        tension: 0.2,
                      },
                      {
                        label: 'Recommended Max (25g)',
                        data: Array(statistics.dailyConsumption.length).fill(25),
                        borderColor: '#ef4444',
                        borderDash: [5, 5],
                        borderWidth: 2,
                        pointRadius: 0,
                        fill: false,
                      },
                    ],
                  }}
                  options={chartOptions}
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">No data available for the selected period</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Weekly Comparison & Source Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Weekly Consumption */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Weekly Consumption</h2>
              <div className="h-80">
                {statistics.weeklyConsumption.length > 0 ? (
                  <Bar
                    data={{
                      labels: statistics.weeklyConsumption.map(w => w.week),
                      datasets: [
                        {
                          label: 'Sugar (g)',
                          data: statistics.weeklyConsumption.map(w => w.sugarAmount),
                          backgroundColor: '#14b8a6',
                        },
                      ],
                    }}
                    options={chartOptions}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-500">No data available for the selected period</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Sugar Sources Distribution */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Sugar Sources</h2>
              <div className="h-80">
                {statistics.sugarSources.length > 0 ? (
                  <Doughnut
                    data={{
                      labels: statistics.sugarSources.map(s => s.source),
                      datasets: [
                        {
                          data: statistics.sugarSources.map(s => s.percentage),
                          backgroundColor: ['#2563eb', '#14b8a6', '#f97316', '#64748b', '#10b981'],
                          borderWidth: 1,
                          borderColor: '#ffffff',
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right',
                        },
                      },
                    }}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-500">No data available for the selected period</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Consumption Trends */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Consumption Trends</h2>
            <div className="h-80">
              {statistics.monthlyTrend.length > 0 ? (
                <Line
                  data={{
                    labels: statistics.monthlyTrend.map(m => m.month),
                    datasets: [
                      {
                        label: 'Average Daily Sugar (g)',
                        data: statistics.monthlyTrend.map(m => m.averageDailyConsumption),
                        borderColor: '#f97316',
                        backgroundColor: 'rgba(249, 115, 22, 0.1)',
                        fill: true,
                      },
                    ],
                  }}
                  options={chartOptions}
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">No data available for the selected period</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-10 text-center">
          <p className="text-gray-500">No statistics data available</p>
        </div>
      )}
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  color: 'primary' | 'secondary' | 'accent';
}

const StatCard = ({ title, value, description, color }: StatCardProps) => {
  const colorClasses = {
    primary: 'bg-primary-50 border-primary-200',
    secondary: 'bg-secondary-50 border-secondary-200',
    accent: 'bg-accent-50 border-accent-200',
  };
  
  const textColorClasses = {
    primary: 'text-primary-800',
    secondary: 'text-secondary-800',
    accent: 'text-accent-800',
  };
  
  return (
    <div className={`rounded-lg shadow-sm border p-6 ${colorClasses[color]}`}>
      <h3 className="text-gray-500 text-sm font-medium truncate">{title}</h3>
      <p className={`mt-2 text-3xl font-semibold ${textColorClasses[color]}`}>{value}</p>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  );
};

export default Statistics;