import React from 'react';
import { useMyPage } from '../hooks/useMyPage';

function MyPage() {
  // 커스텀 훅 사용
  const { 
    userData, 
    isPregnant, 
    togglePregnantStatus, 
    handleLogout, 
    onNavigate 
  } = useMyPage();

  return (
    <div className="w-full max-w-2xl mx-auto">
      
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
        <h1 className="text-3xl font-bold text-gray-800">마이페이지</h1>
      </div>

      <div className="p-6 space-y-6 bg-white rounded-lg shadow-md">
        
        {/* 1. 프로필 영역 */}
        <div className="flex items-center space-x-4 border-b pb-6">
          <div className="flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full">
            <span className="text-2xl font-bold text-indigo-600">
              {userData ? userData.userName.charAt(0).toUpperCase() : 'G'}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {userData ? userData.userName : 'Guest'}
            </h2>
            <p className="text-sm text-gray-500">개인 맞춤형 건강 관리 중</p>
          </div>
        </div>

        {/* 2. 임산부 안심 체크 설정 */}
        <div className={`border rounded-lg p-4 flex justify-between items-center transition-colors duration-300 ${isPregnant ? 'bg-pink-50 border-pink-200' : 'bg-gray-50 border-gray-200'}`}>
            <div>
                <h3 className={`font-bold flex items-center ${isPregnant ? 'text-pink-800' : 'text-gray-600'}`}>
                    🤰 임산부 안심 체크
                </h3>
                <p className={`text-xs mt-1 ${isPregnant ? 'text-pink-600' : 'text-gray-500'}`}>
                    {isPregnant 
                        ? "현재 켜져 있습니다. 임부 금기 약물 등록 시 경고합니다." 
                        : "꺼져 있습니다. 임산부라면 활성화해주세요."}
                </p>
            </div>
            
            <button 
                onClick={togglePregnantStatus}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 ${isPregnant ? 'bg-pink-600' : 'bg-gray-300'}`}
            >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isPregnant ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
        </div>

        {/* 3. 메뉴 목록 */}
        <div className="space-y-2">
          <button className="flex justify-between w-full p-4 text-left bg-gray-50 rounded-lg hover:bg-gray-100">
            <span>회원정보 수정</span>
            <span>&gt;</span>
          </button>
          <button className="flex justify-between w-full p-4 text-left bg-gray-50 rounded-lg hover:bg-gray-100">
            <span>공지사항</span>
            <span>&gt;</span>
          </button>
        </div>

        {/* 4. 로그아웃 버튼 */}
        <div className="pt-4">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 font-bold text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}

export default MyPage;