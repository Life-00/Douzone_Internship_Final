import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const useMapData = () => {
  const [mapDataList, setMapDataList] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [dataError, setDataError] = useState(null);

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        setIsDataLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/public/map/list`);
        
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        
        if (data.retCode === '10') {
          setMapDataList(data.mapDataList || []);
        } else {
          throw new Error(data.userMsg || '데이터 조회 실패');
        }
      } catch (err) {
        setDataError(err);
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchMapData();
  }, []);

  return { mapDataList, isDataLoading, dataError };
};