package com.mymedicine.myson_backend.controller;

import com.mymedicine.myson_backend.service.RecallService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * 의약품 회수/판매중지 알림 API 컨트롤러
 */
@RestController
@RequestMapping("/api/medicine/recall")
@RequiredArgsConstructor
public class RecallController {

    private final RecallService recallService;

    /**
     * 회수 대상 약품 알림 조회
     * 사용자가 보유한 약품 중 회수 대상인 목록을 반환합니다.
     */
    @GetMapping("/alerts")
    public ResponseEntity<Map<String, Object>> getRecallAlerts() {
        Map<String, Object> response = recallService.getRecallMedicineAlerts();

        if (!"10".equals(response.get("retCode"))) {
            return ResponseEntity.badRequest().body(response);
        }

        return ResponseEntity.ok(response);
    }
}