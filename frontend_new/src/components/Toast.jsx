
import React from 'react';

export default function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="fixed right-4 top-4 z-50">
      <div className="bg-gray-800 text-white px-4 py-2 rounded shadow">
        {message}
      </div>
    </div>
  );
}
