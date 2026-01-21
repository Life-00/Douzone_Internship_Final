package com.mymedicine.myson_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 의약품 회수·판매중지 정보 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecallMedicineDto {

    // DB 적재용 필드 (Camel Case)
    private Long tblkey;
    private String itemSeq;             // 품목기준코드
    private String productName;         // 품목명
    private String entpName;            // 업체명
    private String recallReason;        // 회수 사유
    private String commandDate;         // 회수 명령 일자 (YYYYMMDD)
    private String enfrcYn;             // 강제 여부
    private String addDate;             // 등록 일자

    // --- 공공 API 응답 매핑용 내부 클래스 (Snake Case 유지) ---

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Item {
        private String PRDUCT;
        private String ENTRPS;
        private String RTRVL_RESN;
        private String RECALL_COMMAND_DATE;
        private String ENFRC_YN;
        private String ITEM_SEQ;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Items {
        private Item[] item;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Body {
        private int numOfRows;
        private int pageNo;
        private int totalCount;
        private Items items;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Header {
        private String resultCode;
        private String resultMsg;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Header header;
        private Body body;
    }
}
