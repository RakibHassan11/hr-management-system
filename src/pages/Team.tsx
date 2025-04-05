import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { useSelector } from "react-redux"
import { RootState } from "../store"
import axios from "axios"

interface TeamMember {
  id: number
  name: string
  email: string
  status: string
  phone: string
  profile_image: string
}

const TeamPage = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { userToken: authToken } = useSelector((state: RootState) => state.auth)
  const { id: lineManagerDbId } = useSelector(
    (state: RootState) => state.auth.user || {}
  )
  const API_BASE_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    const fetchTeamList = async () => {
      const storedToken = localStorage.getItem("token_user") || authToken
      const managerId =
        lineManagerDbId || localStorage.getItem("lineManagerDbId")

      if (!storedToken || !managerId) {
        setError("Authentication token or manager ID missing. Please log in.")
        setIsLoading(false)
        return
      }

      const url = `${API_BASE_URL}/employee/team-list?line_manager_id=${managerId}`
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json"
          }
        })

        const result = response.data
        if (response.status === 200 && result.message === "Team list fetched") {
          const mappedData = result.data.map((member: any) => ({
            id: member.id,
            name: member.name,
            email: member.email,
            status: member.status,
            phone: member.phone
            // profile_image omitted from mapping since it's not displayed
          }))
          setTeamMembers(mappedData)
        } else {
          setError(result.message || "Failed to fetch team list.")
        }
      } catch (error) {
        console.error("Fetch error:", error)
        setError("Network error: Failed to fetch team list.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeamList()
  }, [authToken, lineManagerDbId, API_BASE_URL])

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
            {isLoading ? (
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
