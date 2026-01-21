package com.mymedicine.myson_backend.service;

/**
 * 공공데이터 API 배치 서비스 인터페이스
 */
public interface ApiBatchService {

    /**
     * 낱알 식별 정보 적재
     */
    int loadAndStorePublicData(int pageNo) throws Exception;

    /**
     * 회수/판매중지 정보 적재
     */
    int loadAndStoreRecallData(int pageNo) throws Exception;

    /**
     * 병용 금기(DUR) 정보 적재
     */
    int loadAndStoreDurData(int pageNo) throws Exception;

    /**
     * 병용 금기 전체 적재 (백그라운드)
     */
    void runDurDataBatch();

    /**
     * 임부 금기 정보 적재
     */
    int loadAndStorePregnantBanData(int pageNo) throws Exception;

    /**
     * 임부 금기 전체 적재 (백그라운드)
     */
    void runPregnantBanBatch();

    /**
     * 공공데이터 전체 초기화
     */
    void clearPublicData();
}
