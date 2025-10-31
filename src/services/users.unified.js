// Fallback for localStorage
const USERS_KEY = 'app_users';

const _getUsersLocal = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch (e) {
    console.error("Error reading users from localStorage:", e);
    return [];
  }
};

const _setUsersLocal = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Unified function to list users

    export async function listUsersUnified(token) {
  try {
    const response = await fetch('https://meta-verso-carlos.b0falx.easypanel.host/api/users', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    _setUsersLocal(data); // Cache the users in localStorage
    return data;
  } catch (e) {
    console.warn("API users fetch failed, falling back to localStorage:", e.message);
    return _getUsersLocal();
  }
}

// Unified function to set user role
export async function setUserRoleUnified(email, role, token) {
  try {
    const response = await fetch(`https://meta-verso-carlos.b0falx.easypanel.host/api/users/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ email, role }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // Update local cache
    const users = _getUsersLocal();
    const userIndex = users.findIndex(u => u.email === email);
    if (userIndex > -1) {
      users[userIndex].role = role;
      _setUsersLocal(users);
    }
    return data;
  } catch (e) {
    console.warn("API set user role failed:", e.message);
    // Fallback to local modification could be implemented here if needed
    return null;
  }
}

// Unified function to toggle user active status
export async function toggleUserActiveUnified(email, is_active, token) {
  try {
    
    const response = await fetch(`https://meta-verso-carlos.b0falx.easypanel.host/api/users/active`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ email, is_active }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // Update local cache
    const users = _getUsersLocal();
    const userIndex = users.findIndex(u => u.email === email);
    if (userIndex > -1) {
      users[userIndex].is_active = is_active;
      _setUsersLocal(users);
    }
    return data;
  } catch (e) {
    console.warn("API toggle user active failed:", e.message);
    // Fallback to local modification could be implemented here if needed
    return null;
  }
}