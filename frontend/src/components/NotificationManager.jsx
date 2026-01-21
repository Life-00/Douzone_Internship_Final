import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
//로그인 정보 확인을 위해 import
import { useNavigation } from '../contexts/NavigationContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const NotificationManager = () => {
  //로그인한 사용자 정보 가져오기
  const { userData } = useNavigation();
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  const fetchReminders = async () => {
    //로그인 정보(userData)가 없으면 API를 부르지 않고 멈춥니다.
    if (!userData) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/reminder/list`, {
        credentials: 'include'
      });
      
      
      if (!response.ok) return; 
      
      const data = await response.json();
      if (data.retCode === '10') {
        setReminders(data.reminderList || []);
      }
    } catch (error) { }
  };

  // userData가 변경될 때마다(로그인/로그아웃 시) 실행
  useEffect(() => {
    if (userData) {
        fetchReminders();
        const syncInterval = setInterval(fetchReminders, 60 * 1000);
        return () => clearInterval(syncInterval);
    } else {
      
        setReminders([]);
    }
  }, [userData]);

  // 알림 체크 로직 
  useEffect(() => {
    if (reminders.length === 0) return; 

    const checkInterval = setInterval(() => {
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
        const notifiedKey = `notified_${now.toLocaleDateString()}_${currentTime}`;
        
        if (sessionStorage.getItem(notifiedKey)) return;

        let hasNotified = false;
        reminders.forEach((reminder) => {
            if (!reminder.reminderTime) return;
            const times = reminder.reminderTime.split(',').map(t => t.trim());
            
            if (times.includes(currentTime)) {
                if (Notification.permission === 'granted') {
                    new Notification('💊 복용 시간 알림', {
                        body: `${reminder.medAlias} (${reminder.medName}) 복용할 시간입니다!`,
                        icon: '/vite.svg',
                    });
                }
                toast(`[알림] ${reminder.medAlias} 복용 시간입니다!`, {
                    icon: '⏰',
                    duration: 5000,
                });
                hasNotified = true;
            }
        });

        if (hasNotified) {
            sessionStorage.setItem(notifiedKey, 'true');
        }
    }, 30 * 1000);

    return () => clearInterval(checkInterval);
  }, [reminders]);

  return null;
};

export default NotificationManager;