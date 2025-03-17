import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useNavigate } from 'react-router-dom';
import { formatDate, formatTime } from '@/components/utils/dateHelper';

export default function ViewAttendance() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const token = useSelector((state: RootState) => state.auth.userToken);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortOn, setSortOn] = useState('name');

  const AttendanceFilterType = {
    NONE: 'NONE',
    DAILY: 'DAILY',
    WEEKLY: 'WEEKLY',
    MONTHLY: 'MONTHLY',
  };

  const [employeeData, setEmployeeData] = useState({
    filterType: AttendanceFilterType.NONE, 
  });

  const fetchEmployees = (filterType = employeeData.filterType, page = currentPage, itemsPerPage = perPage, sortDir = sortDirection, sortField = sortOn) => {
    setLoading(true);
    let url = `${API_URL}/employee-attendance/attendance-list`;
    
    if (filterType !== AttendanceFilterType.NONE) {
      url += `?filterType=${filterType}`;
    }

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          throw new Error('Failed to fetch employee data');
        }
        return response.json();
      })
      .then((data) => {
        setEmployees(data.data || []);
        setTotalPages(data?.extraData?.totalPages || 1);
        setCurrentPage(data?.extraData?.currentPage || 1);
        setPerPage(data?.extraData?.perPage || 10);
        setTotalItems(data?.extraData?.total || 0);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEmployees();
  }, [token, API_URL]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchEmployees(employeeData.filterType, 1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchEmployees(employeeData.filterType, page);
  };

  const handlePerPageChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
    fetchEmployees(employeeData.filterType, 1, newPerPage);
  };

  const handleSortChange = (field) => {
    const newSortDirection = sortOn === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortOn(field);
    setSortDirection(newSortDirection);
    fetchEmployees(employeeData.filterType, currentPage, perPage, newSortDirection, field);
  };

  const handleFilterTypeChange = (e) => {
    const newFilterType = e.target.value;
    setEmployeeData({ ...employeeData, filterType: newFilterType });
    setCurrentPage(1);
    fetchEmployees(newFilterType, 1); 
  };

  if (loading) {
    return (
        <p className="text-center text-gray-600">Loading attendances...</p>
    )
  } 
  if (error) {
    return (
      <p className="text-center text-red-500">{error}</p>
    )
  } 

  return (
    <div className="p-6 bg-white text-[#1F2328] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Attendance</h1>
        <select
          value={employeeData.filterType}
          onChange={handleFilterTypeChange}
          className="border border-gray-300 rounded-md px-4 py-2 outline-none"
        >
          <option value={AttendanceFilterType.NONE}>All</option>
          <option value={AttendanceFilterType.DAILY}>Daily</option>
          <option value={AttendanceFilterType.WEEKLY}>Weekly</option>
          <option value={AttendanceFilterType.MONTHLY}>Monthly</option>
        </select>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300">
        {!loading && !error && (
          <>
            {employees.length === 0 ? (
              <p className="text-center text-gray-600">No attendance data available.</p>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead className="text-[#1F2328] cursor-pointer" onClick={() => handleSortChange('employee_id')}>
                        ID {sortOn === 'employee_id' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </TableHead>
                      <TableHead className="text-[#1F2328] cursor-pointer">
                        Employee ID
                      </TableHead>
                      <TableHead className="text-[#1F2328] cursor-pointer">
                        Date
                      </TableHead>
                      <TableHead className="text-[#1F2328]">Time</TableHead>
                      <TableHead className="text-[#1F2328]">Device</TableHead>
                      <TableHead className="text-[#1F2328]">Comment</TableHead>
                      <TableHead className="text-[#1F2328]">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((employee) => (
                      <TableRow
                        key={employee.employee_id}
                        onClick={(e) => {
                          if (!e.target.closest('button')) {
                            navigate(`/user/employee/profile?id=${employee.id}`);
                          }
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        <TableCell className="text-[#1F2328]">{employee.id}</TableCell>
                        <TableCell className="text-[#1F2328]">{employee.employee_id}</TableCell>
                        <TableCell className="text-[#1F2328]">{formatDate(employee.date)}</TableCell>
                        <TableCell className="text-[#1F2328]">{formatTime(employee.time)}</TableCell>
                        <TableCell className="text-[#1F2328]">{employee.device}</TableCell>
                        <TableCell className="text-[#1F2328]">{employee.comment}</TableCell>
                        <TableCell className="text-[#1F2328]">{employee.active}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-6 flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span>Show</span>
                    <select
                      value={perPage}
                      onChange={(e) => handlePerPageChange(Number(e.target.value))}
                      className="border border-gray-300 rounded-md p-1"
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                    <span>per page</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="bg-[#F97316] text-white hover:bg-[#e06615]"
                    >
                      Previous
                    </Button>
                    <span>
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="bg-[#F97316] text-white hover:bg-[#e06615]"
                    >
                      Next
                    </Button>
                  </div>

                  <span>Total: {totalItems} employees</span>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}