package com.mymedicine.myson_backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mymedicine.myson_backend.dto.PharmacyMapDto;
import com.mymedicine.myson_backend.mapper.MapBatchMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class MapBatchServiceImpl implements MapBatchService {

    private final MapBatchMapper mapBatchMapper;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    private final String MAP_API_URL = "https://www.seogu.go.kr/seoguAPI/3660000/getDuseMdcnTkawyBx";

    @Override
    // [★수정★] API 호출 시에는 Transaction 제외
    public int loadAndStoreMapData(int pageNo) throws Exception {
        URI uri = UriComponentsBuilder.fromHttpUrl(MAP_API_URL)
                .queryParam("pageNo", pageNo)
                .queryParam("numOfRows", 100)
                .queryParam("type", "json")
                .build().toUri();

        log.info("[MapBatch] Calling API: {}", uri);
        String jsonResponse = restTemplate.getForObject(uri, String.class);

        // 데이터 파싱
        List<PharmacyMapDto> mapDataList = parseMapData(jsonResponse);

        if (mapDataList.isEmpty()) return 0;

        // DB 저장 (트랜잭션)
        return saveMapData(pageNo, mapDataList);
    }

    private List<PharmacyMapDto> parseMapData(String jsonResponse) throws Exception {
        JsonNode rootNode = objectMapper.readTree(jsonResponse);
        JsonNode itemsNode = rootNode.path("response").path("body").path("items");

        List<PharmacyMapDto> list = new ArrayList<>();
        if (itemsNode.isArray()) {
            for (JsonNode item : itemsNode) {
                list.add(objectMapper.treeToValue(item, PharmacyMapDto.class));
            }
        } else if (itemsNode.isObject()) {
            list.add(objectMapper.treeToValue(itemsNode, PharmacyMapDto.class));
        }

        String adddate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS"));
        for (PharmacyMapDto dto : list) {
            dto.setTblkey(UUID.randomUUID().toString().replace("-", ""));
            dto.setAdddate(adddate);
        }
        return list;
    }

    @Transactional
    protected int saveMapData(int pageNo, List<PharmacyMapDto> list) {
        if (pageNo == 1) {
            mapBatchMapper.deleteAllMapData();
        }
        int rows = mapBatchMapper.insertMapDataList(list);
        log.info("[MapBatch] Page {}: Inserted {} rows", pageNo, rows);
        return rows;
    }

    @Override
    @Transactional
    public void clearMapData() {
        log.info("[MapBatch] Clearing all map data...");
        mapBatchMapper.deleteAllMapData();
    }
}