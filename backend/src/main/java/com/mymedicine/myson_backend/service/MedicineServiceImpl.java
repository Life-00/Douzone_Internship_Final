package com.mymedicine.myson_backend.service;

import com.mymedicine.myson_backend.dto.MedicineDto;
import com.mymedicine.myson_backend.dto.MedicineRequestDto;
import com.mymedicine.myson_backend.mapper.MedicineMapper;
import com.mymedicine.myson_backend.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MedicineServiceImpl implements MedicineService {

    private final MedicineMapper medicineMapper;

    private String getAuthenticatedUserKey() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails)) {
            throw new SecurityException("인증 정보가 없거나 유효하지 않습니다.");
        }
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return userDetails.getUserDto().getTblkey();
    }

    @Override
    @Transactional
    public Map<String, Object> registerMedicine(MedicineRequestDto requestDto) {
        Map<String, Object> response = new HashMap<>();

        try {
            String currentUserKey = getAuthenticatedUserKey();
            String adddate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS"));
            String tblkey = UUID.randomUUID().toString().replace("-", "");

            MedicineDto medicineDto = MedicineDto.builder()
                    .tblkey(tblkey)
                    .userKey(currentUserKey)
                    .medItemSeq(requestDto.getMedItemSeq())
                    .medItemName(requestDto.getMedItemName())
                    .medEntpName(requestDto.getMedEntpName())
                    .medItemImage(requestDto.getMedItemImage())
                    .medClassName(requestDto.getMedClassName())
                    .alias(requestDto.getAlias())
                    .expiryDate(requestDto.getExpiryDate())
                    .memo(requestDto.getMemo())
                    .status("보관중")
                    .drugType(requestDto.getDrugType())
                    .purchaseDate(requestDto.getPurchaseDate())
                    .adddate(adddate)
                    .modifydate(adddate)
                    .build();

            int result = medicineMapper.insertMedicine(medicineDto);

            if (result > 0) {
                response.put("retCode", "10");
                response.put("userMsg", requestDto.getAlias() + " 등록 완료");
            } else {
                response.put("retCode", "99");
                response.put("userMsg", "약통 등록 실패");
            }
        } catch (SecurityException e) {
            response.put("retCode", "96");
            response.put("userMsg", e.getMessage());
        } catch (Exception e) {
            log.error("Medicine Register Error", e);
            response.put("retCode", "99");
            response.put("userMsg", "DB 오류 발생");
        }
        return response;
    }

    @Override
    public Map<String, Object> getMedicineList(String status) {
        Map<String, Object> response = new HashMap<>();
        try {
            String currentUserKey = getAuthenticatedUserKey();
            String filterStatus = (status == null || status.trim().isEmpty() || "전체".equals(status)) ? null : status;

            List<MedicineDto> medicineList = medicineMapper.findMedicineListByUserKey(currentUserKey, filterStatus);

            LocalDate today = LocalDate.now();
            medicineList.forEach(med -> {
                if (med.getExpiryDate() != null && !med.getExpiryDate().isEmpty() && "보관중".equals(med.getStatus())) {
                    try {
                        LocalDate expiryDate = LocalDate.parse(med.getExpiryDate(), DateTimeFormatter.ISO_DATE);
                        med.setDaysLeft(ChronoUnit.DAYS.between(today, expiryDate));
                    } catch (Exception e) {
                        log.warn("Date Parse Error: {}", med.getExpiryDate());
                    }
                }
            });

            response.put("retCode", "10");
            response.put("medicineList", medicineList);
        } catch (SecurityException e) {
            response.put("retCode", "96");
            response.put("userMsg", e.getMessage());
        } catch (Exception e) {
            log.error("Get Medicine List Error", e);
            response.put("retCode", "99");
            response.put("userMsg", "목록 조회 오류");
        }
        return response;
    }

    @Override
    public Map<String, Object> getMedicineDetail(String id) {
        Map<String, Object> response = new HashMap<>();
        try {
            String currentUserKey = getAuthenticatedUserKey();
            MedicineDto medicineDetail = medicineMapper.findMedicineByIdAndUserKey(id, currentUserKey);

            if (medicineDetail != null) {
                response.put("retCode", "10");
                response.put("medicineDetail", medicineDetail);
            } else {
                response.put("retCode", "97");
                response.put("userMsg", "정보를 찾을 수 없습니다.");
            }
        } catch (SecurityException e) {
            response.put("retCode", "96");
            response.put("userMsg", e.getMessage());
        } catch (Exception e) {
            log.error("Get Detail Error", e);
            response.put("retCode", "99");
            response.put("userMsg", "상세 조회 오류");
        }
        return response;
    }

    @Override
    @Transactional
    public Map<String, Object> updateMedicine(String id, MedicineDto requestDto) {
        Map<String, Object> response = new HashMap<>();
        try {
            String currentUserKey = getAuthenticatedUserKey();

            if (medicineMapper.findMedicineByIdAndUserKey(id, currentUserKey) == null) {
                response.put("retCode", "97");
                response.put("userMsg", "수정 권한이 없습니다.");
                return response;
            }

            requestDto.setTblkey(id);
            requestDto.setUserKey(currentUserKey);
            requestDto.setModifydate(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS")));

            int result = medicineMapper.updateMedicine(requestDto);
            response.put("retCode", result > 0 ? "10" : "99");
            response.put("userMsg", result > 0 ? "수정 완료" : "수정 실패");

        } catch (Exception e) {
            log.error("Update Error", e);
            response.put("retCode", "99");
            response.put("userMsg", "수정 중 오류 발생");
        }
        return response;
    }

    @Override
    @Transactional
    public Map<String, Object> deleteMedicine(String id) {
        Map<String, Object> response = new HashMap<>();
        try {
            String currentUserKey = getAuthenticatedUserKey();
            int result = medicineMapper.deleteMedicine(id, currentUserKey);

            response.put("retCode", result > 0 ? "10" : "97");
            response.put("userMsg", result > 0 ? "삭제 완료" : "삭제 실패");
        } catch (Exception e) {
            log.error("Delete Error", e);
            response.put("retCode", "99");
            response.put("userMsg", "삭제 중 오류 발생");
        }
        return response;
    }

    @Override
    public Map<String, Object> getExpiryAlerts() {
        Map<String, Object> response = new HashMap<>();
        try {
            String currentUserKey = getAuthenticatedUserKey();
            List<MedicineDto> userMedicineList = medicineMapper.findMedicineListByUserKey(currentUserKey, null);
            LocalDate today = LocalDate.now();
            final long EXPIRY_THRESHOLD_DAYS = 90;

            List<Map<String, Object>> expiryAlerts = userMedicineList.stream()
                    .filter(med -> med.getExpiryDate() != null && !med.getExpiryDate().isEmpty() && "보관중".equals(med.getStatus()))
                    .map(med -> {
                        try {
                            LocalDate expiryDate = LocalDate.parse(med.getExpiryDate(), DateTimeFormatter.ISO_DATE);
                            long daysLeft = ChronoUnit.DAYS.between(today, expiryDate);
                            if (daysLeft <= EXPIRY_THRESHOLD_DAYS) {
                                Map<String, Object> alert = new HashMap<>();
                                alert.put("tblkey", med.getTblkey());
                                alert.put("alias", med.getAlias());
                                alert.put("itemName", med.getMedItemName());
                                alert.put("expiryDate", med.getExpiryDate());
                                alert.put("daysLeft", daysLeft);
                                alert.put("isExpired", daysLeft < 0);
                                return alert;
                            }
                        } catch (Exception e) { /* Ignore */ }
                        return null;
                    })
                    .filter(java.util.Objects::nonNull)
                    .sorted((a, b) -> Long.compare((Long) a.get("daysLeft"), (Long) b.get("daysLeft")))
                    .collect(Collectors.toList());

            response.put("retCode", "10");
            response.put("expiryCount", expiryAlerts.size());
            response.put("expiryList", expiryAlerts);

        } catch (Exception e) {
            log.error("Expiry Alert Error", e);
            response.put("retCode", "99");
        }
        return response;
    }
}