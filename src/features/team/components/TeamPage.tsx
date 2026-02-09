import { useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { useTeam } from "@/features/team/hooks/useTeam"

const TeamPage = () => {
  const { id: lineManagerDbId } = useSelector(
    (state: RootState) => state.auth.user || {}
  )
  const managerId = lineManagerDbId || Number(localStorage.getItem("lineManagerDbId"));

  const { teamMembers, loading, error, fetchTeam } = useTeam(managerId || null);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  if (error) return <div className="p-6 text-center text-red-600">{error}</div>

  return (
    <div className="animate-fadeIn p-6">
      <h1 className="text-2xl font-bold text-[#1F2328] mb-6">Team Members</h1>
      <div className="bg-white text-[#1F2328] rounded-xl shadow-lg p-6 overflow-hidden border border-gray-300">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#E0E0E0]">
              <TableHead className="text-[#1F2328] font-semibold">
                Name
              </TableHead>
              <TableHead className="text-[#1F2328] font-semibold">
                Email
              </TableHead>
              <TableHead className="text-[#1F2328] font-semibold">
                Phone
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-[#1F2328]">
                  Loading...
                </TableCell>
              </TableRow>
            ) : teamMembers.length > 0 ? (
              teamMembers.map(member => (
                <TableRow key={member.id}>
                  <TableCell className="text-[#1F2328] font-medium">
                    {member.name}
                  </TableCell>
                  <TableCell className="text-[#1F2328] font-medium">
                    {member.email}
                  </TableCell>
                  <TableCell className="text-[#1F2328] font-medium">
                    {member.phone}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-[#1F2328]">
                  No team members available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default TeamPage
