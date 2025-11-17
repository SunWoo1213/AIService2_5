"""
OpenAI Service
"""
from openai import OpenAI
from app.core.config import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY)


class OpenAIService:
    """Service for OpenAI API integration"""
    
    @staticmethod
    async def analyze_job_posting(text: str) -> dict:
        """
        Analyze job posting and extract keywords and requirements
        """
        prompt = f"""다음 채용 공고를 분석하여 JSON 형식으로 반환해주세요:

채용 공고:
{text}

다음 형식으로 반환해주세요:
{{
    "keywords": ["키워드1", "키워드2", ...],
    "requirements": ["요구사항1", "요구사항2", ...]
}}

키워드는 주요 기술 스택, 요구사항은 필수 역량이나 경력을 포함해주세요."""

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "당신은 채용 공고 분석 전문가입니다."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        
        import json
        result = json.loads(response.choices[0].message.content)
        return result
    
    @staticmethod
    async def generate_cover_letter_feedback(
        user_spec: str,
        job_analysis: dict,
        cover_letter: str
    ) -> str:
        """
        Generate feedback for cover letter
        """
        prompt = f"""당신은 채용 전문가입니다. 다음 정보를 바탕으로 자기소개서에 대한 피드백을 제공해주세요.

[지원자 스펙]
{user_spec}

[채용 공고 분석]
키워드: {', '.join(job_analysis.get('keywords', []))}
요구사항: {', '.join(job_analysis.get('requirements', []))}

[자기소개서]
{cover_letter}

다음 관점에서 피드백을 제공해주세요:
1. 전반적인 평가
2. 강점
3. 개선점
4. 구체적인 조언"""

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "당신은 채용 전문가입니다."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )
        
        return response.choices[0].message.content
    
    @staticmethod
    async def generate_interview_question(
        context: str,
        turn_number: int,
        previous_qa: list = None
    ) -> str:
        """
        Generate interview question
        """
        if turn_number == 1:
            prompt = f"""당신은 {context}입니다.

지원자의 첫 번째 면접 질문을 해주세요. 자기소개를 요청하는 것이 좋습니다."""
        else:
            prev_conversation = "\n\n".join([
                f"Q{i+1}: {qa['question']}\nA{i+1}: {qa['answer']}"
                for i, qa in enumerate(previous_qa)
            ])
            
            prompt = f"""당신은 {context}입니다.

이전 대화:
{prev_conversation}

현재 {turn_number}/5 턴입니다.
이전 답변을 고려하여 다음 질문을 해주세요. 꼬리 질문이나 새로운 주제 모두 가능합니다."""
        
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "당신은 면접관입니다."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.8
        )
        
        return response.choices[0].message.content
    
    @staticmethod
    async def generate_tts(text: str) -> bytes:
        """
        Generate TTS audio from text
        """
        response = client.audio.speech.create(
            model="tts-1-hd",
            voice="alloy",
            input=text
        )
        
        return response.content
    
    @staticmethod
    async def transcribe_audio(audio_file) -> str:
        """
        Transcribe audio to text using Whisper
        """
        transcript = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file
        )
        
        return transcript.text
    
    @staticmethod
    async def generate_interview_feedback(turns: list) -> dict:
        """
        Generate feedback for entire interview
        """
        conversation = "\n\n".join([
            f"[질문 {t['turn_number']}]\n{t['question']}\n\n[답변 {t['turn_number']}]\n{t['answer']}"
            for t in turns
        ])
        
        prompt = f"""다음은 5턴의 면접 전체 기록입니다.

{conversation}

다음 형식으로 JSON을 생성해주세요:
{{
    "total_feedback": "전체적인 종합 피드백",
    "turn_feedbacks": [
        "질문 1에 대한 피드백",
        "질문 2에 대한 피드백",
        "질문 3에 대한 피드백",
        "질문 4에 대한 피드백",
        "질문 5에 대한 피드백"
    ]
}}"""
        
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "당신은 면접 평가 전문가입니다."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        
        import json
        return json.loads(response.choices[0].message.content)

