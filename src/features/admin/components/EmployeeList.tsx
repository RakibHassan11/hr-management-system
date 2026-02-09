import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Edit, ShieldCheck } from 'lucide-react';
import { Employee } from '@/types';

interface EmployeeListProps {
  employees: Employee[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onEdit: (employee: Employee) => void;
  onPermission: (employee: Employee) => void;
}

export default function EmployeeList({
  employees,
  loading,
  error,
  searchTerm,
  setSearchTerm,
  onEdit,
  onPermission,
}: EmployeeListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Adjust as needed

  // Calculate total pages
  const totalPages = Math.ceil(employees.length / itemsPerPage);

  // Calculate the slice of employees to display
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEmployees = employees.slice(startIndex, endIndex);

  // Navigation handlers
  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="p-6 bg-white text-[#1F2328] min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-left">Employee List</h1>
      <div className="mb-6 flex items-center justify-center">
        <Input
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 mr-2"
        />
      </div>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="text-center whitespace-nowrap">Employee ID</TableHead>
              <TableHead className="text-center">Name</TableHead>
              <TableHead className="text-center">Email</TableHead>
              <TableHead className="text-center">Phone</TableHead>
              <TableHead className="text-center">Designation</TableHead>
              <TableHead className="text-center">Personal Email</TableHead>
              <TableHead className="text-center">Gender</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedEmployees.map((emp) => (
              <TableRow key={emp.id}>
                <TableCell className="text-center">{emp.employee_id || 'N/A'}</TableCell>
                <TableCell className="text-center">{emp.name}</TableCell>
                <TableCell className="text-center">{emp.email ? emp.email.replace('mailto:', '') : 'N/A'}</TableCell>
                <TableCell className="text-center">{emp.phone}</TableCell>
                <TableCell className="text-center">{emp.designation}</TableCell>
                <TableCell className="text-center">{emp.personal_email ? emp.personal_email.replace('mailto:', '') : 'N/A'}</TableCell>
                <TableCell className="text-center">{emp.gender}</TableCell>
                <TableCell className="text-center">{emp.status}</TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center">
                    <Button size="sm" variant="ghost" className="mr-2" onClick={() => onEdit(emp)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => onPermission(emp)}>
                      <ShieldCheck className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {employees.length === 0 && !loading && (
          <p className="text-center text-gray-500 mt-4">No employees found.</p>
        )}
        {employees.length > 0 && (
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}