package com.mymedicine.myson_backend.mapper;

import com.mymedicine.myson_backend.dto.ReminderDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 알림 설정 (TBL_REMINDER) 매퍼 인터페이스
 */
@Mapper
public interface ReminderMapper {

    /**
     * 특정 약품에 대한 알림 설정 조회
     */
    ReminderDto findReminderByMedKey(
            @Param("userKey") String userKey,
            @Param("medKey") String medKey
    );

    /**
     * 사용자의 모든 알림 설정 목록 조회
     */
    List<ReminderDto> findAllRemindersByUserKey(@Param("userKey") String userKey);

    /**
     * 알림 설정 등록 (Insert)
     */
    int insertReminder(ReminderDto reminderDto);

    /**
     * 알림 설정 수정 (Update)
     */
    int updateReminder(ReminderDto reminderDto);
}
