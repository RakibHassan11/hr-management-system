import {Layout} from '@/components/Layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState } from 'react';

export default function Holidays() {
  // Modal visibility state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // File upload preview state
  const [filePreview, setFilePreview] = useState<string | null>(null);

  // Handle opening and closing the modal
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="p-6 bg-white text-[#1F2328] min-h-screen">
        {/* Flex container for header and button */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Holidays</h1>
          <button
            className="bg-[#F97316] text-white px-4 py-2 rounded-md shadow-md hover:bg-[#EA580C]"
            onClick={toggleModal}
          >
            Add Holidays
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="text-[#1F2328]">Description</TableHead>
                <TableHead className="text-[#1F2328]">Date</TableHead>
                <TableHead className="text-[#1F2328]">Day</TableHead>
                <TableHead className="text-[#1F2328]">Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="text-green-600 font-medium">
                  Alternative Office Open for The Biswa Ijtema
                </TableCell>
                <TableCell className="text-green-600">2025-01-25</TableCell>
                <TableCell className="text-green-600">Saturday</TableCell>
                <TableCell className="text-green-600">✔</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-[#1F2328]">Holiday for The Biswa Ijtema</TableCell>
                <TableCell className="text-[#1F2328]">2025-02-02</TableCell>
                <TableCell className="text-[#1F2328]">Sunday</TableCell>
                <TableCell className="text-[#1F2328]">✔</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add Holiday</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#1F2328]">Upload Holiday File</label>
              <input type="file" className="mt-2" onChange={handleFileChange} />
              {filePreview && (
                <div className="mt-2">
                  <img src={filePreview} alt="File preview" className="w-32 h-32 object-cover" />
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#1F2328]">Holiday Description</label>
              <input
                type="text"
                className="mt-2 p-2 w-full border border-gray-300 rounded-md"
                placeholder="Enter holiday description"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#1F2328]">Date</label>
              <input type="date" className="mt-2 p-2 w-full border border-gray-300 rounded-md" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#1F2328]">Day</label>
              <select className="mt-2 p-2 w-full border border-gray-300 rounded-md">
                <option>Monday</option>
                <option>Tuesday</option>
                <option>Wednesday</option>
                <option>Thursday</option>
                <option>Friday</option>
                <option>Saturday</option>
                <option>Sunday</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button
                className="bg-[#F97316] text-white px-4 py-2 rounded-md mr-2"
                onClick={toggleModal}
              >
                Close
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded-md">
                Save Holiday
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
