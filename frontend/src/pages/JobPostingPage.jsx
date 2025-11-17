import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileText, Sparkles } from 'lucide-react'
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/Card'
import Button from '@/components/Button'
import Badge from '@/components/Badge'

/**
 * Job Posting Page - Upload and analyze job postings
 */
export default function JobPostingPage() {
  const [file, setFile] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile)
    } else {
      alert('PDF 파일만 업로드 가능합니다.')
    }
  }

  const handleAnalyze = async () => {
    if (!file) return

    setAnalyzing(true)

    // TODO: API call to backend
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Mock analysis result
    setAnalysis({
      keywords: ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'AWS'],
      requirements: [
        '백엔드 개발 경력 3년 이상',
        'RESTful API 설계 및 개발 경험',
        '데이터베이스 설계 및 최적화 경험',
        '클라우드 인프라 구축 경험',
      ],
    })

    setAnalyzing(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">채용 공고 분석</h1>
        <p className="text-gray-600">
          채용 공고를 업로드하면 AI가 핵심 키워드와 요구 역량을 분석합니다
        </p>
      </motion.div>

      {/* Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>공고 업로드</CardTitle>
            <CardDescription>PDF 파일로 채용 공고를 업로드해주세요</CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-primary-500 transition-colors">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-primary-600" />
                  </div>
                  
                  {file ? (
                    <div>
                      <p className="text-lg font-semibold text-gray-900 mb-1">
                        {file.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-lg font-semibold text-gray-900 mb-1">
                        클릭하여 파일 선택
                      </p>
                      <p className="text-sm text-gray-500">
                        또는 파일을 드래그 앤 드롭하세요
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        PDF 파일만 지원 (최대 10MB)
                      </p>
                    </div>
                  )}
                </div>
              </label>
            </div>

            {file && (
              <div className="mt-6 flex justify-end">
                <Button
                  onClick={handleAnalyze}
                  loading={analyzing}
                  leftIcon={<Sparkles className="w-5 h-5" />}
                >
                  AI 분석 시작
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Analysis Result */}
      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary-600" />
                <CardTitle>분석 결과</CardTitle>
              </div>
              <CardDescription>AI가 분석한 채용 공고의 핵심 정보입니다</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Keywords */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">핵심 키워드</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywords.map((keyword) => (
                    <Badge key={keyword} variant="primary" className="text-sm">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">요구 역량</h3>
                <ul className="space-y-2">
                  {analysis.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-semibold text-green-600">
                          {index + 1}
                        </span>
                      </div>
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-200">
                <Button className="w-full">
                  이 공고로 자소서 작성하기
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Previous Job Postings - Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4">이전 공고</h2>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} hover>
              <CardContent className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      백엔드 개발자 채용 공고 #{i}
                    </p>
                    <p className="text-sm text-gray-500">2일 전</p>
                  </div>
                </div>
                <Badge variant="success">분석됨</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

