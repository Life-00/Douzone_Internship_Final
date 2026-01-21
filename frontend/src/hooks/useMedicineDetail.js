import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigation } from '../contexts/NavigationContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const useMedicineDetail = (selectedMedicineId) => {
  const { onNavigate } = useNavigation();
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. 상세 조회
  useEffect(() => {
    if (!selectedMedicineId) {
      toast.error("조회할 약품 ID가 없습니다.");
      onNavigate('main-dashboard');
      return;
    }

    const fetchDetail = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/medicine/${selectedMedicineId}`, {
          credentials: 'include' 
        });

        if (response.status === 401) {
            toast.error("로그인이 필요합니다.");
            onNavigate('login');
            return;
        }

        const data = await response.json();
        if (!response.ok) {
          toast.error(data.userMsg || '조회 실패');
          onNavigate('main-dashboard');
          return;
        }

        setFormData(data.medicineDetail);
      } catch (err) {
        toast.error('서버 통신 오류');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [selectedMedicineId]);

  
  const updateMedicine = async (updatedData) => {
    const requestBody = {
      alias: updatedData.alias,
      expiryDate: updatedData.expiryDate || null,
      memo: updatedData.memo,
      status: updatedData.status,
      drugType: updatedData.drugType,
      purchaseDate: updatedData.purchaseDate || null,
    };

    const jsonPayload = JSON.stringify(requestBody);
    const base64Payload = btoa(unescape(encodeURIComponent(jsonPayload)));

    try {
      const response = await fetch(`${API_BASE_URL}/api/medicine/${selectedMedicineId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload: base64Payload }),
        credentials: 'include' 
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.userMsg || '수정 실패');
        return;
      }
      
      toast.success(data.userMsg || "수정 완료");
      onNavigate('main-dashboard');
    } catch (err) {
      toast.error('서버 오류');
    }
  };

  // 3. 삭제
  const deleteMedicine = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/medicine/${selectedMedicineId}`, {
        method: 'DELETE',
        credentials: 'include' 
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.userMsg || '삭제 실패');
        return;
      }
      
      toast.success(data.userMsg || "삭제 완료");
      onNavigate('main-dashboard');
    } catch (err) {
      toast.error('서버 오류');
    }
  };

  return { formData, setFormData, isLoading, updateMedicine, deleteMedicine };
};