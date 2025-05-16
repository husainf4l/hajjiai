import React from "react";

export default function Sidebar() {
  return (
    <div className="w-64 bg-[#121215] text-white flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-xl font-bold">Good Morning</h2>
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
          <span>Al Hajj Abu Mohmmad</span>
        </div>
      </div>
    </div>
  );
}
