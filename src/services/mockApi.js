/**
 * Mock API using localStorage
 * Simulates a real backend for development purposes.
 */

// --- Helpers -------------------------------------------------------------------
const _get = (key) => JSON.parse(localStorage.getItem(key) || '[]');
const _set = (key, data) => localStorage.setItem(key, JSON.stringify(data));
const _generateId = () => Math.random().toString(36).substr(2, 9);

// --- Seed Data -----------------------------------------------------------------
const seedData = () => {
  const users = _get('users');
  if (users.length === 0) {
    _set('users', [
      { id: 'user-1', name: 'Admin User', email: 'admin@udla.edu.co', password: 'admin123-hashed', role: 'admin', createdAt: Date.now() },
      { id: 'user-2', name: 'Test User', email: 'test@udla.edu.co', password: 'test123-hashed', role: 'user', createdAt: Date.now() },
    ]);
  }
  // Seed other data like projects, threads if needed
};

// --- Auth API ------------------------------------------------------------------

export const register = async ({ name, email, password }) => {
  await new Promise(res => setTimeout(res, 500)); // Simulate network delay
  const users = _get('users');
  if (users.some(u => u.email === email)) {
    throw new Error('El correo electrónico ya está en uso.');
  }
  const newUser = {
    id: _generateId(),
    name,
    email,
    password: `${password}-hashed`, // Mock hashing
    role: 'user',
    createdAt: Date.now(),
  };
  _set('users', [...users, newUser]);
  
  // Automatically log in the new user
  const { user, token } = await login({ email, password });
  return { user, token };
};

export const login = async ({ email, password }) => {
  await new Promise(res => setTimeout(res, 500));
  const users = _get('users');
  const user = users.find(u => u.email === email);

  if (!user || user.password !== `${password}-hashed`) {
    throw new Error('Credenciales incorrectas.');
  }

  // Create a mock session token (just the user ID and role)
  const token = btoa(JSON.stringify({ userId: user.id, role: user.role }));
  localStorage.setItem('session_token', token);

  // Return user data without password
  const { password: _, ...userToReturn } = user;
  return { user: userToReturn, token };
};

export const logout = async () => {
  localStorage.removeItem('session_token');
  return Promise.resolve();
};

export const getSession = async () => {
  const token = localStorage.getItem('session_token');
  if (!token) return null;

  try {
    const decoded = JSON.parse(atob(token));
    const users = _get('users');
    const user = users.find(u => u.id === decoded.userId);
    if (!user) return null;

    const { password, ...userToReturn } = user;
    return { user: userToReturn, token };
  } catch (e) {
    return null;
  }
};

// --- Initialize with seed data ----------------------------------------------
seedData();
