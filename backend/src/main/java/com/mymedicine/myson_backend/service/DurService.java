package com.mymedicine.myson_backend.service;

import java.util.Map;

/**
 * DUR (의약품 안전 사용 서비스) 비즈니스 로직 인터페이스
 */
public interface DurService {

    /**
     * DUR 체크 (병용 금기 및 임부 금기 확인)
     *
     * @param newItemSeq 새로 추가하려는 약품의 품목 기준 코드
     * @return 병용 금기 및 임부 금기 위반 사항이 담긴 Map 객체
     * - retCode: "10"(성공), "96"(인증실패), "99"(오류)
     * - hasConflict: 금기 사항 존재 여부 (true/false)
     * - violationList: 위반 사항 상세 목록 (List<Map>)
     */
    Map<String, Object> checkDur(String newItemSeq);
}