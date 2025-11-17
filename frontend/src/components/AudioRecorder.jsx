import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mic, Square, Play, Pause } from 'lucide-react'
import Button from './Button'
import { cn } from '@/utils/cn'

/**
 * Audio Recorder Component
 */
export default function AudioRecorder({
  maxDuration = 60, // seconds
  onRecordingComplete,
  autoStart = false,
}) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [duration, setDuration] = useState(0)
  const [audioBlob, setAudioBlob] = useState(null)

  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const timerRef = useRef(null)

  // 녹음 시작
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        
        if (onRecordingComplete) {
          onRecordingComplete(blob)
        }

        // Stream 정리
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setDuration(0)

      // 타이머 시작
      timerRef.current = setInterval(() => {
        setDuration((prev) => {
          if (prev >= maxDuration) {
            stopRecording()
            return prev
          }
          return prev + 1
        })
      }, 1000)
    } catch (error) {
      console.error('마이크 접근 오류:', error)
      alert('마이크 접근 권한이 필요합니다.')
    }
  }

  // 녹음 중지
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)
      
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }

  // 녹음 일시정지/재개
  const togglePause = () => {
    if (mediaRecorderRef.current) {
      if (isPaused) {
        mediaRecorderRef.current.resume()
        timerRef.current = setInterval(() => {
          setDuration((prev) => {
            if (prev >= maxDuration) {
              stopRecording()
              return prev
            }
            return prev + 1
          })
        }, 1000)
      } else {
        mediaRecorderRef.current.pause()
        clearInterval(timerRef.current)
      }
      setIsPaused(!isPaused)
    }
  }

  // 자동 시작
  useEffect(() => {
    if (autoStart) {
      startRecording()
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [autoStart])

  // 시간 포맷 (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* 녹음 상태 표시 */}
      <div className="relative">
        <motion.div
          className={cn(
            'w-32 h-32 rounded-full flex items-center justify-center',
            isRecording && !isPaused
              ? 'bg-red-500'
              : isPaused
              ? 'bg-yellow-500'
              : 'bg-primary-500'
          )}
          animate={
            isRecording && !isPaused
              ? {
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    '0 0 0 0 rgba(239, 68, 68, 0.4)',
                    '0 0 0 20px rgba(239, 68, 68, 0)',
                  ],
                }
              : {}
          }
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Mic className="w-16 h-16 text-white" />
        </motion.div>

        {/* 파형 애니메이션 */}
        {isRecording && !isPaused && (
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-red-500 rounded-full"
                animate={{
                  height: ['8px', '24px', '8px'],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* 타이머 */}
      <div className="text-center">
        <div className="text-4xl font-bold text-gray-900 font-mono">
          {formatTime(duration)}
        </div>
        <div className="text-sm text-gray-500 mt-1">
          최대 {formatTime(maxDuration)}
        </div>
      </div>

      {/* 진행률 바 */}
      {isRecording && (
        <div className="w-full max-w-md">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-red-500"
              initial={{ width: 0 }}
              animate={{ width: `${(duration / maxDuration) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* 컨트롤 버튼 */}
      <div className="flex items-center gap-4">
        {!isRecording ? (
          <Button
            onClick={startRecording}
            size="lg"
            leftIcon={<Mic className="w-5 h-5" />}
          >
            녹음 시작
          </Button>
        ) : (
          <>
            <Button
              onClick={togglePause}
              variant="secondary"
              size="lg"
              leftIcon={
                isPaused ? (
                  <Play className="w-5 h-5" />
                ) : (
                  <Pause className="w-5 h-5" />
                )
              }
            >
              {isPaused ? '재개' : '일시정지'}
            </Button>
            
            <Button
              onClick={stopRecording}
              variant="danger"
              size="lg"
              leftIcon={<Square className="w-5 h-5" />}
            >
              답변 제출
            </Button>
          </>
        )}
      </div>

      {/* 상태 메시지 */}
      <div className="text-center">
        {!isRecording && !audioBlob && (
          <p className="text-gray-600">녹음 버튼을 눌러 답변을 시작하세요</p>
        )}
        {isRecording && !isPaused && (
          <p className="text-red-600 font-semibold flex items-center gap-2 justify-center">
            <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
            녹음 중...
          </p>
        )}
        {isPaused && (
          <p className="text-yellow-600 font-semibold">일시정지됨</p>
        )}
        {audioBlob && !isRecording && (
          <p className="text-green-600 font-semibold">녹음 완료! 제출됩니다...</p>
        )}
      </div>
    </div>
  )
}

