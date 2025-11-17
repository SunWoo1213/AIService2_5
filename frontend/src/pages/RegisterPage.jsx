import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Mic2 } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Textarea from '@/components/Textarea'

/**
 * Register Page
 */
export default function RegisterPage() {
  const navigate = useNavigate()
  const register = useAuthStore((state) => state.register)
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    age: '',
    gender: '',
    career_summary: '',
    certifications: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요'
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요'
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다'
    }

    if (!formData.name) {
      newErrors.name = '이름을 입력해주세요'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    const { confirmPassword, ...registerData } = formData
    const success = await register({
      ...registerData,
      age: formData.age ? parseInt(formData.age) : null,
    })
    
    if (success) {
      navigate('/login')
    }
    
    setLoading(false)
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
    
    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors((prev) => ({
        ...prev,
        [e.target.name]: '',
      }))
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-4">
            <Mic2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">회원가입</h2>
          <p className="mt-2 text-gray-600">AI 면접 연습을 무료로 시작하세요</p>
        </div>

        {/* Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">기본 정보</h3>
              
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
                error={errors.email}
              />

              <div className="grid md:grid-cols-2 gap-4">
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
                  error={errors.password}
                  helperText="8자 이상 입력해주세요"
                />

                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  label="비밀번호 확인"
                  placeholder="••••••••"
                  required
                  leftIcon={<Lock className="w-5 h-5" />}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                />
              </div>

              <Input
                id="name"
                name="name"
                type="text"
                label="이름"
                placeholder="홍길동"
                required
                leftIcon={<User className="w-5 h-5" />}
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
              />

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  id="age"
                  name="age"
                  type="number"
                  label="나이"
                  placeholder="28"
                  value={formData.age}
                  onChange={handleChange}
                />

                <div>
                  <label className="label" htmlFor="gender">
                    성별
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    className="input"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">선택</option>
                    <option value="male">남성</option>
                    <option value="female">여성</option>
                    <option value="other">기타</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Career Info */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">경력 정보</h3>
              <p className="text-sm text-gray-500">
                더 정확한 맞춤 피드백을 위해 입력해주세요 (선택사항)
              </p>
              
              <Textarea
                id="career_summary"
                name="career_summary"
                label="경력 요약"
                placeholder="예: 백엔드 개발 3년, Python/FastAPI 경험"
                value={formData.career_summary}
                onChange={handleChange}
                helperText="주요 경력과 기술 스택을 간단히 작성해주세요"
              />

              <Textarea
                id="certifications"
                name="certifications"
                label="자격증"
                placeholder="예: 정보처리기사, AWS SAA"
                value={formData.certifications}
                onChange={handleChange}
                helperText="보유하신 자격증을 쉼표로 구분하여 입력해주세요"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="terms"
                required
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                <Link to="/terms" className="text-primary-600 hover:text-primary-700">
                  이용약관
                </Link>
                {' '}및{' '}
                <Link to="/privacy" className="text-primary-600 hover:text-primary-700">
                  개인정보처리방침
                </Link>
                에 동의합니다
              </label>
            </div>

            <Button type="submit" size="lg" className="w-full" loading={loading}>
              회원가입
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              이미 계정이 있으신가요?{' '}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">
                로그인
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

