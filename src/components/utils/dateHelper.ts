import moment from "moment-timezone"

export const formatDate = (dateString: string) => {
  return moment.utc(dateString).tz("Asia/Dhaka").format("MMMM D, YYYY")
}

export const formatTimeToUTC = timeString => {
  if (!timeString) return "--:--"

  let parsedTime

  if (timeString.includes("T")) {
    // If it's a full ISO string (e.g., "2023-01-01T14:30:00Z")
    parsedTime = moment.utc(timeString)
  } else {
    // If it's just a time string (e.g., "14:30:00"), assume it's UTC and prepend a date
    parsedTime = moment.utc(`1970-01-01T${timeString}Z`)
  }

  return parsedTime.isValid()
    ? parsedTime.tz("Asia/Dhaka").format("hh:mm A")
    : "Invalid Time"
}

export const formatTime = timeString => {
  if (!timeString || !/^\d{2}:\d{2}:\d{2}$/.test(timeString)) {
    return "--:--"
  }

  const [hours, minutes] = timeString.split(":")
  let hourNum = parseInt(hours, 10)
  const period = hourNum >= 12 ? "PM" : "AM"

  if (hourNum === 0) {
    hourNum = 12 // Midnight case
  } else if (hourNum > 12) {
    hourNum -= 12 // Convert to 12-hour format
  }

  return `${hourNum.toString().padStart(2, "0")}:${minutes} ${period}`
}

export const formatText = (str: string) => {
  if (!str) return str
  return str
    .replace(/_/g, " ")
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

// const formatDateTime = (dateString: string, timeString: string) => {
//   const datePart = dateString.split("T")[0] // Extract date portion
//   const combined = `${datePart}T${timeString}Z` // Combine with time as UTC
//   const dhakaMoment = moment.utc(combined).tz("Asia/Dhaka")

//   if (!dhakaMoment.isValid()) {
//     return { date: "Invalid Date", time: "Invalid Time" }
//   }

//   const formattedDate = dhakaMoment.format("MMMM D, YYYY")
//   const formattedTime = dhakaMoment.format("hh:mm A")
//   return {
//     date: formattedDate,
//     time: formattedTime
//   }
// }
