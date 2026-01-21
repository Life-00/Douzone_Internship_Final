package com.mymedicine.myson_backend.mapper;

import com.mymedicine.myson_backend.dto.RecallMedicineDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 의약품 회수/판매중지 정보 조회 매퍼
 */
@Mapper
public interface RecallMapper {

    /**
     * 회수 대상 약품 조회
     * 사용자의 보유 약품 목록(itemSeqList) 중 회수 대상인 항목들을 조회합니다.
     */
    List<RecallMedicineDto> findRecallDetailsByItemSeq(@Param("itemSeqList") List<String> itemSeqList);
}
