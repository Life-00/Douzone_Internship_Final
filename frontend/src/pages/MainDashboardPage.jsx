import React, { useState, useMemo } from 'react';
import toast from 'react-hot-toast'; 
import Skeleton from 'react-loading-skeleton'; 
import { useNavigation } from '../contexts/NavigationContext';
import MedicineChart from '../components/MedicineChart';
import { useDashboardData } from '../hooks/useDashboardData';

function MainDashboardPage() {
  const { onNavigate } = useNavigation();
  
  // 데이터 로드 훅
  const { medicineList, recallCount, expiryCount, isLoading } = useDashboardData();

  const [statusFilter, setStatusFilter] = useState('전체'); 
  const [chartFilter, setChartFilter] = useState(null); 

  // 필터링 로직 (데이터가 없으면 빈 배열 반환)
  const displayedList = useMemo(() => {
    if (isLoading) return []; // 로딩 중엔 필터링 안 함
    return medicineList.filter(med => {
      if (statusFilter !== '전체' && med.status !== statusFilter) return false;
      if (chartFilter) {
        if (chartFilter.type === 'class') {
          const medClass = med.medClassName || '기타';
          return chartFilter.value === '기타' ? !med.medClassName : medClass.includes(chartFilter.value);
        } 
        if (chartFilter.type === 'status') {
          let statusKey = med.status || '보관중';
          if (med.daysLeft !== null && med.daysLeft < 0) statusKey = '사용불가(만료)';
          else if (med.daysLeft !== null && med.daysLeft <= 90) statusKey = '유통기한 임박';
          return statusKey === chartFilter.value;
        }
      }
      return true;
    });
  }, [medicineList, statusFilter, chartFilter, isLoading]);

  const handleChartFilterClick = (type, value) => {
    if (isLoading) return;
    if (chartFilter && chartFilter.type === type && chartFilter.value === value) {
      setChartFilter(null);
      toast('필터 해제됨');
    } else {
      setChartFilter({ type, value });
      toast.success(`'${value}' 목록만 봅니다.`);
    }
  };

  // 인사이트 배너 로직
  const getInsightContent = () => {
    // 로딩 중일 때 텍스트 대신 null 반환 (UI에서 스켈레톤 처리)
    if (isLoading) return null;
    
    if (recallCount > 0) return { text: `🚨 회수 대상 의약품이 ${recallCount}건 있습니다.`, color: "bg-red-50 border-red-500 text-red-700", icon: "📢" };
    if (expiryCount > 0) return { text: `⚠️ 유통기한 임박 약품이 ${expiryCount}건 있습니다.`, color: "bg-yellow-50 border-yellow-500 text-yellow-800", icon: "⏳" };
    if (medicineList.length === 0) return { text: "💊 아직 등록된 약이 없어요.", color: "bg-blue-50 border-blue-500 text-blue-700", icon: "💡" };
    return { text: "✨ 약통 관리가 아주 잘 되고 있어요!", color: "bg-green-50 border-green-500 text-green-700", icon: "😊" };
  };

  const insight = getInsightContent();

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6"> 
      
      <div className="flex justify-between items-end">
        <h1 className="text-3xl font-bold text-gray-800">약통 대시보드 💊</h1>
        <p className="text-gray-500 text-sm">나의 약 보유 현황을 한눈에 확인하세요.</p>
      </div>
      
      {/* 인사이트 배너 스켈레톤 */}
      {isLoading ? (
        <Skeleton height={60} borderRadius="0.5rem" />
      ) : (
        <div className={`${insight.color} border-l-4 p-4 rounded-r-lg flex items-center shadow-sm transition-colors duration-300`}>
          <span className="text-2xl mr-3">{insight.icon}</span>
          <p className="font-medium text-sm md:text-base">{insight.text}</p>
        </div>
      )}

      {/* 차트 영역 스켈레톤 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-80"> 
          {isLoading ? <Skeleton height="100%" borderRadius="0.5rem" /> : (
            <MedicineChart medicineList={medicineList} onFilterClick={handleChartFilterClick} type="class" />
          )}
        </div>
        <div className="h-80"> 
          {isLoading ? <Skeleton height="100%" borderRadius="0.5rem" /> : (
            <MedicineChart medicineList={medicineList} onFilterClick={handleChartFilterClick} type="status" />
          )}
        </div>
      </div>

      {/* 하단 리스트 영역 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-gray-800">나의 약통 목록</h2>
            {!isLoading && chartFilter && (
              <button className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full hover:bg-indigo-200 transition" onClick={() => setChartFilter(null)}>
                필터: {chartFilter.value} ✖
              </button>
            )}
          </div>
             
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {['전체', '보관중', '복용완료'].map(status => (
              <button 
                key={status}
                disabled={isLoading}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition ${
                  statusFilter === status ? 'bg-white text-indigo-600 shadow' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {isLoading ? (
            Array(3).fill(0).map((_, idx) => (
              <div key={idx} className="flex items-center p-4 border border-gray-100 rounded-lg">
                <Skeleton width={48} height={48} className="mr-4" />
                <div className="flex-1">
                  <Skeleton width="30%" height={20} className="mb-1" />
                  <Skeleton width="50%" height={16} />
                </div>
                <Skeleton width={60} height={24} />
              </div>
            ))
          ) : displayedList.length === 0 ? (
            <div className="py-10 text-center text-gray-400">조건에 맞는 약품이 없습니다.</div>
          ) : (
            displayedList.map((med) => (
              <div key={med.tblkey} className="flex items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition">
                <div className="flex-shrink-0 w-12 h-12 mr-4 bg-gray-200 rounded-md overflow-hidden">
                  <img
                    src={med.medItemImage || "https://placehold.co/48x48/e2e8f0/94a3b8?text=약"}
                    alt={med.medItemName}
                    className="object-cover w-full h-full"
                    onError={(e) => { e.target.src = "https://placehold.co/48x48/e2e8f0/94a3b8?text=약"; }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <span className="text-sm font-bold text-gray-800 mr-2 truncate">{med.alias}</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full flex-shrink-0">
                      {med.medClassName ? med.medClassName.split(/[\[\(]/)[0] : '분류없음'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{med.medItemName}</p>
                </div>
                <div className="text-right ml-4 flex-shrink-0">
                  {med.expiryDate && med.daysLeft !== null ? (
                    <p className={`text-sm font-bold ${med.daysLeft < 0 ? 'text-gray-400' : med.daysLeft <= 90 ? 'text-red-600' : 'text-green-600'}`}>
                      {med.daysLeft < 0 ? '만료됨' : `D-${med.daysLeft}`}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400">기한없음</p>
                  )}
                  <button 
                    onClick={() => onNavigate('medicine-detail', { medId: med.tblkey })}
                    className="text-xs text-gray-500 underline hover:text-indigo-600 mt-1 block ml-auto"
                  >
                    상세
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div> 
  );
}

export default MainDashboardPage;