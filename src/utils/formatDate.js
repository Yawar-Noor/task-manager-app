const formatDate = (timestamp) => {
    if (!timestamp) return "";

    let date;

    // Handle Firebase Timestamp object
    if (timestamp && typeof timestamp === "object" && timestamp.toDate) {
      // Firebase Timestamp has a toDate() method
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else if (typeof timestamp === "string") {
      date = new Date(timestamp);
    } else {
      return "";
    }

    // Check if date is valid
    if (isNaN(date.getTime())) return "";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(2);

    return `${day}:${month}:${year}`;
  };

  export default formatDate;