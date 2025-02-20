import ReactECharts from 'echarts-for-react'
import type { TimeSpentByMonth } from '@/types'
import { useMemo } from 'react'
import * as echarts from 'echarts'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'

dayjs.locale('vi')

interface Props {
  data: TimeSpentByMonth[]
}

export const MonthlyChart = ({ data }: Props) => {
  const options = useMemo(() => {
    // Tạo mảng 12 tháng của năm hiện tại
    const currentYear = dayjs().format('YYYY')
    const allMonths = Array.from({ length: 12 }, (_, i) => {
      const month = dayjs(`${currentYear}-01-01`).add(i, 'month')
      return {
        month: month.format('YYYY-MM'),
        monthName: month.format('MM/YYYY'),
        total_time: 0
      }
    })

    // Cập nhật dữ liệu cho các tháng có time spent
    data.forEach(item => {
      const index = allMonths.findIndex(m => m.month === item.month)
      if (index !== -1) {
        allMonths[index].total_time = item.total_time
      }
    })

    return {
      title: {
        text: `Thời gian làm việc năm ${currentYear}`,
        textStyle: {
          color: '#fff',
          fontSize: 16,
          fontWeight: 'bold'
        },
        top: 20,
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#1e293b',
        borderColor: '#475569',
        textStyle: { color: '#94a3b8' },
        formatter: (params: any) => {
          const value = params[0].value
          return `${params[0].name}<br/>Thời gian: ${value > 0 ? value + 'h' : 'Không có dữ liệu'}`
        }
      },
      grid: {
        top: 80,
        left: 60,
        right: 40,
        bottom: 60,
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: allMonths.map(item => item.monthName),
        axisLabel: {
          color: '#94a3b8',
          interval: 0,
          rotate: 45,
          fontSize: 12,
          margin: 20
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
          fontSize: 12,
          padding: [0, 0, 0, 30]
        },
        axisLabel: {
          color: '#94a3b8',
          fontSize: 12,
          formatter: (value: number) => `${value}h`
        },
        splitLine: {
          lineStyle: {
            color: '#334155',
            opacity: 0.2
          }
        }
      },
      series: [
        {
          name: 'Thời gian',
          type: 'line',
          data: allMonths.map(item => item.total_time),
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          itemStyle: {
            color: '#0ea5e9',
            borderColor: '#fff',
            borderWidth: 2
          },
          lineStyle: {
            width: 4,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#3b82f6' },
              { offset: 1, color: '#0ea5e9' }
            ])
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(59, 130, 246, 0.5)' },
              { offset: 1, color: 'rgba(14, 165, 233, 0)' }
            ])
          },
          emphasis: {
            itemStyle: {
              color: '#38bdf8',
              borderColor: '#fff',
              borderWidth: 3,
              shadowColor: 'rgba(14, 165, 233, 0.5)',
              shadowBlur: 10
            }
          }
        }
      ],
      backgroundColor: 'transparent'
    }
  }, [data])

  return (
    <div className="w-full h-[500px] p-6 bg-dark-800 rounded-lg animate-fade-in">
      <ReactECharts 
        option={options} 
        style={{ height: '100%', width: '100%' }}
        opts={{ renderer: 'svg' }}
      />
    </div>
  )
} 