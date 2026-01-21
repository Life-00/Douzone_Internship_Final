import React from 'react';
import { useNavigation } from './contexts/NavigationContext';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MainDashboardPage from './pages/MainDashboardPage';
import MedicineDetailPage from './pages/MedicineDetailPage';
import NotificationPage from './pages/NotificationPage';
import MyPage from './pages/MyPage';
import SearchPage from './pages/SearchPage';
import SearchResultPage from './pages/SearchResultPage';
import MedicineAddPage from './pages/MedicineAddPage';
import PcLayout from './pages/PcLayout';
import MapPage from './pages/MapPage';
import CalendarPage from './pages/CalendarPage';

function AppRouter() {
  const { currentPage } = useNavigation();

  const renderPage = () => {
    let pageComponent;

    switch (currentPage) {
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      
      case 'main-dashboard':
        pageComponent = <MainDashboardPage />;
        break;
      case 'search':
        pageComponent = <SearchPage />;
        break;
      case 'map':
        pageComponent = <MapPage />;
        break;
      case 'calendar':
        pageComponent = <CalendarPage />;
        break;
      case 'medicine-detail':
        pageComponent = <MedicineDetailPage />; 
        break;
      case 'notifications':
        pageComponent = <NotificationPage />;
        break;
      case 'mypage':
        pageComponent = <MyPage />;
        break;
      case 'search-results':
        pageComponent = <SearchResultPage />;
        break;
      case 'medicine-add':
        pageComponent = <MedicineAddPage />;
        break;
      default:
        return <LoginPage />;
    }

    return (
      <PcLayout>
        {pageComponent}
      </PcLayout>
    );
  };

  return renderPage();
}

export default AppRouter;