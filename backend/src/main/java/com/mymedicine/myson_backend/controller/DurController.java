package com.mymedicine.myson_backend.controller;

import com.mymedicine.myson_backend.service.DurService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 병용 금기(DUR) 체크 컨트롤러
 */
@RestController
@RequestMapping("/api/dur")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class DurController {

    private final DurService durService;

    /**
     * 병용 금기 여부 체크
     */
    @GetMapping("/check")
    public ResponseEntity<Map<String, Object>> checkDur(@RequestParam("itemSeq") String itemSeq) {
        Map<String, Object> response = durService.checkDur(itemSeq);
        return ResponseEntity.ok(response);
    }
}