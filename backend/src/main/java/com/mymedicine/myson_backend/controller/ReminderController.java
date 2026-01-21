package com.mymedicine.myson_backend.controller;

import com.mymedicine.myson_backend.dto.ReminderDto;
import com.mymedicine.myson_backend.service.ReminderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 알림 설정 및 조회 API 컨트롤러
 */
@RestController
@RequestMapping("/api/reminder")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ReminderController {

    private final ReminderService reminderService;

    /**
     * 알림 설정 저장
     */
    @PostMapping("/save")
    public ResponseEntity<Map<String, Object>> saveReminder(@RequestBody ReminderDto reminderDto) {
        Map<String, Object> response = reminderService.saveReminder(reminderDto);
        return ResponseEntity.ok(response);
    }

    /**
     * 활성화된 알림 목록 조회 (NotificationManager용)
     */
    @GetMapping("/list")
    public ResponseEntity<Map<String, Object>> getReminders() {
        Map<String, Object> response = reminderService.getMyReminders();
        return ResponseEntity.ok(response);
    }

    /**
     * 캘린더 화면용 통합 목록 조회
     */
    @GetMapping("/calendar-list")
    public ResponseEntity<Map<String, Object>> getCalendarList() {
        Map<String, Object> response = reminderService.getMedicineListWithReminders();
        return ResponseEntity.ok(response);
    }
}
