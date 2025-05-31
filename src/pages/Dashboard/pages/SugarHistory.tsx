import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Search, Filter, ChevronDown, ChevronUp, Edit2, Trash2, X, Check, CalendarRange } from 'lucide-react';
import { toast } from 'react-toastify';
import { format, parseISO } from 'date-fns';

import PageHeader from '../components/PageHeader';
import Loader from '../../../components/ui/Loader';
import { fetchSugarHistory, SugarRecord, deleteSugarRecord, updateSugarRecord, addSugarRecord } from '../../../services/sugarService';

// Table column configuration
const COLUMNS = [
  { id: 'scanId', label: 'Scan ID', sortable: true },
  { id: 'foodName', label: 'Food Name', sortable: true },
  { id: 'sugarPerPackage', label: 'Sugar per Package (g)', sortable: true },
  { id: 'packageCount', label: 'Package Count', sortable: true },
  { id: 'totalSugar', label: 'Total Sugar (g)', sortable: true },
  { id: 'teaspoonConversion', label: 'Teaspoons', sortable: true },
  { id: 'scanTime', label: 'Scan Time', sortable: true },
  { id: 'validationStatus', label: 'Status', sortable: true },
  { id: 'actions', label: 'Actions', sortable: false },
];

// Page size options
const PAGE_SIZES = [10, 25, 50];

