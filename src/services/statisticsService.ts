// Mock statistics service

export interface SugarStatisticsData {
  dailyAverage: number;
  totalConsumption: number;
  maxDailyConsumption: number;
  maxConsumptionDate: string;
  dailyConsumption: { date: string; sugarAmount: number }[];
  weeklyConsumption: { week: string; sugarAmount: number }[];
  monthlyTrend: { month: string; averageDailyConsumption: number }[];
  sugarSources: { source: string; percentage: number }[];
}

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate daily consumption data for past 30 days
const generateDailyData = () => {
  const data = [];
  const today = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    // Generate random sugar amount between 10g and 60g
    const sugarAmount = Math.round((Math.random() * 50 + 10) * 10) / 10;
    
    data.push({
      date: date.toISOString().split('T')[0],
      sugarAmount,
    });
  }
  
  return data;
};

// Generate weekly consumption data
const generateWeeklyData = () => {
  return [
    { week: 'Week 1', sugarAmount: 210 },
    { week: 'Week 2', sugarAmount: 180 },
    { week: 'Week 3', sugarAmount: 240 },
    { week: 'Week 4', sugarAmount: 200 },
  ];
};

// Generate monthly trend data
const generateMonthlyTrend = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  return months.map(month => ({
    month,
    averageDailyConsumption: Math.round((Math.random() * 20 + 20) * 10) / 10,
  }));
};

// Generate sugar sources data
const generateSugarSources = () => {
  return [
    { source: 'Processed Foods', percentage: 45 },
    { source: 'Beverages', percentage: 30 },
    { source: 'Desserts', percentage: 15 },
    { source: 'Others', percentage: 10 },
  ];
};

// Get statistics data
export const fetchStatisticsData = async (
  userId: string,
  fromDate: string,
  toDate: string
): Promise<SugarStatisticsData> => {
  // Simulate API request delay
  await delay(1000);
  
  // Generate daily consumption data
  const dailyData = generateDailyData();
  
  // Calculate max daily consumption
  const maxDay = dailyData.reduce((max, day) => 
    day.sugarAmount > max.sugarAmount ? day : max, dailyData[0]
  );
  
  // Calculate daily average
  const totalSugar = dailyData.reduce((sum, day) => sum + day.sugarAmount, 0);
  const dailyAverage = Math.round((totalSugar / dailyData.length) * 10) / 10;
  
  // Return mock statistics
  return {
    dailyAverage,
    totalConsumption: Math.round(totalSugar),
    maxDailyConsumption: maxDay.sugarAmount,
    maxConsumptionDate: maxDay.date,
    dailyConsumption: dailyData,
    weeklyConsumption: generateWeeklyData(),
    monthlyTrend: generateMonthlyTrend(),
    sugarSources: generateSugarSources(),
  };
};