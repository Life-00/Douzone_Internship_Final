package com.mymedicine.myson_backend.security;

import com.mymedicine.myson_backend.dto.UserDto;
import com.mymedicine.myson_backend.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Spring Security 사용자 로드 서비스
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserMapper userMapper;

    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        UserDto userDto = userMapper.findByUserId(userId);

        if (userDto == null) {
            throw new UsernameNotFoundException("User not found: " + userId);
        }

        return new CustomUserDetails(userDto);
    }
}