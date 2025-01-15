// components/ErrorMessage.tsx
import React from 'react';

interface ErrorMessageProps {
  message?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message = 'Something went wrong. Please try again later.',
}) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-6 border border-red-300 max-w-md w-full">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="red"
            className="w-8 h-8 mr-3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.94-1.28 2.94-2.82V8.82c0-1.54-1.4-2.82-2.94-2.82H5.062C3.522 6 2.122 7.28 2.122 8.82v8.36c0 1.54 1.4 2.82 2.94 2.82z"
            />
          </svg>
          <h2 className="text-lg font-semibold text-red-600">Error</h2>
        </div>
        <p className="text-gray-700 mt-2 text-sm sm:text-base">{message}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300 text-sm sm:text-base"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;
