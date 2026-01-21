import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigation } from '../contexts/NavigationContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const useRegister = () => {
  const { onNavigate } = useNavigation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const register = async (formData) => {
    // 1. 유효성 검사
    if (!formData.userId || !formData.userPassword || !formData.userName) {
      toast.error('아이디, 이름, 비밀번호는 필수 항목입니다.');
      return;
    }
    if (formData.userPassword !== formData.confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!formData.agreeTerms) {
      toast.error('이용약관에 동의해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 2. 데이터 가공 (Base64 Encoding)
      const requestBody = {
        userId: formData.userId,
        userPassword: formData.userPassword,
        userName: formData.userName,
      };
      const jsonPayload = JSON.stringify(requestBody);
      const base64Payload = btoa(unescape(encodeURIComponent(jsonPayload)));

      // 3. API 호출
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload: base64Payload }),
      });

      const result = await response.json();

      // 4. 응답 처리
      if (result.retCode === '10') {
        toast.success(result.userMsg);
        onNavigate('login');
      } else {
        toast.error(result.userMsg || '회원가입 실패');
      }
    } catch (err) {
      console.error('Register Error:', err);
      toast.error('서버와 통신 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return { register, isSubmitting, onNavigate };
};