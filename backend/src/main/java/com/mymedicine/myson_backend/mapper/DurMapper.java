package com.mymedicine.myson_backend.mapper;

import com.mymedicine.myson_backend.dto.DurBanDto;
import com.mymedicine.myson_backend.dto.DurPregnantBanDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * DUR (의약품 안전 사용 서비스) 관련 매퍼
 */
@Mapper
public interface DurMapper {

    /**
     * 병용 금기 체크
     * 새로 추가하려는 약품(newItemSeq)과 사용자가 보유한 약품 목록(myDrugSeqs) 간의 금기 여부를 조회합니다.
     */
    List<DurBanDto> checkDurBan(
            @Param("newItemSeq") String newItemSeq,
            @Param("myDrugSeqs") List<String> myDrugSeqs
    );

    /**
     * 임부 금기 체크
     * 특정 약품(newItemSeq)이 임부 금기 약품인지 조회합니다.
     */
    DurPregnantBanDto checkPregnantBan(@Param("newItemSeq") String newItemSeq);
}