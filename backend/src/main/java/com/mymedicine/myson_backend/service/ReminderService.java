package com.mymedicine.myson_backend.service;

import com.mymedicine.myson_backend.dto.ReminderDto;
import java.util.Map;

/**
 * 알림(Reminder) 관리 서비스 인터페이스
 */
public interface ReminderService {

    /**
     * 알림 설정 저장 (등록 및 수정)
     * @param reminderDto 알림 설정 정보
     * @return 처리 결과
     */
    Map<String, Object> saveReminder(ReminderDto reminderDto);

    /**
     * 내 알림 목록 조회 (NotificationManager용)
     * @return 활성화된 알림 리스트
     */
    Map<String, Object> getMyReminders();

    /**
     * 캘린더 화면용 통합 목록 조회 (약품 + 알림 정보)
     * 오늘 날짜 기준으로 복용해야 할 약품 목록을 계산하여 반환합니다.
     * @return 통합 약품 리스트
     */
    Map<String, Object> getMedicineListWithReminders();
}
