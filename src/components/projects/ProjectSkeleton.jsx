import React from 'react';

export default function ProjectSkeleton(){
  return (
    <div className="card overflow-hidden">
      <div className="bg-brand-50 animate-pulse" style={{aspectRatio: '4/3'}} />
      <div className="p-4 space-y-2">
        <div className="h-5 bg-[rgba(108,138,228,.18)] rounded w-2/3" />
        <div className="h-4 bg-[rgba(108,138,228,.12)] rounded w-full" />
        <div className="h-4 bg-[rgba(108,138,228,.12)] rounded w-5/6" />
      </div>
    </div>
  );
}