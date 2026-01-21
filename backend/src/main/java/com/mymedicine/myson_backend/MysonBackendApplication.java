package com.mymedicine.myson_backend;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Myson Backend Application Entry Point
 * Spring Boot 애플리케이션의 시작점이며, 스케줄링 및 MyBatis 매퍼 스캔 설정을 포함합니다.
 */
@EnableScheduling
@SpringBootApplication
@MapperScan("com.mymedicine.myson_backend.mapper")
public class MysonBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(MysonBackendApplication.class, args);
	}
}
