import React, { useEffect, useRef, useState } from "react";
import { ScrollToBottomButton } from "../ScrollToBottom";

interface ChatAreaProps {
  messages: { text: string; isUser: boolean; isNew?: boolean }[];
  message: string;
  setMessage: (message: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export interface FormatMessageProps {
  text: string;
}

// Function to clean response string from special format markers
const cleanResponseText = (text: string): string => {
  // Remove API response markers like "0:{"a":"$@1"..." or "2:T79e," at the beginning
  const cleanText = text
    .replace(/^\d+:\s*\{[^}]*\}\s*\d*:(?:T\w+,)?/, "")
    .replace(/^\$\d+$/, "")
    .replace(/\$@\d+/g, "") // Remove any remaining API markers like $@1
    .replace(/\\n/g, "\n") // Fix escaped newlines
    .trim();

  return cleanText;
};

// Function to detect and format tables in the text
const formatTable = (tableText: string[]): React.ReactNode => {
  // Skip if there aren't enough lines for a header and at least one row
  if (tableText.length < 2) return null;

  // Find header row (first non-empty line)
  const headerIndex = tableText.findIndex((line) => line.trim() !== "");
  if (headerIndex === -1) return null;

  const headerRow = tableText[headerIndex];

  // Detect table structure (| separated or space separated)
  const isVerticalBarTable = headerRow.includes("|");

  // Parse rows based on the detected format
  const parseRow = (row: string): string[] => {
    if (isVerticalBarTable) {
      // For | separated tables
      return row
        .split("|")
        .map((cell) => cell.trim())
        .filter((cell) => cell !== "");
    } else {
      // For space separated tables (more complex)
      // This is a simple approach - for production you might want a more robust parser
      return row
        .trim()
        .split(/\s{2,}/)
        .map((cell) => cell.trim());
    }
  };

  // Get header cells
  const headers = parseRow(headerRow);

  // Build data rows (skip empty lines)
  const rows = tableText
    .slice(headerIndex + 1)
    .filter((line) => line.trim() !== "")
    .map((row) => parseRow(row));

  return (
    <div className="my-4 overflow-auto max-h-[500px] border border-gray-700 rounded custom-scrollbar transform transition-opacity duration-300 hover:border-gray-500">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800 sticky top-0">
          <tr>
            {headers.map((header, i) => (
              <th
                key={i}
                scope="col"
                className="px-3 py-2 text-center text-xs font-medium text-gray-300 uppercase tracking-wider border-r border-gray-700 last:border-r-0"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-800">
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`${rowIndex % 2 === 0 ? "bg-gray-900" : "bg-gray-800"} hover:bg-gray-700 transition-colors duration-150`}
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={`px-3 py-2 whitespace-nowrap text-sm border-r border-gray-700 last:border-r-0 text-center ${
                    // Add color for monetary values
                    cell.includes("IQD") ||
                    cell.includes("$") ||
                    cell.includes(",")
                      ? "text-green-400"
                      : "text-gray-300"
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Function to format message text with line breaks and styling
export const FormatMessage = ({ text }: FormatMessageProps) => {
  // Clean any API response markers
  const cleanText = cleanResponseText(text);

  // Split the text by line breaks
  const lines = cleanText.split("\n");

  // Process and identify table sections
  let tableLines: string[] = [];
  let inTable = false;
  const processedContent: React.ReactNode[] = [];

  // Process lines to identify tables and other content
  lines.forEach((line, i) => {
    // Check if line might be part of a table
    const isTableLine =
      line.includes("|") ||
      /\s{3,}/.test(line) ||
      line.trim().startsWith("|") ||
      line.trim().startsWith("+") ||
      (line.includes("Country") &&
        (line.includes("Sales") ||
          line.includes("Units") ||
          line.includes("Transactions"))) ||
      /^\s*[\w\s]+\s*\|\s*[\d,.]+/.test(line); // Country | Number pattern

    if (isTableLine) {
      // Start or continue collecting table lines
      if (!inTable) inTable = true;
      tableLines.push(line);
    } else {
      // If we were in a table and now we're not, process the table
      if (inTable && tableLines.length > 0) {
        processedContent.push(formatTable([...tableLines]));
        tableLines = [];
        inTable = false;
      }

      // Process regular line
      processedContent.push(formatRegularLine(line, i));
    }
  });

  // Handle any remaining table lines
  if (tableLines.length > 0) {
    processedContent.push(formatTable([...tableLines]));
  }

  return (
    <div className="whitespace-pre-wrap break-words">{processedContent}</div>
  );

  // Function to highlight monetary values
  function formatMonetaryValues(line: string) {
    return (
      line
        .replace(
          /(\d{1,3}(?:,\d{3})*(?:\.\d+)?\s*(?:IQD|USD|$))/g,
          '<span class="text-green-400 font-semibold">$1</span>'
        )
        .replace(
          /(\d+(?:\.\d+)?%)/g,
          '<span class="text-blue-400 font-semibold">$1</span>'
        )
        .replace(
          /(≈\d+(?:\.\d+)?%)/g,
          '<span class="text-blue-400 font-semibold">$1</span>'
        )
        // Format large numbers without currency symbols
        .replace(
          /(\b\d{1,3}(?:,\d{3})+(?:\.\d+)?\b)(?!\s*(?:IQD|USD|$|%))/g,
          '<span class="text-yellow-300 font-semibold">$1</span>'
        )
        // Format date ranges
        .replace(
          /(\d{1,2}\/\d{1,2}\/\d{2,4}\s*-\s*\d{1,2}\/\d{1,2}\/\d{2,4})/g,
          '<span class="text-purple-300 font-semibold">$1</span>'
        )
        // Format time periods
        .replace(
          /(\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}\b)/gi,
          '<span class="text-purple-300 font-semibold">$1</span>'
        )
    );
  }

  // Function to create HTML from line with monetary formatting
  function createHtmlWithFormatting(line: string) {
    const formattedLine = formatMonetaryValues(line);
    return <div dangerouslySetInnerHTML={{ __html: formattedLine }} />;
  }

  // Function to format regular (non-table) lines based on content
  function formatRegularLine(line: string, i: number): React.ReactNode {
    // Report title
    if (line.includes("Sales Report") || line.includes("Report")) {
      return (
        <div
          key={i}
          className="font-bold text-xl text-blue-300 border-b border-gray-600 pb-2 mb-3"
        >
          {createHtmlWithFormatting(line)}
        </div>
      );
    }
    // Check for Owner's Summary section
    else if (
      line.includes("Owner's Summary") ||
      line.includes("Ownerâ€™s Summary") ||
      line.includes("Owner's Summary")
    ) {
      return (
        <div
          key={i}
          className="font-bold text-yellow-300 text-lg border-t border-b border-gray-600 py-2 my-3"
        >
          {line}
        </div>
      );
    }
    // Executive Summary or major section headers
    else if (
      line.includes("Executive Summary:") ||
      line.includes("Insights:") ||
      line.includes("Key") ||
      line.includes("Actionable Insights:") ||
      line.includes("Sales Performance:") ||
      /^(Summary|Overview|Performance|Analysis):?$/i.test(line.trim())
    ) {
      return (
        <div key={i} className="font-bold text-blue-400 mt-4 mb-2 text-lg">
          {createHtmlWithFormatting(line)}
        </div>
      );
    }
    // Check for Note: sections
    else if (line.includes("Note:")) {
      return (
        <div
          key={i}
          className="text-gray-400 italic text-sm mt-4 border-t border-gray-700 pt-2"
        >
          {createHtmlWithFormatting(line)}
        </div>
      );
    }
    // Check for category sections (lines ending with colon)
    else if (line.trim().endsWith(":") && line.trim().length < 60) {
      return (
        <div key={i} className="font-semibold text-blue-300 mt-4 mb-1">
          {createHtmlWithFormatting(line)}
        </div>
      );
    }
    // Check for bullet points with monetary values
    else if (
      line.trim().startsWith("-") &&
      (line.includes("IQD") || line.includes("%") || line.includes("$"))
    ) {
      return (
        <div key={i} className="pl-4 my-1">
          {createHtmlWithFormatting(line)}
        </div>
      );
    }
    // Check for regular bullet points
    else if (line.trim().startsWith("-") || line.trim().startsWith("•")) {
      return (
        <div key={i} className="pl-4 my-1">
          {createHtmlWithFormatting(line)}
        </div>
      );
    }
    // Lines that represent trends (up/down)
    else if (
      line.includes("↑") ||
      line.includes("↓") ||
      line.includes("increased") ||
      line.includes("decreased") ||
      line.includes("growth") ||
      line.includes("decline")
    ) {
      return (
        <div key={i} className="my-1">
          {line.includes("↑") ||
          line.includes("increased") ||
          line.includes("growth") ? (
            <span className="text-green-400">
              {createHtmlWithFormatting(line)}
            </span>
          ) : (
            <span className="text-red-400">
              {createHtmlWithFormatting(line)}
            </span>
          )}
        </div>
      );
    }
    // Check for numbered list items (like "1.", "2.")
    else if (/^\d+\./.test(line.trim())) {
      return (
        <div key={i} className="pl-4 my-1">
          {createHtmlWithFormatting(line)}
        </div>
      );
    }
    // Check for comparison lines (often containing "vs" or "compared to")
    else if (line.includes(" vs ") || line.includes("compared to")) {
      return (
        <div key={i} className="my-1 italic">
          {createHtmlWithFormatting(line)}
        </div>
      );
    }
    // Lines with monetary values or percentages
    else if (
      line.includes("IQD") ||
      line.includes("%") ||
      line.includes("$") ||
      /\d{3,}/.test(line)
    ) {
      return (
        <div key={i} className="my-1">
          {createHtmlWithFormatting(line)}
        </div>
      );
    }
    // Lines that might be recommendations
    else if (
      line.includes("recommend") ||
      line.includes("should") ||
      line.includes("suggested") ||
      line.includes("consider")
    ) {
      return (
        <div key={i} className="my-1 text-blue-200">
          {createHtmlWithFormatting(line)}
        </div>
      );
    }
    // Lines for time periods or date ranges
    else if (
      line.includes("month") ||
      line.includes("week") ||
      line.includes("period") ||
      line.includes("quarter") ||
      line.includes("Q1") ||
      line.includes("Q2") ||
      line.includes("Q3") ||
      line.includes("Q4")
    ) {
      return (
        <div key={i} className="my-1 font-medium">
          {createHtmlWithFormatting(line)}
        </div>
      );
    }
    // Regular text lines
    else {
      return (
        <div key={i} className="my-1">
          {line || "\u00A0"}
        </div>
      );
    }
  }
};

export default function ChatArea({
  messages,
  message,
  setMessage,
  handleSubmit,
}: ChatAreaProps) {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isUserScrollingRef = useRef(false);

  // Function to scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    isUserScrollingRef.current = false;
  };

  // Handle scroll events
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

    chatContainer.addEventListener('scroll', handleScroll);
    return () => chatContainer.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (!isUserScrollingRef.current) {
      scrollToBottom();
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col bg-[#2d3142] overflow-hidden h-screen">
      {/* Header */}
      <header className="bg-[#121215] p-4 text-white shadow-md flex-shrink-0">
        <h1 className="text-xl font-bold">Chat</h1>
      </header>

      {/* Chat messages area - This will flex and scroll */}
      <div className="flex-1 overflow-y-auto custom-scrollbar relative" ref={chatContainerRef}>
        <div className="p-4 pb-2 space-y-4 min-h-full">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full min-h-[50vh]">
              <p className="text-gray-400">Start a conversation...</p>
            </div>
          ) : (
            messages.map((msg, index) => (
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
            ))
          )}
          {/* Add extra space after messages to allow scrolling past the last message */}
          {messages.length > 0 && <div className="h-4" ref={messagesEndRef}></div>}
        </div>
      </div>

      {/* Message input area - Fixed at bottom */}
      <div className="p-4 w-full border-t border-gray-700 bg-[#2d3142] flex-shrink-0">
        <form onSubmit={handleSubmit} className="relative flex items-center">
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
          </div>
        </form>
      </div>

      {/* Scroll to bottom button - only shown when user has scrolled up */}
      {showScrollButton && <ScrollToBottomButton onClick={scrollToBottom} />}
    </div>
  );
}
