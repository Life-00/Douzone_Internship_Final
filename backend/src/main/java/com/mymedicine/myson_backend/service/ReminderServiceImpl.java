package com.mymedicine.myson_backend.service;

import com.mymedicine.myson_backend.dto.MedicineDto;
import com.mymedicine.myson_backend.dto.ReminderDto;
import com.mymedicine.myson_backend.mapper.MedicineMapper;
import com.mymedicine.myson_backend.mapper.ReminderMapper;
import com.mymedicine.myson_backend.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReminderServiceImpl implements ReminderService {

    private final ReminderMapper reminderMapper;
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
    public Map<String, Object> saveReminder(ReminderDto reminderDto) {
        Map<String, Object> response = new HashMap<>();
        try {
            String userKey = getAuthenticatedUserKey();
            String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS"));

            reminderDto.setUserKey(userKey);
            reminderDto.setTblkey(UUID.randomUUID().toString().replace("-", ""));
            reminderDto.setAdddate(now);
            reminderDto.setModifydate(now);

            reminderMapper.insertReminder(reminderDto);

            response.put("retCode", "10");
            response.put("userMsg", "알림 설정 저장 완료");
        } catch (Exception e) {
            log.error("Save Reminder Error", e);
            response.put("retCode", "99");
            response.put("userMsg", "저장 중 오류 발생");
        }
        return response;
    }

    @Override
    public Map<String, Object> getMyReminders() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<ReminderDto> reminders = reminderMapper.findAllRemindersByUserKey(getAuthenticatedUserKey());
            response.put("retCode", "10");
            response.put("reminderList", reminders);
        } catch (Exception e) {
            log.error("Get Reminders Error", e);
            response.put("retCode", "99");
        }
        return response;
    }

    private boolean shouldTakeOnDate(String frequencyType, String customValue, LocalDate targetDate) {
        if (frequencyType == null || "Daily".equals(frequencyType)) return true;
        if ("PRN".equals(frequencyType)) return false;

        if ("Custom".equals(frequencyType) && customValue != null) {
            DayOfWeek day = targetDate.getDayOfWeek();
            String dayShort = day.name().substring(0, 3); // MON, TUE...
            return Arrays.stream(customValue.toUpperCase().split(","))
                    .anyMatch(d -> d.trim().equals(dayShort));
        }
        return false;
    }

    @Override
    public Map<String, Object> getMedicineListWithReminders() {
        Map<String, Object> response = new HashMap<>();
        try {
            String userKey = getAuthenticatedUserKey();
            List<MedicineDto> meds = medicineMapper.findMedicineListByUserKey(userKey, null);
            LocalDate today = LocalDate.now();
            List<Map<String, Object>> mergedList = new ArrayList<>();

            for (MedicineDto med : meds) {
                if (!"보관중".equals(med.getStatus())) continue;

                ReminderDto reminder = reminderMapper.findReminderByMedKey(userKey, med.getTblkey());
                String frequencyType = reminder != null ? reminder.getFrequencyType() : "Daily";
                String customValue = reminder != null ? reminder.getCustomValue() : "";

                if (!shouldTakeOnDate(frequencyType, customValue, today)) continue;

                Map<String, Object> item = new HashMap<>();
                item.put("medId", med.getTblkey());
                item.put("medName", med.getMedItemName());
                item.put("alias", med.getAlias());
                item.put("reminderTime", reminder != null ? reminder.getReminderTime() : "09:00");
                item.put("isActive", reminder != null && "Y".equals(reminder.getIsActive()));
                item.put("frequencyType", frequencyType);
                item.put("customValue", customValue);

                mergedList.add(item);
            }

            response.put("retCode", "10");
            response.put("medicineList", mergedList);
        } catch (Exception e) {
            log.error("Get Calendar List Error", e);
            response.put("retCode", "99");
        }
        return response;
    }
}
