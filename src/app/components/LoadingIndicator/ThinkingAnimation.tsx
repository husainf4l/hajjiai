import React, { useEffect, useState, useRef, memo } from "react";

interface ThinkingAnimationProps {
  className?: string;
}

const ThinkingAnimation: React.FC<ThinkingAnimationProps> = memo(({ className = "" }) => {
  const [dots, setDots] = useState<string>(".");
  const [searchIndex, setSearchIndex] = useState<number>(0);
  const searchTerms = ["Analyzing data", "Processing query", "Searching records", "Computing results", "Retrieving information"];
  const rafRef = useRef<number | null>(null);
  const lastDotsUpdateRef = useRef<number>(0);
  const lastSearchUpdateRef = useRef<number>(0);

  // Use requestAnimationFrame for smoother animations
  useEffect(() => {
    const animate = (timestamp: number) => {
      // Update dots every 500ms
      if (timestamp - lastDotsUpdateRef.current >= 500) {
        setDots((prevDots) => {
          if (prevDots.length >= 3) return ".";
          return prevDots + ".";
        });
        lastDotsUpdateRef.current = timestamp;
      }

      // Update search terms every 2000ms
      if (timestamp - lastSearchUpdateRef.current >= 2000) {
        setSearchIndex((prevIndex) => (prevIndex + 1) % searchTerms.length);
        lastSearchUpdateRef.current = timestamp;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [searchTerms.length]);

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center">
        <div className="mr-3 animate-pulse">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-blue-400"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <div className="text-gray-300 text-sm">
          {searchTerms[searchIndex]}<span className="text-blue-400">{dots}</span>
        </div>
      </div>
      
      <div className="mt-2 bg-gray-800 h-1.5 rounded-full w-full overflow-hidden">
        <div 
          className="bg-blue-500 h-full rounded-full animate-progress"
          style={{
            width: "90%"
          }}
        />
      </div>
    </div>
  );
});

ThinkingAnimation.displayName = 'ThinkingAnimation';

export default ThinkingAnimation;
