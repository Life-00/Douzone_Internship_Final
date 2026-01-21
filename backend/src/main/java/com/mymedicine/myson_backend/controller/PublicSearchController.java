package com.mymedicine.myson_backend.controller;

import com.mymedicine.myson_backend.dto.PublicSearchRequestDto;
import com.mymedicine.myson_backend.service.PublicSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * 공공데이터(약품, 지도) 검색용 API 컨트롤러 (비인증 허용)
 */
@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicSearchController {

    private final PublicSearchService publicSearchService;

    /**
     * 공공데이터 약품 검색
     */
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchMedicine(@ModelAttribute PublicSearchRequestDto requestDto) {
        Map<String, Object> response = publicSearchService.searchPublicMedicine(requestDto);

        if (!"10".equals(response.get("retCode"))) {
            return ResponseEntity.internalServerError().body(response);
        }
        return ResponseEntity.ok(response);
    }

    /**
     * 지도 데이터(수거함 등) 조회
     */
    @GetMapping("/map/list")
    public ResponseEntity<Map<String, Object>> getMapDataList() {
        Map<String, Object> response = publicSearchService.getMapDataList();

        if (!"10".equals(response.get("retCode"))) {
            return ResponseEntity.internalServerError().body(response);
        }
        return ResponseEntity.ok(response);
    }
}
