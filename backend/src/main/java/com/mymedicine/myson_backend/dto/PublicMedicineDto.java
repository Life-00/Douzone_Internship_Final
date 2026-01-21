package com.mymedicine.myson_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 공공데이터 의약품 식별정보 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicMedicineDto {

    private String tblkey;          // DB PK
    private String adddate;         // 적재 일시

    // 공공 API 원본 정보
    private String medItemSeq;      // 품목기준코드
    private String medItemName;     // 제품명
    private String medEntpName;     // 업체명
    private String medItemImage;    // 이미지 URL

    // 식별 정보
    private String drugShape;       // 모양
    private String colorClass1;     // 색상(앞)
    private String colorClass2;     // 색상(뒤)
    private String printFront;      // 각인(앞)
    private String printBack;       // 각인(뒤)
    private String medClassName;    // 약품 분류
}
