import React from 'react';
import { useNavigation } from '../contexts/NavigationContext';
import { useCalendarData } from '../hooks/useCalendarData';

/**
 * 복용 캘린더 및 알림 설정 페이지
 */
function CalendarPage() {
  const { onNavigate } = useNavigation();
  
  // 커스텀 훅 사용
  const {
    currentDate, setCurrentDate,
    selectedDate, setSelectedDate,
    reminderList, setReminderList,
    dailyIntakeList,
    isLoading,
    saveReminder,
    toggleIntake
  } = useCalendarData(onNavigate);

  // --- 유틸리티 함수 ---
  const getTimesArray = (timeStr) => timeStr ? timeStr.split(',').map(t => t.trim()).filter(t => t) : [];
  
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= lastDate; i++) days.push(new Date(year, month, i));
    return days;
  };

  // --- 핸들러 ---
  const changeMonth = (offset) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  const handleSpecificTimeChange = (medId, index, newTime) => {
    setReminderList(prev => prev.map(item => {
      if (item.medId === medId) {
        const times = getTimesArray(item.reminderTime);
        times[index] = newTime;
        const newTimeStr = times.join(',');
        // 변경 즉시 저장 (onBlur 대체)
        saveReminder(medId, newTimeStr, item.isActive);
        return { ...item, reminderTime: newTimeStr };
      }
      return item;
    }));
  };

  const addTimeSlot = (medId) => {
    setReminderList(prev => {
      const newItem = prev.find(i => i.medId === medId);
      if (!newItem) return prev;
      
      const times = getTimesArray(newItem.reminderTime);
      if (times.length >= 5) return prev; // 최대 5개 제한
      
      times.push("09:00");
      const newTimeStr = times.join(',');
      saveReminder(medId, newTimeStr, newItem.isActive);
      
      return prev.map(item => item.medId === medId ? { ...item, reminderTime: newTimeStr } : item);
    });
  };

  const removeTimeSlot = (medId, index) => {
    setReminderList(prev => {
      const newItem = prev.find(i => i.medId === medId);
      if (!newItem) return prev;

      const times = getTimesArray(newItem.reminderTime);
      times.splice(index, 1);
      const newTimeStr = times.join(',');
      saveReminder(medId, newTimeStr, newItem.isActive);

      return prev.map(item => item.medId === medId ? { ...item, reminderTime: newTimeStr } : item);
    });
  };

  const toggleReminderActive = (medId) => {
    setReminderList(prev => {
      const newItem = prev.find(i => i.medId === medId);
      if (!newItem) return prev;
      
      const newActive = !newItem.isActive;
      saveReminder(medId, newItem.reminderTime, newActive);
      return prev.map(item => item.medId === medId ? { ...item, isActive: newActive } : item);
    });
  };

  // --- 렌더링 변수 ---
  const currentYearStr = currentDate.getFullYear();
  const currentMonthStr = currentDate.getMonth() + 1;
  const selectedYearStr = selectedDate.getFullYear();
  const selectedMonthStr = selectedDate.getMonth() + 1;
  const selectedDayStr = selectedDate.getDate();
  const dayOfWeekStr = ['일','월','화','수','목','금','토'][selectedDate.getDay()];

  if (isLoading) return <div className="p-10 text-center">로딩 중...</div>;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* 1. 캘린더 섹션 */}
      <div className="lg:col-span-5 bg-white p-6 rounded-lg shadow-md h-fit">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">📅 {currentYearStr}년 {currentMonthStr}월</h2>
          <div className="space-x-2">
            <button onClick={() => changeMonth(-1)} className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm">◀</button>
            <button onClick={() => changeMonth(1)} className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm">▶</button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 mb-2 text-center font-semibold text-gray-500 text-sm">
          <div className="text-red-500">일</div>
          <div>월</div><div>화</div><div>수</div><div>목</div><div>금</div>
          <div className="text-blue-500">토</div>
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {getDaysInMonth().map((dateObj, idx) => {
            if (!dateObj) return <div key={idx} className="h-14 border-none"></div>;
            const dayNum = dateObj.getDate();
            const isSelected = dateObj.toDateString() === selectedDate.toDateString();
            const isToday = dateObj.toDateString() === new Date().toDateString();

            return (
              <div key={idx} onClick={() => setSelectedDate(dateObj)}
                className={`h-14 border rounded-md p-1 flex flex-col justify-start cursor-pointer transition hover:bg-indigo-50
                  ${isSelected ? 'ring-2 ring-indigo-500 bg-indigo-50' : 'bg-white'}`}
              >
                <span className={`text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full
                  ${isToday ? 'bg-indigo-600 text-white' : 'text-gray-700'}`}>
                  {dayNum}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. 복용 기록 섹션 */}
      <div className="lg:col-span-4 bg-white p-6 rounded-lg shadow-md h-fit">
        <h2 className="text-xl font-bold text-gray-800 mb-1">💊 복용 기록</h2>
        <p className="text-indigo-600 font-semibold mb-4 text-sm">
          {selectedYearStr}년 {selectedMonthStr}월 {selectedDayStr}일 ({dayOfWeekStr})
        </p>

        {dailyIntakeList.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">복용할 약이 없습니다.</div>
        ) : (
          <div className="space-y-3">
            {dailyIntakeList.map((item) => (
              <div key={item.medId} onClick={() => toggleIntake(item.medId, item.isTaken)}
                className={`flex items-center p-4 rounded-lg border cursor-pointer transition
                  ${item.isTaken ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition
                  ${item.isTaken ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                  {item.isTaken && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <p className={`font-bold ${item.isTaken ? 'text-green-800 line-through' : 'text-gray-800'}`}>{item.alias}</p>
                  <p className="text-xs text-gray-500 truncate w-40">{item.medName}</p>
                </div>
                {item.isTaken && <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">복용완료</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. 알림 설정 섹션 */}
      <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md h-fit">
        <h2 className="text-lg font-bold text-gray-800 mb-4">⏰ 알림 시간 설정</h2>
        
        <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {reminderList.map((med) => (
            <div key={med.medId} className="border-b pb-4 last:border-none">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-sm text-gray-700 truncate w-2/3" title={med.alias}>
                  {med.alias}
                </span>
                <button 
                  onClick={() => toggleReminderActive(med.medId)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${med.isActive ? 'bg-indigo-600' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${med.isActive ? 'translate-x-5' : 'translate-x-1'}`} />
                </button>
              </div>
              
              <div className={`space-y-2 ${!med.isActive && 'opacity-40 pointer-events-none'}`}>
                {getTimesArray(med.reminderTime).map((time, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                     <span className="text-xs text-gray-400 w-6">{idx + 1}회</span>
                     <input 
                        type="time" 
                        value={time}
                        onChange={(e) => handleSpecificTimeChange(med.medId, idx, e.target.value)}
                        className="flex-1 border rounded px-2 py-1 text-sm text-center bg-gray-50 focus:ring-1 focus:ring-indigo-500 outline-none"
                     />
                     <button 
                        onClick={() => removeTimeSlot(med.medId, idx)}
                        className="text-gray-400 hover:text-red-500 p-1"
                     >
                       🗑️
                     </button>
                  </div>
                ))}
                
                <button 
                  onClick={() => addTimeSlot(med.medId)}
                  className="w-full mt-2 py-1 text-xs font-medium text-indigo-600 border border-indigo-200 rounded hover:bg-indigo-50 flex items-center justify-center"
                >
                  + 시간 추가
                </button>
              </div>
            </div>
          ))}
          {reminderList.length === 0 && <p className="text-sm text-gray-400 text-center py-4">약이 없습니다.</p>}
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;