package com.mymedicine.myson_backend.mapper;

import com.mymedicine.myson_backend.dto.IntakeDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 복용 관리 (TBL_INTAKE) 매퍼 인터페이스
 */
@Mapper
public interface IntakeMapper {

    /**
     * 복용 기록 저장 (Upsert: Insert or Update)
     */
    int upsertIntake(IntakeDto intakeDto);

    /**
     * 특정 날짜의 복용 이력 조회
     */
    List<IntakeDto> findIntakeHistoryByDate(
            @Param("userKey") String userKey,
            @Param("date") String date
    );
}
