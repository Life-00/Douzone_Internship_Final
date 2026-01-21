package com.mymedicine.myson_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 알림(리마인더) 설정 정보 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReminderDto {
    private String tblkey;
    private String userKey;
    private String medKey;

    private String reminderTime; // 알림 시간 (예: "09:00,13:00")
    private String isActive;     // 활성화 여부 ("Y" or "N")

    // 복용 주기 설정
    private String frequencyType; // "Daily", "PRN", "Custom"
    private String customValue;   // Custom일 경우 설정값 (예: "Mon,Wed,Fri" or "2")

    private String adddate;
    private String modifydate;

    // 화면 표시용 조인 필드
    private String medAlias;
    private String medName;
}