package com.mymedicine.myson_backend.service;

import com.mymedicine.myson_backend.dto.IntakeDto;
import java.util.Map;

/**
 * 복용 관리 서비스 인터페이스
 */
public interface IntakeService {

    /**
     * 복용 기록 저장 (체크/해제)
     * @param intakeDto 복용 정보 (약품 키, 날짜, 복용 여부)
     * @return 처리 결과 Map
     */
    Map<String, Object> saveIntake(IntakeDto intakeDto);

    /**
     * 일별 복용 현황 조회
     * 특정 날짜에 복용해야 할 약품 목록과 복용 여부를 반환합니다.
     * @param date 조회할 날짜 (YYYY-MM-DD)
     * @return 복용 현황 리스트
     */
    Map<String, Object> getDailyIntakeStatus(String date);
}