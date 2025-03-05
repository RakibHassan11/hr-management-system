import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  department: string;
  email: string;
}

const TeamPage = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: 1, name: "John Doe", role: "Frontend Developer", department: "Engineering", email: "john@example.com" },
    { id: 2, name: "Jane Smith", role: "UI Designer", department: "Design", email: "jane@example.com" },
  ]);

  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const handleEdit = (member: TeamMember) => {
    setEditingMember({ ...member });
  };

  const handleDelete = (id: number) => {
    setTeamMembers(teamMembers.filter(member => member.id !== id));
  };

  const handleSave = () => {
    if (editingMember) {
      setTeamMembers(teamMembers.map(member => (member.id === editingMember.id ? editingMember : member)));
      setEditingMember(null);
    }
  };

  return (
<Layout>
<div className="animate-fadeIn p-6">
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-3xl font-bold text-[#1F2328]">Team Members</h1>
    <Button className="bg-[#F97316] text-white hover:bg-[#EA580C]">
      Add New Member
    </Button>
  </div>

<div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#1F2328]/30">
<Table>
  <TableHeader>
    <TableRow className="bg-[#E0E0E0]">
      <TableHead className="text-[#1F2328] font-semibold">Name</TableHead>
      <TableHead className="text-[#1F2328] font-semibold">Role</TableHead>
      <TableHead className="text-[#1F2328] font-semibold">Department</TableHead>
      <TableHead className="text-[#1F2328] font-semibold">Email</TableHead>
      <TableHead className="text-[#1F2328] font-semibold text-right">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {teamMembers.map((member) => (
    <TableRow key={member.id}>
      <TableCell className="text-[#1F2328] font-medium">{member.name}</TableCell>
      <TableCell className="text-[#1F2328] font-medium">{member.role}</TableCell>
      <TableCell className="text-[#1F2328] font-medium">{member.department}</TableCell>
      <TableCell className="text-[#1F2328] font-medium">{member.email}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-3">
          
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-black"
          onClick={() => handleEdit(member)}
        >
          <Edit className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white text-black">
        <DialogHeader>
          <DialogTitle className="text-[#1F2328]">Edit Team Member</DialogTitle>
          <DialogDescription className="text-[#1F2328]">
            Update the details of this team member.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            type="text"
            value={editingMember?.name || ""}
            onChange={(e) => setEditingMember({ ...editingMember!, name: e.target.value })}
            placeholder="Name"
            className="border border-gray-300"
          />
          <Input
            type="text"
            value={editingMember?.role || ""}
            onChange={(e) => setEditingMember({ ...editingMember!, role: e.target.value })}
            placeholder="Role"
            className="border border-gray-300"
          />
          <Input
            type="text"
            value={editingMember?.department || ""}
            onChange={(e) => setEditingMember({ ...editingMember!, department: e.target.value })}
            placeholder="Department"
            className="border border-gray-300"
          />
          <Input
            type="email"
            value={editingMember?.email || ""}
            onChange={(e) => setEditingMember({ ...editingMember!, email: e.target.value })}
            placeholder="Email"
            className="border border-gray-300"
          />
        </div>
        <DialogFooter>
          <Button className="bg-gray-300 text-[#1F2328] hover:bg-gray-400" onClick={() => setEditingMember(null)}>
            Cancel
          </Button>
          <Button className="bg-[#F97316] text-white hover:bg-[#EA580C]" onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* ✅ Delete Modal (Now Includes Cancel Button) */}
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-black">
          <Trash2 className="h-5 w-5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[400px] bg-white text-black">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-[#1F2328]">Delete Team Member</AlertDialogTitle>
          <AlertDialogDescription className="text-[#1F2328]">
            Are you sure you want to remove this team member? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-gray-300 text-[#1F2328] hover:bg-gray-400">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            className="bg-[#F97316] text-white hover:bg-[#EA580C]" 
            onClick={() => handleDelete(member.id)}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

        </div>
      </TableCell>
    </TableRow>
    ))}
  </TableBody>
</Table>
</div>
</div>
</Layout>
  );
};

export default TeamPage;
