import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileSearch, MessageSquare, Mic, CheckCircle, ArrowRight } from 'lucide-react'
import Button from '@/components/Button'
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/Card'

const features = [
  {
    icon: FileSearch,
    title: '공고 분석',
    description: 'AI가 채용 공고를 분석하여 핵심 키워드와 요구 역량을 추출합니다.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: MessageSquare,
    title: '자소서 피드백',
    description: '스펙과 공고를 고려한 맞춤형 자기소개서 피드백을 제공합니다.',
    color: 'from-green-500 to-green-600',
  },
  {
    icon: Mic,
    title: '음성 면접',
    description: '실전같은 AI 음성 면접으로 면접 실력을 향상시키세요.',
    color: 'from-purple-500 to-purple-600',
  },
]

const benefits = [
  '실전과 동일한 음성 면접 환경',
  '전문가 수준의 AI 피드백',
  '답변 녹음 파일 다시 듣기',
  '개인 맞춤형 질문 생성',
]

/**
 * Landing Page
 */
export default function LandingPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50 -z-10" />
        
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-6">
                <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                AI 기반 면접 연습 서비스
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                AI 음성 면접으로<br />
                <span className="gradient-text">취업 성공률</span>을<br />
                높이세요
              </h1>
              
              <p className="text-xl text-gray-600 mb-8">
                실전같은 음성 면접 연습과 전문가 수준의 AI 피드백으로<br />
                자신감 있게 면접을 준비하세요.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/register">
                  <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                    무료로 시작하기
                  </Button>
                </Link>
                <Button size="lg" variant="secondary">
                  더 알아보기
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative aspect-square rounded-3xl bg-gradient-to-br from-primary-100 to-secondary-100 p-8">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-3xl" />
                <div className="relative flex items-center justify-center h-full">
                  <div className="w-48 h-48 bg-white rounded-full shadow-2xl flex items-center justify-center">
                    <Mic className="w-24 h-24 text-primary-500" />
                  </div>
                  
                  {/* Floating Cards */}
                  <motion.div
                    className="absolute top-8 right-8 bg-white rounded-xl p-4 shadow-lg"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <FileSearch className="w-8 h-8 text-blue-500" />
                  </motion.div>
                  
                  <motion.div
                    className="absolute bottom-8 left-8 bg-white rounded-xl p-4 shadow-lg"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  >
                    <MessageSquare className="w-8 h-8 text-green-500" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              어떻게 도와드릴까요?
            </h2>
            <p className="text-xl text-gray-600">
              AI 기술로 완벽한 면접 준비를 도와드립니다
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card hover>
                    <CardHeader>
                      <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-4`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                왜 AI 면접 시스템을<br />
                선택해야 할까요?
              </h2>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-lg text-gray-700">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-video bg-gradient-to-br from-primary-100 to-secondary-100 rounded-3xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-white rounded-full shadow-2xl flex items-center justify-center mx-auto mb-4">
                    <Mic className="w-16 h-16 text-primary-500 animate-pulse-slow" />
                  </div>
                  <p className="text-lg font-semibold text-gray-700">
                    실전 면접 시뮬레이션
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-500 to-primary-600">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              지금 바로 시작하세요
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              회원가입하고 무료로 AI 면접 연습을 경험해보세요
            </p>
            <Link to="/register">
              <Button
                size="lg"
                variant="secondary"
                rightIcon={<ArrowRight className="w-5 h-5" />}
                className="bg-white text-primary-600 hover:bg-gray-50"
              >
                무료로 시작하기
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

