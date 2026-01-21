package com.mymedicine.myson_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mymedicine.myson_backend.dto.MedicineDto;
import com.mymedicine.myson_backend.dto.MedicineRequestDto;
import com.mymedicine.myson_backend.service.MedicineService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;

/**
 * 약통(개인 보유 약품) 관리 컨트롤러
 */
@Slf4j
@RestController
@RequestMapping("/api/medicine")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class MedicineController {

    private final MedicineService medicineService;
    private final ObjectMapper objectMapper;

    /**
     * 약통 등록 (Base64 Payload)
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registerMedicine(@RequestBody Map<String, Object> requestMap) {
        Map<String, Object> response;
        try {
            String payload = (String) requestMap.get("payload");
            if (payload == null) {
                return ResponseEntity.badRequest().body(Map.of("retCode", "98", "userMsg", "Payload 없음"));
            }

            String decodedJson = new String(Base64.getDecoder().decode(payload.trim()), StandardCharsets.UTF_8);
            MedicineRequestDto requestDto = objectMapper.readValue(decodedJson, MedicineRequestDto.class);

            response = medicineService.registerMedicine(requestDto);

        } catch (Exception e) {
            log.error("Medicine register error: ", e);
            return ResponseEntity.badRequest().body(Map.of("retCode", "92", "userMsg", "요청 형식 오류"));
        }

        if (!"10".equals(response.get("retCode"))) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    /**
     * 나의 약통 목록 조회
     */
    @GetMapping("/list")
    public ResponseEntity<Map<String, Object>> getMedicineList(@RequestParam(value = "status", required = false) String status) {
        Map<String, Object> response = medicineService.getMedicineList(status);

        if (!"10".equals(response.get("retCode"))) {
            return ResponseEntity.internalServerError().body(response);
        }
        return ResponseEntity.ok(response);
    }

    /**
     * 약품 상세 조회
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getMedicineDetail(@PathVariable("id") String id) {
        Map<String, Object> response = medicineService.getMedicineDetail(id);
        if (!"10".equals(response.get("retCode"))) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    /**
     * 약품 정보 수정
     */
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateMedicine(@PathVariable("id") String id, @RequestBody Map<String, Object> requestMap) {
        Map<String, Object> response;
        try {
            String payload = (String) requestMap.get("payload");
            if (payload == null) {
                return ResponseEntity.badRequest().body(Map.of("retCode", "98", "userMsg", "Payload 없음"));
            }

            String decodedJson = new String(Base64.getDecoder().decode(payload.trim()), StandardCharsets.UTF_8);
            MedicineDto requestDto = objectMapper.readValue(decodedJson, MedicineDto.class);

            response = medicineService.updateMedicine(id, requestDto);

        } catch (Exception e) {
            log.error("Medicine update error: ", e);
            return ResponseEntity.badRequest().body(Map.of("retCode", "92", "userMsg", "요청 형식 오류"));
        }

        if (!"10".equals(response.get("retCode"))) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    /**
     * 약품 삭제
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteMedicine(@PathVariable("id") String id) {
        Map<String, Object> response = medicineService.deleteMedicine(id);
        if (!"10".equals(response.get("retCode"))) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    /**
     * 유통기한 임박 알림 조회
     */
    @GetMapping("/expiry/alerts")
    public ResponseEntity<Map<String, Object>> getExpiryAlerts() {
        Map<String, Object> response = medicineService.getExpiryAlerts();
        if (!"10".equals(response.get("retCode"))) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }
}