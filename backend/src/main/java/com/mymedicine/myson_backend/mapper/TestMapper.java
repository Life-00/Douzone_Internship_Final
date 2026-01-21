package com.mymedicine.myson_backend.mapper;

import org.apache.ibatis.annotations.Mapper;

/**
 * 시스템 연결 상태 확인용 테스트 매퍼
 */
@Mapper
public interface TestMapper {
    String getDbTime();
}