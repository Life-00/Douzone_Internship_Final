package com.mymedicine.myson_backend.service;

/**
 * 폐의약품 수거함 지도 데이터 배치 서비스 인터페이스
 */
public interface MapBatchService {

    /**
     * 수거함 데이터 적재
     * @param pageNo API 페이지 번호
     * @return 적재된 데이터 건수
     * @throws Exception API 호출 및 DB 처리 중 오류
     */
    int loadAndStoreMapData(int pageNo) throws Exception;

    /**
     * 수거함 데이터 초기화
     * 기존 테이블 데이터를 모두 삭제합니다.
     */
    void clearMapData();
}