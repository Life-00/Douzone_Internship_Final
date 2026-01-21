# My Medicine (마이슨)

> 개인 맞춤형 의약품 전주기 관리 플랫폼  
> 식약처 공공데이터와 DUR 연동 기반의 실시간 안전 알림 및 스마트 폐기 솔루션

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18+-blue)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
![Mentored by Douzone](https://img.shields.io/badge/Mentored%20by-Douzone%20(Kicom)-blue)
![Internship](https://img.shields.io/badge/Internship-KNU%20SW%20Center-green)

## 📖 프로젝트 개요

**My Medicine**은 의약품의 **등록 → 안전 점검 → 복용 관리 → 폐기**까지 전 과정을 원스톱으로 관리하는 헬스케어 웹 서비스입니다.

- **개발 기간**: 2025.10.20 ~ 2025.11.28 (6주)
- **개발 기관**: 강원대학교 SW중심대학 인턴십 프로젝트
- **배포 환경**: Docker Compose 기반 프로덕션 배포

## ✨ 주요 기능

### 🔍 의약품 검색 & 낱알 식별
- 텍스트 및 외형 정보(모양, 색상) 기반 의약품 검색
- 식약처 낱알식별 API 연동

### ⚠️ 실시간 안전 점검 (DUR)
- 약품 등록 시 병용 금기 및 임부 금기 성분 실시간 분석
- 위험 성분 조합 자동 경고 알림

### 💊 스마트 약통 관리
- 유통기한 D-Day 자동 계산
- 복용 상태 추적 (복용 중/복용 완료/미복용)
- 구매일/처방일 기록 및 히스토리 관리

### 🔔 능동형 회수 알림
- 식약처 회수·폐기 정보 자동 수집 (매일 새벽 배치)
- 사용자 보유 약품과 자동 매칭하여 알림 발송

### 🗺️ 안전 폐기 지도
- 사용자 위치 기반 폐의약품 수거함 위치 안내
- Kakao Maps API 연동

### 🔐 통합 인증
- 자체 회원가입/로그인 (JWT + HttpOnly Cookie)
- Google OAuth 2.0 소셜 로그인 지원

## 🛠 기술 스택

### Backend
- **Framework**: Spring Boot 3.x
- **Language**: Java 17
- **ORM**: MyBatis
- **Database**: MariaDB
- **Authentication**: Spring Security + JWT + OAuth 2.0
- **Build Tool**: Gradle

### Frontend
- **Framework**: React 18+
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **HTTP Client**: Axios
- **Maps**: Kakao Maps API

### DevOps
- **Containerization**: Docker, Docker Compose
- **Web Server**: Nginx (프론트엔드)
- **CI/CD**: (추후 GitHub Actions 예정)

## 🚀 빠른 시작 (Docker Compose)

### 1. 레파지토리 클론

```bash
git clone https://github.com/your-username/myson.git
cd myson
```

## ⚙️ 설정 및 실행 방법

### 1. 환경변수 설정
`.env.example`을 복사하여 `.env` 파일을 생성한 후 필수 값을 입력합니다.
* **명령어:** `cp .env.example .env`
* **필수 입력 값:**
    * 데이터베이스 접속 정보 (URL, ID, PW)
    * 식약처 API 서비스키
    * JWT Secret
    * Google OAuth 2.0 클라이언트 ID/Secret
    * Kakao Maps API Key

### 2. Docker Compose 실행
* **명령어:** `docker-compose up --build`
* **서비스 접속:**
    * 프론트엔드: `http://localhost`
    * 백엔드 API: `http://localhost:8080`
    * DB 연결 테스트: `http://localhost:8080/api/test/db`

---

## 🔧 로컬 개발 환경 실행

### Backend (Spring Boot)
* `cd backend`
* `./gradlew clean build`
* `./gradlew bootRun`
* **접속 주소:** `http://localhost:8080`

### Frontend (React + Vite)
* `cd frontend`
* `npm install`
* `npm run dev`
* **접속 주소:** `http://localhost:5173`

---

## 📡 주요 API 엔드포인트

| 분류 | 메서드/경로 | 설명 |
| :--- | :--- | :--- |
| **인증** | `POST /api/auth/register` | 회원가입 |
| | `POST /api/auth/login` | 로그인 |
| | `POST /api/auth/logout` | 로그아웃 |
| | `GET /api/auth/google` | Google OAuth 로그인 |
| **의약품 관리** | `GET /api/medicines` | 보유 약품 목록 조회 |
| | `POST /api/medicines` | 약품 등록 (DUR 자동 분석) |
| | `PUT /api/medicines/{id}` | 약품 정보 수정 |
| | `DELETE /api/medicines/{id}` | 약품 삭제 |
| **검색/식별** | `GET /api/search` | 의약품 검색 |
| | `GET /api/pill-identify` | 낱알 식별 |
| **알림/지도** | `GET /api/notifications` | 사용자 알림 목록 |
| | `GET /api/disposal-locations` | 폐의약품 수거함 위치 |

---

## 🔐 보안 및 기술 구현
* **보안:** HttpOnly Cookie 기반 JWT 관리, CORS 설정, Spring Security 권한 제어(`ROLE_USER`)
* **환경 관리:** 민감 정보 `.env` 분리 및 Git 제외
* **배치 작업 (매일 새벽 2시):**
    * 식약처 API 연동을 통한 최신 회수·폐기 정보 수집 및 DB 업데이트
    * 낱알식별 데이터 동기화 및 사용자 맞춤형 회수 알림 생성

---

## 🤝 프로젝트 정보
* **기여 방법:** Fork 후 Feature 브랜치 생성(`git checkout -b feature/AmazingFeature`) -> 커밋 -> Push -> Pull Request
* **라이선스:** MIT License
* **팀원:** Backend: [Your Name] / Frontend: [Your Name]
* **기간:** 2025.10.20 ~ 2025.11.28
* **문의:** [이메일] 또는 GitHub Issues

## 👥 팀 정보 및 멘토링
* **Main Developer:** 김지훈 (강원대학교 컴퓨터공학과 21학번)
* **Professional Mentoring:** 본 프로젝트는 **더존 키컴**소속 김동진진 연구원님의 기술 멘토링(코드 리뷰 및 아키텍처 설계 가이드)을 통해 완성되었습니다.
* **Project Duration:** 2025.10.20 ~ 2025.11.28
* **Affiliation:** 강원대학교 SW중심대학사업단 인턴십 

**Made with ❤️ by JiHoon KIM | Mentored by Douzone (Kicom)**
