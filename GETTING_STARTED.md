# 🚀 AI 음성 면접 시스템 - 시작 가이드

이 문서는 프로젝트를 처음 시작하는 개발자를 위한 단계별 가이드입니다.

## 📋 사전 요구사항

### 필수 설치 항목
- **Node.js** 18.x 이상
- **Python** 3.11 이상
- **PostgreSQL** 15 이상
- **Git**

### 외부 서비스 계정
- **OpenAI API Key** (GPT-4o, TTS, Whisper)
- **AWS S3** (파일 저장) 또는 Google Cloud Storage

---

## 🎯 프로젝트 구조

```
AI_Service2_2/
├── ARCHITECTURE.md          # 시스템 아키텍처 문서
├── DESIGN_SYSTEM.md         # UI/UX 디자인 가이드
├── GETTING_STARTED.md       # 이 문서
│
├── backend/                 # FastAPI 백엔드 (구현 예정)
│   ├── app/
│   │   ├── api/            # API 라우터
│   │   ├── models/         # SQLAlchemy 모델
│   │   ├── schemas/        # Pydantic 스키마
│   │   ├── services/       # 비즈니스 로직
│   │   └── utils/          # 유틸리티
│   ├── requirements.txt
│   └── main.py
│
└── frontend/                # React 프론트엔드 (✅ 완료)
    ├── src/
    │   ├── components/     # UI 컴포넌트
    │   ├── pages/          # 페이지
    │   ├── layouts/        # 레이아웃
    │   ├── stores/         # 상태 관리
    │   └── utils/          # 유틸리티
    ├── package.json
    └── vite.config.js
```

---

## 🔧 Phase 1: 프론트엔드 설정 (현재 완료됨)

### 1. 프론트엔드 의존성 설치

```bash
cd frontend
npm install
```

### 2. 환경 변수 설정

```bash
# .env 파일 생성
cp .env.example .env

# .env 파일 편집 (필요시)
# VITE_API_URL=http://localhost:8000/api
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

### 4. 빌드 테스트

```bash
npm run build
npm run preview
```

---

## 🔧 Phase 2: 백엔드 설정 (구현 예정)

### 1. 백엔드 폴더 생성

```bash
# 프로젝트 루트에서
mkdir -p backend/app/{api,models,schemas,services,utils}
cd backend
```

### 2. 가상환경 생성

```bash
# Python 가상환경 생성
python -m venv venv

# 활성화 (Windows)
venv\Scripts\activate

# 활성화 (macOS/Linux)
source venv/bin/activate
```

### 3. 의존성 설치

```bash
# requirements.txt 생성 후
pip install -r requirements.txt
```

**requirements.txt 예시:**
```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
openai==1.3.7
boto3==1.29.7
python-dotenv==1.0.0
alembic==1.12.1
```

### 4. 환경 변수 설정

```bash
# backend/.env 파일 생성
DATABASE_URL=postgresql://user:password@localhost:5432/interview_db
SECRET_KEY=your-secret-key-here
OPENAI_API_KEY=sk-...
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_S3_BUCKET=your-bucket-name
```

### 5. 데이터베이스 설정

```bash
# PostgreSQL 설치 후 DB 생성
psql -U postgres
CREATE DATABASE interview_db;
\q

# Alembic 초기화
alembic init alembic

# 마이그레이션 실행
alembic upgrade head
```

### 6. 백엔드 서버 실행

```bash
# 개발 모드
uvicorn app.main:app --reload --port 8000

# 또는
python -m uvicorn app.main:app --reload
```

API 문서: `http://localhost:8000/docs`

---

## 🔧 Phase 3: 통합 테스트

### 1. 백엔드 + 프론트엔드 동시 실행

**터미널 1 (백엔드):**
```bash
cd backend
venv\Scripts\activate  # Windows
uvicorn app.main:app --reload --port 8000
```

**터미널 2 (프론트엔드):**
```bash
cd frontend
npm run dev
```

### 2. 기능 테스트

1. **회원가입 테스트**
   - `http://localhost:3000/register` 접속
   - 회원가입 양식 작성
   - 제출 후 로그인 페이지로 리디렉션 확인

2. **로그인 테스트**
   - `http://localhost:3000/login` 접속
   - 로그인 후 대시보드로 이동 확인

3. **채용 공고 업로드 테스트**
   - PDF 파일 업로드
   - AI 분석 결과 확인

4. **자소서 피드백 테스트**
   - 자소서 작성
   - AI 피드백 수신 확인

5. **음성 면접 테스트**
   - 면접 시작
   - 녹음 및 재생 확인
   - 피드백 확인

---

## 🗄️ 데이터베이스 초기 설정

### SQL 스크립트 실행

