/**
 * API Abstraction Layer
 * This file provides functions to interact with the backend API.
 */

import * as projectActionsApi from './projects.dev.js';
import { logActivity } from './activityLog.dev.js';

export const API_URL = 'https://meta-verso-carlos.b0falx.easypanel.host/api';

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
  if (session && session.user) {
    logActivity('login', { email: credentials.email }, session.user);
  }
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
  const session = await login({ email: userData.email, password: userData.password });
  if (session && session.user) {
    logActivity('register', { email: userData.email }, session.user);
  }
  return { user: session.user };
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
      headers: { 'Authorization': `Bearer ${token}` },
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
export const listThreads = async (filters = {}, user) => {
  const params = new URLSearchParams();
  if (filters.category) params.append('category', filters.category);
  // Backend will handle onlyMine and onlyRepliedBy based on authenticated user
  // For now, these filters are not directly passed as query params to backend

  const response = await fetch(`${API_URL}/forum/threads?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Error al obtener los hilos del foro');
  }
  const data = await response.json();
  // Map backend data to frontend expected format if necessary
  return data.map(thread => ({
    id: thread.id,
    title: thread.title,
    category: thread.category,
    authorName: thread.author_email,
    lastActivityAt: thread.last_activity_at,
    replies: thread.replies_count,
    authorId: thread.author_id,
  }));
};

export const getThread = async (threadId) => {
  const response = await fetch(`${API_URL}/forum/threads/${threadId}`);
  if (!response.ok) {
    throw new Error('Error al obtener el hilo del foro');
  }
  const data = await response.json();
  return {
    thread: {
      id: data.thread.id,
      title: data.thread.title,
      category: data.thread.category,
      authorName: data.thread.author_email,
      lastActivityAt: data.thread.last_activity_at,
      replies: data.thread.replies_count,
      authorId: data.thread.author_id,
      firstContent: data.posts[0] ? data.posts[0].content : '', // Assuming first post is initial content
    },
    posts: data.posts.map(post => ({
      id: post.id,
      authorName: post.author_email,
      content: post.content,
      createdAt: post.created_at,
      authorId: post.author_id,
    })),
  };
};

export const createThread = async ({ title, category, firstContent, user, token }) => {
  const response = await fetch(`${API_URL}/forum/threads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ title, category, firstContent }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al crear el hilo');
  }
  const data = await response.json();
  return {
    id: data.id,
    title: data.title,
    category: data.category,
    authorName: user.email,
    lastActivityAt: new Date().toISOString(),
    replies: 0,
    authorId: user.id,
  };
};

export const replyThread = async (threadId, { content, user, token }) => {
  const response = await fetch(`${API_URL}/forum/threads/${threadId}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al responder al hilo');
  }
  const data = await response.json();
  return {
    id: data.id,
    authorName: user.email,
    content: data.content,
    createdAt: new Date().toISOString(),
    authorId: user.id,
  };
};



// --- News API ------------------------------------------------------------------

export const createNews = async (newsData, token) => {
  const response = await fetch(`${API_URL}/news`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(newsData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al crear la noticia');
  }
  return await response.json();
};

export const updateNews = async (id, newsData, token) => {
  const response = await fetch(`${API_URL}/news/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(newsData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al actualizar la noticia');
  }
  return await response.json();
};

export const deleteNews = async (id, token) => {
  const response = await fetch(`${API_URL}/news/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al eliminar la noticia');
  }
  return await response.json();
};

// --- Projects API --------------------------------------------------------------

export const getProjects = async (filters = {}) => {

  const params = new URLSearchParams();

  if (filters.limit) {

    params.append('limit', filters.limit);

  }

  // Add other filters here as needed in the future



  const query = params.toString();

  const url = query ? `${API_URL}/projects?${query}` : `${API_URL}/projects`;



  const response = await fetch(url);

  if (!response.ok) {

    throw new Error('Error al cargar los proyectos');

  }

  return await response.json();

};

export const getProjectById = async (id) => {
  const response = await fetch(`${API_URL}/projects/${id}`);
  if (!response.ok) {
    throw new Error('Error al cargar el proyecto');
  }
  return await response.json();
};

export const createProject = async (formData, token) => {
  const response = await fetch(`${API_URL}/projects`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al crear el proyecto');
  }
  return await response.json();
};

export const updateProject = async (id, formData, token) => {
  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al actualizar el proyecto');
  }
  return await response.json();
};

export const deleteProject = async (id, token) => {
  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al eliminar el proyecto');
  }
  return await response.json();
};

export const getMyRating = async (projectId, token) => {
  const response = await fetch(`${API_URL}/projects/${projectId}?rating=user`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al obtener la calificación');
  }
  return await response.json();
};

export const rateProject = async (projectId, rating, token) => {
  const response = await fetch(`${API_URL}/projects/${projectId}/rate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ rating }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al calificar el proyecto');
  }
  return await response.json();
};


// --- Project Actions (Votes, Comments) -----------------------------------------

export const listActions = projectActionsApi.listActions;
export const addComment = projectActionsApi.addComment;
