import ReactECharts from 'echarts-for-react'
import type { TimeSpentByYear } from '@/types'
import { useMemo } from 'react'

interface Props {
  data: TimeSpentByYear[]
}

export const YearlyChart = ({ data }: Props) => {
  const options = useMemo(() => ({
    title: {
      text: 'Thời gian làm việc theo năm',
      textStyle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
      },
      top: 0,
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const value = params[0].value
        return `${params[0].name}: ${value}h`
      }
    },
    grid: {
      top: 60,
      right: 20,
      bottom: 40,
      left: 50,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.map((item) => item.year),
      axisLabel: {
        color: '#94a3b8',
        fontSize: 12
      },
      axisLine: {
        lineStyle: {
          color: '#475569'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: 'Giờ',
      nameTextStyle: {
        color: '#94a3b8',
        fontSize: 12
      },
      axisLabel: {
        color: '#94a3b8',
        fontSize: 12,
        formatter: (value: number) => `${value}h`
      },
      axisLine: {
        lineStyle: {
          color: '#475569'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#334155'
        }
      }
    },
    series: [
      {
        name: 'Thời gian',
        type: 'line',
        data: data.map((item) => item.total_time),
        itemStyle: {
          color: '#0ea5e9'
        },
        emphasis: {
          itemStyle: {
            color: '#38bdf8'
          }
        },
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          width: 3
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(14, 165, 233, 0.5)'
              },
              {
                offset: 1,
                color: 'rgba(14, 165, 233, 0)'
              }
            ]
          }
        }
      }
    ],
    backgroundColor: 'transparent'
  }), [data])

  return (
    <div className="w-full h-[400px] p-4 bg-dark-800 rounded-lg animate-fade-in">
      <ReactECharts option={options} style={{ height: '100%' }} />
    </div>
  )
} 