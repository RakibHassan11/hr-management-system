import moment from "moment" // v2.30.1
import "moment-timezone" // v0.5.47

// export const formatTime = (time) => {
//   if (!time) return 'N/A';

//   try {
//     if (time.includes('T')) {
//       return new Date(time).toLocaleTimeString('en-BD', {
//         hour: 'numeric',
//         minute: 'numeric',
//         hour12: true,
//         timeZone: 'Asia/Dhaka',
//       });
//     } else {
//       const [hours, minutes, seconds] = time.split(':');
//       const dummyDate = new Date();
//       dummyDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), parseInt(seconds || 0, 10));
//       return dummyDate.toLocaleTimeString('en-BD', {
//         hour: 'numeric',
//         minute: 'numeric',
//         hour12: true,
//         timeZone: 'Asia/Dhaka',
//       });
//     }
//   } catch (error) {
//     console.error('Error formatting time:', error);
//     return 'N/A';
//   }
// };

// export const formatDate = (date) => {
//   if (!date) return 'N/A';

//   try {
//     const parsedDate = new Date(date);

//     if (isNaN(parsedDate.getTime())) {
//       throw new Error('Invalid date');
//     }

//     return parsedDate.toLocaleDateString('en-BD', {
//       day: 'numeric',
//       month: 'short',
//       year: 'numeric',
//       timeZone: 'Asia/Dhaka',
//     });
//   } catch (error) {
//     console.error('Error formatting date:', error);
//     return 'N/A';
//   }
// };

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
