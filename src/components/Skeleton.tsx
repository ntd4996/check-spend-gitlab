import { useMemo } from 'react'

interface Props {
  type?: 'daily' | 'monthly'
}

export const Skeleton = ({ type = 'daily' }: Props) => {
  // Tạo mảng giá trị ngẫu nhiên cố định cho mỗi lần render
  const randomValues = useMemo(() => {
    const count = type === 'daily' ? 31 : 12
    const seed = type === 'daily' ? 0.6745 : 0.4123
    return Array.from({ length: count }, (_, i) => {
      // Sử dụng công thức tất định để tạo giá trị ngẫu nhiên
      const value = ((seed * (i + 1)) % 1) * 60 + 20 // Giá trị từ 20% đến 80%
      return value
    })
  }, [type])

  return (
    <div className="w-full h-[500px] p-6 bg-dark-800 rounded-lg animate-pulse">
      {/* Title skeleton */}
      <div className="flex items-center justify-center mb-12">
        <div className="h-6 w-64 bg-dark-700 rounded-lg" />
      </div>

      {/* Chart skeleton */}
      <div className="h-[calc(100%-80px)]">
        {/* Y-axis */}
        <div className="absolute left-12 h-full w-8 flex flex-col justify-between py-8">
          <div className="h-4 w-8 bg-dark-700 rounded" />
          <div className="h-4 w-8 bg-dark-700 rounded" />
          <div className="h-4 w-8 bg-dark-700 rounded" />
          <div className="h-4 w-8 bg-dark-700 rounded" />
        </div>

        {/* Bars or Lines */}
        <div className="h-full ml-24 mr-8 grid gap-2" 
          style={{ 
            gridTemplateColumns: `repeat(${type === 'daily' ? '31' : '12'}, 1fr)`,
          }}
        >
          {randomValues.map((value, i) => (
            <div key={i} className="relative h-full">
              {type === 'daily' ? (
                // Bar chart skeleton
                <div 
                  className="absolute bottom-8 w-full bg-dark-700 rounded-t-sm"
                  style={{ height: `${value}%` }}
                />
              ) : (
                // Line chart skeleton
                <div 
                  className="h-2 w-full bg-dark-700 rounded-full absolute" 
                  style={{ top: `${value}%` }}
                />
              )}
            </div>
          ))}
        </div>

        {/* X-axis */}
        <div className="absolute bottom-0 left-24 right-8 grid gap-2" 
          style={{ 
            gridTemplateColumns: `repeat(${type === 'daily' ? '31' : '12'}, 1fr)`
          }}
        >
          {randomValues.map((_, i) => (
            <div key={i} className="h-4 bg-dark-700 rounded transform -rotate-45 origin-top-left" />
          ))}
        </div>
      </div>
    </div>
  )
} 