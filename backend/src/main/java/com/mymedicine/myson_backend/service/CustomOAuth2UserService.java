package com.mymedicine.myson_backend.service;

import com.mymedicine.myson_backend.dto.UserDto;
import com.mymedicine.myson_backend.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.UUID;

/**
 * OAuth2 (소셜 로그인) 사용자 정보 로드 서비스
 * Google 등 외부 공급자로부터 받은 사용자 정보를 처리하고 DB에 동기화합니다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserMapper userMapper;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(userRequest);

        // Provider ID (google) & Attribute Key (sub)
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        String userNameAttributeName = userRequest.getClientRegistration().getProviderDetails()
                .getUserInfoEndpoint().getUserNameAttributeName();

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        UserDto userDto = userMapper.findByUserId(email);

        if (userDto == null) {
            userDto = UserDto.builder()
                    .tblkey(UUID.randomUUID().toString().replace("-", ""))
                    .userId(email)
                    .userName(name)
                    .userPassword(null) // 소셜 로그인은 비밀번호 없음
                    .provider(registrationId)
                    .adddate(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS")))
                    .isPregnant("N") // 기본값
                    .build();

            userMapper.registerUser(userDto);
            log.info("New Social User Registered: {}", email);
        } else {
            log.info("Existing Social User Login: {}", email);
        }

        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
                oAuth2User.getAttributes(),
                userNameAttributeName
        );
    }
}