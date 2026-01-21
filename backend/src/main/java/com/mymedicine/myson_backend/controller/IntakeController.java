package com.mymedicine.myson_backend.controller;

import com.mymedicine.myson_backend.dto.IntakeDto;
import com.mymedicine.myson_backend.service.IntakeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 복용 관리 관련 API 컨트롤러
 * 복용 여부 체크 및 일별 현황 조회를 처리합니다.
 */
@RestController
@RequestMapping("/api/intake")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") // 개발 환경 허용
public class IntakeController {

    private final IntakeService intakeService;

    /**
     * 복용 체크/해제 상태 저장
     */
    @PostMapping("/save")
    public ResponseEntity<Map<String, Object>> saveIntake(@RequestBody IntakeDto intakeDto) {
        Map<String, Object> response = intakeService.saveIntake(intakeDto);
        return ResponseEntity.ok(response);
    }

    /**
     * 특정 날짜의 복용 현황 조회
     * @param date 조회할 날짜 (YYYY-MM-DD)
     */
    @GetMapping("/daily")
    public ResponseEntity<Map<String, Object>> getDailyIntake(@RequestParam("date") String date) {
        Map<String, Object> response = intakeService.getDailyIntakeStatus(date);
        return ResponseEntity.ok(response);
    }
}