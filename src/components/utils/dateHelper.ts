import moment from "moment" // v2.30.1
import "moment-timezone" // v0.5.47
export const formatDate = (dateString: string) => {
  return moment.utc(dateString).tz("Asia/Dhaka").format("MMMM D, YYYY")
}

export const formatTime = (timeString: string) => {
  const time = timeString.includes("T")
    ? timeString
    : `1970-01-01T${timeString}Z`
  return moment.utc(time).tz("Asia/Dhaka").format("hh:mm A")
}

export const formatText = (str: string) => {
  if (!str) return str
  return str
    .replace(/_/g, " ")
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}
