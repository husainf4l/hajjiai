import React, { useState } from 'react';
import Link from 'next/link';

interface PasswordPromptProps {
  onSubmit: (password: string) => void;
  error?: string;
}

export default function PasswordPrompt({ onSubmit, error }: PasswordPromptProps) {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(password);
  };

  return (
    <div className="fixed inset-0 bg-[#2d3142] flex items-center justify-center p-4">
      <div className="bg-[#1c1e26] p-6 rounded-lg shadow-xl w-full max-w-md scale-in">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2h-1V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2h-1V7a4 4 0 00-8 0v4"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Security Check</h2>
          <p className="text-gray-400">Please enter the password to access the chat</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-[#121215] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
              required
            />
            {error && (
              <p className="mt-2 text-red-500 text-sm">
                {error}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Access Chat
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
