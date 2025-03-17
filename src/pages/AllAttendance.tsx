import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useNavigate } from 'react-router-dom';
import { formatDate, formatTime } from '@/components/utils/dateHelper';

export default function AllAttendance() {
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

  const [employeeData, setEmployeeData] = useState({
    name: '',
  });

  const fetchEmployees = (query = '', page = currentPage, itemsPerPage = perPage, sortDir = sortDirection, sortField = sortOn) => {
    setLoading(true);
    // let url = `${API_URL}/employee-attendance/attendance-list?needPagination=true&page=${page}&perPage=${itemsPerPage}&sortDirection=${sortDir}&sortOn=${sortField}`;

    let url = `${API_URL}/employee-attendance/attendance-list`;

    if (query) {
      url += `&query=${query}`;
    }

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log(response)
        if (!response.ok) {
          throw new Error('Failed to fetch employee data');
        }
        return response.json();
      })
      .then((data) => {
        setEmployees(data.data);
        setTotalPages(data?.extraData?.totalPages);
        setCurrentPage(data?.extraData?.currentPage);
        setPerPage(data?.extraData?.perPage);
        setTotalItems(data?.extraData?.total);
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
    fetchEmployees(employeeData.name, 1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchEmployees(employeeData.name, page);
  };

  const handlePerPageChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
    fetchEmployees(employeeData.name, 1, newPerPage);
  };

  const handleSortChange = (field) => {
    const newSortDirection = sortOn === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortOn(field);
    setSortDirection(newSortDirection);
    fetchEmployees(employeeData.name, currentPage, perPage, newSortDirection, field);
  };

  if (loading) {
    return (
        <p className="text-center text-gray-600">Loading all attendances...</p>
    )
  } 
  if (error) {
    return (
      <p className="text-center text-red-500">{error}</p>
    )
  } 

  return (
    <div className="p-6 bg-white text-[#1F2328] min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Employee Attendance</h1>
      
      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300 mb-6">
        <div className="w-full flex items-center space-x-4">
          <Input
            placeholder="Employee Name"
            className="border border-gray-300 w-full p-4"
            value={employeeData.name}
            onChange={(e) => setEmployeeData({ ...employeeData, name: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300">
        {!loading && !error && (
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
                    <TableCell className="text-[#1F2328]">{employee.status}</TableCell>
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
      </div>
    </div>
  );
}


