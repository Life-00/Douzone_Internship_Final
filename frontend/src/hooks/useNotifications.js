import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigation } from '../contexts/NavigationContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const useNotifications = () => {
  const { onNavigate } = useNavigation();
  const [recallAlerts, setRecallAlerts] = useState([]);
  const [expiryAlerts, setExpiryAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllAlerts = async () => {
      setIsLoading(true);
      try {
        const options = { credentials: 'include' }; 

        const [recallResponse, expiryResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/medicine/recall/alerts`, options),
          fetch(`${API_BASE_URL}/api/medicine/expiry/alerts`, options)
        ]);
        
        if (recallResponse.status === 401) {
            onNavigate('login');
            return;
        }

        const recallData = await recallResponse.json();
        const expiryData = await expiryResponse.json();

        // 1. 회수 알림
        let formattedRecallAlerts = [];
        if (recallData.retCode === '10' && recallData.recallList) {
          formattedRecallAlerts = recallData.recallList.map((item, index) => ({
            id: `R${index}`,
            type: 'recall',
            title: `[주의] 회수 대상 (${item.productName})`,
            message: `사유: ${item.recallReason}`,
            date: item.commandDate,
          }));
        }

        // 2. 유통기한 알림
        let formattedExpiryAlerts = [];
        if (expiryData.retCode === '10' && expiryData.expiryList) {
          formattedExpiryAlerts = expiryData.expiryList.map((item, index) => ({
            id: `E${index}`,
            type: item.isExpired ? 'expired' : 'expiry',
            title: item.isExpired ? '[만료]' : '[임박]',
            message: `'${item.alias}' 만료일: ${item.daysLeft}일 전`,
            date: item.expiryDate.replace(/-/g, ''),
          }));
        }

        setRecallAlerts(formattedRecallAlerts);
        setExpiryAlerts(formattedExpiryAlerts);

      } catch (err) {
        toast.error('알림 조회 오류');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllAlerts();
  }, [onNavigate]);

  return { recallAlerts, expiryAlerts, isLoading, onNavigate };
};