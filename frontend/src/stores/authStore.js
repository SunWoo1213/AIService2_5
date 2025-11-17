import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../utils/api'
import toast from 'react-hot-toast'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      // Login
      login: async (email, password) => {
        try {
          const response = await api.post('/auth/login', { email, password })
          const { access_token, refresh_token, user } = response.data

          localStorage.setItem('access_token', access_token)
          localStorage.setItem('refresh_token', refresh_token)

          set({ user, isAuthenticated: true })
          toast.success('로그인되었습니다!')
          return true
        } catch (error) {
          toast.error('로그인에 실패했습니다.')
          return false
        }
      },

      // Register
      register: async (userData) => {
        try {
          await api.post('/auth/register', userData)
          toast.success('회원가입이 완료되었습니다!')
          return true
        } catch (error) {
          toast.error('회원가입에 실패했습니다.')
          return false
        }
      },

      // Logout
      logout: () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        set({ user: null, isAuthenticated: false })
        toast.success('로그아웃되었습니다.')
      },

      // Fetch current user
      fetchUser: async () => {
        try {
          const response = await api.get('/users/me')
          set({ user: response.data, isAuthenticated: true })
        } catch (error) {
          set({ user: null, isAuthenticated: false })
        }
      },

      // Update user
      updateUser: async (userData) => {
        try {
          const response = await api.patch('/users/me', userData)
          set({ user: response.data })
          toast.success('프로필이 업데이트되었습니다!')
          return true
        } catch (error) {
          toast.error('프로필 업데이트에 실패했습니다.')
          return false
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
)

