import ReactECharts from 'echarts-for-react'
import type { TimeSpent } from '@/types'
import { useMemo } from 'react'
import * as echarts from 'echarts'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import { EChartsOption } from "echarts"

dayjs.locale('vi')

interface Props {
  data: TimeSpent[]
  selectedDate: dayjs.Dayjs
}

export const DailyChart = ({ data, selectedDate }: Props) => {
  const options: EChartsOption = useMemo(() => {
    // Tạo mảng các ngày trong tháng
    const daysInMonth = selectedDate.daysInMonth()
    const allDays = Array.from({ length: daysInMonth }, (_, i) => {
      const day = selectedDate.date(i + 1)
      return {
        date: day.format('YYYY-MM-DD'),
        dayName: day.format('DD/MM'),
        total_time: 0
      }
    })

    // Tính tổng thời gian cho mỗi ngày
    data.forEach(item => {
      const date = dayjs(item.spent_at).format('YYYY-MM-DD')
      const index = allDays.findIndex(d => d.date === date)
      if (index !== -1) {
        allDays[index].total_time += item.time_spent / 3600 // Chuyển đổi từ giây sang giờ
      }
    })

    return {
      title: {
        text: `Thời gian làm việc tháng ${selectedDate.format('MM/YYYY')}`,
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
          return `${params[0].name}<br/>Thời gian: ${value > 0 ? value.toFixed(1) + 'h' : 'Không có dữ liệu'}`
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
        data: allDays.map(item => item.dayName),
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
          type: 'bar',
          data: allDays.map(item => item.total_time),
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#3b82f6' },
              { offset: 1, color: '#0ea5e9' }
            ]),
            borderRadius: [4, 4, 0, 0]
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#60a5fa' },
                { offset: 1, color: '#38bdf8' }
              ])
            }
          }
        }
      ],
      backgroundColor: 'transparent'
    }
  }, [data, selectedDate])

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