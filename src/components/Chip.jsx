import React from 'react';

function Chip({ text }) {
  return (
    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full dark:bg-blue-200 dark:text-blue-800 mr-2 mb-2">
      {text}
    </span>
  );
}

export default Chip;