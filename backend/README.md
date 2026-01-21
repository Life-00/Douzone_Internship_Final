# My Medicine (마이슨) - Backend

### 강원대학교 SW중심대학 인턴십 백엔드 프로젝트입니다.
### MyMedicine 서비스의 API 서버를 Spring Boot와 MyBatis로 구현합니다.

## My Medicine (Backend)

"식약처 공공데이터 & DUR 연동 기반의 실시간 안전 알림 및 스마트 폐기 솔루션"

## 📖 프로젝트 개요

'My Medicine' 프로젝트의 백엔드 서버입니다. Spring Boot를 기반으로 구축되었으며, 공공데이터 수집 배치, DUR 실시간 분석, 사용자 및 약품 데이터 관리 등 핵심 비즈니스 로직을 처리합니다.

개발 기간: 2025.10.20 ~ 2025.11.28 (6주)


## ✨ 주요 기능

RESTful API: 회원가입, 로그인, 약품 CRUD, 알림 조회 등 클라이언트 요청 처리

공공데이터 배치 (Batch): Spring Scheduler를 이용해 매일 새벽 식약처 API(회수/폐기, 낱알식별) 데이터 수집 및 Upsert 처리

실시간 DUR 분석: 약품 등록 시 병용 금기 및 임부 금기 성분 교차 분석 알고리즘 수행

보안 인증: Spring Security + JWT (HttpOnly Cookie) 기반의 Stateless 인증 구현

OAuth 2.0: Google 소셜 로그인 연동 및 통합 계정 관리


## 📂 패키지 구조
```bash
src/main/java/com/mymedicine/myson_backend
├── config          # 설정 클래스 (Security, AppConfig 등)
├── controller      # REST API 컨트롤러
├── dto             # 데이터 전송 객체 (Request/Response)
├── mapper          # MyBatis 매퍼 인터페이스
├── scheduler       # 배치 스케줄러 (BatchScheduler)
├── security        # 보안 관련 클래스 (JwtTokenProvider, Filters)
└── service         # 비즈니스 로직 구현체
```

🔧 주요 기술적 특징

트랜잭션 최적화: 외부 API 호출과 DB 트랜잭션을 분리하여 커넥션 풀 효율성 증대

Upsert 전략: ON DUPLICATE KEY UPDATE 구문을 활용하여 대량 데이터의 정합성 유지

보안 아키텍처: HttpOnly Cookie를 통한 토큰 전달로 XSS 공격 방어

계층형 아키텍처: Controller-Service-Mapper 분리를 통한 유지보수성 확보

## 🛠 사용 기술 (Tech Stack)

Framework: Spring Boot 

Language: Java 

Database ORM: MyBatis 

Database: MariaDB 

Build Tool: Gradle

## 🚀 로컬 개발 환경 실행 방법

### 백엔드 서버 실행

IntelliJ에서 MysonBackendApplication.java 파일을 열고 '▶' (Run) 버튼을 클릭합니다.

서버가 *http://localhost:8080/* 에서 실행됩니다.

### 연동 테스트 

웹 브라우저에서 *http://localhost:8080/api/test/db* 로 접속하여 DB 연결을 확인합니다.

## 🚀 구현된 API 목록

### 1. 인증 (Authentication)

[POST] /api/auth/register: 사용자 회원가입

[POST] /api/auth/login: 사용자 로그인
