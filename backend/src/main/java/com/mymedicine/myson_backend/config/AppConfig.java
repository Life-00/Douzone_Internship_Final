package com.mymedicine.myson_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * 애플리케이션 전역 설정 클래스
 * 외부 API 호출을 위한 RestTemplate 등을 Bean으로 등록합니다.
 */
@Configuration
public class AppConfig {

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
