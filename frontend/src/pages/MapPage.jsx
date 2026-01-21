import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useMapData } from '../hooks/useMapData';

// Kakao Maps API 키
const KAKAO_APP_KEY = import.meta.env.VITE_KAKAO_APP_KEY;

function MapPage() {
  // 1. 데이터 로드 (커스텀 훅)
  const { mapDataList, isDataLoading } = useMapData();
  
  // 2. 지도 상태 관리
  const mapRef = useRef(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // 3. Kakao Maps SDK 스크립트 로드
  useEffect(() => {
    if (!KAKAO_APP_KEY) {
      toast.error('Kakao Maps API 키가 설정되지 않았습니다.');
      return;
    }

    if (window.kakao && window.kakao.maps) {
      setIsMapLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&autoload=false`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => setIsMapLoaded(true));
    };
    script.onerror = () => toast.error('지도 API 로드 실패');
    
    document.head.appendChild(script);

    return () => {
      // 페이지 언마운트 시 스크립트 정리는 선택사항 (보통 SPA에선 유지함)
    };
  }, []);

  // 4. 지도 초기화 (SDK 로드 완료 시)
  useEffect(() => {
    if (!isMapLoaded) return;

    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    const defaultCenter = new window.kakao.maps.LatLng(36.3547, 127.3887); // 대전 시청 부근
    const options = { center: defaultCenter, level: 7 };
    
    const mapInstance = new window.kakao.maps.Map(mapContainer, options);
    mapRef.current = mapInstance;

    // 리사이즈 이슈 방지
    setTimeout(() => mapInstance.relayout(), 100);
    
    const handleResize = () => mapInstance.relayout();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [isMapLoaded]);

  // 5. 마커 렌더링 (지도 & 데이터 준비 완료 시)
  useEffect(() => {
    if (!mapRef.current || mapDataList.length === 0) return;

    const mapInstance = mapRef.current;
    const bounds = new window.kakao.maps.LatLngBounds();
    let validMarkerCount = 0;

    // 기존 마커 클리어 로직이 필요하다면 여기에 추가 (현재는 페이지 진입 시 1회 로드라 생략)

    mapDataList.forEach((item) => {
      const lat = parseFloat(item.latitude);
      const lng = parseFloat(item.longitude);

      if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) return;

      const position = new window.kakao.maps.LatLng(lat, lng);
      
      // 마커 생성
      const marker = new window.kakao.maps.Marker({
        map: mapInstance,
        position: position,
        title: item.placeName,
      });

      // 인포윈도우 내용 (HTML)
      const iwContent = createInfoWindowContent(item);
      const infowindow = new window.kakao.maps.InfoWindow({ 
        content: iwContent, 
        removable: true 
      });

      window.kakao.maps.event.addListener(marker, 'click', () => {
        infowindow.open(mapInstance, marker);
      });

      bounds.extend(position);
      validMarkerCount++;
    });

    // 지도 범위 재설정
    if (validMarkerCount > 0) {
      mapInstance.setBounds(bounds);
    } else {
      toast('지도에 표시할 유효한 위치 정보가 없습니다.');
    }

  }, [isMapLoaded, mapDataList]);

  // 헬퍼: 인포윈도우 HTML 생성
  const createInfoWindowContent = (item) => {
    return `
      <div style="padding:10px; width:250px; font-size:12px; color:#333; font-family:sans-serif;">
        <strong style="display:block; margin-bottom:5px; font-size:14px; color:#000; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
            ${item.placeName}
        </strong>
        <div style="white-space:normal; word-break:keep-all; line-height:1.4; color:#666;">
          ${item.address || '주소 정보 없음'}
        </div>
      </div>
    `;
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">폐의약품 수거함 위치</h1>
      
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="relative w-full h-[600px] rounded-md overflow-hidden border border-gray-300">
          <div id="map" className="w-full h-full"></div>
          
          {(!isMapLoaded || isDataLoading) && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
               <span className="text-gray-600 font-medium">
                 {isDataLoading ? '데이터를 불러오는 중입니다...' : '지도를 로딩 중입니다...'}
               </span>
            </div>
          )}
        </div>
        
        <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-md text-indigo-700">
          <p className="font-semibold">대전광역시 서구 기반 폐의약품 수거함 현황</p>
          <p className="text-sm">추후 전 지역으로 확장 예정입니다. (현재는 시범 운영)</p>
        </div>
      </div>
    </div>
  );
}

export default MapPage;