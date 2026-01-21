package com.mymedicine.myson_backend.security;

import com.mymedicine.myson_backend.dto.UserDto;
import com.mymedicine.myson_backend.mapper.UserMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie; // [★추가★]
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserMapper userMapper;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        UserDto user = userMapper.findByUserId(email);

        String token = jwtTokenProvider.createToken(email, List.of("ROLE_USER"));


        ResponseCookie cookie = ResponseCookie.from("accessToken", token)
                .path("/")
                .sameSite("Lax")
                .httpOnly(true)
                .secure(false)
                .maxAge(24 * 60 * 60)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());


        String targetUrl = "http://localhost:5173/";

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}