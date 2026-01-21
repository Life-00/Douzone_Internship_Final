package com.mymedicine.myson_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 복용 내역 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IntakeDto {
    private String tblkey;
    private String userKey;
    private String medKey;
    private String intakeDate; // 복용 날짜 (YYYY-MM-DD)
    private String isTaken;    // 복용 여부 ("Y", "N")
    private String adddate;

    // 조회용 확장 필드
    private String medName;
    private String medAlias;
}