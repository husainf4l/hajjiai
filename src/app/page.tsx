import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#2d3142] flex flex-col">
      {/* Header */}
      <header className="bg-[#121215] p-4 text-white shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-xl font-bold">Al Balsan Group | Chat Prototype</h1>
        <div className="flex items-center text-sm text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Prototype access closes at 4:00 PM for security maintenance</span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="max-w-3xl w-full bg-[#1c1e26] rounded-lg shadow-xl overflow-hidden scale-in">
          {/* Hero section */}
          <div className="p-4 sm:p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center animate-pulse">
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
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                <span className="absolute -top-1 -right-1 bg-green-500 rounded-full w-4 h-4 border-2 border-[#1c1e26]"></span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 fade-in">
              Welcome to the Al Balsan Group Chat
            </h1>
            <p
              className="text-gray-400 text-base sm:text-lg mb-8 fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              This prototype demonstrates our interactive chat interface with
              sales data visualization and dynamic reporting features.
            </p>
            <Link
              href="/chat"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-md transition-colors duration-200 transform hover:scale-105 fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              Enter Chat Interface
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-0 p-2 md:p-0 divide-y md:divide-y-0 md:divide-x divide-gray-700">
            <div
              className="p-4 md:p-6 text-center slide-in-right"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="bg-[#121215] rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
                Data Visualization
              </h3>
              <p className="text-gray-400 text-sm md:text-base">
                Interactive tables and formatted data presentation
              </p>
            </div>
            <div
              className="p-4 md:p-6 text-center slide-in-right"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="bg-[#121215] rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
                Real-time Chat
              </h3>
              <p className="text-gray-400 text-sm md:text-base">
                Smooth scrolling and animated chat interactions
              </p>
            </div>
            <div
              className="p-4 md:p-6 text-center slide-in-right"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="bg-[#121215] rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
                Sales Reports
              </h3>
              <p className="text-gray-400 text-sm md:text-base">
                Analytics and formatted business insights
              </p>
            </div>
          </div>

          {/* Notice */}
          <div
            className="p-4 md:p-6 bg-[#121215] text-center fade-in"
            style={{ animationDelay: "0.5s" }}
          >
            <p className="text-yellow-300 flex flex-wrap items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>
                This prototype will be closed at 4:00 PM for security
                maintenance updates
              </span>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#121215] p-4 text-center text-gray-500 text-sm">
        <p>© 2025 Al Balsan Group - Prototype Version 1.0.0</p>
      </footer>
    </div>
  );
}
