import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, Loader2 } from 'lucide-react'
import ProgressBar from '@/components/ProgressBar'
import AudioRecorder from '@/components/AudioRecorder'
import AudioPlayer from '@/components/AudioPlayer'
import Button from '@/components/Button'
import Modal from '@/components/Modal'

/**
 * Interview Page - Voice interview simulation
 */
export default function InterviewPage() {
  const { sessionId } = useParams()
  const navigate = useNavigate()

  const [session, setSession] = useState(null)
  const [currentTurn, setCurrentTurn] = useState(null)
  const [turnNumber, setTurnNumber] = useState(1)
  const [phase, setPhase] = useState('loading') // loading, listening, recording, submitting, completed
  const [showInstructions, setShowInstructions] = useState(true)

  const TOTAL_TURNS = 5

  // Initialize interview session
  useEffect(() => {
    initializeInterview()
  }, [sessionId])

  const initializeInterview = async () => {
    // TODO: API call to start interview
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock session data
    setSession({
      id: sessionId,
      coverLetterId: 1,
      status: 'in_progress',
    })

    // Mock first question
    setCurrentTurn({
      turn_number: 1,
      question_text: '먼저 간단히 자기소개를 부탁드립니다.',
      question_audio_url: 'https://example.com/question_1.mp3', // Mock URL
    })

    setPhase('listening')
  }

  const handleQuestionEnded = () => {
    // Question audio finished, start recording
    setPhase('recording')
  }

  const handleRecordingComplete = async (audioBlob) => {
    setPhase('submitting')

    // TODO: Upload audio to backend
    const formData = new FormData()
    formData.append('turn_number', turnNumber)
    formData.append('audio', audioBlob, `answer_${turnNumber}.webm`)

    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Mock response
    if (turnNumber < TOTAL_TURNS) {
      // Next question
      const nextTurn = turnNumber + 1
      setTurnNumber(nextTurn)
      
      // Mock next question
      setCurrentTurn({
        turn_number: nextTurn,
        question_text: `질문 ${nextTurn}: 프로젝트에서 가장 어려웠던 기술적 문제는 무엇이었나요?`,
        question_audio_url: `https://example.com/question_${nextTurn}.mp3`,
      })
      
      setPhase('listening')
    } else {
      // Interview completed
      setPhase('completed')
    }
  }

  const handleCompleteInterview = () => {
    navigate(`/interview/${sessionId}/result`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 -m-6 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Instructions Modal */}
        <Modal
          isOpen={showInstructions}
          onClose={() => setShowInstructions(false)}
          title="면접 안내"
          size="md"
        >
          <div className="space-y-4">
            <p className="text-gray-700">
              총 <strong>5개의 질문</strong>이 진행됩니다. 각 질문마다 다음과 같이 진행됩니다:
            </p>
            
            <ol className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  1
                </span>
                <span>AI가 음성으로 질문을 합니다 (자동 재생)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  2
                </span>
                <span>질문이 끝나면 녹음이 자동으로 시작됩니다</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  3
                </span>
                <span>최대 60초 동안 답변을 녹음하세요</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  4
                </span>
                <span>답변이 완료되면 "답변 제출" 버튼을 누르세요</span>
              </li>
            </ol>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>💡 Tip:</strong> 실제 면접처럼 차분하게 답변해주세요. 
                녹음된 답변은 면접 결과 페이지에서 다시 들을 수 있습니다.
              </p>
            </div>

            <Button onClick={() => setShowInstructions(false)} className="w-full">
              시작하기
            </Button>
          </div>
        </Modal>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <ProgressBar current={turnNumber} total={TOTAL_TURNS} />
        </motion.div>

        {/* Main Content */}
        <div className="space-y-8">
          <AnimatePresence mode="wait">
            {phase === 'loading' && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
                <p className="text-gray-600">면접을 준비하고 있습니다...</p>
              </motion.div>
            )}

            {phase === 'listening' && currentTurn && (
              <motion.div
                key="listening"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6"
              >
                {/* Question Card */}
                <div className="card bg-white">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Volume2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-sm font-semibold text-primary-600 mb-2">
                        질문 {turnNumber} / {TOTAL_TURNS}
                      </h2>
                      <p className="text-2xl font-bold text-gray-900 leading-relaxed">
                        {currentTurn.question_text}
                      </p>
                    </div>
                  </div>

                  {/* Audio Player */}
                  <AudioPlayer
                    src={currentTurn.question_audio_url}
                    autoPlay={true}
                    onEnded={handleQuestionEnded}
                  />

                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500">
                      질문을 듣고 있습니다... 질문이 끝나면 자동으로 녹음이 시작됩니다.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {phase === 'recording' && (
              <motion.div
                key="recording"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6"
              >
                {/* Question Display */}
                <div className="card bg-primary-50 border-2 border-primary-200">
                  <h3 className="text-lg font-semibold text-primary-900 mb-2">
                    질문 {turnNumber}
                  </h3>
                  <p className="text-gray-700">{currentTurn.question_text}</p>
                </div>

                {/* Audio Recorder */}
                <div className="card bg-white">
                  <AudioRecorder
                    maxDuration={60}
                    onRecordingComplete={handleRecordingComplete}
                    autoStart={true}
                  />
                </div>

                {/* Tips */}
                <div className="text-center text-sm text-gray-600">
                  <p>💡 차분하게 답변해주세요. 필요시 일시정지 버튼을 활용하세요.</p>
                </div>
              </motion.div>
            )}

            {phase === 'submitting' && (
              <motion.div
                key="submitting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
                <p className="text-gray-600 mb-2">답변을 제출하고 있습니다...</p>
                <p className="text-sm text-gray-500">
                  {turnNumber < TOTAL_TURNS
                    ? '잠시 후 다음 질문이 시작됩니다'
                    : '면접 결과를 생성하고 있습니다'}
                </p>
              </motion.div>
            )}

            {phase === 'completed' && (
              <motion.div
                key="completed"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-12"
              >
                <div className="card bg-white max-w-2xl mx-auto">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-10 h-10 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>

                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    면접이 완료되었습니다!
                  </h2>
                  
                  <p className="text-gray-600 mb-8">
                    AI가 답변을 분석하여 피드백을 생성하고 있습니다.<br />
                    잠시만 기다려주세요...
                  </p>

                  <div className="flex items-center justify-center gap-2 mb-8">
                    <Loader2 className="w-5 h-5 text-primary-500 animate-spin" />
                    <span className="text-sm text-gray-500">
                      피드백 생성 중... (약 30초 소요)
                    </span>
                  </div>

                  <Button onClick={handleCompleteInterview} size="lg" className="w-full">
                    결과 보기
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
