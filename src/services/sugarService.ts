// Mock sugar history service

export interface SugarRecord {
  id: string;
  userId: string;
  scanId: string;
  foodName: string;
  sugarPerPackage: number;
  packageCount: number;
  totalSugar: number;
  teaspoonConversion: string;
  scanTime: string;
  validationStatus: 'valid' | 'invalid';
}

// Generate mock data
const generateMockData = (userId: string, count = 50): SugarRecord[] => {
  const foodItems = [
    'Chocolate Bar', 'Soda', 'Cereal', 'Yogurt', 'Candy', 'Cookies', 
    'Ice Cream', 'Granola Bar', 'Fruit Juice', 'Energy Drink', 
    'Sweetened Coffee', 'Pastry', 'Cake', 'Jam', 'Ketchup'
  ];
  
  return Array.from({ length: count }).map((_, i) => {
    const sugarPerPackage = parseFloat((Math.random() * 30 + 2).toFixed(1));
    const packageCount = Math.floor(Math.random() * 3) + 1;
    const totalSugar = sugarPerPackage * packageCount;
    
    const now = new Date();
    const randomDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - Math.floor(Math.random() * 60)
    );
    
    return {
      id: `rec_${i + 1}`,
      userId,
      scanId: `SCAN_${(1000 + i).toString(16).toUpperCase()}`,
      foodName: foodItems[Math.floor(Math.random() * foodItems.length)],
      sugarPerPackage,
      packageCount,
      totalSugar,
      teaspoonConversion: (totalSugar / 4).toFixed(1),
      scanTime: randomDate.toISOString(),
      validationStatus: Math.random() > 0.2 ? 'valid' : 'invalid',
    };
  });
};

// Mock database
let mockDatabase: { [userId: string]: SugarRecord[] } = {};

// Initialize mock data
const initMockDatabase = () => {
  if (Object.keys(mockDatabase).length === 0) {
    mockDatabase = {
      '1': generateMockData('1', 80),
      '2': generateMockData('2', 40),
      '3': generateMockData('3', 60),
      '4': generateMockData('4', 30),
    };
  }
};

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get sugar history for a user
export const fetchSugarHistory = async (userId: string): Promise<SugarRecord[]> => {
  initMockDatabase();
  
  // Simulate API request delay
  await delay(800);
  
  return mockDatabase[userId] || [];
};

// Add new sugar record
export const addSugarRecord = async (data: Partial<SugarRecord>): Promise<SugarRecord> => {
  initMockDatabase();
  
  // Simulate API request delay
  await delay(600);
  
  const userId = data.userId || '1';
  
  const newRecord: SugarRecord = {
    id: `rec_${Date.now()}`,
    userId,
    scanId: `SCAN_${Math.floor(Math.random() * 10000).toString(16).toUpperCase()}`,
    foodName: data.foodName || 'Unknown Food',
    sugarPerPackage: data.sugarPerPackage || 0,
    packageCount: data.packageCount || 1,
    totalSugar: data.totalSugar || 0,
    teaspoonConversion: data.teaspoonConversion || '0',
    scanTime: new Date().toISOString(),
    validationStatus: 'valid',
  };
  
  if (!mockDatabase[userId]) {
    mockDatabase[userId] = [];
  }
  
  mockDatabase[userId].unshift(newRecord);
  
  return newRecord;
};

// Update sugar record
export const updateSugarRecord = async (id: string, data: Partial<SugarRecord>): Promise<SugarRecord> => {
  initMockDatabase();
  
  // Simulate API request delay
  await delay(600);
  
  const userId = data.userId || '1';
  
  if (!mockDatabase[userId]) {
    throw new Error('User not found');
  }
  
  const recordIndex = mockDatabase[userId].findIndex(record => record.id === id);
  
  if (recordIndex === -1) {
    throw new Error('Record not found');
  }
  
  const updatedRecord = {
    ...mockDatabase[userId][recordIndex],
    foodName: data.foodName || mockDatabase[userId][recordIndex].foodName,
    sugarPerPackage: data.sugarPerPackage || mockDatabase[userId][recordIndex].sugarPerPackage,
    packageCount: data.packageCount || mockDatabase[userId][recordIndex].packageCount,
    totalSugar: data.totalSugar || mockDatabase[userId][recordIndex].totalSugar,
    teaspoonConversion: data.teaspoonConversion || mockDatabase[userId][recordIndex].teaspoonConversion,
  };
  
  mockDatabase[userId][recordIndex] = updatedRecord;
  
  return updatedRecord;
};

// Delete sugar record
export const deleteSugarRecord = async (id: string): Promise<void> => {
  initMockDatabase();
  
  // Simulate API request delay
  await delay(600);
  
  // Find the record in all user collections
  for (const userId in mockDatabase) {
    mockDatabase[userId] = mockDatabase[userId].filter(record => record.id !== id);
  }
};