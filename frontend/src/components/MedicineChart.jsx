import React, { useMemo, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const CHART_COLORS = {
  CLASS: ['#6366F1', '#8B5CF6', '#EC4899', '#F43F5E', '#10B981', '#3B82F6', '#F59E0B', '#9CA3AF'],
  STATUS: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#6366F1', '#8B5CF6', '#EC4899', '#9CA3AF'],
};

/**
 * 약통 분석 도넛 차트 컴포넌트
 * @param {Array} medicineList - 약품 목록 데이터
 * @param {Function} onFilterClick - 차트 세그먼트 클릭 핸들러
 * @param {string} type - 'class'(분류) 또는 'status'(상태) 모드
 */
function MedicineChart({ medicineList, onFilterClick, type }) {
  const [internalChartType, setInternalChartType] = useState('class');
  const currentType = type || internalChartType;

  // 차트 데이터 생성
  const chartData = useMemo(() => {
    const stats = {};

    medicineList.forEach((med) => {
      let key = '기타';
      
      if (currentType === 'class') {
        const rawClass = med.medClassName || '기타';
        key = rawClass.split(/[[\](),]/)[0].trim() || '기타';
      } else {
        if (med.daysLeft !== null && med.daysLeft < 0) {
          key = '사용불가(만료)';
        } else if (med.daysLeft !== null && med.daysLeft <= 90) {
          key = '유통기한 임박';
        } else {
          key = med.status || '보관중';
        }
      }
      stats[key] = (stats[key] || 0) + 1;
    });

    return {
      labels: Object.keys(stats),
      datasets: [{
        data: Object.values(stats),
        backgroundColor: currentType === 'class' ? CHART_COLORS.CLASS : CHART_COLORS.STATUS,
        borderWidth: 0,
        hoverOffset: 10,
      }],
    };
  }, [medicineList, currentType]);

  // 차트 옵션 설정
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: { usePointStyle: true, font: { size: 11 }, boxWidth: 8, padding: 15 },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.chart._metasets[context.datasetIndex].total;
            const percentage = Math.round((value / total) * 100) + '%';
            return `${label}: ${value}개 (${percentage})`;
          }
        }
      }
    },
    onClick: (event, elements) => {
      if (elements.length > 0 && onFilterClick) {
        const index = elements[0].index;
        const label = chartData.labels[index];
        onFilterClick(currentType, label);
      }
    },
  };

  const title = currentType === 'class' ? '💊 종류별 분포' : '🚦 상태별 현황';

  return (
    <div className="bg-white p-5 rounded-lg shadow-md h-full flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-bold text-gray-800">{title}</h2>
        
        {!type && (
          <div className="bg-gray-100 p-1 rounded-lg flex text-xs font-semibold">
            <button 
              onClick={() => setInternalChartType('class')} 
              className={`px-2 py-0.5 rounded ${currentType === 'class' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'}`}
            >
              종류
            </button>
            <button 
              onClick={() => setInternalChartType('status')} 
              className={`px-2 py-0.5 rounded ${currentType === 'status' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'}`}
            >
              상태
            </button>
          </div>
        )}
      </div>

      <div className="relative flex-1 min-h-[200px]">
        {medicineList.length > 0 ? (
          <>
            <Doughnut data={chartData} options={options} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-6"> 
              <span className="text-2xl font-bold text-gray-800">{medicineList.length}</span>
              <span className="text-[10px] text-gray-400">TOTAL</span>
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            데이터 없음
          </div>
        )}
      </div>
    </div>
  );
}

export default MedicineChart;