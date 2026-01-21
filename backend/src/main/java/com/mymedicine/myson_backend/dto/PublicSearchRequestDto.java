package com.mymedicine.myson_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 약품 공공데이터 검색 요청 파라미터 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicSearchRequestDto {

    private String itemName;        // 약품명
    private String drugShape;       // 모양
    private String drugShapeOther;  // 모양(기타)
    private String colorClass1;     // 색상
    private String colorClass1Other;// 색상(기타)
    private String printFront;      // 각인(앞)
    private String printBack;       // 각인(뒤)
}