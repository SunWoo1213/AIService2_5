import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Mic2 } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import Button from '@/components/Button'
import Input from '@/components/Input'

/**
 * Login Page
 */
export default function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const success = await login(formData.email, formData.password)
    
    if (success) {
      navigate('/dashboard')
    }
    
    setLoading(false)
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-4">
            <Mic2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">로그인</h2>
          <p className="mt-2 text-gray-600">AI 면접 연습을 시작하세요</p>
        </div>

        {/* Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              id="email"
              name="email"
              type="email"
              label="이메일"
              placeholder="example@email.com"
              required
              leftIcon={<Mail className="w-5 h-5" />}
              value={formData.email}
              onChange={handleChange}
            />

            <Input
              id="password"
              name="password"
              type="password"
              label="비밀번호"
              placeholder="••••••••"
              required
              leftIcon={<Lock className="w-5 h-5" />}
              value={formData.password}
              onChange={handleChange}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-600">로그인 유지</span>
              </label>
              
              <Link to="/forgot-password" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                비밀번호 찾기
              </Link>
            </div>

            <Button type="submit" size="lg" className="w-full" loading={loading}>
              로그인
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">또는</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                계정이 없으신가요?{' '}
                <Link to="/register" className="font-medium text-primary-600 hover:text-primary-700">
                  회원가입
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

