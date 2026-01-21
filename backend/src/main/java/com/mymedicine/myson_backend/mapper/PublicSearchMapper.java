package com.mymedicine.myson_backend.mapper;

import com.mymedicine.myson_backend.dto.PublicMedicineDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

/**
 * 공공데이터 약품 검색 매퍼
 */
@Mapper
public interface PublicSearchMapper {

    /**
     * 조건부 약품 검색 (Dynamic SQL 사용)
     * @param params 검색 조건 (itemName, drugShape, colorClass1 등)
     */
    List<PublicMedicineDto> searchByCriteria(Map<String, String> params);
}
