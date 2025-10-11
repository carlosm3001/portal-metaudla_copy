import { supabase } from "@/lib/supabase";

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
export async function listUsersUnified() {
  try {
    const { data, error } = await supabase
      .from("app_users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (e) {
    console.warn("Supabase users fetch failed, falling back to localStorage:", e.message);
    return _getUsersLocal();
  }
}

// Unified function to upsert a user (for login/registration)
export async function upsertUserUnified(user) {
  try {
    const { data, error } = await supabase
      .from("app_users")
      .upsert({
        email: user.email,
        display_name: user.display_name,
        role: user.role || 'user',
        is_active: user.is_active ?? true,
        last_activity_at: user.last_activity_at,
      }, { onConflict: 'email' }) // Conflict on email to update existing user
      .select();

    if (error) throw error;
    return data[0];
  } catch (e) {
    console.warn("Supabase users upsert failed, falling back to localStorage:", e.message);
    const users = _getUsersLocal();
    const existingUserIndex = users.findIndex(u => u.email === user.email);

    const newUser = {
      id: user.id || crypto.randomUUID(),
      email: user.email,
      display_name: user.display_name,
      role: user.role || 'user',
      is_active: user.is_active ?? true,
      last_activity_at: user.last_activity_at || new Date().toISOString(),
      created_at: user.created_at || new Date().toISOString(),
    };

    if (existingUserIndex > -1) {
      users[existingUserIndex] = { ...users[existingUserIndex], ...newUser };
    } else {
      users.push(newUser);
    }
    _setUsersLocal(users);
    return newUser;
  }
}

// Unified function to set user role
export async function setUserRoleUnified(email, role) {
  try {
    const { data, error } = await supabase
      .from("app_users")
      .update({ role })
      .eq("email", email)
      .select();

    if (error) throw error;
    return data[0];
  } catch (e) {
    console.warn("Supabase set user role failed, falling back to localStorage:", e.message);
    const users = _getUsersLocal();
    const userIndex = users.findIndex(u => u.email === email);
    if (userIndex > -1) {
      users[userIndex].role = role;
      _setUsersLocal(users);
      return users[userIndex];
    }
    return null;
  }
}

// Unified function to toggle user active status
export async function toggleUserActiveUnified(email, is_active) {
  try {
    const { data, error } = await supabase
      .from("app_users")
      .update({ is_active })
      .eq("email", email)
      .select();

    if (error) throw error;
    return data[0];
  } catch (e) {
    console.warn("Supabase toggle user active failed, falling back to localStorage:", e.message);
    const users = _getUsersLocal();
    const userIndex = users.findIndex(u => u.email === email);
    if (userIndex > -1) {
      users[userIndex].is_active = is_active;
      _setUsersLocal(users);
      return users[userIndex];
    }
    return null;
  }
}
