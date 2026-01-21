package com.mymedicine.myson_backend.service;

import com.mymedicine.myson_backend.dto.DurBanDto;
import com.mymedicine.myson_backend.dto.DurPregnantBanDto;
import com.mymedicine.myson_backend.dto.MedicineDto;
import com.mymedicine.myson_backend.dto.UserDto;
import com.mymedicine.myson_backend.mapper.DurMapper;
import com.mymedicine.myson_backend.mapper.MedicineMapper;
import com.mymedicine.myson_backend.mapper.UserMapper;
import com.mymedicine.myson_backend.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DurServiceImpl implements DurService {

    private final DurMapper durMapper;
    private final MedicineMapper medicineMapper;
    private final UserMapper userMapper;

    private String getAuthenticatedUserKey() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails)) {
            throw new SecurityException("인증 정보가 없습니다.");
        }
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return userDetails.getUserDto().getTblkey();
    }

    @Override
    public Map<String, Object> checkDur(String newItemSeq) {
        Map<String, Object> response = new HashMap<>();
        String userKey;

        try {
            userKey = getAuthenticatedUserKey();
        } catch (Exception e) {
            response.put("retCode", "96");
            return response;
        }

        try {
            List<Map<String, Object>> violationList = new ArrayList<>();

            // 1. 임부 금기 체크
            UserDto user = userMapper.findByTblKey(userKey);
            boolean isPregnant = user != null && "Y".equals(user.getIsPregnant());

            if (isPregnant) {
                DurPregnantBanDto pregnantBan = durMapper.checkPregnantBan(newItemSeq);
                if (pregnantBan != null) {
                    Map<String, Object> violation = new HashMap<>();
                    violation.put("type", "PREGNANT");
                    violation.put("typeName", pregnantBan.getTypeName());
                    violation.put("reason", pregnantBan.getProhbtContent());
                    violation.put("conflictingDrugName", pregnantBan.getItemName());
                    violationList.add(violation);
                }
            }

            // 2. 병용 금기 체크
            List<MedicineDto> myMeds = medicineMapper.findMedicineListByUserKey(userKey, "보관중");
            List<String> myDrugSeqs = myMeds.stream()
                    .map(MedicineDto::getMedItemSeq)
                    .filter(seq -> seq != null && !seq.isEmpty())
                    .collect(Collectors.toList());

            if (!myDrugSeqs.isEmpty()) {
                List<DurBanDto> conflicts = durMapper.checkDurBan(newItemSeq, myDrugSeqs);

                if (!conflicts.isEmpty()) {
                    DurBanDto conflict = conflicts.get(0);
                    Map<String, Object> violation = new HashMap<>();
                    violation.put("type", "COMBINATION");

                    boolean isNewItemTarget = conflict.getTargetItemSeq().equals(newItemSeq);
                    String conflictDrugName = isNewItemTarget ? conflict.getMainItemName() : conflict.getTargetItemName();

                    violation.put("conflictingDrugName", conflictDrugName);
                    violation.put("reason", conflict.getProhbtContent());
                    violationList.add(violation);
                }
            }

            if (!violationList.isEmpty()) {
                response.put("retCode", "10");
                response.put("hasConflict", true);
                response.put("violationList", violationList);
            } else {
                response.put("retCode", "10");
                response.put("hasConflict", false);
            }

        } catch (Exception e) {
            log.error("DUR Check Error", e);
            response.put("retCode", "99");
            response.put("userMsg", "DUR 검사 중 오류 발생: " + e.getMessage());
        }

        return response;
    }
}
