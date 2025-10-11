import { extractEmailFromDetails, formatAuditDate } from './audit.jsx';

describe('extractEmailFromDetails', () => {
  it('should extract email from JSON string with "correo electrónico"', () => {
    const details = '{"action": "login", "correo electrónico": "test@example.com"}';
    expect(extractEmailFromDetails(details)).toBe('test@example.com');
  });

  it('should extract email from object with "email"', () => {
    const details = { action: "register", email: "another@example.com" };
    expect(extractEmailFromDetails(details)).toBe('another@example.com');
  });

  it('should extract email from object with "correo" (case-insensitive)', () => {
    const details = { action: "update", Correo: "user@domain.com" };
    expect(extractEmailFromDetails(details)).toBe('user@domain.com');
  });

  it('should return null if no valid email key is found', () => {
    const details = { action: "view", data: "some data" };
    expect(extractEmailFromDetails(details)).toBeNull();
  });

  it('should return null for invalid email format', () => {
    const details = { email: "invalid-email" };
    expect(extractEmailFromDetails(details)).toBeNull();
  });

  it('should return null for non-object/non-JSON string details', () => {
    expect(extractEmailFromDetails("plain string")).toBeNull();
    expect(extractEmailFromDetails(123)).toBeNull();
    expect(extractEmailFromDetails(null)).toBeNull();
  });
});

describe('formatAuditDate', () => {
  it('should format ISO string date correctly', () => {
    const isoDate = '2023-10-27T10:30:00.000Z';
    // This test might be locale/timezone dependent, so we'll check the format
    const formatted = formatAuditDate(isoDate);
    expect(formatted).toMatch(/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/);
    // Example: "27/10/2023 12:30" (if local timezone is +2)
  });

  it('should format number (timestamp) date correctly', () => {
    const timestamp = 1678886400000; // March 15, 2023 00:00:00 GMT
    const formatted = formatAuditDate(timestamp);
    expect(formatted).toMatch(/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/);
  });

  it('should format Date object correctly', () => {
    const dateObj = new Date('2024-01-01T05:00:00.000Z');
    const formatted = formatAuditDate(dateObj);
    expect(formatted).toMatch(/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/);
  });

  it('should return "—" for invalid date string', () => {
    expect(formatAuditDate('invalid date')).toBe('—');
  });

  it('should return "—" for null or undefined input', () => {
    expect(formatAuditDate(null)).toBe('—');
    expect(formatAuditDate(undefined)).toBe('—');
  });
});
