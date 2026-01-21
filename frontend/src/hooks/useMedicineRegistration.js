import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigation } from '../contexts/NavigationContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const useMedicineRegistration = (drugToAdd, formData) => {
  const { onNavigate } = useNavigation();
  
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [violationList, setViolationList] = useState([]);
  const [currentViolationIndex, setCurrentViolationIndex] = useState(0);
  const [currentConflictInfo, setCurrentConflictInfo] = useState(null);

  // 1. DUR 체크
  const startRegistrationProcess = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/dur/check?itemSeq=${drugToAdd.medItemSeq}`, {
        method: 'GET',
        credentials: 'include' 
      });
      
      if (response.status === 401) {
          onNavigate('login');
          return;
      }

      const data = await response.json();

      if (data.retCode === '10') {
        if (data.hasConflict && data.violationList?.length > 0) {
          const list = data.violationList;
          setViolationList(list);
          setCurrentViolationIndex(0);
          setCurrentConflictInfo(list[0]);
          setShowWarningModal(true);
        } else {
          await submitToBackend();
        }
      } else {
        toast.error(data.userMsg || "DUR 검사 실패");
      }
    } catch (err) {
      toast.error("서버 통신 오류");
    }
  };

  const proceedToNextStep = async () => {
    const nextIndex = currentViolationIndex + 1;
    if (nextIndex < violationList.length) {
      setCurrentViolationIndex(nextIndex);
      setCurrentConflictInfo(violationList[nextIndex]);
    } else {
      setShowWarningModal(false);
      await submitToBackend();
    }
  };

  // 3. 등록
  const submitToBackend = async () => {
    const requestBody = {
      medItemSeq: drugToAdd.medItemSeq || '', 
      medItemName: drugToAdd.medItemName || '',
      medEntpName: drugToAdd.medEntpName || '',
      medItemImage: drugToAdd.medItemImage || '',
      medClassName: drugToAdd.medClassName || '',
      
      alias: formData.alias,
      expiryDate: formData.expiryDate || null, 
      memo: formData.memo,
      drugType: formData.drugType,
      purchaseDate: formData.purchaseDate || null, 
    };

    const jsonPayload = JSON.stringify(requestBody);
    const base64Payload = btoa(unescape(encodeURIComponent(jsonPayload)));

    try {
      const response = await fetch(`${API_BASE_URL}/api/medicine/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload: base64Payload }), 
        credentials: 'include' 
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.userMsg || '약품 등록 실패');
      } else {
        toast.success(data.userMsg || "등록되었습니다.");
        onNavigate('main-dashboard');
      }
    } catch (err) {
      toast.error('서버 오류 발생');
    }
  };

  return {
    startRegistrationProcess,
    proceedToNextStep,
    showWarningModal,
    setShowWarningModal,
    currentConflictInfo
  };
};