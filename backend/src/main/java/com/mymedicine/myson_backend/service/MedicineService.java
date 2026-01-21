package com.mymedicine.myson_backend.service;

import com.mymedicine.myson_backend.dto.MedicineDto;
import com.mymedicine.myson_backend.dto.MedicineRequestDto;

import java.util.Map;

/**
 * 나의 약통 (개인 보유 약품) 관리 서비스 인터페이스
 */
public interface MedicineService {

    /**
     * 약통에 새로운 약품 등록
     * @param requestDto 등록할 약품 정보 (별칭, 유통기한, 공공데이터 정보 등)
     * @return 처리 결과 Map (retCode, userMsg)
     */
    Map<String, Object> registerMedicine(MedicineRequestDto requestDto);

    /**
     * 나의 약통 목록 조회
     * @param status 조회할 약품 상태 (예: "보관중", "복용완료", null=전체)
     * @return 약품 목록 리스트 및 처리 결과
     */
    Map<String, Object> getMedicineList(String status);

    /**
     * 약품 상세 정보 조회
     * @param id 약품 고유 키 (tblkey)
     * @return 약품 상세 정보 DTO 및 처리 결과
     */
    Map<String, Object> getMedicineDetail(String id);

    /**
     * 약품 정보 수정
     * @param id 수정할 약품 키 (tblkey)
     * @param requestDto 수정할 정보 (별칭, 상태, 메모 등)
     * @return 처리 결과 Map
     */
    Map<String, Object> updateMedicine(String id, MedicineDto requestDto);

    /**
     * 약품 삭제
     * @param id 삭제할 약품 키 (tblkey)
     * @return 처리 결과 Map
     */
    Map<String, Object> deleteMedicine(String id);

    /**
     * 유통기한 임박 알림 조회
     * 보유 중인 약품 중 유통기한이 얼마 남지 않은 목록을 반환합니다.
     * @return 임박 약품 리스트 및 카운트
     */
    Map<String, Object> getExpiryAlerts();
}