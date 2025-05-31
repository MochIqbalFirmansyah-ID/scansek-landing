// Mock authentication service

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
}

interface LoginResult {
  success: boolean;
  message: string;
  user?: User;
}

// Mock user data
const MOCK_USERS = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@scansek.com',
    password: 'admin123', // In a real app, passwords would be hashed
    role: 'admin' as const,
  },
  {
    id: '2',
    username: 'user',
    email: 'user@example.com',
    password: 'user123',
    role: 'user' as const,
  },
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock login function
export const mockLogin = async (email: string, password: string): Promise<LoginResult> => {
  // Simulate API request delay
  await delay(800);
  
  const user = MOCK_USERS.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  
  if (user) {
    // Strip password from returned user object
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      success: true,
      message: 'Login successful',
      user: userWithoutPassword,
    };
  }
  
  return {
    success: false,
    message: 'Invalid email or password',
  };
};

// Mock logout function
export const mockLogout = async (): Promise<void> => {
  // Simulate API request delay
  await delay(300);
  
  // In a real app, this would invalidate the session/token on the server
  return;
};