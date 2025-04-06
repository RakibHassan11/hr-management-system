import moment from "moment-timezone"

export const formatDate = (dateString: string) => {
  if (!dateString) {
    return "--:--"
  }
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

export const formatTimeStr = (timeString: string) => {
  const time = timeString?.includes("T")
    ? timeString
    : `1970-01-01T${timeString}Z`
  return moment.utc(time).tz("Asia/Dhaka").format("hh:mm A")
}

export const formatTime = timeString => {
  if (!timeString) {
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

export function formatDateTime(isoString) {
  if (!isoString || typeof isoString !== "string") {
    return "--:--"
  }

  try {
    const date = new Date(isoString)

    if (isNaN(date.getTime())) {
      return "--:--"
    }

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ]

    const month = months[date.getUTCMonth()]
    const day = String(date.getUTCDate()).padStart(2, "0")
    const year = date.getUTCFullYear()

    // Extract time components
    let hours = date.getUTCHours()
    const minutes = String(date.getUTCMinutes()).padStart(2, "0")
    const period = hours >= 12 ? "PM" : "AM"

    // Convert to 12-hour format
    hours = hours % 12
    hours = hours === 0 ? 12 : hours // Handle midnight (0 becomes 12 AM)

    return `${month} ${day}, ${year} ${hours}:${minutes} ${period}`
  } catch (error) {
    return "--:--"
  }
}
