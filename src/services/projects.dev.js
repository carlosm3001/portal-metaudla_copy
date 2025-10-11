const KEY_ACTIONS = "projects:actions";
const read = (k)=> JSON.parse(localStorage.getItem(k) || "[]");
const write = (k,v)=> localStorage.setItem(k, JSON.stringify(v));

import { logActivity } from './activityLog.dev.js';

// Seed initial data if empty
(function seed() {
  if (read(KEY_ACTIONS).length === 0) {
    write(KEY_ACTIONS, [
      { id: crypto.randomUUID(), projectId: '1', authorId: 'user-2', type: "vote", createdAt: Date.now() - 200000 },
      { id: crypto.randomUUID(), projectId: '1', authorId: 'user-1', type: "comment", content: "¡Excelente iniciativa! Muy útil para la comunidad.", createdAt: Date.now() - 100000 },
    ]);
  }
})();

export function listActions(projectId){ 
  return read(KEY_ACTIONS)
    .filter(a=> a.projectId === projectId)
    .sort((a,b) => b.createdAt - a.createdAt);
}

export function addComment({projectId, content, user}){
  const a = { id: crypto.randomUUID(), projectId, authorId:user.id, authorName: user.name, type:"comment", content, createdAt:Date.now() };
  const arr = read(KEY_ACTIONS); 
  arr.push(a); 
  write(KEY_ACTIONS, arr); 

  logActivity('comment_project', { projectId, content }, user);

  return a;
}

export function addVote({projectId, user}){
  const arr = read(KEY_ACTIONS);
  const exists = arr.find(a=> a.projectId===projectId && a.type==="vote" && a.authorId===user.id);
  if (exists) {
    console.log("User has already voted for this project.");
    return exists; // 1 voto por usuario
  }
  const a = { id: crypto.randomUUID(), projectId, authorId:user.id, authorName: user.name, type:"vote", createdAt:Date.now() };
  arr.push(a); 
  write(KEY_ACTIONS, arr); 

  logActivity('vote_project', { projectId }, user);

  return a;
}