```sql
-- users 테이블
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    age INTEGER,
    gender VARCHAR(10),
    career_summary TEXT,
    certifications TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- job_postings 테이블
CREATE TABLE job_postings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    original_text TEXT NOT NULL,
    ai_analysis JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- cover_letters 테이블
CREATE TABLE cover_letters (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    job_posting_id INTEGER REFERENCES job_postings(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    ai_feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- interview_sessions 테이블
CREATE TABLE interview_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    cover_letter_id INTEGER REFERENCES cover_letters(id) ON DELETE CASCADE,
    total_feedback TEXT,
    status VARCHAR(20) DEFAULT 'in_progress',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- interview_turns 테이블
CREATE TABLE interview_turns (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES interview_sessions(id) ON DELETE CASCADE,
    turn_number INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    question_audio_url VARCHAR(512),
    answer_audio_url VARCHAR(512),
    answer_stt_text TEXT,
    turn_feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_job_postings_user_id ON job_postings(user_id);
CREATE INDEX idx_cover_letters_user_id ON cover_letters(user_id);
CREATE INDEX idx_interview_sessions_user_id ON interview_sessions(user_id);
CREATE INDEX idx_interview_turns_session_id ON interview_turns(session_id);
```

---

## 🔐 보안 설정

### 1. JWT Secret Key 생성

```python
# Python에서 실행
import secrets
print(secrets.token_urlsafe(32))
```

생성된 키를 `.env` 파일의 `SECRET_KEY`에 설정

### 2. CORS 설정 (Backend)

```python
# app/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # 프론트엔드 URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 📦 배포 준비

### Docker 사용 (선택사항)

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/interview_db
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"

  db:
    image: postgres:15
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=interview_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### 실행

```bash
docker-compose up -d
```

---

## 🐛 트러블슈팅

### 문제 1: 포트 충돌
```bash
# 포트 사용 확인 (Windows)
netstat -ano | findstr :3000
netstat -ano | findstr :8000

# 프로세스 종료
taskkill /PID <PID> /F
```

### 문제 2: 데이터베이스 연결 실패
```bash
# PostgreSQL 서비스 확인
# Windows: services.msc에서 PostgreSQL 서비스 확인
# Linux/Mac: sudo service postgresql status

# 연결 테스트
psql -U postgres -h localhost
```

### 문제 3: Node Modules 오류
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### 문제 4: Python 의존성 오류
```bash
cd backend
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall
```

---

## 📚 추가 리소스

### 공식 문서
- [FastAPI](https://fastapi.tiangolo.com/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [PostgreSQL](https://www.postgresql.org/docs/)

### 참고 문서
- `ARCHITECTURE.md` - 시스템 아키텍처
- `DESIGN_SYSTEM.md` - 디자인 가이드
- `frontend/README.md` - 프론트엔드 상세 가이드

---

## ✅ 체크리스트

### 프론트엔드
- [x] 프로젝트 구조 생성
- [x] 의존성 설치
- [x] Tailwind CSS 설정
- [x] 라우팅 설정
- [x] 인증 시스템 (Zustand)
- [x] 공통 컴포넌트 제작
- [x] 레이아웃 제작
- [x] 주요 페이지 제작
  - [x] Landing Page
  - [x] Login Page
  - [x] Register Page
  - [x] Dashboard Page
  - [x] Job Posting Page
  - [ ] Cover Letter Page (상세 구현 필요)
  - [ ] Interview Page (상세 구현 필요)
  - [ ] Interview Result Page (상세 구현 필요)

### 백엔드
- [ ] 프로젝트 구조 생성
- [ ] FastAPI 기본 설정
- [ ] 데이터베이스 연결
- [ ] 인증 API (JWT)
- [ ] 사용자 관리 API
- [ ] 채용 공고 API
- [ ] 자소서 API
- [ ] 면접 세션 API
- [ ] OpenAI 통합
- [ ] AWS S3 통합

### 통합
- [ ] CORS 설정
- [ ] API 연동 테스트
- [ ] 파일 업로드 테스트
- [ ] 음성 녹음/재생 테스트

### 배포
- [ ] 환경 변수 보안 설정
- [ ] 프로덕션 빌드 테스트
- [ ] Docker 컨테이너화
- [ ] CI/CD 파이프라인

---

## 🤝 기여 방법

1. 이슈 생성
2. 기능 브랜치 생성 (`git checkout -b feature/AmazingFeature`)
3. 커밋 (`git commit -m 'Add some AmazingFeature'`)
4. 푸시 (`git push origin feature/AmazingFeature`)
5. Pull Request 생성

---

## 📞 지원

문제가 발생하면 GitHub Issues에 등록해주세요.

**Happy Coding! 🚀**

