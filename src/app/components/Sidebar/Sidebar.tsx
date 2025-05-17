import React, { useState } from "react";
import Link from "next/link";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Mobile overlay when sidebar is open */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={() => setIsCollapsed(true)}
          style={{ top: "60px" }}
        />
      )}

      {/* Mobile toggle button */}
      <button
        className="fixed top-4 left-4 z-30 p-2 rounded-md bg-[#121215] text-white lg:hidden"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isCollapsed ? "M4 6h16M4 12h16M4 18h16" : "M6 18L18 6M6 6l12 12"}
          />
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isCollapsed ? "-translate-x-full" : "translate-x-0"
        } lg:relative lg:translate-x-0 w-64 bg-[#121215] text-white flex flex-col z-20 transition-transform duration-300 ease-in-out mt-14 lg:mt-0`}
      >
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            Al Balsan
          </Link>
          <button
            className="p-2 rounded-md bg-[#1c1e26] lg:hidden"
            onClick={() => setIsCollapsed(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {/* Sidebar content */}
          <div className="space-y-2">
            <button className="w-full text-left p-3 rounded-lg bg-[#1c1e26]">
              Prototype Chat
            </button>
          </div>
        </div>
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <span>U</span>
            </div>
            <span className="truncate">Al Hajj Abu Mohmmad</span>
          </div>
        </div>
      </div>
    </>
  );
}
