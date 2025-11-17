import { Outlet, Link } from 'react-router-dom'
import { Mic2 } from 'lucide-react'
import Button from '@/components/Button'

/**
 * Main Layout for Public Pages (Landing, Login, Register)
 */
export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <nav className="container-custom py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <Mic2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">AI 면접</span>
            </Link>

            {/* Navigation */}
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  로그인
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  시작하기
                </Button>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                  <Mic2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-bold">AI 면접</span>
              </div>
              <p className="text-sm">
                AI 기반 음성 면접 연습으로<br />
                취업 성공률을 높이세요
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">서비스</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">공고 분석</a></li>
                <li><a href="#" className="hover:text-white transition">자소서 피드백</a></li>
                <li><a href="#" className="hover:text-white transition">음성 면접</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">회사</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">소개</a></li>
                <li><a href="#" className="hover:text-white transition">블로그</a></li>
                <li><a href="#" className="hover:text-white transition">채용</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">지원</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">고객센터</a></li>
                <li><a href="#" className="hover:text-white transition">이용약관</a></li>
                <li><a href="#" className="hover:text-white transition">개인정보처리방침</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
            © 2025 AI Interview. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

