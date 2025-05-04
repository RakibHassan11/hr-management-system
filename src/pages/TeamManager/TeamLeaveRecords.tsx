import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { FaCheck, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import api from "@/axiosConfig";
import moment from "moment-timezone";

interface LeaveRecord {
  id: number;
  employee_id: number;
  name: string;
  type: string;
  start_date: string;
  end_date: string;
  days: number;
  status:
    | "PENDING"
    | "APPROVED_BY_LINE_MANAGER"
    | "REJECTED_BY_LINE_MANAGER"
    | "APPROVED_BY_HR"
    | "REJECTED_BY_HR"
    | string;
  description: string;
  created_at: string;
  updated_at?: string;
  without_pay?: boolean;
  note_by_team_lead?: string | null;
  note_by_hr?: string | null;
}

const formatDateRange = (start: string, end: string) => {
  const startDate = moment(start);
  const endDate = moment(end);
  if (startDate.isSame(endDate, "month")) {
    return `${startDate.format("D")}-${endDate.format("D MMM")}`;
  }
  return `${startDate.format("D MMM")}-${endDate.format("D MMM")}`;
};

const formatStatus = (status: string) => {
  switch (status) {
    case "PENDING": return "Pending";
    case "APPROVED_BY_LINE_MANAGER": return "Team Lead";
    case "REJECTED_BY_LINE_MANAGER": return "Team Lead";
    case "APPROVED_BY_HR": return "HR";
    case "REJECTED_BY_HR": return "HR";
    case "SICK": return "Sick";
    case "ANNUAL": return "Annual";
    case "CASUAL": return "Casual";
    default: return status;
  }
};

const truncateText = (text: string, maxLength: number) =>
  text.length <= maxLength ? text : text.substring(0, maxLength);

const TeamLeaveRecords = () => {
  const [leaveRecords, setLeaveRecords] = useState<LeaveRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<number>>(new Set());
  const [expandedTeamLeadNotes, setExpandedTeamLeadNotes] = useState<Set<number>>(new Set());
  const [expandedHrNotes, setExpandedHrNotes] = useState<Set<number>>(new Set());
  const [selectedStatus, setSelectedStatus] = useState<string>(""); // Added filter state
  const recordsPerPage = 10;
  const { userToken: authToken } = useSelector((state: RootState) => state.auth);
  const { id: lineManagerDbId, permissions = [] } = useSelector(
    (state: RootState) => state.auth.user || { id: null, permissions: [] }
  );
  const API_BASE_URL = import.meta.env.VITE_API_URL; 

  const storedToken = localStorage.getItem("token_user") || authToken;
  if (!storedToken) {
    return <div className="p-6 text-center text-red-600">No authentication token found. Please log in.</div>;
  }

  useEffect(() => {
    const fetchLeaveRecords = async () => {
      setIsLoading(true);
      const managerId = lineManagerDbId || localStorage.getItem("lineManagerDbId");

      if (!managerId) {
        setError("Manager ID missing. Please ensure proper login.");
        setIsLoading(false);
        return;
      }

      const url = selectedStatus
        ? `${API_BASE_URL}/team/leave-records?line_manager_id=${managerId}&status=${selectedStatus}`
        : `${API_BASE_URL}/team/leave-records?line_manager_id=${managerId}`;

      try {
        const response = await api.get(url, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
        });

        const result = response.data;
        if (
          response.status === 200 &&
          result.message === "LEAVE_RECORDS_FETCHED"
        ) {
          const mappedRecords = result.data.map((record: any) => ({
            ...record,
            name: record.name || record.employee_name,
          }));
          setTimeout(() => {
            setLeaveRecords(mappedRecords);
            setIsLoading(false);
          }, 500);
        } else {
          setError(result.message || "Failed to fetch leave records.");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setError("Network error: Failed to fetch leave records.");
        setIsLoading(false);
      }
    };

    fetchLeaveRecords();
  }, [authToken, lineManagerDbId, API_BASE_URL, selectedStatus]); // Added selectedStatus as dependency

  const handleAction = async (
    recordId: number,
    newStatus: "APPROVED_BY_LINE_MANAGER" | "REJECTED_BY_LINE_MANAGER" | "APPROVED_BY_HR" | "REJECTED_BY_HR"
  ) => {
    if (!storedToken) {
      toast.error("No authentication token found.");
      return;
    }

    const isHR = Array.isArray(permissions) && permissions.includes("HR_PERMISSION");
    const actionText = newStatus.includes("APPROVED") ? "approve" : "reject";
    const noteFieldName = isHR ? "note_by_hr" : "note_by_team_lead";
    const statusForRole = isHR
      ? (newStatus.includes("APPROVED") ? "APPROVED_BY_HR" : "REJECTED_BY_HR")
      : newStatus;

    const result = await Swal.fire({
      title: `Are you sure you want to ${actionText} this leave request?`,
      icon: "question",
      input: "text",
      inputPlaceholder: "Enter your note here (optional)...",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    });

    if (!result.isConfirmed) return;

    const noteValue = result.value?.trim() || null;
    const payload = {
      id: recordId,
      status: statusForRole,
      [noteFieldName]: noteValue,
    };

    try {
      const response = await api.put(
        `${API_BASE_URL}/employee/update-leave-status`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const responseData = response.data;
      if (response.status === 200 && responseData.success) {
        setLeaveRecords((prev) =>
          prev.map((record) =>
            record.id === recordId
              ? {
                  ...record,
                  ...responseData.data,
                  [noteFieldName]: responseData.data[noteFieldName] ?? noteValue,
                }
              : record
          )
        );
        toast.success(`Leave request ${actionText}d successfully`);
      } else {
        toast.error(responseData.message || "Failed to update leave record.");
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Network error: Failed to update leave record.");
    }
  };

  const toggleDescription = (recordId: number) => {
    setExpandedDescriptions((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(recordId)) newExpanded.delete(recordId);
      else newExpanded.add(recordId);
      return newExpanded;
    });
  };

  const toggleTeamLeadNote = (recordId: number) => {
    setExpandedTeamLeadNotes((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(recordId)) newExpanded.delete(recordId);
      else newExpanded.add(recordId);
      return newExpanded;
    });
  };

  const toggleHrNote = (recordId: number) => {
    setExpandedHrNotes((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(recordId)) newExpanded.delete(recordId);
      else newExpanded.add(recordId);
      return newExpanded;
    });
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = leaveRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(leaveRecords.length / recordsPerPage) || 1;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

  return (
    <div className="bg-white text-[#1F2328] p-3">
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-2xl font-bold text-[#1F2328]">Team Leave Records</h1>
        <div className="flex items-center space-x-2">
          <label htmlFor="statusFilter" className="text-[#1F2328] font-medium">
            Filter by Status:
          </label>
          <select
            id="statusFilter"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="p-2 border border-gray-300 rounded-md bg-white text-[#1F2328] focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED_BY_LINE_MANAGER">Approved by Team Lead</option>
            <option value="REJECTED_BY_LINE_MANAGER">Rejected by Team Lead</option>
          </select>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-300 p-4">
        <Table>
          {!isLoading && currentRecords.length > 0 && (
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="text-[#1F2328]">Employee Name</TableHead>
                <TableHead className="text-[#1F2328]">Date</TableHead>
                <TableHead className="text-[#1F2328]">Description</TableHead>
                <TableHead className="text-[#1F2328]">Days</TableHead>
                <TableHead className="text-[#1F2328]">Status</TableHead>
                <TableHead className="text-[#1F2328]">Team Lead Notes</TableHead>
                <TableHead className="text-[#1F2328]">HR Notes</TableHead>
                <TableHead className="text-[#1F2328]">Actions</TableHead>
              </TableRow>
            </TableHeader>
          )}
          <TableBody>
            {isLoading ? (
              <div className="divide-y rounded-md border border-gray-300">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center p-4 space-x-4 animate-pulse">
                    <div className="h-3 w-1/4 bg-gray-200 rounded"></div>
                    <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                    <div className="h-3 w-1/6 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : currentRecords.length > 0 ? (
              currentRecords.map((record) => {
                const isHR = Array.isArray(permissions) && permissions.includes("HR_PERMISSION");
                const canAct =
                  record.status === "PENDING" ||
                  (record.status === "APPROVED_BY_LINE_MANAGER" && isHR);
                const isDescriptionExpanded = expandedDescriptions.has(record.id);
                const isTeamLeadNoteExpanded = expandedTeamLeadNotes.has(record.id);
                const isHrNoteExpanded = expandedHrNotes.has(record.id);
                const descriptionText = isDescriptionExpanded ? record.description : truncateText(record.description, 10);
                const teamLeadNoteText = record.note_by_team_lead || "-";
                const hrNoteText = record.note_by_hr || "-";
                const truncatedTeamLeadNote = isTeamLeadNoteExpanded ? teamLeadNoteText : truncateText(teamLeadNoteText, 10);
                const truncatedHrNote = isHrNoteExpanded ? hrNoteText : truncateText(hrNoteText, 10);

                return (
                  <TableRow key={record.id}>
                    <TableCell className="text-[#1F2328]">
                      {record.name}
                    </TableCell>
                    <TableCell className="text-[#1F2328]">
                      {formatDateRange(record.start_date, record.end_date)}
                      <span
                        className={`px-1 py-0.5 text-xs font-bold rounded-full ml-2 ${
                          record.type === "SICK"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {formatStatus(record.type)}
                      </span>
                    </TableCell>
                    <TableCell className="text-[#1F2328] transition-all duration-200 ease-in-out">
                      <span>{descriptionText}</span>
                      {record.description.length > 10 && (
                        <button
                          className="text-blue-600 hover:underline text-sm"
                          onClick={() => toggleDescription(record.id)}
                        >
                          {isDescriptionExpanded ? "<" : "..."}
                        </button>
                      )}
                    </TableCell>
                    <TableCell className="text-[#1F2328] font-semibold text-xs">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {record.days}
                      </span>
                    </TableCell>
                    <TableCell className="text-[#1F2328]">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          record.status === "APPROVED_BY_LINE_MANAGER" || record.status === "APPROVED_BY_HR"
                            ? "bg-green-100 text-green-800"
                            : record.status === "REJECTED_BY_LINE_MANAGER" || record.status === "REJECTED_BY_HR"
                            ? "bg-red-100 text-red-800"
                            : record.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {formatStatus(record.status)}
                      </span>
                    </TableCell>
                    <TableCell className="text-[#1F2328] transition-all duration-200 ease-in-out">
                      <span className={isTeamLeadNoteExpanded ? "inline" : "inline"}>
                        {truncatedTeamLeadNote}
                      </span>
                      {teamLeadNoteText.length > 10 && (
                        <button
                          className="text-blue-600 hover:underline text-sm"
                          onClick={() => toggleTeamLeadNote(record.id)}
                        >
                          {isTeamLeadNoteExpanded ? "<" : "..."}
                        </button>
                      )}
                    </TableCell>
                    <TableCell className="text-[#1F2328] transition-all duration-200 ease-in-out">
                      <span className={isHrNoteExpanded ? "inline" : "inline"}>
                        {truncatedHrNote}
                      </span>
                      {hrNoteText.length > 10 && (
                        <button
                          className="text-blue-600 hover:underline text-sm"
                          onClick={() => toggleHrNote(record.id)}
                        >
                          {isHrNoteExpanded ? "<" : "..."}
                        </button>
                      )}
                    </TableCell>
                    <TableCell className="text-[#1F2328] font-medium">
                      {canAct && (
                        <div className="flex items-center space-x-2">
                          <button
                            className="p-1.5 rounded-full bg-gray-200 text-green-600 hover:bg-green-100"
                            title="Approve"
                            onClick={() =>
                              handleAction(
                                record.id,
                                isHR ? "APPROVED_BY_HR" : "APPROVED_BY_LINE_MANAGER"
                              )
                            }
                          >
                            <FaCheck size={14} />
                          </button>
                          <button
                            className="p-1.5 rounded-full bg-gray-200 text-red-600 hover:bg-red-100"
                            title="Reject"
                            onClick={() =>
                              handleAction(
                                record.id,
                                isHR ? "REJECTED_BY_HR" : "REJECTED_BY_LINE_MANAGER"
                              )
                            }
                          >
                            <FaTimes size={14} />
                          </button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-[#1F2328]">
                  No leave records available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex justify-between items-center p-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-[#1F2328]">Page {currentPage} of {totalPages}</span>
          <button
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamLeaveRecords;