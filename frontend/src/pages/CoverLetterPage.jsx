import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, Sparkles, Save, Eye } from 'lucide-react'
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/Card'
import Button from '@/components/Button'
import Textarea from '@/components/Textarea'
import Badge from '@/components/Badge'

/**
 * Cover Letter Page - Write cover letters and get AI feedback
 */
export default function CoverLetterPage() {
  const [selectedJobPosting, setSelectedJobPosting] = useState(null)
  const [coverLetter, setCoverLetter] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(false)
  const [jobPostings, setJobPostings] = useState([])

  // TODO: Fetch job postings from API
  useEffect(() => {
    // Mock data
    setJobPostings([
      {
        id: 1,
        title: '백엔드 개발자 채용',
        keywords: ['Python', 'FastAPI', 'PostgreSQL'],
        date: '2일 전',
      },
      {
        id: 2,
        title: 'AI 엔지니어 채용',
        keywords: ['ML', 'PyTorch', 'NLP'],
        date: '3일 전',
      },
    ])
  }, [])

  const handleGetFeedback = async () => {
    if (!coverLetter.trim() || !selectedJobPosting) {
      alert('채용 공고를 선택하고 자소서를 작성해주세요.')
      return
    }

    setLoading(true)

    // TODO: API call to backend
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Mock feedback
    setFeedback({
      overall: '전반적으로 경력이 잘 드러나나, 구체적인 프로젝트 성과를 추가하면 좋겠습니다.',
      strengths: [
        '기술 스택이 공고 요구사항과 잘 맞습니다',
        '경력 기간이 명확하게 표현되어 있습니다',
      ],
      improvements: [
        '구체적인 프로젝트 성과 (예: 성능 개선 %)를 추가하세요',
        '팀 협업 경험을 더 강조하면 좋겠습니다',
      ],
      score: 75,
    })

    setLoading(false)
  }

  const handleSave = () => {
    // TODO: Save cover letter
    alert('자소서가 저장되었습니다!')
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">자기소개서</h1>
        <p className="text-gray-600">
          채용 공고에 맞춰 자소서를 작성하고 AI 피드백을 받아보세요
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Posting Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>채용 공고 선택</CardTitle>
                <CardDescription>
                  어떤 공고에 지원하시나요?
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  {jobPostings.map((job) => (
                    <div
                      key={job.id}
                      onClick={() => setSelectedJobPosting(job)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedJobPosting?.id === job.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {job.keywords.map((keyword) => (
                              <Badge key={keyword} variant="primary" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">{job.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Cover Letter Editor */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>자기소개서 작성</CardTitle>
                <CardDescription>
                  자유롭게 작성해주세요 (최소 200자)
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="예시:
저는 3년간 백엔드 개발자로 일하며 Python과 FastAPI를 활용한 RESTful API 개발 경험을 쌓았습니다.

주요 프로젝트로는...

[구체적인 경험과 성과를 작성해주세요]"
                  className="min-h-[400px] font-sans"
                  maxLength={2000}
                />
                
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {coverLetter.length >= 200 ? (
                      <span className="text-green-600">✓ 충분한 분량입니다</span>
                    ) : (
                      <span>최소 200자 이상 작성해주세요 ({coverLetter.length}/200)</span>
                    )}
                  </span>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      leftIcon={<Save className="w-4 h-4" />}
                      onClick={handleSave}
                    >
                      저장
                    </Button>
                    <Button
                      leftIcon={<Sparkles className="w-4 h-4" />}
                      onClick={handleGetFeedback}
                      loading={loading}
                      disabled={!selectedJobPosting || coverLetter.length < 200}
                    >
                      AI 피드백 받기
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right: Feedback & Tips */}
        <div className="space-y-6">
          {/* Tips */}
          {!feedback && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-yellow-600" />
                    </div>
                    <CardTitle>작성 팁</CardTitle>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-primary-500 mt-1">✓</span>
                      <span>공고의 키워드를 자연스럽게 포함하세요</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-500 mt-1">✓</span>
                      <span>구체적인 수치와 성과를 언급하세요</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-500 mt-1">✓</span>
                      <span>팀 협업 경험을 강조하세요</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-500 mt-1">✓</span>
                      <span>지원 동기를 명확히 표현하세요</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Feedback */}
          {feedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              {/* Score */}
              <Card>
                <CardContent className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-primary-100 rounded-full mb-4">
                    <span className="text-4xl font-bold text-primary-600">
                      {feedback.score}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    자소서 점수
                  </h3>
                  <p className="text-sm text-gray-600">
                    {feedback.score >= 80
                      ? '우수합니다!'
                      : feedback.score >= 60
                      ? '양호합니다'
                      : '개선이 필요합니다'}
                  </p>
                </CardContent>
              </Card>

              {/* Overall Feedback */}
              <Card>
                <CardHeader>
                  <CardTitle>종합 피드백</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{feedback.overall}</p>
                </CardContent>
              </Card>

              {/* Strengths */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <CardTitle className="text-base">강점</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feedback.strengths.map((strength, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Improvements */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                    <CardTitle className="text-base">개선점</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feedback.improvements.map((improvement, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-yellow-500 mt-0.5">💡</span>
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Next Step */}
              <Button className="w-full" leftIcon={<Eye className="w-4 h-4" />}>
                이 자소서로 면접 연습하기
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
