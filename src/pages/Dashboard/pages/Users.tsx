import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Mail, RefreshCcw, User, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import PageHeader from '../components/PageHeader';
import Loader from '../../../components/ui/Loader';
import { fetchUsers, updateUserStatus, resetUserPassword, User as UserType } from '../../../services/userService';

const Users = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  
  // Pagination calculations
  const totalUsers = filteredUsers.length;
  const pageCount = Math.ceil(totalUsers / pageSize);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  
  // Fetch users
  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      try {
        const data = await fetchUsers();
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        toast.error('Failed to load users');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUsers();
  }, []);
  
  // Filter users when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }
    
    const filtered = users.filter(user => 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, users]);
  
  // Handle verify/unverify user
  const handleVerificationChange = async (userId: string, isVerified: boolean) => {
    try {
      const updatedUser = await updateUserStatus(userId, isVerified);
      
      // Update users state
      setUsers(users.map(user => 
        user.id === userId ? updatedUser : user
      ));
      
      toast.success(`User ${isVerified ? 'verified' : 'unverified'} successfully`);
    } catch (error) {
      toast.error('Failed to update user verification status');
    }
  };
  
  // Handle password reset
  const handlePasswordReset = async (userId: string, email: string) => {
    try {
      await resetUserPassword(userId);
      toast.success(`Password reset email sent to ${email}`);
    } catch (error) {
      toast.error('Failed to reset password');
    }
  };
  
  return (
    <div>
      <PageHeader 
        title="User Management"
        description="View and manage user accounts"
      />
      
      {/* Search bar */}
      <div className="mb-6">
        <div className="max-w-md relative">
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
        </div>
      </div>
      
      {/* Users table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="py-20">
            <Loader />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Verification Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registration Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center">
                          <span className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium mr-2">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                          {user.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.isVerified
                                ? 'bg-success-100 text-success-800'
                                : 'bg-warning-100 text-warning-800'
                            }`}
                          >
                            {user.isVerified ? (
                              <>
                                <CheckCircle size={12} className="mr-1" />
                                Verified
                              </>
                            ) : (
                              <>
                                <XCircle size={12} className="mr-1" />
                                Unverified
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(user.registeredAt), 'PPP')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex space-x-3">
                            <button
                              type="button"
                              onClick={() => handleVerificationChange(user.id, !user.isVerified)}
                              className={`inline-flex items-center text-xs font-medium px-2.5 py-1.5 rounded-md ${
                                user.isVerified
                                  ? 'bg-error-50 text-error-700 hover:bg-error-100'
                                  : 'bg-success-50 text-success-700 hover:bg-success-100'
                              }`}
                            >
                              <User size={14} className="mr-1" />
                              {user.isVerified ? 'Unverify' : 'Verify'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handlePasswordReset(user.id, user.email)}
                              className="inline-flex items-center text-xs font-medium px-2.5 py-1.5 rounded-md bg-gray-50 text-gray-700 hover:bg-gray-100"
                            >
                              <RefreshCcw size={14} className="mr-1" />
                              Reset Password
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pageCount > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(currentPage * pageSize, totalUsers)}
                      </span>{' '}
                      of <span className="font-medium">{totalUsers}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 ${
                          currentPage === 1
                            ? 'bg-gray-50 text-gray-400'
                            : 'bg-white text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronDown className="h-5 w-5 rotate-90" aria-hidden="true" />
                      </button>

                      {[...Array(pageCount)].map((_, idx) => (
                        <button
                          key={idx + 1}
                          onClick={() => setCurrentPage(idx + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border ${
                            currentPage === idx + 1
                              ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          } text-sm font-medium`}
                        >
                          {idx + 1}
                        </button>
                      ))}

                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
                        disabled={currentPage === pageCount}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 ${
                          currentPage === pageCount
                            ? 'bg-gray-50 text-gray-400'
                            : 'bg-white text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Next</span>
                        <ChevronDown className="h-5 w-5 -rotate-90" aria-hidden="true" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Users;