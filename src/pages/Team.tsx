import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import axios from 'axios';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  email: string;
  status: string;
  phone: string;
  profile_image: string;
}

const TeamPage = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const { userToken } = useSelector((state: RootState) => state.auth);

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchTeamList = async () => {
      const storedToken = localStorage.getItem('token_user') || userToken;
      if (!storedToken) return;

      try {
        const response = await axios.get(`${API_BASE_URL}/employee/team-list?line_manager_id=2`, {
          headers: {
            'Authorization': `Bearer ${storedToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200 && response.data.message === 'Team list fetched') {
          const mappedData = response.data.data.map((member: any) => {
            console.log('Member data:', member); // Debug to check phone
            return {
              id: member.id,
              name: member.name,
              role: member.designation,
              email: member.email,
              status: member.status,
              phone: member.phone,
              profile_image: `${API_BASE_URL}/${member.profile_image}`, // Adjust if path differs
            };
          });
          setTeamMembers(mappedData);
        }
      } catch (error) {
        console.log('Axios error:', error);
      }
    };

    fetchTeamList();
  }, [userToken, API_BASE_URL]);

  return (
    <div className="animate-fadeIn p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#1F2328]">Team Members</h1>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#1F2328]/30">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#E0E0E0]">
              <TableHead className="text-[#1F2328] font-semibold"></TableHead> {/* No title */}
              <TableHead className="text-[#1F2328] font-semibold">Name</TableHead>
              <TableHead className="text-[#1F2328] font-semibold">Role</TableHead>
              <TableHead className="text-[#1F2328] font-semibold">Email</TableHead>
              <TableHead className="text-[#1F2328] font-semibold">Phone</TableHead>
              <TableHead className="text-[#1F2328] font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="text-[#1F2328] font-medium">
                  <img
                    src={member.profile_image || '/default-profile.jpg'}
                    alt={`${member.name}'s profile`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </TableCell>
                <TableCell className="text-[#1F2328] font-medium">{member.name}</TableCell>
                <TableCell className="text-[#1F2328] font-medium">{member.role}</TableCell>
                <TableCell className="text-[#1F2328] font-medium">{member.email}</TableCell>
                <TableCell className="text-[#1F2328] font-medium">{member.phone}</TableCell>
                <TableCell className="text-[#1F2328] font-medium">{member.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TeamPage;