import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FileText,
  MessageSquare,
  Video,
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/Card'
import Button from '@/components/Button'
import Badge from '@/components/Badge'

/**
 * Dashboard Page
 */
export default function DashboardPage() {
  const user = useAuthStore((state) => state.user)
  const [stats, setStats] = useState({
    jobPostings: 0,
    coverLetters: 0,
    interviews: 0,
  })

  // TODO: Fetch actual stats from API
  useEffect(() => {
    // Mock data
    setStats({
      jobPostings: 3,
      coverLetters: 5,
      interviews: 2,
    })
  }, [])

  const quickActions = [
    {
      title: '채용 공고 업로드',
      description: '새로운 채용 공고를 분석하세요',
      icon: FileText,
      href: '/job-postings',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: '자소서 작성',
      description: 'AI 피드백을 받아보세요',
      icon: MessageSquare,
      href: '/cover-letters',
      color: 'from-green-500 to-green-600',
    },
    {
      title: '면접 연습',
      description: '실전 면접을 시작하세요',
      icon: Video,
      href: '/interviews',
      color: 'from-purple-500 to-purple-600',
    },
  ]

  const recentActivities = [
    {
      type: 'cover-letter',
      title: '백엔드 개발자 자소서',
      date: '2시간 전',
      status: 'completed',
    },
    {
      type: 'interview',
      title: '프론트엔드 면접 연습',
      date: '1일 전',
      status: 'completed',
    },
    {
      type: 'job-posting',
      title: 'AI 엔지니어 채용 공고',
      date: '2일 전',
      status: 'analyzed',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-8 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                환영합니다, {user?.name || '사용자'}님 👋
              </h1>
              <p className="text-primary-100 text-lg">
                오늘도 면접 준비를 시작해볼까요?
              </p>
            </div>
            
            <Link to="/interviews">
              <Button variant="secondary" className="bg-white text-primary-600 hover:bg-gray-50">
                면접 시작하기
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">채용 공고</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.jobPostings}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-600 font-medium">+2</span>
                <span className="text-gray-500 ml-1">이번 주</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">자기소개서</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.coverLetters}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-600 font-medium">+3</span>
                <span className="text-gray-500 ml-1">이번 주</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">면접 연습</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.interviews}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Video className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-600 font-medium">+1</span>
                <span className="text-gray-500 ml-1">이번 주</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">빠른 시작</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              >
                <Link to={action.href}>
                  <Card hover>
                    <CardHeader>
                      <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-4`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle>{action.title}</CardTitle>
                      <CardDescription>{action.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-primary-600 font-medium text-sm">
                        시작하기
                        <ArrowRight className="ml-1 w-4 h-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Recent Activities */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">최근 활동</h2>
        <Card>
          <CardContent className="divide-y divide-gray-100">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                className="py-4 first:pt-0 last:pb-0 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    {activity.type === 'cover-letter' && (
                      <MessageSquare className="w-5 h-5 text-gray-600" />
                    )}
                    {activity.type === 'interview' && (
                      <Video className="w-5 h-5 text-gray-600" />
                    )}
                    {activity.type === 'job-posting' && (
                      <FileText className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-sm text-gray-500">{activity.date}</span>
                    </div>
                  </div>
                </div>
                
                {activity.status === 'completed' ? (
                  <Badge variant="success">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    완료
                  </Badge>
                ) : (
                  <Badge variant="primary">분석됨</Badge>
                )}
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

