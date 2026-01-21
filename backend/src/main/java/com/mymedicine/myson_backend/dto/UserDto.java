package com.mymedicine.myson_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 사용자 정보 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private String tblkey;
    private String userId;
    private String userPassword; // 보안상 응답 시 제거 주의
    private String userName;
    private String adddate;

    private String provider;     // 가입 경로 (local, google 등)
    private String isPregnant;   // 임신 여부 (Y/N)
}
