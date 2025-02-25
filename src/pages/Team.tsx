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
          <h1 className="text-3xl font-bold text-[#1FB77F]">Team Members</h1>
          <Button className="bg-[#1FB77F] hover:bg-[#189962] text-white px-5 py-2 shadow-md">
            Add New Member
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#1FB77F]/30">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#1FB77F]/10">
                <TableHead className="text-[#1FB77F] font-semibold">Name</TableHead>
                <TableHead className="text-[#1FB77F] font-semibold">Role</TableHead>
                <TableHead className="text-[#1FB77F] font-semibold">Department</TableHead>
                <TableHead className="text-[#1FB77F] font-semibold">Email</TableHead>
                <TableHead className="text-[#1FB77F] font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium text-gray-800">{member.name}</TableCell>
                  <TableCell className="text-gray-700">{member.role}</TableCell>
                  <TableCell className="text-gray-700">{member.department}</TableCell>
                  <TableCell className="text-gray-700">{member.email}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-3">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-[#1FB77F]/10 text-[#1FB77F]"
                            onClick={() => handleEdit(member)}
                          >
                            <Edit className="h-5 w-5" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle className="text-[#1FB77F]">Edit Team Member</DialogTitle>
                            <DialogDescription className="text-gray-500">
                              Update the details of this team member.
                            </DialogDescription>
                          </DialogHeader>
                          {editingMember && (
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <label className="text-sm text-gray-600">Name</label>
                                <Input
                                  value={editingMember.name}
                                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                                  className="border-[#1FB77F]/50"
                                />
                              </div>
                              <div className="grid gap-2">
                                <label className="text-sm text-gray-600">Role</label>
                                <Input
                                  value={editingMember.role}
                                  onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                                  className="border-[#1FB77F]/50"
                                />
                              </div>
                              <div className="grid gap-2">
                                <label className="text-sm text-gray-600">Department</label>
                                <Input
                                  value={editingMember.department}
                                  onChange={(e) => setEditingMember({ ...editingMember, department: e.target.value })}
                                  className="border-[#1FB77F]/50"
                                />
                              </div>
                              <div className="grid gap-2">
                                <label className="text-sm text-gray-600">Email</label>
                                <Input
                                  value={editingMember.email}
                                  onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                                  className="border-[#1FB77F]/50"
                                />
                              </div>
                            </div>
                          )}
                          <DialogFooter>
                            <Button onClick={handleSave} className="bg-[#1FB77F] hover:bg-[#189962] text-white">
                              Save Changes
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="hover:bg-red-50 text-red-500">
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-gray-900">Delete Team Member</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-600">
                              Are you sure you want to delete this team member? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border-gray-300 text-gray-600">Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(member.id)} className="bg-red-500 hover:bg-red-600 text-white">
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
