package com.mymedicine.myson_backend.service;

import com.mymedicine.myson_backend.dto.PublicSearchRequestDto;
import java.util.Map;

/**
 * 공공데이터 검색 서비스 인터페이스
 */
public interface PublicSearchService {

    /**
     * 약품 식별 정보 검색
     * @param requestDto 검색 조건 (약품명, 모양, 색상 등)
     * @return 검색 결과 리스트
     */
    Map<String, Object> searchPublicMedicine(PublicSearchRequestDto requestDto);

    /**
     * 지도 데이터(폐의약품 수거함) 목록 조회
     * @return 수거함 위치 리스트
     */
    Map<String, Object> getMapDataList();
}
