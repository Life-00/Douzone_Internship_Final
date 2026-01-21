import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigation } from '../contexts/NavigationContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const useMedicineSearch = () => {
  const { onNavigate, setSearchResults, setSearchQuery } = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const searchMedicine = async (formData) => {
    setIsLoading(true);

    // '기타' 선택 시 입력값 사용, 아니면 선택값 사용
    const searchParams = {
      itemName: formData.itemName,
      printFront: formData.printFront,
      printBack: formData.printBack,
      drugShape: formData.drugShape === '기타' ? formData.drugShapeOther : formData.drugShape,
      colorClass1: formData.colorClass1 === '기타' ? formData.colorClass1Other : formData.colorClass1,
    };

    const queryParams = new URLSearchParams(searchParams).toString();
    const API_URL = `${API_BASE_URL}/api/public/search?${queryParams}`;

    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.userMsg || '검색 중 오류가 발생했습니다.');
        return;
      }

      const resultList = data.searchResultList || [];
      toast.success(data.userMsg || `${resultList.length}건 조회됨`);

      // Context 업데이트 및 페이지 이동
      setSearchResults(resultList);
      setSearchQuery(formData.itemName || '전체');
      onNavigate('search-results');

    } catch (err) {
      console.error('Fetch error:', err);
      toast.error('서버와 통신 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return { searchMedicine, isLoading };
};