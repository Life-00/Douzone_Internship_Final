package com.mymedicine.myson_backend.controller;

import com.mymedicine.myson_backend.service.ApiBatchService;
import com.mymedicine.myson_backend.service.MapBatchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * 공공데이터 수집 및 적재용 배치 컨트롤러
 * TODO: 운영 배포 시 Admin 권한 검증 로직 추가 필요
 */
@Slf4j
@RestController
@RequestMapping("/api/batch")
@RequiredArgsConstructor
public class ApiBatchController {

    private final ApiBatchService apiBatchService;
    private final MapBatchService mapBatchService;

    /**
     * 낱알 식별 정보 적재
     */
    @GetMapping("/load-public-data")
    public ResponseEntity<Map<String, Object>> loadPublicData(@RequestParam(value = "pageNo", defaultValue = "1") int pageNo) {
        try {
            int count = apiBatchService.loadAndStorePublicData(pageNo);
            return ResponseEntity.ok(Map.of("retCode", "10", "userMsg", count + "건 적재 완료 (페이지: " + pageNo + ")"));
        } catch (Exception e) {
            log.error("Public data load failed: ", e);
            return ResponseEntity.internalServerError().body(Map.of("retCode", "99", "userMsg", "서버 오류: " + e.getMessage()));
        }
    }

    /**
     * 의약품 회수 정보 적재
     */
    @GetMapping("/load-recall-data")
    public ResponseEntity<Map<String, Object>> loadRecallData(@RequestParam(value = "pageNo", defaultValue = "1") int pageNo) {
        try {
            int count = apiBatchService.loadAndStoreRecallData(pageNo);
            return ResponseEntity.ok(Map.of("retCode", "10", "userMsg", count + "건 적재 완료 (페이지: " + pageNo + ")"));
        } catch (Exception e) {
            log.error("Recall data load failed: ", e);
            return ResponseEntity.internalServerError().body(Map.of("retCode", "99", "userMsg", "서버 오류: " + e.getMessage()));
        }
    }

    /**
     * 병용 금기(DUR) 정보 적재
     */
    @GetMapping("/load-dur-data")
    public ResponseEntity<Map<String, Object>> loadDurData(@RequestParam(value = "pageNo", defaultValue = "1") int pageNo) {
        try {
            int count = apiBatchService.loadAndStoreDurData(pageNo);
            return ResponseEntity.ok(Map.of("retCode", "10", "userMsg", count + "건 적재 완료 (페이지: " + pageNo + ")"));
        } catch (Exception e) {
            log.error("DUR data load failed: ", e);
            return ResponseEntity.internalServerError().body(Map.of("retCode", "99", "userMsg", "서버 오류: " + e.getMessage()));
        }
    }

    @GetMapping("/load-dur-all")
    public ResponseEntity<Map<String, Object>> loadDurAll() {
        apiBatchService.runDurDataBatch();
        return ResponseEntity.ok(Map.of("retCode", "10", "userMsg", "DUR 전체 적재 백그라운드 작업 시작"));
    }

    @GetMapping("/load-pregnant-all")
    public ResponseEntity<Map<String, Object>> loadPregnantAll() {
        apiBatchService.runPregnantBanBatch();
        return ResponseEntity.ok(Map.of("retCode", "10", "userMsg", "임부금기 전체 적재 백그라운드 작업 시작"));
    }

    @GetMapping("/load-map-data")
    public ResponseEntity<Map<String, Object>> loadMapData(@RequestParam(value = "pageNo", defaultValue = "1") int pageNo) {
        try {
            int count = mapBatchService.loadAndStoreMapData(pageNo);
            return ResponseEntity.ok(Map.of("retCode", "10", "userMsg", count + "건 적재 완료 (페이지: " + pageNo + ")"));
        } catch (Exception e) {
            log.error("Map data load failed: ", e);
            return ResponseEntity.internalServerError().body(Map.of("retCode", "99", "userMsg", "서버 오류: " + e.getMessage()));
        }
    }

    /**
     * 통합 데이터 초기화
     */
    @GetMapping("/clear-public-data")
    public ResponseEntity<Map<String, Object>> clearPublicData() {
        try {
            apiBatchService.clearPublicData();
            mapBatchService.clearMapData();
            return ResponseEntity.ok(Map.of("retCode", "10", "userMsg", "공공데이터 초기화 완료"));
        } catch (Exception e) {
            log.error("Data clear failed: ", e);
            return ResponseEntity.internalServerError().body(Map.of("retCode", "99", "userMsg", "서버 오류: " + e.getMessage()));
        }
    }
}
