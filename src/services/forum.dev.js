const KEY_THREADS = "forum:threads";
const KEY_POSTS   = "forum:posts";
const read = (k)=> JSON.parse(localStorage.getItem(k) || "[]");
const write = (k,v)=> localStorage.setItem(k, JSON.stringify(v));

import { logActivity } from './activityLog.dev.js';

// Seed initial data if empty
(function seed() {
  if (read(KEY_THREADS).length === 0) {
    const user = { id: 'user-1', name: 'Admin User' };
    const now = Date.now();
    const threads = [
      { id: 'thread-1', title: "Busco diseñador UI para app de estudio", category: "Colaboración", authorId: user.id, authorName: user.name, createdAt: now - 200000, lastActivityAt: now - 100000, replies: 1 },
      { id: 'thread-2', title: "¿Cómo subo imágenes a mi card?", category: "Dudas técnicas", authorId: 'user-2', authorName: 'Test User', createdAt: now - 100000, lastActivityAt: now, replies: 0 },
      { id: 'thread-3', title: "Convocatoria hackatón de la facultad", category: "Anuncios", authorId: user.id, authorName: user.name, createdAt: now - 300000, lastActivityAt: now - 200000, replies: 0 },
    ];
    const posts = [
      { id: 'post-1', threadId: 'thread-1', content: '¡Hola! Estoy buscando a alguien con experiencia en Figma para colaborar en un proyecto de una app para tomar notas.', authorId: user.id, authorName: user.name, createdAt: now - 200000 },
      { id: 'post-2', threadId: 'thread-1', content: '¡Me interesa! Te envío un correo.', authorId: 'user-2', authorName: 'Test User', createdAt: now - 100000 },
    ];
    write(KEY_THREADS, threads);
    write(KEY_POSTS, posts);
  }
})();

export function listThreads(filters = {}, user = null) {
  let threads = read(KEY_THREADS);

  if (filters.category) {
    threads = threads.filter(t => t.category === filters.category);
  }
  if (user && filters.onlyMine) {
    threads = threads.filter(t => t.authorId === user.id);
  }
  if (user && filters.onlyRepliedBy) {
    const userPostThreads = new Set(read(KEY_POSTS).filter(p => p.authorId === user.id).map(p => p.threadId));
    threads = threads.filter(t => userPostThreads.has(t.id));
  }

  return threads.sort((a, b) => b.lastActivityAt - a.lastActivityAt);
}

export function getThread(id){ return read(KEY_THREADS).find(t=> t.id===id); }
export function listPosts(threadId){ return read(KEY_POSTS).filter(p=> p.threadId===threadId).sort((a,b)=> a.createdAt-b.createdAt); }

export function createThread({title, category, firstContent, user}){
  const threads = read(KEY_THREADS);
  const posts = read(KEY_POSTS);
  const now = Date.now();

  const newThread = {
    id: crypto.randomUUID(),
    title, category,
    authorId: user.id, authorName: user.name,
    createdAt: now, lastActivityAt: now, replies: 1 // Starts with 1 post
  };
  threads.push(newThread);

  const firstPost = {
    id: crypto.randomUUID(),
    threadId: newThread.id,
    content: firstContent,
    authorId: user.id,
    authorName: user.name,
    createdAt: now
  };
  posts.push(firstPost);

  write(KEY_THREADS, threads);
  write(KEY_POSTS, posts);

  logActivity('create_thread', { threadId: newThread.id, title: newThread.title }, user);

  return newThread;
}

export function replyThread({threadId, content, user}){
  const p = { id: crypto.randomUUID(), threadId, content, authorId:user.id, authorName:user.name, createdAt: Date.now() };
  const posts = read(KEY_POSTS); posts.push(p); write(KEY_POSTS, posts);
  
  const threads = read(KEY_THREADS);
  const t = threads.find(x=> x.id===threadId);
  if (t) {
    t.replies = (t.replies || 0) + 1;
    t.lastActivityAt = Date.now();
    write(KEY_THREADS, threads);
  }

  logActivity('reply_thread', { threadId, postId: p.id }, user);

  return p;
}