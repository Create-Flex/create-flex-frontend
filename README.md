# Create Flex Frontend

**Create Flex Frontend**는 유연한 근무 환경과 효율적인 인력 관리를 위한 HR 플랫폼의 프론트엔드 프로젝트입니다. React와 Vite를 기반으로 구축되었으며, 세련된 UI와 직관적인 사용자 경험을 제공합니다.

## 🚀 주요 기능 (Key Features)

이 프로젝트는 다음과 같은 핵심 HR 및 업무 관리 기능을 포함합니다:

*   **📅 일정 관리 (Schedule Management)**
    *   개인 및 회사 일정 통합 관리 (월별 캘린더 뷰)
    *   일정 등록, 수정, 삭제 기능 (권한 기반 제어)
    *   일정 종류별(회사/개인) 시각적 구분 및 필터링
*   **👥 인사 관리 (Staff Management)**
    *   임직원 목록 조회 및 상세 정보 확인
    *   직원 정보 수정 및 관리 (관리자 기능)
*   **📊 근태 관리 (Attendance)**
    *   출퇴근 기록 및 근태 현황 조회
*   **🧩 조직도 (Organization Chart)**
    *   Interactive한 조직도 시각화 (`reactflow` 활용)
*   **🔐 권한 및 보안 (Authentication & Security)**
    *   사용자 역할(Administrator, Employee 등)에 따른 메뉴 및 기능 접근 제어
    *   JWT 기반 인증 처리

## 🛠️ 기술 스택 (Tech Stack)

*   **Framework/Library**: React 18, Vite
*   **State Management**: Zustand
*   **Styling**: Styled-components
*   **Routing**: React Router DOM
*   **HTTP Client**: Axios
*   **UI/Icons**: Lucide React
*   **Visualizations**: React Flow (조직도)

## 📦 설치 및 실행 (Installation & Run)

이 프로젝트를 로컬 환경에서 실행하려면 Node.js가 필요합니다.

1. **저장소 클론 (Clone Repository)**
   ```bash
   git clone <repository-url>
   cd create-flex-frontend
   ```

2. **패키지 설치 (Install Dependencies)**
   ```bash
   npm install
   ```

3. **개발 서버 실행 (Run Dev Server)**
   ```bash
   npm run dev
   ```
   브라우저에서 `http://localhost:3000` (또는 터미널에 표시된 포트)로 접속하여 확인합니다.

## 📂 폴더 구조 (Directory Structure)

```
create-flex-frontend/
├── api/            # API 서비스 로직 (Axios 인스턴스 및 엔드포인트)
├── components/     # UI 컴포넌트 (Schedule, HR, Common 등)
├── stores/         # 전역 상태 관리 (Zustand 스토어)
├── utils/          # 유틸리티 함수
├── App.jsx         # 메인 앱 컴포넌트 및 라우팅 설정
└── main.jsx        # 진입점 (Entry Point)
```

## 📝 라이선스 (License)

This project is private and proprietary.
