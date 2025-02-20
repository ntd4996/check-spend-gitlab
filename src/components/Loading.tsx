import { ArrowPathIcon } from '@heroicons/react/24/outline'

interface Props {
  message?: string
}

export const Loading = ({ message = 'Đang tải dữ liệu...' }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 animate-fade-in">
      <ArrowPathIcon className="w-8 h-8 text-primary-500 animate-spin" />
      <p className="text-dark-400">{message}</p>
    </div>
  )
} 