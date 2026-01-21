package com.mymedicine.myson_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DUR 임부 금기 정보 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DurPregnantBanDto {
    private Long durKey;
    private String ingrCode;      // 성분 코드
    private String ingrName;      // 성분명
    private String itemSeq;       // 약품 코드
    private String itemName;      // 약품명
    private String prohbtContent; // 금기 사유
    private String typeName;      // 금기 등급 (1등급/2등급)
    private String entpName;      // 제조사
}