package com.mymedicine.myson_backend.service;

import com.mymedicine.myson_backend.dto.PharmacyMapDto;
import com.mymedicine.myson_backend.dto.PublicMedicineDto;
import com.mymedicine.myson_backend.dto.PublicSearchRequestDto;
import com.mymedicine.myson_backend.mapper.MapBatchMapper;
import com.mymedicine.myson_backend.mapper.PublicSearchMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class PublicSearchServiceImpl implements PublicSearchService {

    private final PublicSearchMapper publicSearchMapper;
    private final MapBatchMapper mapBatchMapper;

    @Override
    public Map<String, Object> searchPublicMedicine(PublicSearchRequestDto requestDto) {
        Map<String, Object> response = new HashMap<>();

        String finalShape = "기타".equals(requestDto.getDrugShape()) ? requestDto.getDrugShapeOther() : requestDto.getDrugShape();
        String finalColor = "기타".equals(requestDto.getColorClass1()) ? requestDto.getColorClass1Other() : requestDto.getColorClass1();

        Map<String, String> searchParams = new HashMap<>();
        searchParams.put("itemName", requestDto.getItemName());
        searchParams.put("drugShape", finalShape);
        searchParams.put("colorClass1", finalColor);
        searchParams.put("printFront", requestDto.getPrintFront());
        searchParams.put("printBack", requestDto.getPrintBack());

        log.debug("Search Params: {}", searchParams);

        try {
            List<PublicMedicineDto> resultList = publicSearchMapper.searchByCriteria(searchParams);
            response.put("retCode", "10");
            response.put("userMsg", resultList.size() + "건 조회 성공");
            response.put("searchResultList", resultList);
        } catch (Exception e) {
            log.error("Search Medicine Error", e);
            response.put("retCode", "99");
            response.put("userMsg", "검색 중 서버 오류 발생");
        }

        return response;
    }

    @Override
    public Map<String, Object> getMapDataList() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<PharmacyMapDto> mapDataList = mapBatchMapper.findAllMapData();
            response.put("retCode", "10");
            response.put("mapDataList", mapDataList);
        } catch (Exception e) {
            log.error("Get Map Data Error", e);
            response.put("retCode", "99");
            response.put("userMsg", "지도 데이터 조회 오류");
        }
        return response;
    }
}
