'use client'

import { getFetchHistory, saveTimeSpent } from '@/lib/supabase/client'
import { ArrowPathIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

interface FetchHistory {
  id: string
  user_email: string
  records_count: number
  status: 'processing' | 'completed' | 'error'
  error_message?: string
  started_at: string
  completed_at: string
}

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState('')
  const [history, setHistory] = useState<FetchHistory[]>([])

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      const data = await getFetchHistory()
      setHistory(data)
    } catch (error: any) {
      console.error('Error loading history:', error)
    }
  }

  const handleFetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      setSuccess(false)
      setProgress(0)
      setMessage('')

      await saveTimeSpent((progress, message) => {
        setProgress(progress)
        setMessage(message)
      })
      
      setSuccess(true)
      loadHistory()
    } catch (error: any) {
      console.error('Error in handleFetchData:', error)
      
      if (error.networkError) {
        setError(`Lỗi kết nối: ${error.networkError.message}`)
      } else if (error.graphQLErrors?.length > 0) {
        setError(`Lỗi GraphQL: ${error.graphQLErrors[0].message}`)
      } else if (error.message) {
        setError(`Lỗi: ${error.message}`)
      } else {
        setError('Đã xảy ra lỗi không xác định')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500'
      case 'error':
        return 'text-red-500'
      default:
        return 'text-yellow-500'
    }
  }

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10'
      case 'error':
        return 'bg-red-500/10'
      default:
        return 'bg-yellow-500/10'
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Cài đặt</h1>
      </div>

      <div className="bg-dark-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-dark-700">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">Đồng bộ dữ liệu</h2>
              <p className="text-dark-400">
                Lấy và cập nhật dữ liệu thời gian từ GitLab
              </p>
            </div>

            <button
              onClick={handleFetchData}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-800 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              <ArrowPathIcon
                className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`}
              />
              <span>{isLoading ? 'Đang xử lý...' : 'Đồng bộ ngay'}</span>
            </button>
          </div>

          {(isLoading || message) && (
            <div className="mt-6 space-y-4">
              <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-dark-400 flex items-center">
                <ClockIcon className="w-5 h-5 mr-2" />
                {message}
              </p>
            </div>
          )}

          {error && (
            <div className="mt-6 flex items-start space-x-2 text-red-500 bg-red-500/10 p-4 rounded-lg">
              <XCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="break-words">{error}</p>
            </div>
          )}

          {success && (
            <div className="mt-6 flex items-center space-x-2 text-green-500 bg-green-500/10 p-4 rounded-lg">
              <CheckCircleIcon className="w-5 h-5" />
              <p>Đồng bộ dữ liệu thành công!</p>
            </div>
          )}
        </div>

        {history.length > 0 && (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Lịch sử đồng bộ</h3>
            <div className="space-y-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-4 rounded-lg ${getStatusBgColor(item.status)}`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={getStatusColor(item.status)}>
                        {item.status === 'completed' && '✓ Thành công'}
                        {item.status === 'error' && '✕ Lỗi'}
                        {item.status === 'processing' && '⟳ Đang xử lý'}
                      </span>
                      {item.records_count > 0 && (
                        <span className="text-dark-400">
                          ({item.records_count.toLocaleString()} bản ghi)
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-dark-400">
                      {dayjs(item.started_at).format('DD/MM/YYYY HH:mm:ss')}
                    </div>
                    {item.error_message && (
                      <div className="text-sm text-red-500 mt-2 bg-red-500/5 p-2 rounded">
                        {item.error_message}
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-dark-400">
                    {dayjs(item.completed_at).diff(dayjs(item.started_at), 'second')}s
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 