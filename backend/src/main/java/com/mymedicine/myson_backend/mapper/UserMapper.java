package com.mymedicine.myson_backend.mapper;

import com.mymedicine.myson_backend.dto.UserDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * 사용자 정보(TBL_USER) 관리 매퍼
 */
@Mapper
public interface UserMapper {

    /**
     * 신규 회원 가입
     */
    int registerUser(UserDto userDto);

    /**
     * 사용자 ID로 조회 (로그인 등)
     */
    UserDto findByUserId(@Param("userId") String userId);

    /**
     * 사용자 고유 키(TBLKEY)로 조회
     */
    UserDto findByTblKey(@Param("tblkey") String tblkey);

    /**
     * 임신 여부 상태 업데이트
     */
    int updatePregnantStatus(
            @Param("userKey") String userKey,
            @Param("isPregnant") String isPregnant
    );
}