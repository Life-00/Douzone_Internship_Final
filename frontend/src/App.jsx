import React from 'react';
import { Toaster } from 'react-hot-toast'; 
import { ErrorBoundary } from 'react-error-boundary'; // [★추가★]
import AppRouter from './Router'; 
import { NavigationProvider } from './contexts/NavigationContext';
import NotificationManager from './components/NotificationManager';
import ErrorFallback from './components/ErrorFallback'; // [★추가★]

function App() {
  return (
    // [★추가★] 전체 앱을 에러 경계로 감싸기
    <ErrorBoundary 
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // 에러 발생 후 '다시 시도' 클릭 시 실행할 로직 (예: 홈으로 이동)
        window.location.href = '/';
      }}
    >
      <Toaster 
        position="bottom-right"
        toastOptions={{ duration: 3000 }}
      />
      
    
      <NavigationProvider>
        <NotificationManager />
        <AppRouter />
      </NavigationProvider>
    </ErrorBoundary>
  );
}

export default App;