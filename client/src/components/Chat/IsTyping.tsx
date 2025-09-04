// src/components/Chat/IsTyping.tsx

import React from 'react';

interface IsTypingProps {
  username?: string;
}

export const IsTyping: React.FC<IsTypingProps> = ({ username }) => {
  return (
    <span className="inline-flex items-center gap-2">
      <svg
        className="animate-spin h-4 w-4 text-gray-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2.293-6.707A8.003 8.003 0 0012 20v4c-6.627 0-12-5.373-12-12h4a8.003 8.003 0 006.707-2.293l-1.414-1.414z"
        ></path>
      </svg>
      <span>{username || 'someone'} is typing...</span>
    </span>
  );
};
