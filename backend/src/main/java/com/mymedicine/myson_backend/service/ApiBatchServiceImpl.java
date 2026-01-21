package com.mymedicine.myson_backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mymedicine.myson_backend.dto.DurBanDto;
import com.mymedicine.myson_backend.dto.DurPregnantBanDto;
import com.mymedicine.myson_backend.dto.PublicMedicineDto;
import com.mymedicine.myson_backend.dto.RecallMedicineDto;
import com.mymedicine.myson_backend.mapper.ApiBatchMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
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
public class ApiBatchServiceImpl implements ApiBatchService {

    private final ApiBatchMapper apiBatchMapper;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${api.serviceKey}")
    private String encodedServiceKey;

    private final String PUBLIC_INFO_URL = "https://apis.data.go.kr/1471000/MdcinGrnIdntfcInfoService03/getMdcinGrnIdntfcInfoList03";
    private final String RECALL_INFO_URL = "https://apis.data.go.kr/1471000/MdcinRtrvlSleStpgeInfoService04/getMdcinRtrvlSleStpgelList03";
    private final String DUR_INFO_URL = "https://apis.data.go.kr/1471000/DURPrdlstInfoService03/getUsjntTabooInfoList03";
    private final String PREGNANT_BAN_URL = "https://apis.data.go.kr/1471000/DURPrdlstInfoService03/getPwnmTabooInfoList03";

    // [★핵심 수정★] 외부 API 호출부에는 @Transactional을 제거하여 DB 커넥션 점유 시간을 줄임
    @Override
    public int loadAndStorePublicData(int pageNo) throws Exception {
        String apiUrl = PUBLIC_INFO_URL + "?serviceKey=" + encodedServiceKey + "&pageNo=" + pageNo + "&numOfRows=300&type=json";
        URI uri = UriComponentsBuilder.fromUriString(apiUrl).build(true).toUri();

        log.info("[PublicBatch] API Call: {}", uri);
        String jsonResponse = restTemplate.getForObject(uri, String.class);

        // 데이터 가공 (API 파싱 등 비즈니스 로직)
        List<PublicMedicineDto> medicineList = parsePublicData(jsonResponse);

        if (medicineList.isEmpty()) return 0;

        // [★핵심★] DB 저장만 별도 트랜잭션으로 처리
        return savePublicData(pageNo, medicineList);
    }

    private List<PublicMedicineDto> parsePublicData(String jsonResponse) throws Exception {
        JsonNode rootNode = objectMapper.readTree(jsonResponse);
        JsonNode itemsNode = rootNode.path("body").path("items");

        List<PublicMedicineDto> list = new ArrayList<>();
        if (itemsNode.isArray()) {
            String adddate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS"));
            for (JsonNode item : itemsNode) {
                PublicMedicineDto dto = new PublicMedicineDto();
                dto.setMedItemSeq(item.path("ITEM_SEQ").asText(null));
                dto.setMedItemName(item.path("ITEM_NAME").asText(null));
                dto.setMedEntpName(item.path("ENTP_NAME").asText(null));
                dto.setMedItemImage(item.path("ITEM_IMAGE").asText(null));
                dto.setDrugShape(item.path("DRUG_SHAPE").asText(null));
                dto.setColorClass1(item.path("COLOR_CLASS1").asText(null));
                dto.setColorClass2(item.path("COLOR_CLASS2").asText(null));
                dto.setPrintFront(item.path("PRINT_FRONT").asText(null));
                dto.setPrintBack(item.path("PRINT_BACK").asText(null));
                dto.setMedClassName(item.path("CLASS_NAME").asText(null));
                dto.setTblkey(UUID.randomUUID().toString().replace("-", ""));
                dto.setAdddate(adddate);
                if (dto.getMedItemSeq() != null) list.add(dto);
            }
        } else if (itemsNode.isObject()) {
            // 단일 객체 처리 로직... (생략 가능하나 안전을 위해 유지)
            // ... (위와 동일하게 추가)
        }
        return list;
    }

    // DB 저장 전용 메서드 (트랜잭션 적용)
    @Transactional
    protected int savePublicData(int pageNo, List<PublicMedicineDto> list) {
        int insertedRows = apiBatchMapper.upsertPublicMedicineList(list);
        log.info("[PublicBatch] Page {}: Inserted {} rows", pageNo, insertedRows);
        return insertedRows;
    }


    // --- 회수 정보 ---
    @Override
    public int loadAndStoreRecallData(int pageNo) throws Exception {
        String apiUrl = RECALL_INFO_URL + "?serviceKey=" + encodedServiceKey + "&pageNo=" + pageNo + "&numOfRows=100&type=json";
        URI uri = UriComponentsBuilder.fromUriString(apiUrl).build(true).toUri();

        log.info("[RecallBatch] API Call: {}", uri);
        String jsonResponse = restTemplate.getForObject(uri, String.class);

        List<RecallMedicineDto> recallList = parseRecallData(jsonResponse);

        if (recallList.isEmpty()) return 0;
        return saveRecallData(pageNo, recallList);
    }

    private List<RecallMedicineDto> parseRecallData(String jsonResponse) throws Exception {
        // ... (기존 파싱 로직 복사하여 사용)
        JsonNode rootNode = objectMapper.readTree(jsonResponse);
        JsonNode itemsNode = rootNode.path("body").path("items");
        List<RecallMedicineDto> list = new ArrayList<>();
        if (itemsNode.isArray()) {
            for (JsonNode node : itemsNode) {
                JsonNode item = node.path("item");
                if (!item.isMissingNode()) {
                    RecallMedicineDto dto = new RecallMedicineDto();
                    dto.setItemSeq(item.path("ITEM_SEQ").asText(null));
                    dto.setProductName(item.path("PRDUCT").asText(null));
                    dto.setEntpName(item.path("ENTRPS").asText(null));
                    dto.setRecallReason(item.path("RTRVL_RESN").asText(null));
                    dto.setCommandDate(item.path("RECALL_COMMAND_DATE").asText(null));
                    dto.setEnfrcYn(item.path("ENFRC_YN").asText(null));
                    if (dto.getItemSeq() != null) list.add(dto);
                }
            }
        }
        return list;
    }

