import React from 'react';
import toast from 'react-hot-toast'; 
import { useNavigation } from '../contexts/NavigationContext';

// 아이콘 데이터 정의 (컴포넌트 외부로 이동하여 가독성 확보)
const NAV_ITEMS = [
  { 
    name: 'main-dashboard', 
    label: '나의 약통', 
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  },
  { 
    name: 'calendar', 
    label: '복용 캘린더', 
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  },
  { 
    name: 'search', 
    label: '약품 검색', 
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
  },
  { 
    name: 'map', 
    label: '수거함 위치', 
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  },
];

function PcLayout({ children }) {
  const { userData, currentPage, onNavigate, notificationCount } = useNavigation();

  const welcomeMessage = userData ? `${userData.userName}님, 환영합니다!` : '환영합니다!';

  const handleLogout = () => {
    toast.success("로그아웃 되었습니다."); 
    onNavigate('login'); 
  };

  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* Sidebar */}
      <aside className="flex flex-col w-64 bg-gray-900 text-gray-200">
        <div className="flex items-center justify-center h-16 bg-gray-950">
          <h1 className="text-xl font-bold text-indigo-400">My Medicine (마이슨)</h1>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.name}
              onClick={() => onNavigate(item.name)}
              className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors duration-200 ${
                (currentPage === item.name)
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                {item.icon}
              </svg>
              <span className="ml-3 font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        
        {/* Header */}
        <header className="flex items-center justify-end p-4 bg-white shadow-md h-16 z-10">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">{welcomeMessage}</span>
            
            {/* Notification Button */}
            <button 
                onClick={() => onNavigate('notifications')}
                className="relative p-2 text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                title="알림"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              {/* Notification Badge */}
              {notificationCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </span>
              )}
            </button>

            {/* MyPage Button */}
            <button 
                onClick={() => onNavigate('mypage')} 
                className="p-2 text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                title="마이페이지"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            
            {/* Logout Button */}
            <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-lg hover:bg-red-200 transition-colors">
              로그아웃
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default PcLayout;