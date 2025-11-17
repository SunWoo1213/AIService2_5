# AI 음성 면접 시스템 - Backend

FastAPI 기반의 RESTful API 서버입니다.

## 🚀 빠른 시작

### 1. 가상환경 생성

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 2. 의존성 설치

```bash
pip install -r requirements.txt
```

### 3. 환경 변수 설정

```bash
# .env 파일 생성
cp .env.example .env

# .env 파일 편집 (필수)
# - DATABASE_URL
# - SECRET_KEY (openssl rand -hex 32)
# - OPENAI_API_KEY
# - AWS 정보
```

### 4. 데이터베이스 초기화

```bash
# PostgreSQL 데이터베이스 생성
psql -U postgres
CREATE DATABASE interview_db;
\q

# 테이블 생성
python init_db.py
```

### 5. 서버 실행

```bash
# 개발 모드 (자동 재시작)
uvicorn app.main:app --reload --port 8000

# 프로덕션 모드
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

서버가 실행되면:
- API: http://localhost:8000
- Docs: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc

---

## 📁 프로젝트 구조

```
backend/
├── app/
│   ├── api/
│   │   ├── dependencies.py      # 의존성 (인증 등)
│   │   └── routes/              # API 엔드포인트
│   │       ├── auth.py          # 인증 (로그인, 회원가입)
│   │       ├── users.py         # 사용자 관리
│   │       ├── job_postings.py  # 채용 공고
│   │       ├── cover_letters.py # 자기소개서
│   │       └── interviews.py    # 음성 면접
│   ├── core/
│   │   ├── config.py            # 설정
│   │   ├── database.py          # 데이터베이스 연결
│   │   └── security.py          # JWT, 암호화
│   ├── models/                  # SQLAlchemy 모델
│   │   ├── user.py
│   │   ├── job_posting.py
│   │   ├── cover_letter.py
│   │   └── interview.py
│   ├── schemas/                 # Pydantic 스키마
│   │   ├── user.py
│   │   ├── job_posting.py
│   │   ├── cover_letter.py
│   │   └── interview.py
│   ├── services/                # 비즈니스 로직
│   │   ├── openai_service.py   # OpenAI 통합
│   │   └── s3_service.py       # AWS S3 통합
│   └── main.py                  # FastAPI 앱
├── requirements.txt
├── .env.example
└── init_db.py
```

---

## 🔌 API 엔드포인트

### 인증 (Authentication)

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/auth/register` | 회원가입 |
| POST | `/api/auth/login` | 로그인 |
| POST | `/api/auth/refresh` | 토큰 갱신 |

### 사용자 (Users)

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/users/me` | 현재 사용자 정보 |
| PATCH | `/api/users/me` | 사용자 정보 수정 |

### 채용 공고 (Job Postings)

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/job-postings` | PDF 업로드 및 분석 |
| GET | `/api/job-postings` | 목록 조회 |
| GET | `/api/job-postings/{id}` | 상세 조회 |
| DELETE | `/api/job-postings/{id}` | 삭제 |

### 자기소개서 (Cover Letters)

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/cover-letters` | 작성 및 피드백 생성 |
| GET | `/api/cover-letters` | 목록 조회 |
| GET | `/api/cover-letters/{id}` | 상세 조회 |
| PATCH | `/api/cover-letters/{id}` | 수정 |
| DELETE | `/api/cover-letters/{id}` | 삭제 |

### 음성 면접 (Interviews)

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/interviews/start` | 면접 시작 |
| POST | `/api/interviews/{id}/answer` | 답변 제출 |
| GET | `/api/interviews/{id}/result` | 결과 조회 |
| GET | `/api/interviews/history` | 이력 조회 |

---

## 🔐 인증

### JWT 토큰

```bash
# 로그인 예시
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

# 응답
{
  "access_token": "eyJhbGci...",
  "refresh_token": "eyJhbGci...",
  "token_type": "bearer"
}
```

### 인증된 요청

```bash
curl -X GET http://localhost:8000/api/users/me \
  -H "Authorization: Bearer eyJhbGci..."
```

---

## 🧪 테스트

```bash
# 테스트 실행
pytest

# 커버리지 포함
pytest --cov=app tests/
```

---

## 🛠️ 개발 가이드

### 새 API 엔드포인트 추가

1. `app/models/`에 모델 추가
2. `app/schemas/`에 스키마 추가
3. `app/api/routes/`에 라우터 추가
4. `app/main.py`에 라우터 등록

### 데이터베이스 마이그레이션

```bash
# Alembic 초기화 (최초 1회)
alembic init alembic

# 마이그레이션 생성
alembic revision --autogenerate -m "Add new table"

# 마이그레이션 적용
alembic upgrade head

# 롤백
alembic downgrade -1
```

---

## 🐛 트러블슈팅

### 데이터베이스 연결 오류

```bash
# PostgreSQL 서비스 확인
sudo service postgresql status

# 연결 테스트
psql -U postgres -h localhost
```

### OpenAI API 오류

```bash
# API 키 확인
echo $OPENAI_API_KEY

# 할당량 확인
https://platform.openai.com/account/usage
```

### AWS S3 오류

```bash
# 자격 증명 확인
aws configure list

# 버킷 접근 테스트
aws s3 ls s3://your-bucket-name
```

---

## 📚 의존성

### 핵심
- FastAPI 0.104.1
- Uvicorn 0.24.0
- SQLAlchemy 2.0.23
- PostgreSQL (psycopg2-binary)

### AI/ML
- OpenAI 1.3.7
- PyPDF2 3.0.1

### 클라우드
- Boto3 1.29.7 (AWS S3)

---

## 🔒 보안

### 환경 변수

절대 `.env` 파일을 Git에 커밋하지 마세요!

### SECRET_KEY 생성

```bash
# OpenSSL 사용
openssl rand -hex 32

# Python 사용
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

---

## 📞 문의

이슈나 질문은 GitHub Issues에 등록해주세요.

**Happy Coding! 🚀**

