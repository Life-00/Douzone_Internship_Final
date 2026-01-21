package com.mymedicine.myson_backend.controller;

import com.mymedicine.myson_backend.service.TestService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 시스템 상태 확인용 테스트 컨트롤러
 */
@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
public class TestController {

    private final TestService testService;

    @GetMapping("/db")
    public String dbTest() {
        return "DB SAYS: " + testService.getDbTime();
    }

    @GetMapping("/hello")
    public String helloTest() {
        return "SERVER SAYS: Hello, World!";
    }
}