package com.mymedicine.myson_backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 폐의약품 수거함 지도 API 응답 및 DB 매핑 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class PharmacyMapDto {

    private String tblkey;

    // 프론트엔드 매핑 필드
    private String placeName;   // 장소명
    private String address;     // 주소
    private String latitude;    // 위도
    private String longitude;   // 경도
    private String phone;       // 전화번호

    private String placeType;
    private String dataStdDe;   // 데이터 기준일
    private String adddate;
}
