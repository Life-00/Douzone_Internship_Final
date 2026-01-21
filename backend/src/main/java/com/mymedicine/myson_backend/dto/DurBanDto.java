package com.mymedicine.myson_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DUR 병용 금기 정보 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DurBanDto {
    private Long durKey;
    private String mainItemSeq;     // 주성분 약품 코드
    private String mainItemName;    // 주성분 약품명
    private String targetItemSeq;   // 병용 금기 약품 코드
    private String targetItemName;  // 병용 금기 약품명
    private String prohbtContent;   // 금기 사유
}