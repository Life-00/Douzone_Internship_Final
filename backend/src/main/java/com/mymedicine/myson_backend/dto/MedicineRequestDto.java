package com.mymedicine.myson_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 나의 약통 등록 및 수정 요청 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicineRequestDto {

    // --- 공공 API 정보 ---
    private String medItemSeq;      // 품목 기준 코드
    private String medItemName;     // 품목명
    private String medEntpName;     // 제조사명
    private String medItemImage;    // 약 이미지 URL
    private String medClassName;    // 약품 분류 (e.g. 해열, 진통, 소염제)

    // --- 사용자 입력 정보 ---
    private String alias;           // 약 별칭
    private String expiryDate;      // 유통기한 (YYYY-MM-DD)
    private String memo;            // 메모
    private String drugType;        // '상비약' 또는 '처방약'
    private String purchaseDate;    // 구매 또는 처방 날짜 (YYYY-MM-DD)

    private String status;          // 보관 상태 (수정 시 사용)
}
