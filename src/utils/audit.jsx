export function extractEmailFromDetails(details) {
  if (!details) return null;

  let parsedDetails = details;
  if (typeof details === 'string') {
    try {
      parsedDetails = JSON.parse(details);
    } catch (e) {
      return null; // Not a valid JSON string
    }
  }

  if (typeof parsedDetails === 'object' && parsedDetails !== null) {
    const possibleKeys = ['correo electrónico', 'email', 'correo'];
    for (const key of possibleKeys) {
      // Check original key and then try lowercased version if not found
      let value = parsedDetails[key];
      if (value === undefined) {
        // Try finding the key case-insensitively
        const foundKey = Object.keys(parsedDetails).find(k => k.toLowerCase() === key.toLowerCase());
        if (foundKey) {
          value = parsedDetails[foundKey];
        }
      }

      if (typeof value === 'string') {
        const emailRegex = new RegExp("^[^\s@]+@[^\s@]+\\.[^\s@]+$");
        if (emailRegex.test(value)) {
          return value;
        }
      }
    }
  }
  return null;
}

export function formatAuditDate(input) {
  if (!input) return "—";

  let d;
  if (input instanceof Date) {
    d = input;
  } else if (typeof input === 'number' || (typeof input === 'string' && !isNaN(new Date(input)))) {
    d = new Date(input);
  } else {
    return "—"; // Invalid input type
  }

  if (isNaN(d.getTime())) return "—";

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}
