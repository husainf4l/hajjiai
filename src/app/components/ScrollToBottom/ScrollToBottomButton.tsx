import React from 'react';

interface ScrollToBottomButtonProps {
  onClick: () => void;
  className?: string;
}

const ScrollToBottomButton: React.FC<ScrollToBottomButtonProps> = ({ onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`${className} fixed bottom-24 right-8 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all fade-in-up z-10`}
      aria-label="Scroll to bottom"
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
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </button>
  );
};

export default ScrollToBottomButton;
