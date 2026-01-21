package com.mymedicine.myson_backend.service;

import com.mymedicine.myson_backend.dto.IntakeDto;
import com.mymedicine.myson_backend.dto.MedicineDto;
import com.mymedicine.myson_backend.mapper.IntakeMapper;
import com.mymedicine.myson_backend.mapper.MedicineMapper;
import com.mymedicine.myson_backend.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class IntakeServiceImpl implements IntakeService {

    private final IntakeMapper intakeMapper;
    private final MedicineMapper medicineMapper;

    private String getAuthenticatedUserKey() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails)) {
            throw new SecurityException("인증 정보가 없습니다.");
        }
        return ((CustomUserDetails) authentication.getPrincipal()).getUserDto().getTblkey();
    }

    @Override
    @Transactional
    public Map<String, Object> saveIntake(IntakeDto intakeDto) {
        Map<String, Object> response = new HashMap<>();
        try {
            String userKey = getAuthenticatedUserKey();
            intakeDto.setUserKey(userKey);

            if (intakeDto.getTblkey() == null || intakeDto.getTblkey().isEmpty()) {
                intakeDto.setTblkey(UUID.randomUUID().toString().replace("-", ""));
            }
            intakeDto.setAdddate(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS")));

            intakeMapper.upsertIntake(intakeDto);

            response.put("retCode", "10");
            response.put("userMsg", "복용 기록 저장 완료");
        } catch (Exception e) {
            log.error("Intake Save Error", e);
            response.put("retCode", "99");
            response.put("userMsg", "저장 중 오류 발생");
        }
        return response;
    }

    @Override
    public Map<String, Object> getDailyIntakeStatus(String date) {
        Map<String, Object> response = new HashMap<>();
        try {
            String userKey = getAuthenticatedUserKey();
            List<MedicineDto> allMeds = medicineMapper.findMedicineListByUserKey(userKey, null);
            List<IntakeDto> history = intakeMapper.findIntakeHistoryByDate(userKey, date);

            List<Map<String, Object>> resultList = new ArrayList<>();

            for (MedicineDto med : allMeds) {
                if (!"보관중".equals(med.getStatus())) continue;

                Map<String, Object> item = new HashMap<>();
                item.put("medId", med.getTblkey());
                item.put("medName", med.getMedItemName());
                item.put("alias", med.getAlias());

                IntakeDto record = history.stream()
                        .filter(h -> h.getMedKey().equals(med.getTblkey()))
                        .findFirst()
                        .orElse(null);

                item.put("isTaken", record != null && "Y".equals(record.getIsTaken()));
                resultList.add(item);
            }

            response.put("retCode", "10");
            response.put("dailyList", resultList);

        } catch (Exception e) {
            log.error("Get Daily Intake Error", e);
            response.put("retCode", "99");
            response.put("userMsg", "조회 중 오류 발생");
        }
        return response;
    }
}
