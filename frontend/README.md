# My Medicine (마이슨) - Frontend

### 강원대학교 SW중심대학 인턴십 프론트엔드 프로젝트입니다.
### MyMedicine 서비스의 사용자 인터페이스(UI)를 React로 구현합니다.


## "개인 맞춤형 의약품 전주기 관리 플랫폼 - My Medicine (마이슨)"

### 📖 프로젝트 개요

'My Medicine'은 식약처 공공데이터와 지자체 데이터를 융합하여, 의약품의 [등록 → 안전 점검 → 복용 관리 → 폐기] 전 과정을 원스톱으로 관리하는 헬스케어 웹 서비스입니다.

개발 기간: 2025.10.20 ~ 2025.11.28 (6주)

배포 주소: [배포 URL 입력]

### ✨ 주요 기능

의약품 검색 & 낱알 식별: 텍스트 및 외형 정보(모양, 색상) 기반 의약품 검색

실시간 안전 점검 (DUR): 약품 등록 시 병용 금기 및 임부 금기 성분 실시간 분석 및 경고

스마트 약통 관리: 유통기한 D-Day 자동 계산, 복용 상태 관리, 구매일/처방일 기록

능동형 회수 알림: 식약처 회수 정보 자동 수집 및 사용자 보유 약품과 매칭하여 알림 발송

안전 폐기 지도: 사용자 위치 기반 폐의약품 수거함 위치 지도 안내 (Kakao Maps API)

통합 인증: 자체 로그인 및 Google OAuth 2.0 소셜 로그인 지원


### 📂 폴더 구조
```bash
src
├── assets          # 이미지, 폰트 등 정적 리소스
├── components      # 재사용 가능한 UI 컴포넌트 (WarningModal, MedicineChart 등)
├── contexts        # 전역 상태 관리 (NavigationContext)
├── hooks           # 비즈니스 로직 분리 (useAuth, useDashboardData 등)
├── pages           # 페이지 컴포넌트 (MainDashboardPage, LoginPage 등)
├── App.jsx         # 메인 앱 컴포넌트 (Error Boundary 적용)
├── Router.jsx      # 라우팅 설정
└── main.jsx        # 진입점
```

### 🔧 주요 기술적 특징

Custom Hook 패턴: 비즈니스 로직과 UI 컴포넌트를 분리하여 유지보수성 향상

HttpOnly Cookie 인증: JWT 토큰을 쿠키로 관리하여 XSS 보안 취약점 해결

Error Boundary & Skeleton UI: 런타임 에러 방지 및 로딩 UX 최적화

Responsive Design: Tailwind CSS를 활용한 모바일/PC 반응형 레이아웃 구현



## 🛠 사용 기술 (Tech Stack)

Framework: React 18+

Build Tool: Vite

Styling: TailwindCSS 

Language: JavaScript 

## 🚀 로컬 개발 환경 실행 방법

의존성 설치
```bash
npm install
```

개발 서버 실행
```bash
npm run dev
```

실행 후 *http://localhost:5173/* 으로 접속하세요.

