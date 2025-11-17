# ⚡ Quick Start - AI 음성 면접 시스템

> 5분 안에 프로젝트를 실행해보세요!

---

## 🎯 지금 바로 시작하기

### 1️⃣ 프론트엔드 실행 (30초)

```bash
# 1. frontend 폴더로 이동
cd frontend

# 2. 의존성 설치 (첫 실행 시만)
npm install

# 3. 개발 서버 실행
npm run dev
```

✅ 브라우저에서 **http://localhost:3000** 접속!

---

## 🎨 체험 가능한 기능

### 1. 랜딩 페이지 (/)
- 🎬 Hero 섹션 애니메이션
- 📋 서비스 소개
- 💫 Framer Motion 효과

### 2. 회원가입 (/register)
- 📝 2단계 폼 (기본정보 + 경력정보)
- ✅ 실시간 유효성 검사
- 🎨 세련된 UI

### 3. 로그인 (/login)
- 🔐 JWT 토큰 방식
- 💾 로컬 스토리지 저장
- 🔄 자동 토큰 갱신

### 4. 대시보드 (/dashboard)
- 📊 통계 카드
- 🚀 빠른 시작 메뉴
- 📜 최근 활동 타임라인

### 5. 채용 공고 (/job-postings)
- 📄 PDF 업로드 UI
- 🤖 AI 분석 시뮬레이션
- 🏷️ 키워드 추출 결과

### 6. 자기소개서 (/cover-letters)
- ✍️ 텍스트 에디터
- 📊 글자 수 카운터
- 💬 AI 피드백 (Mock 데이터)

### 7. 음성 면접 (/interview/:id)
- 🎙️ 음성 녹음 (MediaRecorder API)
- ⏱️ 60초 타이머
- 🎯 5턴 진행률

### 8. 면접 결과 (/interview/:id/result)
- 📈 종합 점수 (원형 그래프)
- 🎧 답변 오디오 플레이어
- 💬 개별 피드백

---

## 🎮 테스트 계정 (Mock)

현재는 백엔드가 없어 실제 로그인은 불가하지만, UI는 모두 체험 가능합니다!

```
이메일: test@example.com
비밀번호: password123
```

> ⚠️ 참고: 실제 API 연동 전까지는 로그인 후 데이터가 Mock입니다.

---

## 📱 반응형 테스트

### 개발자 도구로 테스트하기

1. `F12` 또는 `Ctrl+Shift+I` (Mac: `Cmd+Option+I`)
2. 디바이스 툴바 토글 (`Ctrl+Shift+M`)
3. 다양한 디바이스 선택:
   - 📱 iPhone SE (375px)
   - 📱 iPhone 12 Pro (390px)
   - 📱 iPad (768px)
   - 💻 Desktop (1920px)

---

## 🎨 주요 UI 컴포넌트 확인

### Buttons
```
/register - 다양한 버튼 스타일
- Primary (그라데이션)
- Secondary (아웃라인)
- Ghost (투명)
```

### Cards
```
/dashboard - 카드 컴포넌트
- 호버 효과
- Shadow 전환
```

### Forms
```
/register - 입력 폼
- 에러 처리
- 포커스 효과
```

### Audio
```
/interview/1 - 음성 녹음
/interview/1/result - 오디오 플레이어
```

---

## 🛠️ 개발 명령어

```bash
# 개발 서버 (Hot Reload)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview

# 린트 검사
npm run lint
```

---

## 📦 설치된 주요 패키지

### 핵심
- **react**: ^18.2.0
- **react-router-dom**: ^6.20.0
- **axios**: ^1.6.2

### UI/애니메이션
- **framer-motion**: ^10.16.16
- **lucide-react**: ^0.294.0
- **tailwindcss**: ^3.3.6

### 상태 관리
- **zustand**: ^4.4.7

### 유틸리티
- **clsx**: ^2.0.0
- **tailwind-merge**: ^2.1.0
- **react-hot-toast**: ^2.4.1

---

## 🎯 다음 단계

### Option 1: 프론트엔드 커스터마이징
```bash
# 컬러 변경
frontend/tailwind.config.js 수정

# 새 페이지 추가
frontend/src/pages/NewPage.jsx 생성

# 새 컴포넌트 추가
frontend/src/components/NewComponent.jsx 생성
```

### Option 2: 백엔드 개발 시작
```bash
# 백엔드 폴더 생성
mkdir backend
cd backend

# Python 가상환경
python -m venv venv
venv\Scripts\activate  # Windows

# FastAPI 설치
pip install fastapi uvicorn sqlalchemy
```

자세한 내용은 [GETTING_STARTED.md](GETTING_STARTED.md) 참고

---

## 💡 팁

### 1. 개발 시 자동 새로고침
Vite는 파일 변경 시 자동으로 새로고침됩니다.

### 2. API 프록시
```javascript
// vite.config.js
server: {
  proxy: {
    '/api': 'http://localhost:8000'
  }
}
```

### 3. 환경 변수
```bash
# .env 파일 생성
VITE_API_URL=http://localhost:8000/api
```

### 4. VS Code 추천 확장
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- ESLint
- Prettier

---

## 🐛 문제 해결

### 포트 충돌 (3000번 포트 사용 중)
```bash
# vite.config.js에서 포트 변경
server: {
  port: 3001
}
```

### Node modules 오류
```bash
rm -rf node_modules package-lock.json
npm install
```

### Tailwind CSS 적용 안 됨
```bash
# 캐시 삭제 후 재시작
npm run dev
```

---

## 📚 추가 문서

- [ARCHITECTURE.md](ARCHITECTURE.md) - 시스템 아키텍처
- [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) - 디자인 가이드
- [GETTING_STARTED.md](GETTING_STARTED.md) - 상세 설정 가이드
- [PROJECT_STATUS.md](PROJECT_STATUS.md) - 프로젝트 현황

---

## 🎉 완료!

프론트엔드가 정상적으로 실행되었다면, 이제 아름다운 UI를 즐기세요!

**Happy Coding! 🚀**

