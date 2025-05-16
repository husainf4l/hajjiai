import React from "react";

interface ChatAreaProps {
  messages: { text: string; isUser: boolean }[];
  message: string;
  setMessage: (message: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export default function ChatArea({
  messages,
  message,
  setMessage,
  handleSubmit,
}: ChatAreaProps) {
  return (
    <div className="flex-1 flex flex-col bg-[#2d3142]">
      {/* Header */}
      <header className="bg-[#121215] p-4 text-white shadow-md">
        <h1 className="text-xl font-bold">Chat</h1>
      </header>

      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">Start a conversation...</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg max-w-[80%] ${
                msg.isUser
                  ? "ml-auto bg-[#121215] text-white"
                  : "bg-[#1c1e26] text-white"
              }`}
            >
              {msg.text}
            </div>
          ))
        )}
      </div>

      {/* Message input area */}
      <form onSubmit={handleSubmit} className="bg-[#121215] p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-3 rounded-lg bg-[#1c1e26] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
