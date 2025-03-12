import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useNavigate } from 'react-router-dom';

export default function Employee() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const token = useSelector((state: RootState) => state.auth.userToken);
  const navigate = useNavigate();

  const [employeeData, setEmployeeData] = useState({
    name: ''
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalStatus, setModalStatus] = useState(''); 
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const fetchEmployees = (query = '') => {
    setLoading(true);
    const url = `${API_URL}/employee/list?needPagination=true${query ? `&query=${query}` : ''}`;
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch employee data');
        }
        return response.json();
      })
      .then((data) => {
        setEmployees(data.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEmployees();
  }, [API_URL, token]);

  const handleSearch = () => {
    fetchEmployees(employeeData.name);
  };


  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    setModalOpen(true);
    setModalLoading(true);
    const url = `${API_URL}/employee/update-permission`;

    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ id: Number(employee.id), permission:"USER" }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Permission denied');
        }
        return response.json();
      })
      .then(data => {
        setModalMessage('Permission granted! Redirecting...');
        setModalStatus('success');
        setModalLoading(false);
        setTimeout(() => {
          setModalOpen(false);
          navigate(`/user/employee/edit/${employee.employee_id}`);
        }, 2000);
      })
      .catch(err => {
        setModalMessage(err.message || 'Permission denied');
        setModalStatus('error');
        setModalLoading(false);
        setTimeout(() => {
          setModalOpen(false);
        }, 2000);
      });
  };

  return (
    <div className="p-6 bg-white text-[#1F2328] min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Employee List</h1>
      
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
        {loading && <p className="text-center text-gray-600">Loading employees...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        
        {!loading && !error && (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="text-[#1F2328]">ID</TableHead>
                <TableHead className="text-[#1F2328]">Name</TableHead>
                <TableHead className="text-[#1F2328]">Email</TableHead>
                <TableHead className="text-[#1F2328]">Phone</TableHead>
                <TableHead className="text-[#1F2328]">Designation</TableHead>
                <TableHead className="text-[#1F2328]">Department</TableHead>
                <TableHead className="text-[#1F2328]">Action</TableHead>
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
                  <TableCell className="text-[#1F2328]">{employee.employee_id}</TableCell>
                  <TableCell className="text-[#1F2328]">{employee.name}</TableCell>
                  <TableCell className="text-[#1F2328]">{employee.email}</TableCell>
                  <TableCell className="text-[#1F2328]">{employee.phone}</TableCell>
                  <TableCell className="text-[#1F2328]">{employee.designation}</TableCell>
                  <TableCell className="text-[#1F2328]">{employee.department || "Development"}</TableCell>
                  <TableCell>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(employee);
                      }}
                      className="text-[#fff] bg-[#8e44ad] border-none px-4 py-1.5 text-xs rounded-md cursor-pointer transition-all duration-300 hover:bg-[#860dba]"
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Modal for permission check */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Semi-transparent overlay */}
          <div className="absolute inset-0 bg-black opacity-50"></div>
          {/* Modal content with fade-in animation */}
          <div className="relative bg-white rounded-lg shadow-lg p-6 z-10 animate-fadeIn">
            {modalLoading ? (
              <div className="flex flex-col items-center">
                {/* A simple loader can be a spinner div */}
                <div className="loader mb-4"></div>
                <p className="text-[#1F2328]">Checking permission...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                {modalStatus === 'success' ? (
                  <>
                    <svg className="w-12 h-12 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-[#1F2328] font-semibold">{modalMessage}</p>
                  </>
                ) : (
                  <>
                    <svg className="w-12 h-12 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <p className="text-[#1F2328] font-semibold">{modalMessage}</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


