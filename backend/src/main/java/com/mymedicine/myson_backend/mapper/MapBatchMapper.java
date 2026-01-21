package com.mymedicine.myson_backend.mapper;

import com.mymedicine.myson_backend.dto.PharmacyMapDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * 폐의약품 수거함 지도 데이터 배치 작업용 매퍼
 */
@Mapper
public interface MapBatchMapper {

    /**
     * 폐의약품 수거함 목록 대량 적재 (Bulk Insert)
     */
    int insertMapDataList(List<PharmacyMapDto> mapDataList);

    /**
     * 기존 수거함 데이터 전체 삭제 (초기화용)
     */
    void deleteAllMapData();

    /**
     * 적재된 모든 지도 데이터 조회
     */
    List<PharmacyMapDto> findAllMapData();
}