import { useState, useEffect } from 'react'

const API_BASE = 'http://localhost:8000'

function App() {
  const [currentPage, setCurrentPage] = useState('login')
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
      setCurrentPage('search')
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    setCurrentPage('login')
  }

  if (!token) {
    return <AuthPage setToken={setToken} setUser={setUser} setCurrentPage={setCurrentPage} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
  }

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`shadow-sm border-b transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Findly</h1>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Smart Document Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                👤 {user?.name} <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>({user?.role})</span>
              </span>
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {darkMode ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
              <button
                onClick={handleLogout}
                className={`px-4 py-2 text-sm rounded-lg transition ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className={`border-b transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {['search', 'upload', 'documents', 'stats', 'profile'].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                  currentPage === page
                    ? 'border-indigo-600 text-indigo-600'
                    : darkMode 
                      ? 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {page.charAt(0).toUpperCase() + page.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'search' && <SearchPage token={token} darkMode={darkMode} />}
        {currentPage === 'upload' && <UploadPage token={token} darkMode={darkMode} />}
        {currentPage === 'documents' && <DocumentsPage darkMode={darkMode} />}
        {currentPage === 'stats' && <StatsPage darkMode={darkMode} />}
        {currentPage === 'profile' && <ProfilePage user={user} darkMode={darkMode} />}
      </main>
    </div>
  )
}

// Auth Page Component
function AuthPage({ setToken, setUser, setCurrentPage, darkMode, toggleDarkMode }) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'student',
    branch: '',
    semester: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const url = isLogin ? `${API_BASE}/login` : `${API_BASE}/signup`
      const body = isLogin
        ? { email: formData.email, password: formData.password }
        : formData

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await res.json()

      if (res.ok) {
        if (isLogin) {
          localStorage.setItem('token', data.access_token)
          localStorage.setItem('user', JSON.stringify({ 
            name: data.name, 
            role: data.role,
            email: formData.email,
            branch: data.branch,
            semester: data.semester
          }))
          setToken(data.access_token)
          setUser({ name: data.name, role: data.role })
          setCurrentPage('search')
        } else {
          setIsLogin(true)
          setError('Account created! Please login.')
        }
      } else {
        setError(data.detail || 'Authentication failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900'
        : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50'
    }`}>
      <div className="max-w-md w-full">
        {/* Dark Mode Toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleDarkMode}
            className={`p-3 rounded-full transition ${
              darkMode 
                ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400'
                : 'bg-white hover:bg-gray-100 text-gray-600 shadow-md'
            }`}
          >
            {darkMode ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>
        
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl items-center justify-center mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h1 className={`text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Findly</h1>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Smart Document Management for Educational Institutions</p>
        </div>

        <div className={`rounded-2xl shadow-xl p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className={`flex mb-6 rounded-lg p-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition ${
                isLogin 
                  ? darkMode
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-white text-indigo-600 shadow'
                  : darkMode
                    ? 'text-gray-400'
                    : 'text-gray-600'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition ${
                !isLogin 
                  ? darkMode
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-white text-indigo-600 shadow'
                  : darkMode
                    ? 'text-gray-400'
                    : 'text-gray-600'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg transition focus:ring-2 focus:ring-indigo-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            )}

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg transition focus:ring-2 focus:ring-indigo-500 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border border-gray-300 text-gray-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg transition focus:ring-2 focus:ring-indigo-500 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border border-gray-300 text-gray-900'
                }`}
              />
            </div>

            {!isLogin && (
              <>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg transition focus:ring-2 focus:ring-indigo-500 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {formData.role === 'student' && (
                  <>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Branch</label>
                      <select
                        value={formData.branch}
                        onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                        className={`w-full px-4 py-3 rounded-lg transition focus:ring-2 focus:ring-indigo-500 ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="">Select Branch</option>
                        <option value="CSE">Computer Science</option>
                        <option value="ECE">Electronics</option>
                        <option value="EEE">Electrical</option>
                        <option value="MECH">Mechanical</option>
                        <option value="CIVIL">Civil</option>
                      </select>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Semester</label>
                      <input
                        type="text"
                        value={formData.semester}
                        onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                        placeholder="e.g., 6"
                        className={`w-full px-4 py-3 rounded-lg transition focus:ring-2 focus:ring-indigo-500 ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                  </>
                )}
              </>
            )}

            {error && (
              <div className={`p-4 rounded-lg ${
                error.includes('created') 
                  ? darkMode
                    ? 'bg-green-900/50 text-green-200 border border-green-700'
                    : 'bg-green-50 text-green-800'
                  : darkMode
                    ? 'bg-red-900/50 text-red-200 border border-red-700'
                    : 'bg-red-50 text-red-800'
              }`}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>

          {isLogin && (
            <div className={`mt-6 p-4 rounded-lg ${
              darkMode ? 'bg-indigo-900/30 border border-indigo-700' : 'bg-blue-50'
            }`}>
              <p className={`text-sm ${darkMode ? 'text-indigo-200' : 'text-blue-800'}`}>
                <strong>Demo Account:</strong><br />
                Email: admin@findly.com<br />
                Password: admin123
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Search Page Component
function SearchPage({ token, darkMode }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [understanding, setUnderstanding] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/chat-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      })
      const data = await res.json()
      console.log('Search response:', data) // Debug log
      setResults(data.results || [])
      setUnderstanding(data.query_understanding)
    } catch (err) {
      console.error('Search failed:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Search Documents</h2>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Ask naturally, like "Show AI project reports from 2023"</p>
      </div>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Try: "Find CSE notes from 2023" or "Research papers on ML"'
            className={`flex-1 px-6 py-4 text-lg rounded-xl shadow-sm transition focus:ring-2 focus:ring-indigo-500 ${
              darkMode 
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                : 'bg-white border border-gray-300 text-gray-900'
            }`}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition disabled:opacity-50"
          >
            {loading ? '🔍' : 'Search'}
          </button>
        </div>
      </form>

      {understanding && (
        <div className={`mb-6 p-4 rounded-lg border ${
          darkMode 
            ? 'bg-blue-900/30 border-blue-700'
            : 'bg-blue-50 border-blue-200'
        }`}>
          <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-blue-200' : 'text-blue-900'}`}>🧠 Query Understanding:</p>
          <div className="flex flex-wrap gap-2">
            {understanding.extracted_year && (
              <span className={`px-3 py-1 rounded-full text-sm ${
                darkMode ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-800'
              }`}>
                📅 Year: {understanding.extracted_year}
              </span>
            )}
            {understanding.extracted_department && (
              <span className={`px-3 py-1 rounded-full text-sm ${
                darkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800'
              }`}>
                🏢 Dept: {understanding.extracted_department}
              </span>
            )}
            {understanding.extracted_type && (
              <span className={`px-3 py-1 rounded-full text-sm ${
                darkMode ? 'bg-purple-800 text-purple-200' : 'bg-purple-100 text-purple-800'
              }`}>
                📄 Type: {understanding.extracted_type}
              </span>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className={`inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-transparent ${
            darkMode ? 'border-indigo-500' : 'border-indigo-600'
          }`}></div>
          <p className={`mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Searching...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-4">
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{results.length} results found</p>
          {results.map((doc, i) => (
            <div key={i} className={`p-6 rounded-xl shadow-sm border transition hover:shadow-md ${
              darkMode 
                ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}>
              <div className="flex justify-between items-start mb-3">
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{doc.filename || 'Untitled Document'}</h3>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  darkMode ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
                }`}>
                  {doc.category || 'Document'}
                </span>
              </div>
              <p className={`mb-4 whitespace-pre-line ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{doc.summary || 'No summary available'}</p>
              <div className={`flex flex-wrap gap-2 text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {doc.department && <span>🏢 {doc.department}</span>}
                {doc.year && <span>📅 {doc.year}</span>}
                {doc.uploader && <span>👤 {doc.uploader}</span>}
                {doc.tags && doc.tags.length > 0 && (
                  <div className="flex gap-1">
                    {doc.tags.map((tag, j) => (
                      <span key={j} className={`px-2 py-1 rounded text-xs ${
                        darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {doc.filename && (
                <a
                  href={`${API_BASE}/uploads/${doc.filename}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Open Document
                </a>
              )}
            </div>
          ))}
        </div>
      ) : query ? (
        <div className="text-center py-12">
          <svg className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>No documents found. Try a different query.</p>
        </div>
      ) : null}
    </div>
  )
}

// Upload Page Component
function UploadPage({ token, darkMode }) {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) return

    setUploading(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('token', token)

      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData
      })

      const data = await res.json()
      if (res.ok) {
        setResult({ success: true, data })
        setFile(null)
      } else {
        setResult({ success: false, error: data.detail })
      }
    } catch (err) {
      setResult({ success: false, error: 'Upload failed' })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Upload Document</h2>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Upload PDF or DOCX files for AI-powered processing</p>
      </div>

      <div className={`p-8 rounded-2xl shadow-sm border ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <form onSubmit={handleUpload}>
          <div className="mb-6">
            <label className="block w-full">
              <div className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition ${
                file 
                  ? darkMode
                    ? 'border-indigo-600 bg-indigo-900/20'
                    : 'border-indigo-600 bg-indigo-50'
                  : darkMode
                    ? 'border-gray-600 hover:border-indigo-600 hover:bg-gray-700'
                    : 'border-gray-300 hover:border-indigo-600 hover:bg-gray-50'
              }`}>
                <svg className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                {file ? (
                  <div>
                    <p className={`text-lg font-medium mb-1 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>{file.name}</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div>
                    <p className={`text-lg font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Click to upload</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>PDF or DOCX (Max 10MB)</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={!file || uploading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-medium hover:shadow-lg transition disabled:opacity-50"
          >
            {uploading ? 'Uploading & Processing...' : 'Upload Document'}
          </button>
        </form>

        {result && (
          <div className={`mt-6 p-6 rounded-xl border ${
            result.success 
              ? darkMode
                ? 'bg-green-900/30 border-green-700'
                : 'bg-green-50 border-green-200'
              : darkMode
                ? 'bg-red-900/30 border-red-700'
                : 'bg-red-50 border-red-200'
          }`}>
            {result.success ? (
              <div>
                <h3 className={`font-semibold mb-3 flex items-center ${darkMode ? 'text-green-200' : 'text-green-900'}`}>
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Upload Successful!
                </h3>
                <div className={`space-y-3 text-sm ${darkMode ? 'text-green-200' : 'text-green-800'}`}>
                  <div>
                    <p className="font-medium mb-1">Category: {result.data.category}</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">AI Summary:</p>
                    <p className="whitespace-pre-line">{result.data.summary}</p>
                  </div>
                  {result.data.metadata && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {result.data.metadata.department && (
                        <span className={`px-3 py-1 rounded-full ${darkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800'}`}>
                          🏢 {result.data.metadata.department}
                        </span>
                      )}
                      {result.data.metadata.year && (
                        <span className={`px-3 py-1 rounded-full ${darkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800'}`}>
                          📅 {result.data.metadata.year}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className={darkMode ? 'text-red-200' : 'text-red-800'}>{result.error}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Documents Page Component
function DocumentsPage({ darkMode }) {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      const res = await fetch(`${API_BASE}/documents`)
      const data = await res.json()
      setDocuments(data)
    } catch (err) {
      console.error('Failed to fetch documents:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className={`inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-transparent ${
          darkMode ? 'border-indigo-500' : 'border-indigo-600'
        }`}></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>All Documents</h2>
        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{documents.length} documents</span>
      </div>

      <div className="grid gap-4">
        {documents.map((doc, i) => (
          <div key={i} className={`p-6 rounded-xl shadow-sm border transition hover:shadow-md ${
            darkMode 
              ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}>
            <div className="flex justify-between items-start mb-3">
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{doc.filename}</h3>
              <span className={`px-3 py-1 rounded-full text-sm ${
                darkMode ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
              }`}>
                {doc.category || 'Uncategorized'}
              </span>
            </div>
            <p className={`mb-4 line-clamp-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{doc.summary || 'No summary available'}</p>
            <div className="flex items-center justify-between">
              <div className={`flex flex-wrap gap-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {doc.department && <span>🏢 {doc.department}</span>}
                {doc.year && <span>📅 {doc.year}</span>}
                {doc.uploader && <span>👤 {doc.uploader}</span>}
                {doc.timestamp && <span>🕒 {new Date(doc.timestamp).toLocaleDateString()}</span>}
              </div>
              <a
                href={`${API_BASE}/uploads/${doc.filename}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Open
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Profile Page Component
function ProfilePage({ user, darkMode }) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>My Profile</h2>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Your account information</p>
      </div>

      <div className={`rounded-2xl shadow-lg border p-8 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        {/* Profile Header */}
        <div className="flex items-center space-x-6 mb-8 pb-8 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h3 className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user?.name || 'User'}</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${darkMode ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-100 text-indigo-700'}`}>
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'Student'}
              </span>
            </p>
          </div>
        </div>

        {/* Profile Information */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Full Name</label>
              <div className={`px-4 py-3 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'}`}>
                {user?.name || 'N/A'}
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Email Address</label>
              <div className={`px-4 py-3 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'}`}>
                {localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).email || 'N/A' : 'N/A'}
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Role</label>
              <div className={`px-4 py-3 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'}`}>
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'Student'}
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Account Status</label>
              <div className={`px-4 py-3 rounded-lg flex items-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <span className={darkMode ? 'text-white' : 'text-gray-900'}>Active</span>
                </span>
              </div>
            </div>
          </div>

          {/* Additional Info for Students */}
          {user?.role === 'student' && (
            <div className={`mt-8 p-6 rounded-xl border ${darkMode ? 'bg-indigo-900/20 border-indigo-700' : 'bg-indigo-50 border-indigo-200'}`}>
              <h4 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-indigo-300' : 'text-indigo-900'}`}>Student Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-700'}`}>Branch</label>
                  <div className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-indigo-800/50 text-indigo-200' : 'bg-white text-indigo-900'}`}>
                    {localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).branch || 'N/A' : 'N/A'}
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-700'}`}>Semester</label>
                  <div className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-indigo-800/50 text-indigo-200' : 'bg-white text-indigo-900'}`}>
                    {localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).semester || 'N/A' : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Account Statistics */}
          <div className={`mt-8 p-6 rounded-xl border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
            <h4 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Quick Stats</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className={`text-3xl font-bold ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>-</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Documents</p>
              </div>
              <div className="text-center">
                <p className={`text-3xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>-</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Searches</p>
              </div>
              <div className="text-center">
                <p className={`text-3xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>-</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Uploads</p>
              </div>
              <div className="text-center">
                <p className={`text-3xl font-bold ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>-</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Downloads</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Stats Page Component
function StatsPage({ darkMode }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/stats`)
      const data = await res.json()
      setStats(data)
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className={`inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-transparent ${
          darkMode ? 'border-indigo-500' : 'border-indigo-600'
        }`}></div>
      </div>
    )
  }

  return (
    <div>
      <h2 className={`text-3xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Statistics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white p-6 rounded-2xl shadow-lg">
          <p className="text-sm opacity-90 mb-2">Total Documents</p>
          <p className="text-4xl font-bold">{stats.total_documents}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white p-6 rounded-2xl shadow-lg">
          <p className="text-sm opacity-90 mb-2">Total Users</p>
          <p className="text-4xl font-bold">{stats.total_users}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`p-6 rounded-2xl shadow-sm border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>By Department</h3>
          <div className="space-y-3">
            {Object.entries(stats.documents_by_department || {}).map(([dept, count]) => (
              <div key={dept} className="flex justify-between items-center">
                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{dept}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  darkMode ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
                }`}>
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-6 rounded-2xl shadow-sm border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>By Type</h3>
          <div className="space-y-3">
            {Object.entries(stats.documents_by_type || {}).map(([type, count]) => (
              <div key={type} className="flex justify-between items-center">
                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{type}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  darkMode ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700'
                }`}>
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
