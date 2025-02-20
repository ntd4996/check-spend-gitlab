import { createClient } from '@supabase/supabase-js'
import type { TimeSpent, TimeSpentByMonth, TimeSpentByYear } from '@/types'
import { client, CURRENT_USER_QUERY, TIME_SPENT_QUERY, type GitLabResponse } from '@/lib/gitlab/client'
import dayjs from 'dayjs'
import { Database } from "@/types/supabase"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const userEmail = process.env.NEXT_PUBLIC_GITLAB_USER!

// Tắt hoàn toàn tính năng auth
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js'
    }
  }
})

interface GitLabTimelog {
  timeSpent: number
  spentAt: string
  user: {
    username: string
    email: string
  }
}

interface GitLabIssue {
  id: string
  iid: string
  title: string
  timelogs: {
    nodes: GitLabTimelog[]
  }
}

interface GitLabProject {
  id: string
  name: string
  issues: {
    nodes: GitLabIssue[]
  }
}

interface GitLabProjects {
  nodes: GitLabProject[]
  pageInfo: {
    hasNextPage: boolean
    endCursor: string | null
  }
}

interface GitLabQueryData {
  projects: GitLabProjects
}

export const saveTimeSpent = async (onProgress: (progress: number, message: string) => void) => {
  let fetchHistoryId: string | null = null
  
  try {
    // Create fetch history record
    const { data: historyData } = await supabase
      .from('fetch_history')
      .insert({
        user_email: userEmail,
        records_count: 0,
        status: 'processing',
        started_at: new Date().toISOString()
      })
      .select()
      .single()

    fetchHistoryId = historyData?.id

    onProgress(0, 'Đang lấy thông tin người dùng...')
    // Get current user
    const { data: userData } = await client.query({
      query: CURRENT_USER_QUERY,
    })
    const currentUser = userData?.currentUser
    console.log('Current User:', currentUser)

    if (!currentUser?.username) {
      throw new Error('Could not get current user information')
    }

    onProgress(10, 'Đang lấy dữ liệu từ GitLab...')
    let hasNextPage = true
    let endCursor = null
    let allTimeSpentData: any[] = []
    let progress = 10

    while (hasNextPage) {
      const { data } = await client.query<GitLabQueryData>({
        query: TIME_SPENT_QUERY,
        variables: { after: endCursor }
      })

      if (!data || !data.projects || !data.projects.nodes) {
        throw new Error('Invalid response from GitLab API')
      }

      const projects: GitLabProjects = data.projects
      const timeSpentData = projects.nodes.flatMap((project: GitLabProject) => {
        if (!project || !project.issues || !project.issues.nodes) return []
        
        return project.issues.nodes.flatMap((issue: GitLabIssue) => {
          if (!issue || !issue.timelogs || !issue.timelogs.nodes) return []
          
          return issue.timelogs.nodes
            .filter((timelog: GitLabTimelog) => timelog?.user?.username === currentUser.username)
            .map((timelog: GitLabTimelog) => {
              if (!timelog) return null
              
              try {
                const projectId = project.id.replace('gid://gitlab/Project/', '')
                return {
                  user_email: userEmail,
                  project_id: projectId,
                  project_name: project.name,
                  issue_id: issue.iid,
                  issue_title: issue.title,
                  spent_at: timelog.spentAt,
                  time_spent: timelog.timeSpent
                }
              } catch (error) {
                console.error('Error processing timelog:', error)
                return null
              }
            })
            .filter(Boolean)
        })
      })

      allTimeSpentData = [...allTimeSpentData, ...timeSpentData]
      hasNextPage = projects.pageInfo?.hasNextPage || false
      endCursor = projects.pageInfo?.endCursor || null

      progress += 5
      onProgress(Math.min(progress, 70), `Đã tìm thấy ${allTimeSpentData.length} bản ghi...`)
    }

    onProgress(80, 'Đang xóa dữ liệu cũ...')
    const { error: deleteError } = await supabase
      .from('time_spent')
      .delete()
      .eq('user_email', userEmail)

    if (deleteError) {
      console.error('Delete Error:', deleteError)
      throw deleteError
    }

    onProgress(90, 'Đang lưu dữ liệu mới...')
    const { data: result, error } = await supabase
      .from('time_spent')
      .insert(allTimeSpentData)
      .select()

    if (error) {
      console.error('Insert Error:', error)
      throw error
    }

    // Update fetch history record
    if (fetchHistoryId) {
      await supabase
        .from('fetch_history')
        .update({
          records_count: allTimeSpentData.length,
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', fetchHistoryId)
    }

    onProgress(100, 'Hoàn thành!')
    return result
  } catch (error: any) {
    console.error('Save Time Spent Error:', error)

    // Update fetch history record with error
    if (fetchHistoryId) {
      await supabase
        .from('fetch_history')
        .update({
          status: 'error',
          error_message: error.message || 'Unknown error',
          completed_at: new Date().toISOString()
        })
        .eq('id', fetchHistoryId)
    }

    throw error
  }
}

export const getTimeSpentByMonth = async (month: string): Promise<TimeSpentByMonth[]> => {
  const { data, error } = await supabase
    .rpc('get_time_spent_by_month', { 
      p_user_email: userEmail,
      p_month: month
    })

  if (error) throw error
  return data || []
}

export const getTimeSpentByYear = async (year: string): Promise<TimeSpentByYear[]> => {
  const { data, error } = await supabase
    .rpc('get_time_spent_by_year', { 
      p_user_email: userEmail,
      p_year: year
    })

  if (error) throw error
  return data || []
}

export const getFetchHistory = async () => {
  const { data, error } = await supabase
    .from('fetch_history')
    .select()
    .eq('user_email', userEmail)
    .order('started_at', { ascending: false })
    .limit(10)

  if (error) throw error
  return data || []
} 