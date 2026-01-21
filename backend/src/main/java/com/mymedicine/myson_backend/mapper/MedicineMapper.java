package com.mymedicine.myson_backend.mapper;

import com.mymedicine.myson_backend.dto.MedicineDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 나의 약통 (TBL_MEDICINE_CABINET) 매퍼 인터페이스
 * 사용자의 약품 등록, 조회, 수정, 삭제(CRUD)를 담당합니다.
 */
@Mapper
public interface MedicineMapper {

    /**
     * 약통에 새로운 약품 등록 (Create)
     */
    int insertMedicine(MedicineDto medicineDto);

    /**
     * 사용자 키를 기준으로 약통 목록 조회 (Read)
     * @param userKey 사용자 고유 키
     * @param status 필터링 상태 (null 또는 empty 시 전체 조회)
     */
    List<MedicineDto> findMedicineListByUserKey(
            @Param("userKey") String userKey,
            @Param("status") String status
    );

    /**
     * 단일 약품 상세 조회 (Read)
     */
    MedicineDto findMedicineByIdAndUserKey(
            @Param("tblkey") String tblkey,
            @Param("userKey") String userKey
    );

    /**
     * 약품 정보 수정 (Update)
     */
    int updateMedicine(MedicineDto medicineDto);

    /**
     * 약품 삭제 (Delete)
     */
    int deleteMedicine(
            @Param("tblkey") String tblkey,
            @Param("userKey") String userKey
    );
}