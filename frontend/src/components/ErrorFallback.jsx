import React from 'react';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">오류가 발생했습니다</h2>
        <p className="text-gray-600 mb-6">
          일시적인 시스템 오류입니다.<br />
          잠시 후 다시 시도해주세요.
        </p>
        <div className="bg-gray-100 p-3 rounded text-left text-xs text-gray-500 mb-6 overflow-auto max-h-32">
          {error.message}
        </div>
        <button
          onClick={resetErrorBoundary}
          className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors"
        >
          다시 시도하기
        </button>
      </div>
    </div>
  );
}

export default ErrorFallback;