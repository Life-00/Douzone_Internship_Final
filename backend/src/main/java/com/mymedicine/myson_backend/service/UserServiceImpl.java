package com.mymedicine.myson_backend.service;

import com.mymedicine.myson_backend.dto.LoginRequestDto;
import com.mymedicine.myson_backend.dto.UserDto;
import com.mymedicine.myson_backend.dto.UserRegisterRequestDto;
import com.mymedicine.myson_backend.mapper.UserMapper;
import com.mymedicine.myson_backend.security.CustomUserDetails;
import com.mymedicine.myson_backend.security.CustomUserDetailsService;
import com.mymedicine.myson_backend.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailsService userDetailsService;

    private String getAuthenticatedUserKey() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails)) {
            throw new SecurityException("인증 정보가 없습니다.");
        }
        return ((CustomUserDetails) authentication.getPrincipal()).getUserDto().getTblkey();
    }

    @Override
    @Transactional
    public Map<String, Object> registerUser(UserRegisterRequestDto requestDto) {
        Map<String, Object> response = new HashMap<>();
        String adddate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS"));

        UserDto userDto = UserDto.builder()
                .tblkey(UUID.randomUUID().toString().replace("-", ""))
                .userId(requestDto.getUserId().trim())
                .userPassword(passwordEncoder.encode(requestDto.getUserPassword()))
                .userName(requestDto.getUserName())
                .adddate(adddate)
                .provider("local")
                .isPregnant("N")
                .build();

        try {
            userMapper.registerUser(userDto);
            response.put("retCode", "10");
            response.put("userMsg", "회원가입 성공");
        } catch (Exception e) {
            response.put("retCode", "91");
            response.put("userMsg", "이미 사용 중인 아이디입니다.");
        }
        return response;
    }

    @Override
    public Map<String, Object> login(LoginRequestDto requestDto) {
        Map<String, Object> response = new HashMap<>();
        String userId = requestDto.getUserId().trim();
        UserDto user = userMapper.findByUserId(userId);

        if (user == null) {
            return Map.of("retCode", "91", "userMsg", "존재하지 않는 아이디입니다.");
        }
        if (user.getUserPassword() == null || !passwordEncoder.matches(requestDto.getUserPassword(), user.getUserPassword())) {
            return Map.of("retCode", "91", "userMsg", "비밀번호 불일치 또는 소셜 계정입니다.");
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(userId);
        List<String> roles = userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList());
        String token = jwtTokenProvider.createToken(userDetails.getUsername(), roles);

        response.put("retCode", "10");
        response.put("userMsg", "로그인 성공");
        response.put("userName", user.getUserName());
        response.put("token", token);
        response.put("userKey", user.getTblkey());
        response.put("isPregnant", user.getIsPregnant());

        return response;
    }

    @Override
    @Transactional
    public Map<String, Object> updatePregnantStatus(String isPregnant) {
        Map<String, Object> response = new HashMap<>();
        try {
            String userKey = getAuthenticatedUserKey();
            String status = "Y".equalsIgnoreCase(isPregnant) ? "Y" : "N";
            userMapper.updatePregnantStatus(userKey, status);

            response.put("retCode", "10");
            response.put("isPregnant", status);
        } catch (Exception e) {
            response.put("retCode", "99");
            response.put("userMsg", "상태 변경 실패");
        }
        return response;
    }

    @Override
    public Map<String, Object> getMyInfo() {
        Map<String, Object> response = new HashMap<>();
        try {
            UserDto user = userMapper.findByTblKey(getAuthenticatedUserKey());
            if (user != null) {
                response.put("retCode", "10");
                response.put("userName", user.getUserName());
                response.put("userId", user.getUserId());
                response.put("isPregnant", user.getIsPregnant());
                response.put("provider", user.getProvider());
            } else {
                response.put("retCode", "91");
            }
        } catch (Exception e) {
            response.put("retCode", "99");
        }
        return response;
    }
}