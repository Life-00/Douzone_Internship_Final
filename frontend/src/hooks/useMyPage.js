import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigation } from '../contexts/NavigationContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const useMyPage = () => {
  const { onNavigate, userData } = useNavigation();
  const [isPregnant, setIsPregnant] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          credentials: 'include' // [수정]
        });
        if (response.status === 401) return; // 비로그인이면 무시
        
        const data = await response.json();
        if (data.retCode === '10') {
          setIsPregnant(data.isPregnant === 'Y');
        }
      } catch (error) { }
    };

    fetchUserInfo();
  }, []);

  const togglePregnantStatus = async () => {
    const newState = !isPregnant;
    const statusParam = newState ? 'Y' : 'N';

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/pregnant?status=${statusParam}`, {
        method: 'PUT',
        credentials: 'include' 
      });
      
      if (response.status === 401) {
          toast.error("로그인이 필요합니다.");
          return;
      }

      const data = await response.json();
      if (data.retCode === '10') {
        setIsPregnant(newState);
        toast.success(newState ? "임산부 모드 ON" : "임산부 모드 OFF");
      } else {
        toast.error(data.userMsg || "설정 실패");
      }
    } catch (error) {
      toast.error("통신 오류");
    }
  };

  const handleLogout = () => {
    onNavigate('login'); // NavigationContext의 performLogout 호출
  };

  return {
    userData,
    isPregnant,
    togglePregnantStatus,
    handleLogout,
    onNavigate
  };
};