package com.mymedicine.myson_backend.service;

import com.mymedicine.myson_backend.mapper.TestMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * 시스템 연결 상태 확인용 테스트 서비스
 */
@Service
@RequiredArgsConstructor
public class TestService {

    private final TestMapper testMapper;

    /**
     * DB 현재 시간 조회
     */
    public String getDbTime() {
        return testMapper.getDbTime();
    }
}
