/**
 * Activity Log Service (localStorage)
 * Mimics a backend service for development purposes.
 */

const KEY = 'activity_log';

const _getLogs = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch (e) {
    return [];
  }
};

const _setLogs = (logs) => {
  localStorage.setItem(KEY, JSON.stringify(logs));
};

/**
 * Logs a new activity.
 * @param {string} action - The type of action (e.g., 'login', 'create_thread').
 * @param {object} details - Additional details about the action.
 * @param {object} user - The user who performed the action.
 */
export const logActivity = (action, details, user) => {
  if (!user) {
    console.error("logActivity error: User is required to log an activity.");
    return;
  }
  
  const logs = _getLogs();
  const newLog = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    userId: user.id,
    userName: user.email, // Using email as name for consistency
    action,
    details,
  };

  logs.unshift(newLog); // Add to the beginning
  _setLogs(logs.slice(0, 100)); // Keep only the latest 100 entries
};

/**
 * Retrieves all activity logs, sorted by most recent first.
 * @returns {Array<object>} - The list of activity logs.
 */
export const getActivities = () => {
  return _getLogs();
};
