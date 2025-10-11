import React from 'react';

export default function FeatureCard({ icon, title, text }) {
  return (
    <article className="card p-5 feature-card">
      <div className="w-9 h-9 rounded-full grid place-items-center bg-[rgba(108,138,228,.14)] text-ink ring-1 ring-border mb-3">
        {icon}
      </div>
      <h4 className="text-ink font-bold">{title}</h4>
      <p className="text-muted text-[15px] leading-6 mt-1">{text}</p>
    </article>
  );
}