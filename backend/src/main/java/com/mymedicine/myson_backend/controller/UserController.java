package com.mymedicine.myson_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mymedicine.myson_backend.dto.LoginRequestDto;
import com.mymedicine.myson_backend.dto.UserRegisterRequestDto;
import com.mymedicine.myson_backend.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie; // [★중요★]
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final ObjectMapper objectMapper;


    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, Object> requestMap) {
        Map<String, Object> response;
        try {
            String payload = (String) requestMap.get("payload");
            if (payload == null) return ResponseEntity.badRequest().body(Map.of("retCode", "98"));
            String decodedJson = new String(Base64.getDecoder().decode(payload.trim()), StandardCharsets.UTF_8);
            UserRegisterRequestDto requestDto = objectMapper.readValue(decodedJson, UserRegisterRequestDto.class);
            response = userService.registerUser(requestDto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("retCode", "92"));
        }
        return ResponseEntity.ok(response);
    }

    /**
     * [★수정★] 로그인 API - ResponseCookie 사용
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(
            @RequestBody Map<String, Object> requestMap,
            HttpServletResponse httpResponse
    ) {
        Map<String, Object> response;
        try {
            String payload = (String) requestMap.get("payload");
            if (payload == null) return ResponseEntity.badRequest().body(Map.of("retCode", "98"));

            String decodedJson = new String(Base64.getDecoder().decode(payload.trim()), StandardCharsets.UTF_8);
            LoginRequestDto requestDto = objectMapper.readValue(decodedJson, LoginRequestDto.class);

            response = userService.login(requestDto);

            if ("10".equals(response.get("retCode"))) {
                String token = (String) response.get("token");


                ResponseCookie cookie = ResponseCookie.from("accessToken", token)
                        .path("/")
                        .sameSite("Lax")      // [중요] 서로 다른 포트 간 쿠키 허용을 위해 Lax 또는 None 설정
                        .httpOnly(true)       // JS 접근 불가
                        .secure(false)        // 로컬(http) 환경이므로 false. (https 배포 시 true로 변경)
                        .maxAge(24 * 60 * 60) // 24시간
                        .build();


                httpResponse.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

                response.remove("token"); // Body에서는 제거
            }

        } catch (Exception e) {
            log.error("Login error: ", e);
            return ResponseEntity.badRequest().body(Map.of("retCode", "92"));
        }

        if (!"10".equals(response.get("retCode"))) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        return ResponseEntity.ok(response);
    }


    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(HttpServletResponse httpResponse) {
        ResponseCookie cookie = ResponseCookie.from("accessToken", "")
                .path("/")
                .sameSite("Lax")
                .httpOnly(true)
                .secure(false)
                .maxAge(0)
                .build();

        httpResponse.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(Map.of("retCode", "10", "userMsg", "로그아웃 되었습니다."));
    }


    @PutMapping("/pregnant")
    public ResponseEntity<Map<String, Object>> updatePregnantStatus(@RequestParam("status") String status) {
        Map<String, Object> response = userService.updatePregnantStatus(status);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getMyInfo() {
        Map<String, Object> response = userService.getMyInfo();
        return ResponseEntity.ok(response);
    }
}