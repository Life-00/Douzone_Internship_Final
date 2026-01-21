package com.mymedicine.myson_backend.service;

import java.util.Map;

/**
 * 의약품 회수 알림 서비스 인터페이스
 */
public interface RecallService {

    /**
     * 회수 대상 약품 알림 조회
     * 사용자가 보유한 약품과 공공데이터 회수 정보를 비교하여 일치하는 항목을 반환합니다.
     * @return 회수 알림 결과 (recallList, recallCount)
     */
    Map<String, Object> getRecallMedicineAlerts();
}
