import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Employee {
  id: string;
  employee_id: number;
  name: string;
  email: string;
  phone: string;
  designation: string;
  personal_email: string;
  gender: string;
  status: string;
}

const AdminEmployee = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDesignation, setFilterDesignation] = useState<string>('All');
  const [filterGender, setFilterGender] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  // Fetch employee list from the API on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          'https://api.allinall.social/api/otz-hrm/employee/list',
          { headers: { 'Content-Type': 'application/json' } }
        );
        if (response.data.success) {
          setEmployees(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch employees');
        }
      } catch (err: any) {
        console.error('Error fetching employees:', err);
        setError(err.response?.data?.message || 'Failed to fetch employees');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // Get unique values for filtering from the employees list
  const designations = useMemo(() => {
    const d = new Set(employees.map((emp) => emp.designation));
    return ['All', ...Array.from(d)];
  }, [employees]);

  const genders = useMemo(() => {
    const g = new Set(employees.map((emp) => emp.gender));
    return ['All', ...Array.from(g)];
  }, [employees]);

  const statuses = useMemo(() => {
    const s = new Set(employees.map((emp) => emp.status));
    return ['All', ...Array.from(s)];
  }, [employees]);

  // Filter employees based on search and selected filters
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesName = emp.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDesignation =
        filterDesignation === 'All' || emp.designation === filterDesignation;
      const matchesGender = filterGender === 'All' || emp.gender === filterGender;
      const matchesStatus = filterStatus === 'All' || emp.status === filterStatus;
      return matchesName && matchesDesignation && matchesGender && matchesStatus;
    });
  }, [employees, searchTerm, filterDesignation, filterGender, filterStatus]);

  return (
    <div className="p-6 bg-white text-[#1F2328] min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Employee List</h1>
      
      {/* Filter Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <Input
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300"
          />
          <Select value={filterDesignation} onValueChange={(val) => setFilterDesignation(val)}>
            <SelectTrigger className="border border-gray-300 bg-white">
              <SelectValue placeholder="Designation" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-300 shadow-md">
              {designations.map((des) => (
                <SelectItem key={des} value={des}>
                  {des}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterGender} onValueChange={(val) => setFilterGender(val)}>
            <SelectTrigger className="border border-gray-300 bg-white">
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-300 shadow-md">
              {genders.map((g) => (
                <SelectItem key={g} value={g}>
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={(val) => setFilterStatus(val)}>
            <SelectTrigger className="border border-gray-300 bg-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-300 shadow-md">
              {statuses.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => { /* Optionally, you can trigger a refetch or clear filters here */ }}>
          Apply Filters
        </Button>
      </div>
      
      {/* Display loading or error */}
      {loading && <p>Loading employees...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Employee Table */}
      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="text-[#1F2328]">ID</TableHead>
              <TableHead className="text-[#1F2328]">Employee ID</TableHead>
              <TableHead className="text-[#1F2328]">Name</TableHead>
              <TableHead className="text-[#1F2328]">Email</TableHead>
              <TableHead className="text-[#1F2328]">Phone</TableHead>
              <TableHead className="text-[#1F2328]">Designation</TableHead>
              <TableHead className="text-[#1F2328]">Personal Email</TableHead>
              <TableHead className="text-[#1F2328]">Gender</TableHead>
              <TableHead className="text-[#1F2328]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((emp) => (
              <TableRow key={emp.id}>
                <TableCell className="text-[#1F2328]">{emp.id}</TableCell>
                <TableCell className="text-[#1F2328]">{emp.employee_id}</TableCell>
                <TableCell className="text-[#1F2328]">{emp.name}</TableCell>
                <TableCell className="text-[#1F2328]">{emp.email.replace('mailto:', '')}</TableCell>
                <TableCell className="text-[#1F2328]">{emp.phone}</TableCell>
                <TableCell className="text-[#1F2328]">{emp.designation}</TableCell>
                <TableCell className="text-[#1F2328]">{emp.personal_email.replace('mailto:', '')}</TableCell>
                <TableCell className="text-[#1F2328]">{emp.gender}</TableCell>
                <TableCell className="text-[#1F2328]">{emp.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredEmployees.length === 0 && !loading && (
          <p className="text-center text-gray-500 mt-4">No employees found matching the filters.</p>
        )}
      </div>
    </div>
  );
};

export default AdminEmployee;
