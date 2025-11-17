from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Vercel이 인식할 수 있도록 app이라는 이름의 FastAPI 인스턴스 생성
app = FastAPI(title="AI Interview API", version="1.0.0")

# CORS 설정 (프론트엔드에서 API 호출 가능하도록)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 프로덕션에서는 특정 도메인으로 제한 필요
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 루트 엔드포인트
@app.get("/")
async def root():
    return {"message": "Welcome to AI Interview API"}

# 예시 엔드포인트: /api/users
@app.get("/api/users")
async def get_users():
    return {"user": "Guest"}

# Health check 엔드포인트
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "API is running"}


