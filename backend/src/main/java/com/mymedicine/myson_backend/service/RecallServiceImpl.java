package com.mymedicine.myson_backend.service;

import com.mymedicine.myson_backend.dto.MedicineDto;
import com.mymedicine.myson_backend.dto.RecallMedicineDto;
import com.mymedicine.myson_backend.mapper.MedicineMapper;
import com.mymedicine.myson_backend.mapper.RecallMapper;
import com.mymedicine.myson_backend.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class RecallServiceImpl implements RecallService {

    private final MedicineMapper medicineMapper;
    private final RecallMapper recallMapper;

    private String getAuthenticatedUserKey() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails)) {
            throw new SecurityException("인증 정보가 없습니다.");
        }
        return ((CustomUserDetails) authentication.getPrincipal()).getUserDto().getTblkey();
    }

    @Override
    public Map<String, Object> getRecallMedicineAlerts() {
        Map<String, Object> response = new HashMap<>();

        try {
            String currentUserKey = getAuthenticatedUserKey();
            List<MedicineDto> userMedicineList = medicineMapper.findMedicineListByUserKey(currentUserKey, null);

            if (userMedicineList.isEmpty()) {
                return Map.of("retCode", "10", "recallCount", 0, "recallList", Collections.emptyList());
            }

            List<String> itemSeqList = userMedicineList.stream()
                    .map(MedicineDto::getMedItemSeq)
                    .filter(seq -> seq != null && !seq.isEmpty())
                    .collect(Collectors.toList());

            if (itemSeqList.isEmpty()) {
                return Map.of("retCode", "10", "recallCount", 0, "recallList", Collections.emptyList());
            }

            List<RecallMedicineDto> recallDetails = recallMapper.findRecallDetailsByItemSeq(itemSeqList);

            response.put("retCode", "10");
            response.put("recallCount", recallDetails.size());
            response.put("recallList", recallDetails);

        } catch (Exception e) {
            log.error("Recall Alert Error", e);
            response.put("retCode", "99");
            response.put("userMsg", "회수 정보 조회 중 오류가 발생했습니다.");
        }

        return response;
    }
}
