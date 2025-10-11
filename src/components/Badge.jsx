import React from 'react';

function Badge({ text, color = 'gray' }) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    purple: 'bg-purple-100 text-purple-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    gray: 'bg-gray-200 text-gray-800',
  };

  return (
    <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${colorClasses[color] || colorClasses.gray}`}>
      {text}
    </span>
  );
}

export default Badge;