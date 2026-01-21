import { useState, useEffect } from 'react';
import { useNavigation } from '../contexts/NavigationContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const useDashboardData = () => {
  const [medicineList, setMedicineList] = useState([]);
  const [recallCount, setRecallCount] = useState(0);
  const [expiryCount, setExpiryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { setNotificationCount, onNavigate } = useNavigation();

  useEffect(() => {
    
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        
        
        const options = { credentials: 'include' };

        const [listRes, recallRes, expiryRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/medicine/list`, options),
          fetch(`${API_BASE_URL}/api/medicine/recall/alerts`, options),
          fetch(`${API_BASE_URL}/api/medicine/expiry/alerts`, options)
        ]);
        
        // 401(인증 실패) 체크
        if (listRes.status === 401) {
            onNavigate('login');
            return;
        }

        const listData = await listRes.json();
        const recallData = await recallRes.json();
        const expiryData = await expiryRes.json();

        if (listData.retCode === '10') setMedicineList(listData.medicineList || []);
        
        let totalAlerts = 0;
        if (recallData.retCode === '10') {
          setRecallCount(recallData.recallCount || 0);
          totalAlerts += recallData.recallCount || 0;
        }
        if (expiryData.retCode === '10') {
          setExpiryCount(expiryData.expiryCount || 0);
          totalAlerts += expiryData.expiryCount || 0;
        }

        setNotificationCount(totalAlerts);

      } catch (err) {
        console.error("Dashboard Data Fetch Error", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [setNotificationCount, onNavigate]);

  return { medicineList, recallCount, expiryCount, isLoading, error };
};