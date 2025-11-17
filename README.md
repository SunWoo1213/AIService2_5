# 🎤 AI 음성 면접 시스템

> AI 기반 음성 모의 면접 및 피드백 서비스

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green.svg)](https://fastapi.tiangolo.com/)

---

## 📖 소개

**AI 음성 면접 시스템**은 사용자의 스펙, 채용 공고, 자기소개서를 기반으로 실전같은 음성 모의 면접과 전문가 수준의 AI 피드백을 제공하는 웹 애플리케이션입니다.

### ✨ 주요 기능

- 📄 **채용 공고 분석**: AI가 PDF 공고를 분석하여 핵심 키워드와 요구 역량 추출
- ✍️ **자기소개서 피드백**: 맞춤형 AI 피드백으로 자소서 품질 향상
- 🎙️ **음성 모의 면접**: 
  - 실전과 동일한 TTS 음성 질문 (5턴)
  - 음성 녹음 및 STT 변환
  - 개별 답변 및 종합 피드백
  - 답변 다시 듣기 기능

---

## 🎨 미리보기

### 랜딩 페이지
![Landing Page](https://via.placeholder.com/800x400?text=Landing+Page+Screenshot)

### 대시보드
![Dashboard](https://via.placeholder.com/800x400?text=Dashboard+Screenshot)

### 음성 면접
![Interview](https://via.placeholder.com/800x400?text=Interview+Screenshot)

---

## 🏗️ 기술 스택

### Frontend
- **React 18** - UI 라이브러리
- **Vite** - 빌드 도구
- **Tailwind CSS** - 스타일링
- **Framer Motion** - 애니메이션
- **Zustand** - 상태 관리
- **React Router v6** - 라우팅
- **Axios** - HTTP 클라이언트

### Backend (구현 예정)
- **FastAPI** - Python 웹 프레임워크
- **PostgreSQL** - 데이터베이스
- **SQLAlchemy** - ORM
- **JWT** - 인증
- **OpenAI API** - GPT-4o, TTS-1-HD, Whisper
- **AWS S3** - 파일 저장

---

## 🚀 빠른 시작

### 사전 요구사항

- Node.js 18+
- Python 3.11+
- PostgreSQL 15+
- OpenAI API Key
- AWS S3 계정

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/yourusername/ai-interview-system.git
cd ai-interview-system

# 프론트엔드 실행
cd frontend
npm install
cp .env.example .env
npm run dev

# 백엔드 실행 (별도 터미널)
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload
```

자세한 내용은 [GETTING_STARTED.md](GETTING_STARTED.md)를 참고하세요.

---

## 📁 프로젝트 구조

```
AI_Service2_2/
├── ARCHITECTURE.md          # 시스템 아키텍처 문서
├── DESIGN_SYSTEM.md         # UI/UX 디자인 가이드
├── GETTING_STARTED.md       # 시작 가이드
├── README.md                # 이 파일
│
├── frontend/                # React 프론트엔드
│   ├── src/
│   │   ├── components/     # 재사용 가능한 UI 컴포넌트
│   │   ├── pages/          # 페이지 컴포넌트
│   │   ├── layouts/        # 레이아웃
│   │   ├── stores/         # Zustand 상태 관리
│   │   └── utils/          # 유틸리티
│   └── package.json
│
└── backend/                 # FastAPI 백엔드 (구현 예정)
    ├── app/
    │   ├── api/            # API 엔드포인트
    │   ├── models/         # 데이터베이스 모델
    │   ├── schemas/        # Pydantic 스키마
    │   └── services/       # 비즈니스 로직
    └── requirements.txt
```

---

## 📚 문서

- [📐 아키텍처 설계](ARCHITECTURE.md) - 시스템 전체 아키텍처 및 API 설계
- [🎨 디자인 시스템](DESIGN_SYSTEM.md) - UI/UX 컴포넌트 및 스타일 가이드
- [🚀 시작 가이드](GETTING_STARTED.md) - 개발 환경 설정 및 실행 방법
- [💻 프론트엔드 README](frontend/README.md) - 프론트엔드 상세 가이드

---

## 🎯 로드맵

### Phase 1: 기반 구축 ✅
- [x] 프로젝트 구조 설정
- [x] 프론트엔드 UI 컴포넌트
- [x] 레이아웃 및 페이지
- [x] 인증 시스템 (클라이언트)

### Phase 2: 백엔드 개발 (진행 중)
- [ ] FastAPI 프로젝트 구조
- [ ] 데이터베이스 설정 및 마이그레이션
- [ ] 인증 API (JWT)
- [ ] 사용자 관리 API
- [ ] 채용 공고 API
- [ ] 자소서 피드백 API

### Phase 3: 음성 면접 (예정)
- [ ] 면접 세션 API
- [ ] OpenAI TTS 통합
- [ ] 음성 녹음 및 STT
- [ ] 피드백 생성 로직

### Phase 4: 최적화 및 배포 (예정)
- [ ] 성능 최적화
- [ ] 테스트 코드 작성
- [ ] Docker 컨테이너화
- [ ] CI/CD 파이프라인
- [ ] 프로덕션 배포

---

## 🎨 디자인 하이라이트

### 현대적이고 세련된 UI
- **미니멀리즘**: 불필요한 요소 제거, 핵심 기능 집중
- **부드러운 애니메이션**: Framer Motion 활용
- **반응형 디자인**: 모바일부터 데스크톱까지
- **접근성**: WCAG 2.1 AA 준수

### 컬러 팔레트
- Primary: Blue (#3b82f6) - 신뢰와 전문성
- Secondary: Green (#22c55e) - 성공과 긍정
- Neutral: Gray - 배경 및 텍스트

### 타이포그래피
- 한글: Pretendard Variable
- 영문: Inter

---

## 🔒 보안

- **JWT 인증**: Access/Refresh Token
- **비밀번호 해싱**: bcrypt
- **HTTPS**: 프로덕션 환경
- **환경 변수**: 민감 정보 분리
- **CORS**: Origin 제한
- **S3 Private Bucket**: Presigned URL

---

## 🤝 기여

프로젝트에 기여하고 싶으신가요? 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참고하세요.

---

## 👥 개발팀

- **Lead Developer**: Your Name
- **Frontend**: React Team
- **Backend**: FastAPI Team
- **AI Integration**: OpenAI Team

---

## 📞 문의

- **이메일**: support@aiinterview.com
- **GitHub Issues**: [Issues](https://github.com/yourusername/ai-interview-system/issues)
- **웹사이트**: [https://aiinterview.com](https://aiinterview.com)

---

## 🙏 감사의 말

이 프로젝트는 다음 오픈소스 프로젝트들을 사용합니다:

- [React](https://reactjs.org/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [OpenAI](https://openai.com/)
- [PostgreSQL](https://www.postgresql.org/)

---

<div align="center">
  <p>Made with ❤️ by AI Interview Team</p>
  <p>⭐ 이 프로젝트가 도움이 되셨다면 Star를 눌러주세요!</p>
</div>

