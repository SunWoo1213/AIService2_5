# AI 음성 면접 시스템 - Frontend

세련되고 현대적인 UI/UX를 제공하는 음성 면접 웹 애플리케이션입니다.

## 🎨 기술 스택

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Framer Motion
- **State Management**: Zustand
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Icons**: Lucide React

## 🚀 시작하기

### 사전 요구사항

- Node.js 18+ 
- npm 또는 yarn

### 설치

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env

# 개발 서버 실행
npm run dev
```

개발 서버는 `http://localhost:3000`에서 실행됩니다.

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

## 📁 프로젝트 구조

```
frontend/
├── public/              # 정적 파일
├── src/
│   ├── assets/         # 이미지, 폰트 등
│   ├── components/     # 재사용 가능한 UI 컴포넌트
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   └── ...
│   ├── layouts/        # 레이아웃 컴포넌트
│   │   ├── MainLayout.jsx
│   │   └── DashboardLayout.jsx
│   ├── pages/          # 페이지 컴포넌트
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   └── ...
│   ├── stores/         # Zustand 상태 관리
│   │   └── authStore.js
│   ├── utils/          # 유틸리티 함수
│   │   ├── api.js
│   │   └── cn.js
│   ├── styles/         # 글로벌 스타일
│   │   └── index.css
│   ├── App.jsx         # 메인 앱 컴포넌트
│   └── main.jsx        # 앱 진입점
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🎨 디자인 시스템

### 컬러 팔레트

- **Primary**: Blue (#3b82f6) - 신뢰와 전문성
- **Secondary**: Green (#22c55e) - 성공과 긍정
- **Gray**: 배경 및 텍스트

### 타이포그래피

- **Font**: Pretendard (한글), Inter (영문)
- **Sizes**: 12px ~ 48px (Fluid Typography)

### 컴포넌트

모든 컴포넌트는 Tailwind CSS를 기반으로 제작되었으며, Framer Motion으로 부드러운 애니메이션을 구현했습니다.

```jsx
import Button from '@/components/Button'

<Button variant="primary" size="lg">
  버튼 텍스트
</Button>
```

자세한 디자인 가이드는 `DESIGN_SYSTEM.md`를 참고하세요.

## 📱 반응형 디자인

모바일, 태블릿, 데스크톱 모든 화면 크기에 최적화되어 있습니다.

- Mobile: < 640px
- Tablet: 640px ~ 1024px
- Desktop: > 1024px

## 🔒 인증

JWT 토큰 기반 인증을 사용합니다.

- Access Token: 15분 만료 (localStorage)
- Refresh Token: 7일 만료 (자동 갱신)

## 🎯 주요 기능

### 1. 랜딩 페이지
- Hero 섹션
- 기능 소개
- CTA (Call to Action)

### 2. 대시보드
- 통계 카드
- 빠른 시작 메뉴
- 최근 활동

### 3. 채용 공고 분석
- PDF 업로드
- AI 분석 결과 표시
- 키워드 및 요구사항 추출

### 4. 자기소개서 피드백
- 텍스트 에디터
- AI 피드백 생성
- 저장 및 관리

### 5. 음성 면접 (구현 예정)
- 실시간 녹음
- TTS 질문 재생
- STT 답변 변환
- 피드백 제공

## 🛠️ 개발 가이드

### 새 컴포넌트 추가

```jsx
// src/components/MyComponent.jsx
import { cn } from '@/utils/cn'

export default function MyComponent({ className, ...props }) {
  return (
    <div className={cn('기본-클래스', className)} {...props}>
      내용
    </div>
  )
}
```

### API 호출

```jsx
import api from '@/utils/api'

// GET 요청
const response = await api.get('/endpoint')

// POST 요청
const response = await api.post('/endpoint', data)
```

### 상태 관리 (Zustand)

```jsx
import { create } from 'zustand'

export const useMyStore = create((set) => ({
  value: 0,
  increment: () => set((state) => ({ value: state.value + 1 })),
}))
```

## 🧪 테스트

```bash
# 린트 검사
npm run lint
```

## 📦 배포

### Vercel (권장)

1. GitHub 레포지토리 연결
2. 자동 배포 설정
3. 환경 변수 설정

### Netlify

1. 빌드 명령어: `npm run build`
2. 배포 디렉토리: `dist`

## 🤝 기여

이슈와 풀 리퀘스트를 환영합니다!

## 📄 라이선스

MIT License

---

**제작**: AI Interview Team  
**문의**: support@aiinterview.com

