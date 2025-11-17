import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Download, 
  Share2, 
  Home, 
  TrendingUp, 
  Award,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import Card, { CardHeader, CardTitle, CardContent } from '@/components/Card'
import Button from '@/components/Button'
import Badge from '@/components/Badge'
import AudioPlayer from '@/components/AudioPlayer'
import { CircularProgress } from '@/components/ProgressBar'
import Loading from '@/components/Loading'

/**
 * Interview Result Page - View feedback and answers
 */
export default function InterviewResultPage() {
  const { sessionId } = useParams()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expandedTurns, setExpandedTurns] = useState([1]) // First turn expanded by default

  useEffect(() => {
    fetchResult()
  }, [sessionId])

  const fetchResult = async () => {
    // TODO: API call to fetch interview result
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock result data
    setResult({
      session_id: sessionId,
      status: 'completed',
      total_feedback: `전반적으로 답변이 구조적이었으나, 구체적인 수치와 사례를 더 추가하면 좋겠습니다. 
      
특히 프로젝트 성과를 설명할 때 "많이", "잘"과 같은 추상적 표현보다는 "30% 성능 개선", "5명의 팀원과 협업" 같은 구체적 표현을 사용하면 더 설득력이 있습니다.

기술적 깊이는 충분했으나, 비즈니스 임팩트를 함께 설명했다면 더 좋았을 것입니다.`,
      overall_score: 78,
      turns: [
        {
          turn_number: 1,
          question_text: '먼저 간단히 자기소개를 부탁드립니다.',
          question_audio_url: 'https://example.com/q1.mp3',
          answer_audio_url: 'https://example.com/a1.mp3',
          answer_stt_text: '안녕하세요. 저는 3년간 백엔드 개발자로 일한 김개발입니다. Python과 FastAPI를 주로 사용하며, RESTful API 설계와 데이터베이스 최적화 경험이 있습니다.',
          turn_feedback: '자기소개가 명확하고 핵심 역량이 잘 드러났습니다. 다만, 구체적인 프로젝트 사례를 1~2개 추가하면 더 좋았을 것입니다.',
          score: 80,
        },
        {
          turn_number: 2,
          question_text: '프로젝트에서 가장 어려웠던 기술적 문제는 무엇이었나요?',
          question_audio_url: 'https://example.com/q2.mp3',
          answer_audio_url: 'https://example.com/a2.mp3',
          answer_stt_text: '대용량 트래픽 처리 시 데이터베이스 병목 현상이 있었습니다. 인덱스 최적화와 캐싱을 도입하여 해결했습니다.',
          turn_feedback: '문제와 해결책을 간결하게 설명했으나, 구체적인 성과(예: 응답 시간 개선율)를 언급하면 더 설득력 있었을 것입니다.',
          score: 75,
        },
        {
          turn_number: 3,
          question_text: '팀 협업 경험에 대해 말씀해주세요.',
          question_audio_url: 'https://example.com/q3.mp3',
          answer_audio_url: 'https://example.com/a3.mp3',
          answer_stt_text: '5명의 팀원과 애자일 방법론으로 협업했습니다. 주간 스프린트 회의와 코드 리뷰를 통해 코드 품질을 유지했습니다.',
          turn_feedback: '협업 방식이 명확하게 드러났습니다. 갈등 상황과 해결 방법을 추가로 언급하면 좋겠습니다.',
          score: 82,
        },
        {
          turn_number: 4,
          question_text: '최근에 학습한 기술이나 관심 있는 분야는 무엇인가요?',
          question_audio_url: 'https://example.com/q4.mp3',
          answer_audio_url: 'https://example.com/a4.mp3',
          answer_stt_text: '최근 Kubernetes와 Docker를 공부하고 있습니다. 컨테이너 오케스트레이션에 관심이 많습니다.',
          turn_feedback: '학습 의지가 잘 드러났습니다. 실제 프로젝트 적용 경험이나 계획을 추가하면 더 좋겠습니다.',
          score: 70,
        },
        {
          turn_number: 5,
          question_text: '마지막으로 하고 싶은 말씀이 있으신가요?',
          question_audio_url: 'https://example.com/q5.mp3',
          answer_audio_url: 'https://example.com/a5.mp3',
          answer_stt_text: '귀사의 기술 스택과 제 경험이 잘 맞다고 생각합니다. 함께 성장하고 싶습니다.',
          turn_feedback: '긍정적이고 간결한 마무리였습니다. 회사에 대한 구체적인 관심사를 언급하면 더 인상적이었을 것입니다.',
          score: 83,
        },
      ],
      created_at: '2025-11-14T12:00:00Z',
      completed_at: '2025-11-14T12:15:00Z',
    })

    setLoading(false)
  }

  const toggleTurn = (turnNumber) => {
    setExpandedTurns((prev) =>
      prev.includes(turnNumber)
        ? prev.filter((t) => t !== turnNumber)
        : [...prev, turnNumber]
    )
  }

  const handleDownloadReport = () => {
    alert('PDF 리포트 다운로드 기능은 준비 중입니다!')
  }

  const handleShare = () => {
    alert('공유 기능은 준비 중입니다!')
  }

  if (loading) {
    return <Loading fullScreen />
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <Award className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">면접 결과</h1>
        <p className="text-gray-600">
          AI가 분석한 면접 피드백을 확인하세요
        </p>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-center gap-4"
      >
        <Button
          variant="secondary"
          leftIcon={<Download className="w-4 h-4" />}
          onClick={handleDownloadReport}
        >
          PDF 다운로드
        </Button>
        <Button
          variant="secondary"
          leftIcon={<Share2 className="w-4 h-4" />}
          onClick={handleShare}
        >
          공유하기
        </Button>
        <Link to="/dashboard">
          <Button variant="ghost" leftIcon={<Home className="w-4 h-4" />}>
            대시보드로
          </Button>
        </Link>
      </motion.div>

      {/* Overall Score & Feedback */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Score */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="text-center py-8">
              <CircularProgress percentage={result.overall_score} />
              
              <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-2">
                종합 점수
              </h3>
              
              <p className="text-gray-600 mb-6">
                {result.overall_score >= 80
                  ? '🎉 우수한 답변입니다!'
                  : result.overall_score >= 60
                  ? '👍 양호한 답변입니다'
                  : '💪 더 연습이 필요합니다'}
              </p>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary-600">
                    {result.turns.length}
                  </p>
                  <p className="text-xs text-gray-500">총 질문</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round(
                      result.turns.reduce((acc, t) => acc + t.score, 0) /
                        result.turns.length
                    )}
                  </p>
                  <p className="text-xs text-gray-500">평균 점수</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {Math.max(...result.turns.map((t) => t.score))}
                  </p>
                  <p className="text-xs text-gray-500">최고 점수</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Total Feedback */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-primary-600" />
                <CardTitle>종합 피드백</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {result.total_feedback}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Individual Turns */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">개별 답변 피드백</h2>
        
        <div className="space-y-4">
          {result.turns.map((turn, index) => {
            const isExpanded = expandedTurns.includes(turn.turn_number)
            
            return (
              <motion.div
                key={turn.turn_number}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Card className="overflow-hidden">
                  {/* Header */}
                  <button
                    onClick={() => toggleTurn(turn.turn_number)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="font-bold text-primary-600">
                          {turn.turn_number}
                        </span>
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-900">
                          {turn.question_text}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          점수: {turn.score}점
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          turn.score >= 80
                            ? 'success'
                            : turn.score >= 60
                            ? 'primary'
                            : 'warning'
                        }
                      >
                        {turn.score >= 80 ? '우수' : turn.score >= 60 ? '양호' : '개선'}
                      </Badge>
                      
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-6 pb-6 space-y-6 border-t border-gray-100">
                      {/* Answer Text */}
                      <div className="pt-6">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">
                          📝 답변 내용 (STT 변환)
                        </h4>
                        <p className="text-gray-700 bg-gray-50 rounded-lg p-4">
                          {turn.answer_stt_text}
                        </p>
                      </div>

                      {/* Audio Player */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">
                          🎧 내 답변 다시 듣기
                        </h4>
                        <AudioPlayer src={turn.answer_audio_url} />
                      </div>

                      {/* Feedback */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">
                          💬 AI 피드백
                        </h4>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-gray-700 leading-relaxed">
                            {turn.turn_feedback}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Next Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <CardContent className="text-center py-8">
            <h3 className="text-2xl font-bold mb-4">다음 단계</h3>
            <p className="mb-6 text-primary-100">
              피드백을 바탕으로 답변을 개선하고, 다시 연습해보세요!
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/cover-letters">
                <Button
                  variant="secondary"
                  className="bg-white text-primary-600 hover:bg-gray-50"
                >
                  자소서 수정하기
                </Button>
              </Link>
              <Link to="/interviews">
                <Button
                  variant="secondary"
                  className="bg-white text-primary-600 hover:bg-gray-50"
                >
                  다시 연습하기
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
