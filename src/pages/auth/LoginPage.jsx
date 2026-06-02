import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Lock, Mail, Stethoscope } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
 
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const userData = await login(email.trim(), password, { remember })

      if (userData.role === 'admin') navigate('/admin/dashboard', { replace: true })
      else if (userData.role === 'doctor') navigate('/doctor/dashboard', { replace: true })
      else if (userData.role === 'patient') navigate('/patient/home', { replace: true })
      else if (userData.role === 'receptionist') navigate('/receptionist/dashboard', { replace: true })
      else setError('គណនីនេះមិនមានសិទ្ធិចូលប្រើ')
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.email?.[0] ||
        'អ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ!'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
            <Stethoscope className="text-[#1976D2]" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-[#1976D2]">ClinicSync</h1>
          <p className="text-sm text-gray-500 mt-1">
            ប្រព័ន្ធគ្រប់គ្រងការណាត់ជួបក្នុងគ្លីនិក
          </p>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          សូមស្វាគមន៍ចូលប្រើប្រាស់
        </h2>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              អាសយដ្ឋានអ៊ីមែល
            </label>
            <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2.5 focus-within:border-[#1976D2] focus-within:ring-1 focus-within:ring-[#1976D2]">
              <Mail size={18} className="text-gray-400 mr-2 flex-shrink-0" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 outline-none text-sm bg-transparent"
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              ពាក្យសម្ងាត់
            </label>
            <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2.5 focus-within:border-[#1976D2] focus-within:ring-1 focus-within:ring-[#1976D2]">
              <Lock size={18} className="text-gray-400 mr-2 flex-shrink-0" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="flex-1 outline-none text-sm bg-transparent"
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 accent-[#1976D2]"
              />
              ចងចាំខ្ញុំ
            </label>
            <button type="button" className="text-[#1976D2] hover:underline">
              ភ្លេចពាក្យសម្ងាត់?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1976D2] hover:bg-[#1565C0] text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
          >
            {loading ? "កំពុងចូល..." : "ចូលប្រើប្រាស់"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          មិនទាន់មានគណនី?{' '}
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="text-[#1976D2] hover:underline"
          >
            ចុះឈ្មោះ
          </button>
        </p>
      </div>

      {/* Footer */}
      <p className="mt-6 text-xs text-gray-400 text-center">
        © ២០២៥ ClinicSync Medical Portal. រក្សាសិទ្ធិគ្រប់យ៉ាង
      </p>
    </div>
  )
}