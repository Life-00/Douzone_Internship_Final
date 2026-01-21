import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const useCalendarData = (onNavigate) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reminderList, setReminderList] = useState([]);
  const [dailyIntakeList, setDailyIntakeList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // [수정] formatDate 함수는 유지
  const formatDate = (date) => {
    if (!(date instanceof Date) || isNaN(date)) return '';
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // 1. 초기 데이터 로드
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/reminder/calendar-list`, { credentials: 'include' })
    .then(res => {
        if(res.status === 401) { onNavigate('login'); throw new Error('Unauthorized'); }
        return res.json();
    })
    .then(data => {
      if (data.retCode === '10') {
        setReminderList(data.medicineList || []);
      }
    })
    .catch(console.error)
    .finally(() => setIsLoading(false));
  }, []);

  // 2. 복용 현황 로드
  useEffect(() => {
    const dateStr = formatDate(selectedDate);
    if (!dateStr) return;

    fetch(`${API_BASE_URL}/api/intake/daily?date=${dateStr}`, { credentials: 'include' })
    .then(res => res.json())
    .then(data => {
      if (data.retCode === '10') {
        setDailyIntakeList(data.dailyList || []);
      }
    })
    .catch(console.error);
  }, [selectedDate]);

  // 3. 알림 저장
  const saveReminder = async (medId, timeStr, isActive) => {
    try {
      await fetch(`${API_BASE_URL}/api/reminder/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medKey: medId,
          reminderTime: timeStr,
          isActive: isActive ? 'Y' : 'N'
        }),
        credentials: 'include' // [수정]
      });
    } catch (e) {
      toast.error('알림 저장 실패');
    }
  };

  // 4. 복용 체크
  const toggleIntake = async (medId, currentStatus) => {
    const newStatus = !currentStatus;
    const dateStr = formatDate(selectedDate);

    setDailyIntakeList(prev => prev.map(item => 
      item.medId === medId ? { ...item, isTaken: newStatus } : item
    ));

    try {
      const res = await fetch(`${API_BASE_URL}/api/intake/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medKey: medId,
          intakeDate: dateStr,
          isTaken: newStatus ? 'Y' : 'N'
        }),
        credentials: 'include' // [수정]
      });
      const data = await res.json();
      if (data.retCode === '10' && newStatus) {
        toast.success('복용 완료! 💊');
      }
    } catch (e) {
      // Rollback
      setDailyIntakeList(prev => prev.map(item => 
        item.medId === medId ? { ...item, isTaken: currentStatus } : item
      ));
      toast.error('저장 실패');
    }
  };

  return {
    currentDate, setCurrentDate,
    selectedDate, setSelectedDate,
    reminderList, setReminderList,
    dailyIntakeList,
    isLoading,
    saveReminder,
    toggleIntake
  };
};