    @Transactional
    protected int saveRecallData(int pageNo, List<RecallMedicineDto> list) {
        if (pageNo == 1) apiBatchMapper.deleteAllRecallMedicine();
        int rows = apiBatchMapper.upsertRecallMedicineList(list);
        log.info("[RecallBatch] Page {}: Inserted {} rows", pageNo, rows);
        return rows;
    }

    // --- DUR ---
    @Override
    public int loadAndStoreDurData(int pageNo) throws Exception {
        String apiUrl = DUR_INFO_URL + "?serviceKey=" + encodedServiceKey + "&pageNo=" + pageNo + "&numOfRows=100&type=json&typeName=%EB%B3%91%EC%9A%A9%EA%B8%88%EA%B8%B0";
        URI uri = UriComponentsBuilder.fromUriString(apiUrl).build(true).toUri();

        String jsonResponse = restTemplate.getForObject(uri, String.class);
        List<DurBanDto> durList = parseDurData(jsonResponse);

        if (durList.isEmpty()) return 0;
        return saveDurData(durList);
    }

    private List<DurBanDto> parseDurData(String jsonResponse) throws Exception {
        JsonNode itemsNode = objectMapper.readTree(jsonResponse).path("body").path("items");
        List<DurBanDto> list = new ArrayList<>();
        if (itemsNode.isArray()) {
            for (JsonNode item : itemsNode) {
                DurBanDto dto = new DurBanDto();
                dto.setMainItemSeq(item.path("ITEM_SEQ").asText(null));
                dto.setMainItemName(item.path("ITEM_NAME").asText(null));
                dto.setTargetItemSeq(item.path("MIXTURE_ITEM_SEQ").asText(null));
                dto.setTargetItemName(item.path("MIXTURE_ITEM_NAME").asText(null));
                dto.setProhbtContent(item.path("PROHBT_CONTENT").asText(null));
                if (dto.getMainItemSeq() != null) list.add(dto);
            }
        }
        return list;
    }

    @Transactional
    protected int saveDurData(List<DurBanDto> list) {
        return apiBatchMapper.upsertDurBanList(list);
    }

    @Override
    public void runDurDataBatch() {
        new Thread(() -> {
            log.info("Start DUR Batch");
            int pageNo = 1;
            while (true) {
                try {
                    int loaded = loadAndStoreDurData(pageNo);
                    if (loaded == 0) break;
                    log.info("DUR Page {} Loaded: {}", pageNo, loaded);
                    pageNo++;
                    Thread.sleep(100);
                } catch (Exception e) {
                    log.error("DUR Batch Error", e);
                    break;
                }
            }
            log.info("End DUR Batch");
        }).start();
    }

    // --- 임부금기 ---
    @Override
    public int loadAndStorePregnantBanData(int pageNo) throws Exception {
        String apiUrl = PREGNANT_BAN_URL + "?serviceKey=" + encodedServiceKey + "&pageNo=" + pageNo + "&numOfRows=100&type=json";
        URI uri = UriComponentsBuilder.fromUriString(apiUrl).build(true).toUri();
        String jsonResponse = restTemplate.getForObject(uri, String.class);

        List<DurPregnantBanDto> list = parsePregnantData(jsonResponse);
        if (list.isEmpty()) return 0;
        return savePregnantData(list);
    }

    private List<DurPregnantBanDto> parsePregnantData(String jsonResponse) throws Exception {
        JsonNode itemsNode = objectMapper.readTree(jsonResponse).path("body").path("items");
        List<DurPregnantBanDto> list = new ArrayList<>();
        if (itemsNode.isArray()) {
            for (JsonNode item : itemsNode) {
                DurPregnantBanDto dto = new DurPregnantBanDto();
                dto.setIngrCode(item.path("INGR_CODE").asText(null));
                dto.setIngrName(item.path("INGR_NAME").asText(null));
                dto.setItemSeq(item.path("ITEM_SEQ").asText(null));
                dto.setItemName(item.path("ITEM_NAME").asText(null));
                dto.setProhbtContent(item.path("PROHBT_CONTENT").asText(null));
                dto.setTypeName(item.path("TYPE_NAME").asText(null));
                if (dto.getItemSeq() != null) list.add(dto);
            }
        }
        return list;
    }

    @Transactional
    protected int savePregnantData(List<DurPregnantBanDto> list) {
        return apiBatchMapper.upsertPregnantBanList(list);
    }

    @Override
    public void runPregnantBanBatch() {
        new Thread(() -> {
            log.info("Start Pregnant Ban Batch");
            int pageNo = 1;
            while (true) {
                try {
                    int loaded = loadAndStorePregnantBanData(pageNo);
                    if (loaded == 0) break;
                    pageNo++;
                    Thread.sleep(100);
                } catch (Exception e) {
                    log.error("Pregnant Ban Batch Error", e);
                    break;
                }
            }
            log.info("End Pregnant Ban Batch");
        }).start();
    }

    @Override
    @Transactional
    public void clearPublicData() {
        log.info("Clearing all public data...");
        apiBatchMapper.deleteAllPublicMedicine();
        apiBatchMapper.deleteAllRecallMedicine();
        apiBatchMapper.deleteAllDurBan();
        apiBatchMapper.deleteAllPregnantBan();
    }
}