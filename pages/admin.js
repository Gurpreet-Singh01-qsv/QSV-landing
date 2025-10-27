import { useState, useEffect } from 'react'
import Head from 'next/head'

export default function Admin() {
  const [emails, setEmails] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({ total: 0, today: 0, thisWeek: 0 })

  useEffect(() => {
    fetchEmails()
  }, [])

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

    const todayCount = emailList.filter(email => 
      new Date(email.created_at) >= today
    ).length

    const weekCount = emailList.filter(email => 
      new Date(email.created_at) >= weekAgo
    ).length

    setStats({
      total: emailList.length,
      today: todayCount,
      thisWeek: weekCount
    })
  }

  const exportToCSV = () => {
    const csvContent = [
      ['Email', 'Date', 'Source'],
      ...emails.map(email => [
        email.email,
        new Date(email.created_at).toLocaleDateString(),
        email.source || 'landing_page'
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
      </Head>

      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">QSV Waitlist Dashboard</h1>
            <button
              onClick={exportToCSV}
              className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Export CSV
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-gray-400 text-sm uppercase tracking-wide">Total Signups</h3>
              <p className="text-3xl font-bold text-cyan-400 mt-2">{stats.total}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-gray-400 text-sm uppercase tracking-wide">Today</h3>
              <p className="text-3xl font-bold text-green-400 mt-2">{stats.today}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-gray-400 text-sm uppercase tracking-wide">This Week</h3>
              <p className="text-3xl font-bold text-purple-400 mt-2">{stats.thisWeek}</p>
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