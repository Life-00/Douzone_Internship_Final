import React from 'react';
import { useNotifications } from '../hooks/useNotifications';

function NotificationPage() {
  // 커스텀 훅 사용
  const { recallAlerts, expiryAlerts, isLoading, onNavigate } = useNotifications();

  const renderNotificationItem = (noti) => {
    let style = {};
    if (noti.type === 'recall' || noti.type === 'expired') {
      style = { bgColor: 'bg-red-100', titleColor: 'text-red-600', borderColor: 'border-red-500', icon: '⚠️' };
    } else {
      style = { bgColor: 'bg-yellow-100', titleColor: 'text-yellow-700', borderColor: 'border-yellow-500', icon: '🔔' };
    }
    
    const formattedDate = noti.date && noti.date.length === 8
      ? `${noti.date.substring(0, 4)}-${noti.date.substring(4, 6)}-${noti.date.substring(6, 8)}` 
      : (noti.date || '날짜 없음');

    return (
      <div key={noti.id} className={`flex p-4 ${style.bgColor} rounded-lg shadow-md border-l-4 ${style.borderColor}`}>
        <div className="flex-shrink-0 mr-4">
          <div className={`flex items-center justify-center w-12 h-12 ${style.bgColor} rounded-full`}>
            <span className="text-2xl">{style.icon}</span>
          </div>
        </div>
        <div className="flex-1">
          <p className={`font-semibold ${style.titleColor}`}>{noti.title}</p>
          <p className="text-sm text-gray-800">{noti.message}</p>
          <p className="mt-1 text-xs text-gray-500">{formattedDate}</p>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <div className="w-full max-w-3xl mx-auto p-10 text-center text-gray-500">알림 정보를 불러오는 중입니다...</div>;
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      
      {/* 헤더 */}
      <div className="flex items-center mb-6">
        <button 
          onClick={() => onNavigate('main-dashboard')} 
          className="p-2 mr-4 text-gray-600 rounded-full hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <h1 className="text-3xl font-bold text-gray-800">알림 목록</h1>
      </div>

      <div className="space-y-6">
        {/* 회수/폐기 알림 섹션 */}
        <div>
          <h2 className="text-xl font-semibold text-red-600 mb-3">[주의] 회수/폐기 대상 알림 ({recallAlerts.length}건)</h2>
          <div className="space-y-2">
            {recallAlerts.length > 0 ? recallAlerts.map(renderNotificationItem) : (
              <p className="p-4 text-center text-gray-500 bg-white rounded-lg shadow-sm">회수/폐기 대상 알림이 없습니다.</p>
            )}
          </div>
        </div>

        {/* 유통기한 알림 섹션 */}
        <div>
          <h2 className="text-xl font-semibold text-yellow-700 mb-3">[알림] 유통기한 임박/만료 ({expiryAlerts.length}건)</h2>
          <div className="space-y-2">
            {expiryAlerts.length > 0 ? expiryAlerts.map(renderNotificationItem) : (
              <p className="p-4 text-center text-gray-500 bg-white rounded-lg shadow-sm">유통기한 알림이 없습니다.</p>
            )}
          </div>
        </div>

        {recallAlerts.length === 0 && expiryAlerts.length === 0 && (
          <p className="p-10 text-center text-gray-500">새로운 알림이 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default NotificationPage;