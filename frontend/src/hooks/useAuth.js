import { useState } from 'react';
import { useNavigation } from '../contexts/NavigationContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  
  /**
   * 로그인 요청
   */
  const login = async (userId, userPassword) => {
    setIsLoading(true);
    try {
      const rawData = { userId, userPassword };
      const jsonPayload = JSON.stringify(rawData);
      const base64Payload = btoa(unescape(encodeURIComponent(jsonPayload)));

      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload: base64Payload }),
        credentials: 'include', 
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.userMsg || '로그인 실패' };
      }
      
     
      return { success: true, data };

    } catch (error) {
      return { success: false, message: '서버 통신 오류 발생' };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 로그아웃 요청
   */
  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  return { login, logout, isLoading };
};