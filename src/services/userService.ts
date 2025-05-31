// Mock user service

export interface User {
  id: string;
  username: string;
  email: string;
  isVerified: boolean;
  registeredAt: string;
  lastLogin?: string;
}

// Generate mock users
const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@scansek.com',
    isVerified: true,
    registeredAt: '2025-01-01T10:00:00Z',
    lastLogin: '2025-03-15T08:30:00Z',
  },
  {
    id: '2',
    username: 'testuser',
    email: 'user@example.com',
    isVerified: true,
    registeredAt: '2025-01-15T14:20:00Z',
    lastLogin: '2025-03-14T16:45:00Z',
  },
  {
    id: '3',
    username: 'johndoe',
    email: 'john@example.com',
    isVerified: false,
    registeredAt: '2025-02-05T09:15:00Z',
  },
  {
    id: '4',
    username: 'janesmith',
    email: 'jane@example.com',
    isVerified: true,
    registeredAt: '2025-02-20T11:30:00Z',
    lastLogin: '2025-03-10T10:20:00Z',
  },
  {
    id: '5',
    username: 'sarahjones',
    email: 'sarah@example.com',
    isVerified: false,
    registeredAt: '2025-03-01T15:45:00Z',
  },
  {
    id: '6',
    username: 'mikebrown',
    email: 'mike@example.com',
    isVerified: true,
    registeredAt: '2025-03-05T08:10:00Z',
    lastLogin: '2025-03-12T14:30:00Z',
  },
  {
    id: '7',
    username: 'emilygreen',
    email: 'emily@example.com',
    isVerified: true,
    registeredAt: '2025-03-08T16:20:00Z',
    lastLogin: '2025-03-13T09:15:00Z',
  },
  {
    id: '8',
    username: 'alexwilson',
    email: 'alex@example.com',
    isVerified: false,
    registeredAt: '2025-03-10T10:30:00Z',
  },
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get all users
export const fetchUsers = async (): Promise<User[]> => {
  // Simulate API request delay
  await delay(800);
  
  return [...mockUsers];
};

// Update user verification status
export const updateUserStatus = async (userId: string, isVerified: boolean): Promise<User> => {
  // Simulate API request delay
  await delay(600);
  
  const userIndex = mockUsers.findIndex(user => user.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  mockUsers[userIndex] = {
    ...mockUsers[userIndex],
    isVerified,
  };
  
  return mockUsers[userIndex];
};

// Reset user password
export const resetUserPassword = async (userId: string): Promise<void> => {
  // Simulate API request delay
  await delay(600);
  
  const userIndex = mockUsers.findIndex(user => user.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  // In a real app, this would send a password reset email
  // Here we just simulate the API call
  return;
};