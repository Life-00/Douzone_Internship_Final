package com.mymedicine.myson_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 나의 약통 조회 응답 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicineDto {

    private String tblkey;
    private String userKey;

    // 공공 API 정보
    private String medItemSeq;
    private String medItemName;
    private String medEntpName;
    private String medItemImage;
    private String medClassName;

    // 사용자 입력/관리 정보
    private String alias;
    private String expiryDate;
    private String memo;
    private String status;
    private String drugType;        // '상비약' 또는 '처방약'
    private String purchaseDate;    // 구매 또는 처방 날짜

    // 메타 정보
    private String adddate;
    private String modifydate;
    private Long daysLeft;          // 유통기한 남은 일수 (음수일 경우 만료)
}