const SugarHistory = () => {
  // State for table data and pagination
  const [records, setRecords] = useState<SugarRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<SugarRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for sorting
  const [sortConfig, setSortConfig] = useState({ key: 'scanTime', direction: 'desc' as 'asc' | 'desc' });
  
  // State for date filter
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  
  // State for selected user
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [users, setUsers] = useState<{id: string, name: string, email: string}[]>([]);
  
  // State for modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<SugarRecord | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Fetch list of users (in a real app, this would be a separate API call)
        const mockUsers = [
          { id: '1', name: 'Admin User', email: 'admin@scansek.com' },
          { id: '2', name: 'Test User', email: 'user@example.com' },
          { id: '3', name: 'John Doe', email: 'john@example.com' },
          { id: '4', name: 'Jane Smith', email: 'jane@example.com' },
        ];
        setUsers(mockUsers);
        
        if (!selectedUser && mockUsers.length > 0) {
          setSelectedUser(mockUsers[0].id);
        }
        
        // Fetch sugar history data
        const data = await fetchSugarHistory(selectedUser || '1');
        setRecords(data);
        setFilteredRecords(data);
        setTotalRecords(data.length);
      } catch (error) {
        toast.error('Failed to load data');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [selectedUser]);
  
  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...records];
    
    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter(record => 
        record.foodName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.scanId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply date range filter
    if (dateRange.from) {
      filtered = filtered.filter(record => 
        new Date(record.scanTime) >= new Date(dateRange.from)
      );
    }
    
    if (dateRange.to) {
      filtered = filtered.filter(record => 
        new Date(record.scanTime) <= new Date(`${dateRange.to}T23:59:59`)
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key as keyof SugarRecord];
      const bValue = b[sortConfig.key as keyof SugarRecord];
      
      if (sortConfig.key === 'scanTime') {
        return sortConfig.direction === 'asc'
          ? new Date(aValue as string).getTime() - new Date(bValue as string).getTime()
          : new Date(bValue as string).getTime() - new Date(aValue as string).getTime();
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });
    
    setFilteredRecords(filtered);
    setTotalRecords(filtered.length);
    setCurrentPage(1);
  }, [records, searchTerm, dateRange, sortConfig]);
  
  // Handle sort request
  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };
  
  // Pagination calculations
  const pageCount = Math.ceil(totalRecords / pageSize);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  
  // Handle user selection change
  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUser(e.target.value);
  };
  
  // Handle edit record
  const handleEditClick = (record: SugarRecord) => {
    setCurrentRecord(record);
    setShowEditModal(true);
  };
  
  // Handle delete record
  const handleDeleteClick = (record: SugarRecord) => {
    setCurrentRecord(record);
    setShowDeleteModal(true);
  };
  
  // Delete record
  const confirmDelete = async () => {
    if (!currentRecord) return;
    
    setIsLoading(true);
    try {
      await deleteSugarRecord(currentRecord.id);
      
      // Update local state
      const updatedRecords = records.filter(r => r.id !== currentRecord.id);
      setRecords(updatedRecords);
      toast.success('Record deleted successfully');
    } catch (error) {
      toast.error('Failed to delete record');
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
      setCurrentRecord(null);
    }
  };
  
  return (
    <div>
      <PageHeader 
        title="Sugar Consumption History"
        description="View and manage sugar consumption records"
        actions={
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={16} className="mr-2" />
            Add New Record
          </button>
        }
      />

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* User Selection */}
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
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>
          
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Food Items
            </label>
            <div className="relative">
              <input
                id="search"
                type="text"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50 pl-10"
                placeholder="Search by food name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
            </div>
          </div>
          
          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <input
                  type="date"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                  value={dateRange.from}
                  onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                />
              </div>
              <div className="relative">
                <input
                  type="date"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                  value={dateRange.to}
                  onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Filter tags/chips */}
        <div className="flex flex-wrap gap-2 mt-4">
          {searchTerm && (
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
              Search: {searchTerm}
              <button
                type="button"
                className="ml-2 text-gray-500 hover:text-gray-700"
                onClick={() => setSearchTerm('')}
              >
                <X size={14} />
              </button>
            </div>
          )}
          {dateRange.from && (
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
              From: {dateRange.from}
              <button
                type="button"
                className="ml-2 text-gray-500 hover:text-gray-700"
                onClick={() => setDateRange({ ...dateRange, from: '' })}
              >
                <X size={14} />
              </button>
            </div>
          )}
          {dateRange.to && (
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
              To: {dateRange.to}
              <button
                type="button"
                className="ml-2 text-gray-500 hover:text-gray-700"
                onClick={() => setDateRange({ ...dateRange, to: '' })}
              >
                <X size={14} />
              </button>
            </div>
          )}
          {(searchTerm || dateRange.from || dateRange.to) && (
            <button
              type="button"
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-50 text-primary-700 hover:bg-primary-100"
              onClick={() => {
                setSearchTerm('');
                setDateRange({ from: '', to: '' });
              }}
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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
                    {COLUMNS.map((column) => (
                      <th
                        key={column.id}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        <div className="flex items-center">
                          {column.label}
                          {column.sortable && (
                            <button
                              type="button"
                              className="ml-1 focus:outline-none"
                              onClick={() => handleSort(column.id)}
                            >
                              <div className="flex flex-col">
                                <ChevronUp
                                  size={12}
                                  className={`${
                                    sortConfig.key === column.id && sortConfig.direction === 'asc'
                                      ? 'text-gray-900'
                                      : 'text-gray-400'
                                  } -mb-1`}
                                />
                                <ChevronDown
                                  size={12}
                                  className={`${
                                    sortConfig.key === column.id && sortConfig.direction === 'desc'
                                      ? 'text-gray-900'
                                      : 'text-gray-400'
                                  }`}
                                />
                              </div>
                            </button>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedRecords.length > 0 ? (
                    paginatedRecords.map((record) => (
                      <tr key={record.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {record.scanId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.foodName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.sugarPerPackage}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.packageCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.totalSugar}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.teaspoonConversion}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(record.scanTime), 'PPP p')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              record.validationStatus === 'valid'
                                ? 'bg-success-100 text-success-800'
                                : 'bg-error-100 text-error-800'
                            }`}
                          >
                            {record.validationStatus === 'valid' ? (
                              <Check size={12} className="mr-1" />
                            ) : (
                              <X size={12} className="mr-1" />
                            )}
                            {record.validationStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center space-x-3">
                            <button
                              type="button"
                              className="text-primary-600 hover:text-primary-900"
                              onClick={() => handleEditClick(record)}
                            >
                              <Edit2 size={16} />
                              <span className="sr-only">Edit</span>
                            </button>
                            <button
                              type="button"
                              className="text-error-600 hover:text-error-900"
                              onClick={() => handleDeleteClick(record)}
                            >
                              <Trash2 size={16} />
                              <span className="sr-only">Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={COLUMNS.length} className="px-6 py-4 text-center text-sm text-gray-500">
                        No records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {paginatedRecords.length > 0 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      currentPage === 1
                        ? 'bg-gray-50 text-gray-400'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
                    disabled={currentPage === pageCount}
                    className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      currentPage === pageCount
                        ? 'bg-gray-50 text-gray-400'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(currentPage * pageSize, totalRecords)}
                      </span>{' '}
                      of <span className="font-medium">{totalRecords}</span> results
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-4">
                      <div>
                        <select
                          className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                          value={pageSize}
                          onChange={(e) => setPageSize(Number(e.target.value))}
                        >
                          {PAGE_SIZES.map(size => (
                            <option key={size} value={size}>
                              {size} per page
                            </option>
                          ))}
                        </select>
                      </div>
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
                        {Array.from({ length: Math.min(5, pageCount) }, (_, i) => {
                          // Calculate which pages to show based on current page
                          let pageNum;
                          if (pageCount <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= pageCount - 2) {
                            pageNum = pageCount - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`relative inline-flex items-center px-4 py-2 border ${
                                currentPage === pageNum
                                  ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              } text-sm font-medium`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
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
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Record Modal */}
      {showAddModal && (
        <SugarRecordModal
          onClose={() => setShowAddModal(false)}
          onSave={async (formData) => {
            try {
              // Generate a new record
              const newRecord = await addSugarRecord({
                ...formData,
                userId: selectedUser,
              });
              
              // Update local state
              setRecords(prev => [newRecord, ...prev]);
              toast.success('Record added successfully');
              return true;
            } catch (error) {
              toast.error('Failed to add record');
              return false;
            }
          }}
          title="Add New Sugar Record"
        />
      )}

      {/* Edit Record Modal */}
      {showEditModal && currentRecord && (
        <SugarRecordModal
          record={currentRecord}
          onClose={() => {
            setShowEditModal(false);
            setCurrentRecord(null);
          }}
          onSave={async (formData) => {
            try {
              // Update the record
              const updatedRecord = await updateSugarRecord(currentRecord.id, {
                ...formData,
                userId: selectedUser,
              });
              
              // Update local state
              setRecords(prev => 
                prev.map(record => 
                  record.id === currentRecord.id ? updatedRecord : record
                )
              );
              
              toast.success('Record updated successfully');
              return true;
            } catch (error) {
              toast.error('Failed to update record');
              return false;
            }
          }}
          title="Edit Sugar Record"
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && currentRecord && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity\" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-error-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash2 className="h-6 w-6 text-error-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Record</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete the record for{' '}
                        <span className="font-semibold">{currentRecord.foodName}</span>? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-error-600 text-base font-medium text-white hover:bg-error-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-error-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setCurrentRecord(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Modal for adding/editing sugar records
interface SugarRecordModalProps {
  record?: SugarRecord;
  onClose: () => void;
  onSave: (data: Omit<SugarRecord, 'id' | 'scanId' | 'scanTime' | 'validationStatus'>) => Promise<boolean>;
  title: string;
}

interface SugarRecordFormData {
  foodName: string;
  sugarPerPackage: number;
  packageCount: number;
}

const SugarRecordModal = ({ record, onClose, onSave, title }: SugarRecordModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset,
  } = useForm<SugarRecordFormData>({
    defaultValues: record ? {
      foodName: record.foodName,
      sugarPerPackage: record.sugarPerPackage,
      packageCount: record.packageCount,
    } : {
      foodName: '',
      sugarPerPackage: 0,
      packageCount: 1,
    }
  });
  
  useEffect(() => {
    if (record) {
      reset({
        foodName: record.foodName,
        sugarPerPackage: record.sugarPerPackage,
        packageCount: record.packageCount,
      });
    }
  }, [record, reset]);
  
  const onSubmit = async (data: SugarRecordFormData) => {
    setIsSubmitting(true);
    
    try {
      // Calculate derived fields
      const totalSugar = data.sugarPerPackage * data.packageCount;
      const teaspoonConversion = (totalSugar / 4).toFixed(1); // 1 teaspoon ≈ 4g of sugar
      
      const success = await onSave({
        ...data,
        totalSugar,
        teaspoonConversion,
      });
      
      if (success) {
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="fixed inset-0 overflow-y-auto z-50">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
                  <div className="mt-6 space-y-4">
                    {/* Food Name */}
                    <div>
                      <label htmlFor="foodName" className="block text-sm font-medium text-gray-700">
                        Food Name
                      </label>
                      <input
                        type="text"
                        id="foodName"
                        className={`mt-1 block w-full rounded-md shadow-sm ${
                          errors.foodName ? 'border-red-300' : 'border-gray-300'
                        } focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50`}
                        {...register('foodName', { 
                          required: 'Food name is required',
                          minLength: { value: 2, message: 'Food name must be at least 2 characters' }
                        })}
                      />
                      {errors.foodName && (
                        <p className="mt-1 text-sm text-red-600">{errors.foodName.message}</p>
                      )}
                    </div>
                    
                    {/* Sugar Per Package */}
                    <div>
                      <label htmlFor="sugarPerPackage" className="block text-sm font-medium text-gray-700">
                        Sugar Per Package (grams)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        id="sugarPerPackage"
                        className={`mt-1 block w-full rounded-md shadow-sm ${
                          errors.sugarPerPackage ? 'border-red-300' : 'border-gray-300'
                        } focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50`}
                        {...register('sugarPerPackage', { 
                          required: 'Sugar amount is required',
                          min: { value: 0, message: 'Sugar amount must be positive' },
                          valueAsNumber: true
                        })}
                      />
                      {errors.sugarPerPackage && (
                        <p className="mt-1 text-sm text-red-600">{errors.sugarPerPackage.message}</p>
                      )}
                    </div>
                    
                    {/* Package Count */}
                    <div>
                      <label htmlFor="packageCount" className="block text-sm font-medium text-gray-700">
                        Number of Packages
                      </label>
                      <input
                        type="number"
                        min="1"
                        id="packageCount"
                        className={`mt-1 block w-full rounded-md shadow-sm ${
                          errors.packageCount ? 'border-red-300' : 'border-gray-300'
                        } focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50`}
                        {...register('packageCount', { 
                          required: 'Package count is required',
                          min: { value: 1, message: 'At least 1 package is required' },
                          valueAsNumber: true
                        })}
                      />
                      {errors.packageCount && (
                        <p className="mt-1 text-sm text-red-600">{errors.packageCount.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SugarHistory;