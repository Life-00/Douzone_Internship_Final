package com.mymedicine.myson_backend.service;

import com.mymedicine.myson_backend.dto.LoginRequestDto;
import com.mymedicine.myson_backend.dto.UserRegisterRequestDto;

import java.util.Map;

/**
 * 사용자 관리 서비스 인터페이스
 */
public interface UserService {

    /**
     * 회원가입
     * @param requestDto 가입 요청 정보
     * @return 처리 결과
     */
    Map<String, Object> registerUser(UserRegisterRequestDto requestDto);

    /**
     * 로그인
     * @param requestDto 로그인 요청 정보
     * @return 토큰 및 사용자 정보
     */
    Map<String, Object> login(LoginRequestDto requestDto);

    /**
     * 임신 여부 상태 변경
     * @param isPregnant "Y" or "N"
     * @return 변경 결과
     */
    Map<String, Object> updatePregnantStatus(String isPregnant);

    /**
     * 내 정보 조회
     * @return 사용자 상세 정보
     */
    Map<String, Object> getMyInfo();
}