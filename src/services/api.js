/**
 * API Abstraction Layer
 * This file provides functions to interact with the backend API.
 */

import * as forumApi from './forum.dev.js';
import * as projectActionsApi from './projects.dev.js';

const API_URL = 'http://localhost:3001/api';

// --- Auth API ------------------------------------------------------------------

export const login = async (credentials) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error de inicio de sesión');
  }
  const { token } = await response.json();
  localStorage.setItem('session_token', token);
  
  // After login, get the full user session data
  const session = await getSession();
  return session;
};

export const register = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error de registro');
  }
  // After registering, log the user in to get a token and session
  const { user } = await login({ email: userData.email, password: userData.password });
  return { user };
};

export const logout = async () => {
  localStorage.removeItem('session_token');
  return Promise.resolve();
};

export const getSession = async () => {
  const token = localStorage.getItem('session_token');
  if (!token) return null;

  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: { 'x-auth-token': token },
    });
    if (!response.ok) {
      localStorage.removeItem('session_token'); // Token is invalid
      return null;
    }
    const user = await response.json();
    return { user, token };
  } catch (e) {
    return null;
  }
};


// --- Forum API -----------------------------------------------------------------
export const listThreads = forumApi.listThreads;
export const getThread = forumApi.getThread;
export const listPosts = forumApi.listPosts;
export const createThread = forumApi.createThread;
export const replyThread = forumApi.replyThread;

// --- Project Actions (Votes, Comments) -----------------------------------------
export const listActions = projectActionsApi.listActions;
export const addComment = projectActionsApi.addComment;
export const addVote = projectActionsApi.addVote;