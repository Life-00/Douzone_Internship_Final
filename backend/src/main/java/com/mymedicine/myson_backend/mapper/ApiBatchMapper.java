package com.mymedicine.myson_backend.mapper;

import com.mymedicine.myson_backend.dto.DurBanDto;
import com.mymedicine.myson_backend.dto.DurPregnantBanDto;
import com.mymedicine.myson_backend.dto.PublicMedicineDto;
import com.mymedicine.myson_backend.dto.RecallMedicineDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * 공공데이터 API 배치(Batch) 작업용 매퍼
 * 낱알 식별 정보, 회수 정보, DUR 정보 등을 대량 적재합니다.
 */
@Mapper
public interface ApiBatchMapper {

    // --- 낱알 식별 정보 ---
    int upsertPublicMedicineList(List<PublicMedicineDto> medicineList);
    void deleteAllPublicMedicine();

    // --- 회수/판매중지 정보 ---
    int upsertRecallMedicineList(List<RecallMedicineDto> recallList);
    void deleteAllRecallMedicine();

    // --- 병용 금기(DUR) 정보 ---
    int upsertDurBanList(List<DurBanDto> durList);
    void deleteAllDurBan();

    // --- 임부 금기 정보 ---
    int upsertPregnantBanList(List<DurPregnantBanDto> list);
    void deleteAllPregnantBan();
}
