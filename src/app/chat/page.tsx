"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Sidebar from "../components/Sidebar/Sidebar";
import { sendMessageToWebhook } from "../actions";
import { FormatMessage } from "../components/ChatArea/ChatArea";
import Spinner from "../components/Spinner/Spinner";
import { ThinkingAnimation } from "../components/LoadingIndicator";
import { ScrollToBottomButton } from "../components/ScrollToBottom";
import PasswordPrompt from "../components/Auth/PasswordPrompt";

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { text: string; isUser: boolean; isNew?: boolean }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isUserScrollingRef = useRef(false);

  // Function to auto-resize the textarea
  const autoResizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = "auto";
      // Set the height to scrollHeight to fit content
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  // Function to scroll to bottom of chat
  const scrollToBottom = useCallback(() => {
    if (isUserScrollingRef.current) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Handle scroll events in the chat container
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = chatContainer;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

      setShowScrollButton(!isNearBottom);

      if (isNearBottom) {
        isUserScrollingRef.current = false;
      } else {
        isUserScrollingRef.current = true;
      }
    };

    chatContainer.addEventListener("scroll", handleScroll);
    return () => chatContainer.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to bottom when messages change, with marking new messages
  useEffect(() => {
    const markMessagesAsRead = () => {
      // Remove 'isNew' flag from all messages after they've been displayed
      setMessages((prevMessages) =>
        prevMessages.map((msg) => ({ ...msg, isNew: false }))
      );
    };

    scrollToBottom();

    // Schedule cleanup of 'isNew' flags after animation completes
    const timeoutId = setTimeout(markMessagesAsRead, 1000);
    return () => clearTimeout(timeoutId);
  }, [messages, isLoading, scrollToBottom]);

  // Resize on every change
  useEffect(() => {
    autoResizeTextarea();
  }, [message]);

  // Resize on initial render
  useEffect(() => {
    autoResizeTextarea();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // Add the user message to the chat
      const userMessage = message.trim();
      setMessages([
        ...messages,
        { text: userMessage, isUser: true, isNew: true },
      ]);

      // Clear the input field
      setMessage("");

      try {
        setIsLoading(true);
        isUserScrollingRef.current = false; // Auto-scroll should work for new messages

        // Send the message to the n8n webhook
        const result = await sendMessageToWebhook(userMessage);

        // Display a response message
        if (result.success) {
          setMessages((prev) => [
            ...prev,
            {
              text:
                result.responseText || "Message sent successfully to webhook!",
              isUser: false,
              isNew: true,
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              text: `Error: ${result.error || "Failed to send message"}`,
              isUser: false,
              isNew: true,
            },
          ]);
        }
      } catch (error) {
        // Handle any unexpected errors
        console.error("Error in handleSubmit:", error);
        setMessages((prev) => [
          ...prev,
          {
            text: "An unexpected error occurred. Please try again.",
            isUser: false,
            isNew: true,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePasswordSubmit = (password: string) => {
    if (password === 'tt55oo77') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect password. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return <PasswordPrompt onSubmit={handlePasswordSubmit} error={authError} />;
  }

  return (
    <div className="flex h-screen max-h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main chat area */}
      <div className="flex-1 flex flex-col items-center bg-[#2d3142] overflow-hidden w-full">
        <div className="max-w-5xl w-full flex flex-col flex-1 h-full">
          {/* Mobile header - only visible on mobile */}
          <div className="bg-[#121215] p-4 text-white shadow-md flex-shrink-0 flex items-center justify-between lg:hidden">
            <div className="w-8"></div>{" "}
            {/* Empty space to balance the header */}
            <h1 className="text-xl font-bold text-center">Chat</h1>
            <Link
              href="/"
              className="text-gray-400 hover:text-white transition-colors"
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </Link>
          </div>
          {/* Chat messages area */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
            ref={chatContainerRef}
          >
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400">Start a conversation...</p>
              </div>
            ) : (
              <>
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg max-w-[80%] mb-4 ${
                      msg.isUser
                        ? "ml-auto bg-[#121215] text-white"
                        : "bg-[#1c1e26] text-white"
                    } ${msg.isNew ? "message-new" : ""}`}
                  >
                    {msg.isUser ? msg.text : <FormatMessage text={msg.text} />}
                  </div>
                ))}
                {isLoading && (
                  <div className="p-4 rounded-lg bg-[#1c1e26] text-white max-w-[80%] mb-4 message-new">
                    <ThinkingAnimation className="mb-2" />
                    <div className="flex flex-wrap gap-2 mt-3">
                      {["Sales Data", "Statistics", "Regional Data"].map(
                        (tag, i) => (
                          <div
                            key={i}
                            className="px-2 py-0.5 bg-gray-800 text-xs rounded-full text-gray-300 flex items-center animate-pulse"
                            style={{ animationDelay: `${i * 0.3}s` }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                              />
                            </svg>
                            {tag}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Message input area */}
          <div className="p-4 w-full border-t border-gray-700 bg-[#2d3142] flex-shrink-0">
            <form
              onSubmit={handleSubmit}
              className="relative flex items-center"
            >
              <button type="button" className="absolute left-4 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10zm0 16.5v.5m0-8v4"></path>
                </svg>
              </button>
              <textarea
                ref={textareaRef}
                rows={1}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="How can I help you today?"
                className="w-full py-3 pl-12 pr-16 rounded-md bg-[#121215] text-white placeholder-gray-400 focus:outline-none resize-none overflow-y-auto custom-scrollbar min-h-[46px] max-h-[200px]"
                style={{ paddingTop: "0.75rem", paddingBottom: "0.75rem" }}
              />
              <div className="absolute right-2 flex items-center">
                {isLoading ? (
                  <Spinner />
                ) : (
                  <button
                    type="submit"
                    className="p-2 text-white bg-[#121215] rounded-full hover:bg-gray-700 transition-colors"
                    aria-label="Send message"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Scroll to bottom button - only shown when user has scrolled up */}
      {showScrollButton && (
        <ScrollToBottomButton
          onClick={() => {
            isUserScrollingRef.current = false;
            scrollToBottom();
          }}
        />
      )}
    </div>
  );
}
