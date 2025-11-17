# 음성 면접 시스템 아키텍처 설계 문서

## 📋 목차
1. [시스템 개요](#시스템-개요)
2. [핵심 아키텍처 원칙](#핵심-아키텍처-원칙)
3. [기술 스택](#기술-스택)
4. [데이터베이스 설계](#데이터베이스-설계)
5. [API 설계](#api-설계)
6. [기능 흐름](#기능-흐름)
7. [보안 및 인증](#보안-및-인증)
8. [배포 아키텍처](#배포-아키텍처)

---

## 시스템 개요

### 목적
사용자의 스펙, 채용 공고, 자기소개서를 기반으로 **음성 모의 면접 및 AI 피드백**을 제공하는 서비스

### 핵심 기능
1. **채용 공고 분석**: PDF/텍스트로 업로드한 공고를 AI가 분석하여 핵심 키워드와 요구 역량 추출
2. **자기소개서 피드백**: 사용자 스펙과 공고를 고려한 맞춤형 자소서 피드백 제공
3. **음성 모의 면접**: 
   - AI가 생성한 자연스러운 TTS 음성 질문 (5턴)
   - 사용자 음성 답변 녹음 및 STT 변환
   - 개별 답변 및 종합 피드백 제공
   - 답변 다시 듣기 기능

---

## 핵심 아키텍처 원칙

### 1. API-First 설계
클라이언트와 백엔드를 완벽하게 분리하여 **웹과 모바일 앱** 모두 지원

```
┌─────────────────────────────────────────────┐
│         Presentation Layer                   │
│  ┌──────────────┐      ┌──────────────┐    │
│  │   Web (SPA)  │      │  Mobile App  │    │
│  │ React/Vue    │      │ RN/Flutter   │    │
│  └──────────────┘      └──────────────┘    │
└─────────────────────────────────────────────┘
                    ↓ REST API (JSON)
┌─────────────────────────────────────────────┐
│         Logic & Data Layer                   │
│  ┌───────────────────────────────────────┐  │
│  │     Backend API Server                │  │
│  │   FastAPI / NestJS                    │  │
│  │   - 인증/인가 (JWT)                   │  │
│  │   - 비즈니스 로직                     │  │
│  │   - AI 모델 호출                      │  │
│  │   - 파일 관리                         │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│         Resources Layer                      │
│  ┌────────────┐  ┌────────────┐  ┌────────┐│
│  │ PostgreSQL │  │  AWS S3    │  │ OpenAI ││
│  │    DB      │  │   Storage  │  │   API  ││
│  └────────────┘  └────────────┘  └────────┘│
└─────────────────────────────────────────────┘
```

### 2. 책임 분리

| Layer | 역할 | 기술 |
|-------|------|------|
| **Client** | UI 렌더링, 사용자 입력, 오디오 녹음/재생 | React/Vue, MediaRecorder API |
| **Backend** | 비즈니스 로직, AI 호출, 데이터 관리 | FastAPI/NestJS |
| **Database** | 구조화된 데이터 저장 | PostgreSQL |
| **Storage** | 바이너리 파일 저장 (PDF, 오디오) | AWS S3 / GCS |
| **AI** | 분석, 질문 생성, 피드백, TTS, STT | OpenAI GPT-4o, TTS-1-HD, Whisper |

---

## 기술 스택

### Backend
- **Language**: Python 3.11+
- **Framework**: FastAPI
- **ORM**: SQLAlchemy 2.0
- **Database**: PostgreSQL 15+
- **Authentication**: JWT (python-jose)
- **File Storage**: boto3 (AWS S3) or google-cloud-storage
- **AI Integration**: OpenAI Python SDK

### Frontend (Web)
- **Framework**: React 18+ or Vue 3+
- **State Management**: Zustand / Pinia
- **HTTP Client**: Axios
- **Audio**: MediaRecorder API, HTML5 Audio
- **UI**: TailwindCSS / Material-UI

### Infrastructure
- **Cloud Provider**: AWS / GCP
- **Storage**: S3 / Cloud Storage
- **Deployment**: Docker + Kubernetes / AWS ECS
- **CI/CD**: GitHub Actions

---

## 데이터베이스 설계

### ERD 개요
```
users (1) ─── (N) job_postings
   │                   │
   │                   │
   └─── (N) cover_letters (N) ─── (1) job_postings
              │
              │
         (1) ├─── (N) interview_sessions
                        │
                        │
                   (1) └─── (N) interview_turns
```

### 테이블 스키마

#### 1. users (사용자 스펙)
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    age INTEGER,
    gender VARCHAR(10), -- 'male', 'female', 'other'
    career_summary TEXT, -- 경력 요약 (JSONB 가능)
    certifications TEXT, -- 자격증 목록 (JSONB 가능)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

#### 2. job_postings (채용 공고)
```sql
CREATE TABLE job_postings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255), -- 공고 제목 (선택)
    original_text TEXT NOT NULL, -- PDF 추출 텍스트
    ai_analysis JSONB, -- {"keywords": [...], "requirements": [...]}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_job_postings_user_id ON job_postings(user_id);
```

#### 3. cover_letters (자기소개서)
```sql
CREATE TABLE cover_letters (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    job_posting_id INTEGER REFERENCES job_postings(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    ai_feedback TEXT, -- AI 피드백
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cover_letters_user_id ON cover_letters(user_id);
CREATE INDEX idx_cover_letters_job_posting_id ON cover_letters(job_posting_id);
```

#### 4. interview_sessions (면접 세션)
```sql
CREATE TABLE interview_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    cover_letter_id INTEGER REFERENCES cover_letters(id) ON DELETE CASCADE,
    total_feedback TEXT, -- 종합 피드백
    status VARCHAR(20) DEFAULT 'in_progress', -- 'in_progress', 'completed'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE INDEX idx_interview_sessions_user_id ON interview_sessions(user_id);
CREATE INDEX idx_interview_sessions_cover_letter_id ON interview_sessions(cover_letter_id);
```

#### 5. interview_turns (면접 턴)
```sql
CREATE TABLE interview_turns (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES interview_sessions(id) ON DELETE CASCADE,
    turn_number INTEGER NOT NULL, -- 1~5
    question_text TEXT NOT NULL, -- AI 생성 질문
    question_audio_url VARCHAR(512), -- TTS 음성 파일 URL
    answer_audio_url VARCHAR(512), -- 사용자 녹음 파일 URL
    answer_stt_text TEXT, -- STT 변환 텍스트
    turn_feedback TEXT, -- 개별 답변 피드백
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_interview_turns_session_id ON interview_turns(session_id);
CREATE UNIQUE INDEX idx_interview_turns_session_turn ON interview_turns(session_id, turn_number);
```

---

## API 설계

### 인증 (Authentication)

#### POST /api/auth/register
회원가입
```json
Request:
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "홍길동",
  "age": 28,
  "gender": "male",
  "career_summary": "백엔드 개발 3년",
  "certifications": "정보처리기사"
}

Response:
{
  "id": 1,
  "email": "user@example.com",
  "name": "홍길동"
}
```

#### POST /api/auth/login
로그인
```json
Request:
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response:
{
  "access_token": "eyJhbGci...",
  "refresh_token": "eyJhbGci...",
  "token_type": "bearer"
}
```

#### POST /api/auth/refresh
토큰 갱신
```json
Request:
{
  "refresh_token": "eyJhbGci..."
}

Response:
{
  "access_token": "eyJhbGci...",
  "token_type": "bearer"
}
```

---

### 사용자 관리 (Users)

#### GET /api/users/me
현재 사용자 정보 조회
```json
Headers: Authorization: Bearer {access_token}

Response:
{
  "id": 1,
  "email": "user@example.com",
  "name": "홍길동",
  "age": 28,
  "gender": "male",
  "career_summary": "백엔드 개발 3년",
  "certifications": "정보처리기사"
}
```

#### PATCH /api/users/me
사용자 정보 수정
```json
Headers: Authorization: Bearer {access_token}

Request:
{
  "career_summary": "백엔드 개발 4년",
  "certifications": "정보처리기사, AWS SAA"
}

Response:
{
  "id": 1,
  "email": "user@example.com",
  "career_summary": "백엔드 개발 4년",
  "certifications": "정보처리기사, AWS SAA"
}
```

---

### 채용 공고 (Job Postings)

#### POST /api/job-postings
공고 업로드 및 분석
```json
Headers: Authorization: Bearer {access_token}
Content-Type: multipart/form-data

Request (FormData):
- file: <PDF 파일>
- title: "백엔드 개발자 채용" (optional)

Response:
{
  "id": 1,
  "title": "백엔드 개발자 채용",
  "original_text": "우리 회사는...",
  "ai_analysis": {
    "keywords": ["Python", "FastAPI", "PostgreSQL"],
    "requirements": ["백엔드 개발 경력 3년 이상", "RESTful API 설계 경험"]
  },
  "created_at": "2025-11-14T10:00:00Z"
}
```

#### GET /api/job-postings
공고 목록 조회
```json
Headers: Authorization: Bearer {access_token}

Response:
{
  "items": [
    {
      "id": 1,
      "title": "백엔드 개발자 채용",
      "ai_analysis": {...},
      "created_at": "2025-11-14T10:00:00Z"
    }
  ],
  "total": 1
}
```

#### GET /api/job-postings/{id}
공고 상세 조회
```json
Headers: Authorization: Bearer {access_token}

Response:
{
  "id": 1,
  "title": "백엔드 개발자 채용",
  "original_text": "우리 회사는...",
  "ai_analysis": {
    "keywords": ["Python", "FastAPI", "PostgreSQL"],
    "requirements": ["백엔드 개발 경력 3년 이상"]
  },
  "created_at": "2025-11-14T10:00:00Z"
}
```

---

### 자기소개서 (Cover Letters)

#### POST /api/cover-letters
자소서 작성 및 피드백 요청
```json
Headers: Authorization: Bearer {access_token}

Request:
{
  "job_posting_id": 1,
  "content": "저는 3년간 백엔드 개발을..."
}

Response:
{
  "id": 1,
  "job_posting_id": 1,
  "content": "저는 3년간 백엔드 개발을...",
  "ai_feedback": "전반적으로 경력이 잘 드러나나, 구체적인 프로젝트 성과를 추가하면 좋겠습니다...",
  "created_at": "2025-11-14T11:00:00Z"
}
```

#### GET /api/cover-letters
자소서 목록 조회
```json
Headers: Authorization: Bearer {access_token}

Response:
{
  "items": [
    {
      "id": 1,
      "job_posting_id": 1,
      "content": "저는 3년간...",
      "ai_feedback": "전반적으로...",
      "created_at": "2025-11-14T11:00:00Z"
    }
  ],
  "total": 1
}
```

#### GET /api/cover-letters/{id}
자소서 상세 조회
```json
Headers: Authorization: Bearer {access_token}

Response:
{
  "id": 1,
  "job_posting_id": 1,
  "job_posting": {
    "id": 1,
    "title": "백엔드 개발자 채용",
    "ai_analysis": {...}
  },
  "content": "저는 3년간 백엔드 개발을...",
  "ai_feedback": "전반적으로 경력이 잘 드러나나...",
  "created_at": "2025-11-14T11:00:00Z"
}
```

---

### 면접 세션 (Interview Sessions)

#### POST /api/interviews/start
면접 시작
```json
Headers: Authorization: Bearer {access_token}

Request:
{
  "cover_letter_id": 1
}

Response:
{
  "session_id": 1,
  "status": "in_progress",
  "current_turn": {
    "turn_number": 1,
    "question_text": "먼저 자기소개를 부탁드립니다.",
    "question_audio_url": "https://s3.../question_1.mp3"
  }
}
```

#### POST /api/interviews/{session_id}/answer
답변 제출 (턴별)
```json
Headers: Authorization: Bearer {access_token}
Content-Type: multipart/form-data

Request (FormData):
- turn_number: 1
- audio: <녹음된 오디오 파일 Blob>

Response:
{
  "turn_number": 1,
  "answer_audio_url": "https://s3.../answer_1.mp3",
  "answer_stt_text": "안녕하세요, 저는 3년간...",
  "next_turn": {
    "turn_number": 2,
    "question_text": "프로젝트에서 가장 어려웠던 점은?",
    "question_audio_url": "https://s3.../question_2.mp3"
  }
}

// 5턴 완료 시
Response:
{
  "turn_number": 5,
  "answer_audio_url": "https://s3.../answer_5.mp3",
  "answer_stt_text": "...",
  "interview_completed": true,
  "message": "면접이 종료되었습니다. 피드백을 생성 중입니다."
}
```

#### GET /api/interviews/{session_id}/result
면접 결과 및 피드백 조회
```json
Headers: Authorization: Bearer {access_token}

Response:
{
  "session_id": 1,
  "status": "completed",
  "total_feedback": "전반적으로 답변이 구조적이었으나...",
  "turns": [
    {
      "turn_number": 1,
      "question_text": "먼저 자기소개를 부탁드립니다.",
      "question_audio_url": "https://s3.../question_1.mp3",
      "answer_audio_url": "https://s3.../answer_1.mp3",
      "answer_stt_text": "안녕하세요, 저는...",
      "turn_feedback": "자기소개가 명확하나, 핵심 역량을 더 강조하면 좋겠습니다."
    },
    // ... turns 2-5
  ],
  "created_at": "2025-11-14T12:00:00Z",
  "completed_at": "2025-11-14T12:15:00Z"
}
```

#### GET /api/interviews/history
면접 이력 조회
```json
Headers: Authorization: Bearer {access_token}

Response:
{
  "items": [
    {
      "session_id": 1,
      "cover_letter_id": 1,
      "status": "completed",
      "created_at": "2025-11-14T12:00:00Z",
      "completed_at": "2025-11-14T12:15:00Z"
    }
  ],
  "total": 1
}
```

---

## 기능 흐름

### 1. 자기소개서 피드백 흐름

```mermaid
sequenceDiagram
    participant C as Client (Web/App)
    participant B as Backend API
    participant DB as PostgreSQL
    participant AI as OpenAI GPT-4o

    Note over C,AI: 1. 공고 업로드 및 분석
    C->>B: POST /api/job-postings (PDF)
    B->>B: PDF 텍스트 추출
    B->>DB: INSERT job_postings (original_text)
    B->>AI: 공고 분석 요청 (keywords, requirements)
    AI-->>B: 분석 결과 JSON
    B->>DB: UPDATE job_postings (ai_analysis)
    B-->>C: 공고 분석 결과

    Note over C,AI: 2. 자소서 작성 및 피드백
    C->>C: 사용자가 자소서 작성
    C->>B: POST /api/cover-letters
    B->>DB: SELECT users, job_postings
    B->>AI: 피드백 요청 (스펙 + 공고 + 자소서)
    AI-->>B: 피드백 텍스트
    B->>DB: INSERT cover_letters (ai_feedback)
    B-->>C: 자소서 피드백
    C->>C: 피드백 UI 표시
```

**상세 단계:**

1. **공고 업로드**
   - Client: PDF 파일을 FormData로 전송
   - Backend: PDF에서 텍스트 추출 (PyPDF2, pdfplumber 등)
   - Backend: `job_postings` 테이블에 저장

2. **공고 분석**
   - Backend → GPT-4o: 
     ```
     "다음 채용 공고를 분석하여 JSON으로 반환해주세요:
     - keywords: 핵심 키워드 배열
     - requirements: 요구 역량 배열
     
     [공고 텍스트]"
     ```
   - Backend: 결과를 `ai_analysis` JSONB 컬럼에 저장

3. **자소서 제출**
   - Client: 분석 결과를 사용자에게 보여주고, 자소서 텍스트 입력 받음
   - Client → Backend: 자소서 텍스트 전송

4. **피드백 생성**
   - Backend: DB에서 users, job_postings, cover_letters 조합
   - Backend → GPT-4o:
     ```
     "당신은 채용 전문가입니다.
     
     [지원자 스펙]
     나이: 28세, 경력: 백엔드 개발 3년, 자격증: 정보처리기사
     
     [채용 공고 분석]
     키워드: Python, FastAPI, PostgreSQL
     요구사항: 백엔드 개발 경력 3년 이상, RESTful API 설계 경험
     
     [자기소개서]
     저는 3년간 백엔드 개발을...
     
     위 자소서에 대한 전문적인 피드백을 제공해주세요."
     ```
   - Backend: 피드백을 `ai_feedback`에 저장
   - Backend → Client: 피드백 전송

---

### 2. 음성 모의 면접 흐름

```mermaid
sequenceDiagram
    participant C as Client
    participant B as Backend
    participant DB as PostgreSQL
    participant S3 as AWS S3
    participant AI as OpenAI (GPT/TTS/Whisper)

    Note over C,AI: A. 면접 시작
    C->>B: POST /api/interviews/start
    B->>DB: INSERT interview_sessions
    B->>DB: SELECT users, job_postings, cover_letters
    B->>AI: GPT-4o: 첫 질문 생성
    AI-->>B: Q1 텍스트
    B->>AI: TTS-1-HD: Q1 음성 생성
    AI-->>B: Q1 MP3
    B->>S3: 업로드 Q1 MP3
    S3-->>B: question_audio_url
    B->>DB: INSERT interview_turns (turn=1)
    B-->>C: {turn: 1, question, audioUrl}

    Note over C,AI: B. 면접 루프 (Turn 1-5)
    C->>C: <audio> 재생 (question_audio_url)
    C->>C: TTS 종료 후 자동 녹음 시작 (60초)
    C->>C: 녹음 종료 → Blob 생성
    C->>B: POST /api/interviews/{id}/answer (FormData: audio)
    B->>S3: 업로드 답변 오디오
    S3-->>B: answer_audio_url
    B->>DB: UPDATE interview_turns (answer_audio_url)
    B->>AI: Whisper: STT 변환
    AI-->>B: answer_stt_text
    B->>DB: UPDATE interview_turns (answer_stt_text)
    
    alt Turn < 5
        B->>AI: GPT-4o: 다음 질문 생성 (대화 이력 포함)
        AI-->>B: Q(n+1) 텍스트
        B->>AI: TTS-1-HD: Q(n+1) 음성 생성
        AI-->>B: Q(n+1) MP3
        B->>S3: 업로드 Q(n+1) MP3
        S3-->>B: question_audio_url
        B->>DB: INSERT interview_turns (turn=n+1)
        B-->>C: {turn: n+1, question, audioUrl}
        Note over C: 루프 반복
    else Turn == 5
        B-->>C: {interview_completed: true}
    end

    Note over C,AI: C. 면접 종료 및 피드백
    C->>C: "피드백 생성 중..." UI 표시
    B->>DB: SELECT all turns (Q1~Q5, A1~A5)
    B->>AI: GPT-4o: 종합 + 개별 피드백 요청
    AI-->>B: 피드백 JSON
    B->>DB: UPDATE interview_sessions (total_feedback)
    B->>DB: UPDATE interview_turns (turn_feedback for each)
    B->>DB: UPDATE interview_sessions (status='completed')
    
    C->>B: GET /api/interviews/{id}/result
    B->>DB: SELECT session + turns
    B-->>C: 전체 피드백 데이터
    C->>C: 결과 페이지 렌더링
    C->>C: 각 턴별 답변 오디오 플레이어 표시
```

**상세 단계:**

#### A. 면접 시작 (1회성)

1. **면접 초기화**
   ```python
   # Backend
   session = InterviewSession(
       user_id=current_user.id,
       cover_letter_id=request.cover_letter_id,
       status="in_progress"
   )
   db.add(session)
   ```

2. **첫 질문 생성 (Turn 1)**
   ```python
   # 데이터 조합
   user_spec = db.query(User).get(current_user.id)
   job_posting = db.query(JobPosting).get(cover_letter.job_posting_id)
   cover_letter = db.query(CoverLetter).get(request.cover_letter_id)
   
   # GPT-4o 호출
   prompt = f"""
   당신은 {job_posting.ai_analysis['keywords'][0]} 분야의 최고 전문가이자 면접관입니다.
   
   [지원자 스펙]
   {user_spec.career_summary}
   
   [채용 공고 요구사항]
   {job_posting.ai_analysis['requirements']}
   
   [자기소개서]
   {cover_letter.content}
   
   첫 번째 면접 질문을 해주세요. (총 5개 질문 예정)
   """
   
   response = openai.ChatCompletion.create(
       model="gpt-4o",
       messages=[{"role": "system", "content": prompt}]
   )
   question_text = response.choices[0].message.content
   ```

3. **TTS 음성 생성**
   ```python
   # OpenAI TTS-1-HD 호출
   tts_response = openai.audio.speech.create(
       model="tts-1-hd",
       voice="alloy",  # 또는 "nova", "shimmer" 등
       input=question_text
   )
   
   audio_content = tts_response.content
   ```

4. **S3 업로드**
   ```python
   # AWS S3 업로드
   file_key = f"interviews/{session.id}/question_{turn_number}.mp3"
   s3_client.put_object(
       Bucket=BUCKET_NAME,
       Key=file_key,
       Body=audio_content,
       ContentType="audio/mpeg"
   )
   question_audio_url = f"https://{BUCKET_NAME}.s3.amazonaws.com/{file_key}"
   ```

5. **턴 데이터 저장**
   ```python
   turn = InterviewTurn(
       session_id=session.id,
       turn_number=1,
       question_text=question_text,
       question_audio_url=question_audio_url
   )
   db.add(turn)
   ```

#### B. 면접 루프 (Turn 1~5)

**Client 측 로직:**

1. **질문 재생**
   ```javascript
   // React 예시
   const [currentTurn, setCurrentTurn] = useState(null);
   const audioRef = useRef(null);

   useEffect(() => {
     if (currentTurn?.question_audio_url) {
       audioRef.current.src = currentTurn.question_audio_url;
       audioRef.current.play();
     }
   }, [currentTurn]);

   // Audio 요소
   <audio 
     ref={audioRef} 
     onEnded={handleQuestionEnded}  // TTS 재생 종료 시
   />
   ```

2. **자동 녹음 시작**
   ```javascript
   const handleQuestionEnded = async () => {
     // TTS 재생 완료 후 녹음 자동 시작
     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
     const mediaRecorder = new MediaRecorder(stream);
     
     const chunks = [];
     mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
     
     mediaRecorder.onstop = async () => {
       const audioBlob = new Blob(chunks, { type: 'audio/webm' });
       await submitAnswer(audioBlob);
     };
     
     mediaRecorder.start();
     
     // 60초 타이머
     setTimeout(() => {
       mediaRecorder.stop();
     }, 60000);
     
     // 또는 사용자 수동 중지
     setRecorder(mediaRecorder);
   };
   ```

3. **답변 제출**
   ```javascript
   const submitAnswer = async (audioBlob) => {
     const formData = new FormData();
     formData.append('turn_number', currentTurn.turn_number);
     formData.append('audio', audioBlob, `answer_${currentTurn.turn_number}.webm`);
     
     const response = await axios.post(
       `/api/interviews/${sessionId}/answer`,
       formData,
       {
         headers: {
           'Content-Type': 'multipart/form-data',
           'Authorization': `Bearer ${token}`
         }
       }
     );
     
     if (response.data.interview_completed) {
       // 면접 종료
       navigate(`/interviews/${sessionId}/result`);
     } else {
       // 다음 턴
       setCurrentTurn(response.data.next_turn);
     }
   };
   ```

**Backend 측 로직:**

1. **답변 수신 및 저장**
   ```python
   @router.post("/{session_id}/answer")
   async def submit_answer(
       session_id: int,
       turn_number: int = Form(...),
       audio: UploadFile = File(...),
       current_user: User = Depends(get_current_user)
   ):
       # S3 업로드
       file_key = f"interviews/{session_id}/answer_{turn_number}.{audio.filename.split('.')[-1]}"
       s3_client.upload_fileobj(
           audio.file,
           BUCKET_NAME,
           file_key,
           ExtraArgs={"ContentType": audio.content_type}
       )
       answer_audio_url = f"https://{BUCKET_NAME}.s3.amazonaws.com/{file_key}"
       
       # DB 업데이트
       turn = db.query(InterviewTurn).filter_by(
           session_id=session_id,
           turn_number=turn_number
       ).first()
       turn.answer_audio_url = answer_audio_url
       db.commit()
   ```

2. **STT 변환**
   ```python
       # Whisper STT
       audio_file = s3_client.get_object(Bucket=BUCKET_NAME, Key=file_key)
       transcript = openai.audio.transcriptions.create(
           model="whisper-1",
           file=audio_file["Body"]
       )
       
       turn.answer_stt_text = transcript.text
       db.commit()
   ```

3. **다음 질문 생성 (Turn < 5)**
   ```python
       if turn_number < 5:
           # 대화 이력 구성
           previous_turns = db.query(InterviewTurn).filter_by(
               session_id=session_id
           ).order_by(InterviewTurn.turn_number).all()
           
           conversation_history = "\n".join([
               f"Q{t.turn_number}: {t.question_text}\nA{t.turn_number}: {t.answer_stt_text}"
               for t in previous_turns if t.answer_stt_text
           ])
           
           # GPT-4o 호출
           prompt = f"""
           이전 대화:
           {conversation_history}
           
           현재 {turn_number + 1}/5 턴입니다.
           이전 답변을 고려하여 다음 질문을 해주세요.
           """
           
           response = openai.ChatCompletion.create(
               model="gpt-4o",
               messages=[{"role": "system", "content": prompt}]
           )
           next_question_text = response.choices[0].message.content
           
           # TTS 생성 (A-3과 동일)
           # ... TTS 및 S3 업로드 ...
           
           # 새 턴 생성
           next_turn = InterviewTurn(
               session_id=session_id,
               turn_number=turn_number + 1,
               question_text=next_question_text,
               question_audio_url=next_question_audio_url
           )
           db.add(next_turn)
           db.commit()
           
           return {
               "turn_number": turn_number,
               "answer_audio_url": answer_audio_url,
               "answer_stt_text": transcript.text,
               "next_turn": {
                   "turn_number": turn_number + 1,
                   "question_text": next_question_text,
                   "question_audio_url": next_question_audio_url
               }
           }
   ```

4. **면접 종료 (Turn == 5)**
   ```python
       else:
           return {
               "turn_number": turn_number,
               "answer_audio_url": answer_audio_url,
               "answer_stt_text": transcript.text,
               "interview_completed": True,
               "message": "면접이 종료되었습니다. 피드백을 생성 중입니다."
           }
   ```

#### C. 면접 종료 및 피드백 생성

1. **피드백 생성 (백그라운드 작업 추천)**
   ```python
   # 비동기 작업 (Celery, FastAPI BackgroundTasks 등)
   @router.post("/{session_id}/generate-feedback")
   async def generate_feedback(
       session_id: int,
       background_tasks: BackgroundTasks
   ):
       background_tasks.add_task(generate_feedback_task, session_id)
       return {"message": "피드백 생성이 시작되었습니다."}

   def generate_feedback_task(session_id: int):
       # 전체 턴 조회
       turns = db.query(InterviewTurn).filter_by(
           session_id=session_id
       ).order_by(InterviewTurn.turn_number).all()
       
       # 대화 이력 구성
       full_conversation = "\n\n".join([
           f"[질문 {t.turn_number}]\n{t.question_text}\n\n[답변 {t.turn_number}]\n{t.answer_stt_text}"
           for t in turns
       ])
       
       # GPT-4o 피드백 요청
       prompt = f"""
       다음은 5턴의 면접 전체 기록입니다.
       
       {full_conversation}
       
       다음 형식으로 피드백을 생성해주세요:
       
       ## 종합 피드백
       [전체적인 평가]
       
       ## 개별 답변 피드백
       ### 질문 1
       [피드백]
       
       ### 질문 2
       [피드백]
       
       ...
       """
       
       response = openai.ChatCompletion.create(
           model="gpt-4o",
           messages=[{"role": "system", "content": prompt}]
       )
       
       feedback_text = response.choices[0].message.content
       
       # 파싱 (정규표현식 등)
       total_feedback = extract_total_feedback(feedback_text)
       turn_feedbacks = extract_turn_feedbacks(feedback_text)  # List[str]
       
       # DB 저장
       session = db.query(InterviewSession).get(session_id)
       session.total_feedback = total_feedback
       session.status = "completed"
       session.completed_at = datetime.utcnow()
       
       for i, turn in enumerate(turns):
           turn.turn_feedback = turn_feedbacks[i]
       
       db.commit()
   ```

2. **결과 조회 (Client)**
   ```javascript
   // 결과 페이지 진입
   const fetchResult = async () => {
     const response = await axios.get(
       `/api/interviews/${sessionId}/result`,
       {
         headers: { Authorization: `Bearer ${token}` }
       }
     );
     
     setResult(response.data);
   };

   // UI 렌더링
   return (
     <div>
       <h1>면접 결과</h1>
       
       {/* 종합 피드백 */}
       <section>
         <h2>종합 피드백</h2>
         <p>{result.total_feedback}</p>
       </section>
       
       {/* 개별 턴 */}
       {result.turns.map((turn) => (
         <div key={turn.turn_number}>
           <h3>질문 {turn.turn_number}</h3>
           <p>{turn.question_text}</p>
           
           {/* 내 답변 다시 듣기 */}
           <audio controls src={turn.answer_audio_url} />
           <p><strong>답변 텍스트:</strong> {turn.answer_stt_text}</p>
           
           <h4>피드백</h4>
           <p>{turn.turn_feedback}</p>
         </div>
       ))}
     </div>
   );
   ```

---

## 보안 및 인증

### JWT (JSON Web Token)

#### 토큰 구조
- **Access Token**: 15분 만료 (API 요청에 사용)
- **Refresh Token**: 7일 만료 (Access Token 갱신에 사용)

#### 토큰 저장
- **Web**: `localStorage` (XSS 주의 - CSP 설정 필요)
- **Mobile**: SecureStorage / Keychain

#### 요청 헤더
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 백엔드 검증
```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> User:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    user = db.query(User).get(user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    return user
```

### 파일 접근 제어

#### S3 Private Bucket + Presigned URL
```python
# 파일 업로드 시 private로 설정
s3_client.put_object(
    Bucket=BUCKET_NAME,
    Key=file_key,
    Body=file_content,
    ACL='private'  # 중요!
)

# 클라이언트에게는 임시 접근 URL 제공
def generate_presigned_url(file_key: str) -> str:
    url = s3_client.generate_presigned_url(
        'get_object',
        Params={'Bucket': BUCKET_NAME, 'Key': file_key},
        ExpiresIn=3600  # 1시간
    )
    return url

# API 응답 시
return {
    "answer_audio_url": generate_presigned_url(turn.answer_audio_url)
}
```

### CORS 설정
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 배포 아키텍처

### 개발 환경
```
┌─────────────────────────────────────┐
│  Local Development                   │
│  - Backend: localhost:8000           │
│  - Frontend: localhost:3000          │
│  - DB: PostgreSQL Docker Container   │
│  - Storage: LocalStack (S3 emulator) │
└─────────────────────────────────────┘
```

### 프로덕션 환경
```
┌──────────────────────────────────────────────────────┐
│  Cloud Infrastructure (AWS Example)                   │
│                                                       │
│  ┌─────────────┐        ┌──────────────┐            │
│  │   Route 53  │───────>│     ALB      │            │
│  │    (DNS)    │        │ (Load Balancer)           │
│  └─────────────┘        └──────────────┘            │
│                               │                       │
│         ┌─────────────────────┼─────────────────┐   │
│         │                     │                  │   │
│    ┌────▼────┐          ┌────▼────┐      ┌─────▼───┐
│    │   ECS   │          │   ECS   │      │   S3    ││
│    │ (Backend│          │ (Backend│      │ (Files) ││
│    │ Container)         │ Container)     └─────────┘│
│    └────┬────┘          └────┬────┘                 │
│         │                     │                      │
│         └─────────┬───────────┘                      │
│                   │                                  │
│            ┌──────▼───────┐                          │
│            │   RDS        │                          │
│            │ (PostgreSQL) │                          │
│            └──────────────┘                          │
│                                                       │
│  Frontend: CloudFront + S3 (Static Hosting)          │
└──────────────────────────────────────────────────────┘
```

### Docker Compose (개발용)
```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/interview_db
      - AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
      - AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    depends_on:
      - db
    volumes:
      - ./backend:/app

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

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules

volumes:
  postgres_data:
```

---

## 확장 고려사항

### 1. 성능 최적화
- **캐싱**: Redis로 공고 분석 결과, 사용자 세션 캐싱
- **비동기 작업**: Celery로 TTS/STT/피드백 생성을 백그라운드 처리
- **CDN**: CloudFront로 정적 파일 및 오디오 파일 배포

### 2. 모니터링
- **로깅**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **메트릭**: Prometheus + Grafana
- **에러 추적**: Sentry

### 3. 비용 최적화
- **S3 Lifecycle**: 오래된 녹음 파일은 Glacier로 자동 이전
- **OpenAI API**: 토큰 사용량 모니터링 및 최적화
- **DB Indexing**: 자주 조회되는 컬럼에 인덱스 추가

### 4. 향후 기능
- **실시간 피드백**: WebSocket으로 답변 중 실시간 음성 분석
- **다국어 지원**: i18n, 다국어 TTS/STT
- **모바일 앱**: React Native 또는 Flutter 개발

---

## 개발 단계별 가이드

### Phase 1: 기반 구축 (1-2주)
- [ ] 프로젝트 구조 설정 (Backend: FastAPI, Frontend: React)
- [ ] PostgreSQL 스키마 생성 및 마이그레이션 도구 설정 (Alembic)
- [ ] JWT 인증 구현 (회원가입, 로그인, 토큰 갱신)
- [ ] AWS S3 연동 및 파일 업로드 기능

### Phase 2: 자기소개서 피드백 (1주)
- [ ] 채용 공고 업로드 API (PDF 파싱)
- [ ] OpenAI GPT-4o 공고 분석 API
- [ ] 자소서 작성 및 피드백 API
- [ ] 프론트엔드: 공고/자소서 입력 UI

### Phase 3: 음성 면접 (2-3주)
- [ ] 면접 시작 API (GPT-4o 질문 생성)
- [ ] OpenAI TTS-1-HD 음성 생성
- [ ] 프론트엔드: MediaRecorder 녹음 기능
- [ ] 답변 제출 API (S3 업로드, Whisper STT)
- [ ] 다음 질문 생성 로직 (대화 이력 관리)
- [ ] 피드백 생성 API
- [ ] 프론트엔드: 결과 페이지 (오디오 플레이어 포함)

### Phase 4: 테스트 및 최적화 (1주)
- [ ] 단위 테스트 및 통합 테스트
- [ ] 성능 최적화 (DB 쿼리, API 응답 시간)
- [ ] UI/UX 개선
- [ ] 에러 핸들링 강화

### Phase 5: 배포 (1주)
- [ ] Docker 이미지 빌드
- [ ] AWS 인프라 구성 (ECS, RDS, S3, CloudFront)
- [ ] CI/CD 파이프라인 구축 (GitHub Actions)
- [ ] 모니터링 및 로깅 설정

---

## 참고 자료

### OpenAI API Docs
- [GPT-4o](https://platform.openai.com/docs/models/gpt-4o)
- [TTS-1-HD](https://platform.openai.com/docs/guides/text-to-speech)
- [Whisper](https://platform.openai.com/docs/guides/speech-to-text)

### Backend
- [FastAPI](https://fastapi.tiangolo.com/)
- [SQLAlchemy](https://docs.sqlalchemy.org/)
- [Alembic](https://alembic.sqlalchemy.org/)

### Frontend
- [MediaRecorder API](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

### Cloud
- [AWS S3 Presigned URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/ShareObjectPreSignedURL.html)
- [AWS ECS](https://docs.aws.amazon.com/ecs/)

---

## 라이선스
MIT License

---

**작성일**: 2025-11-14  
**버전**: 1.0.0  
**문서 관리**: 변경 사항이 있을 때마다 버전 업데이트 및 이력 관리

