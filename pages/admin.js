import { useState, useEffect } from 'react'
import Head from 'next/head'

export default function Admin() {
  const [emails, setEmails] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [stats, setStats] = useState({ 
    total: 0, 
    today: 0, 
    thisWeek: 0, 
    thisMonth: 0,
    growthRate: 0,
    topSources: [],
    topCountries: []
  })
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')

  useEffect(() => {
    // Check if already authenticated
    const authStatus = localStorage.getItem('qsv-admin-auth')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
      fetchEmails()
    } else {
      setLoading(false)
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setAuthError('')
    
    try {
      const response = await fetch('/api/auth/admin-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })
      
      const result = await response.json()
      
      if (result.success) {
        setIsAuthenticated(true)
        localStorage.setItem('qsv-admin-auth', 'true')
        fetchEmails()
      } else {
        setAuthError('Invalid password')
      }
    } catch (err) {
      setAuthError('Authentication failed')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('qsv-admin-auth')
    setPassword('')
  }

  const fetchEmails = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/emails')
      const result = await response.json()
      
      if (result.success) {
        setEmails(result.data)
        calculateStats(result.data)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Failed to load emails')
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (emailList) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
    const twoWeeksAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000)

    const todayCount = emailList.filter(email => 
      new Date(email.created_at) >= today
    ).length

    const weekCount = emailList.filter(email => 
      new Date(email.created_at) >= weekAgo
    ).length

    const monthCount = emailList.filter(email => 
      new Date(email.created_at) >= monthAgo
    ).length

    const lastWeekCount = emailList.filter(email => {
      const date = new Date(email.created_at)
      return date >= twoWeeksAgo && date < weekAgo
    }).length

    const growthRate = lastWeekCount > 0 ? 
      ((weekCount - lastWeekCount) / lastWeekCount * 100).toFixed(1) : 0

    // Calculate top sources
    const sources = {}
    emailList.forEach(email => {
      const source = email.utm_source || email.source || 'direct'
      sources[source] = (sources[source] || 0) + 1
    })
    const topSources = Object.entries(sources)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([source, count]) => ({ source, count }))

    // Calculate top countries
    const countries = {}
    emailList.forEach(email => {
      if (email.country) {
        countries[email.country] = (countries[email.country] || 0) + 1
      }
    })
    const topCountries = Object.entries(countries)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([country, count]) => ({ country, count }))

    setStats({
      total: emailList.length,
      today: todayCount,
      thisWeek: weekCount,
      thisMonth: monthCount,
      growthRate,
      topSources,
      topCountries
    })
  }

  const exportToCSV = () => {
    const csvContent = [
      ['Email', 'Date', 'Source', 'UTM Source', 'UTM Medium', 'UTM Campaign', 'Country', 'City', 'Status'],
      ...filteredEmails.map(email => [
        email.email,
        new Date(email.created_at).toLocaleDateString(),
        email.source || 'landing_page',
        email.utm_source || '',
        email.utm_medium || '',
        email.utm_campaign || '',
        email.country || '',
        email.city || '',
        email.status || 'active'
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `qsv-waitlist-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const filteredEmails = emails
    .filter(email => {
      if (filter === 'today') {
        return new Date(email.created_at).toDateString() === new Date().toDateString()
      }
      if (filter === 'week') {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        return new Date(email.created_at) >= weekAgo
      }
      return true
    })
    .filter(email => 
      email.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (email.country && email.country.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (email.utm_source && email.utm_source.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      const aVal = a[sortBy] || ''
      const bVal = b[sortBy] || ''
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1
      }
      return aVal < bVal ? 1 : -1
    })

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <Head>
          <title>QSV Admin - Login</title>
          
          {/* Favicon */}
          <link rel="icon" href="/favicon.ico" />
          <link rel="icon" type="image/png" sizes="32x32" href="/images/qsv-logo-merged.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/images/qsv-logo-merged.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/images/qsv-logo-merged.png" />
        </Head>
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 w-full max-w-md">
            <h1 className="text-2xl font-bold text-white mb-6 text-center">QSV Admin Access</h1>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-300 text-sm font-medium mb-2">
                  Admin Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-cyan-500 focus:outline-none"
                  placeholder="Enter admin password"
                  required
                />
              </div>
              {authError && (
                <div className="mb-4 text-red-400 text-sm">{authError}</div>
              )}
              <button
                type="submit"
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-3 rounded-lg transition-colors"
              >
                Access Dashboard
              </button>
            </form>
          </div>
        </div>
      </>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>QSV Admin - Waitlist Dashboard</title>
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/qsv-logo-merged.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/qsv-logo-merged.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/qsv-logo-merged.png" />
      </Head>

      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">QSV Waitlist Dashboard</h1>
            <div className="flex gap-3">
              <button
                onClick={exportToCSV}
                className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Export CSV
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-cyan-900 to-cyan-800 p-6 rounded-xl border border-cyan-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-cyan-200 text-sm uppercase tracking-wide">Total Signups</h3>
                  <p className="text-3xl font-bold text-white mt-2">{stats.total}</p>
                </div>
                <div className="text-cyan-300 text-2xl">👥</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-900 to-green-800 p-6 rounded-xl border border-green-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-green-200 text-sm uppercase tracking-wide">Today</h3>
                  <p className="text-3xl font-bold text-white mt-2">{stats.today}</p>
                </div>
                <div className="text-green-300 text-2xl">📈</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-900 to-purple-800 p-6 rounded-xl border border-purple-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-purple-200 text-sm uppercase tracking-wide">This Week</h3>
                  <p className="text-3xl font-bold text-white mt-2">{stats.thisWeek}</p>
                  {stats.growthRate !== 0 && (
                    <p className={`text-sm mt-1 ${stats.growthRate > 0 ? 'text-green-300' : 'text-red-300'}`}>
                      {stats.growthRate > 0 ? '↗' : '↘'} {Math.abs(stats.growthRate)}% vs last week
                    </p>
                  )}
                </div>
                <div className="text-purple-300 text-2xl">📊</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-900 to-orange-800 p-6 rounded-xl border border-orange-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-orange-200 text-sm uppercase tracking-wide">This Month</h3>
                  <p className="text-3xl font-bold text-white mt-2">{stats.thisMonth}</p>
                </div>
                <div className="text-orange-300 text-2xl">🚀</div>
              </div>
            </div>
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <h3 className="text-white text-lg font-semibold mb-4">Top Traffic Sources</h3>
              <div className="space-y-3">
                {stats.topSources.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-300 capitalize">{item.source}</span>
                    <div className="flex items-center gap-2">
                      <div className="bg-cyan-600 h-2 rounded-full" style={{width: `${(item.count / stats.total) * 100}px`}}></div>
                      <span className="text-cyan-400 font-medium">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <h3 className="text-white text-lg font-semibold mb-4">Top Countries</h3>
              <div className="space-y-3">
                {stats.topCountries.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-300">{item.country}</span>
                    <div className="flex items-center gap-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{width: `${(item.count / stats.total) * 100}px`}}></div>
                      <span className="text-purple-400 font-medium">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'all' ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  All Time
                </button>
                <button
                  onClick={() => setFilter('today')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'today' ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Today
                </button>
                <button
                  onClick={() => setFilter('week')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'week' ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  This Week
                </button>
              </div>
              
              <div className="flex gap-4 items-center">
                <input
                  type="text"
                  placeholder="Search emails, countries, sources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-cyan-500 focus:outline-none"
                />
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-')
                    setSortBy(field)
                    setSortOrder(order)
                  }}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="created_at-desc">Newest First</option>
                  <option value="created_at-asc">Oldest First</option>
                  <option value="email-asc">Email A-Z</option>
                  <option value="email-desc">Email Z-A</option>
                </select>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Email List */}
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700">
              <h2 className="text-xl font-semibold">Waitlist Emails ({emails.length})</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Source
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {emails.map((email, index) => (
                    <tr key={email.id || index} className="hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {email.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {new Date(email.created_at).toLocaleDateString()} {new Date(email.created_at).toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <span className="bg-cyan-900 text-cyan-200 px-2 py-1 rounded-full text-xs">
                          {email.source || 'landing_page'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {emails.length === 0 && !error && (
              <div className="px-6 py-8 text-center text-gray-400">
                No emails in waitlist yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}