export interface TimeSpent {
  id: string
  user_email: string
  project_id: number
  project_name: string
  issue_id: number
  issue_title: string
  spent_at: string
  time_spent: number
  created_at: string
}

export interface TimeSpentByMonth {
  month: string
  total_time: number
}

export interface TimeSpentByYear {
  year: string
  total_time: number
}

export interface GitLabResponse {
  projects: {
    nodes: {
      id: string
      name: string
      fullPath: string
      issues: {
        nodes: {
          id: string
          iid: string
          title: string
          webUrl: string
          state: string
          timeEstimate: number
          totalTimeSpent: number
          timelogs: {
            nodes: {
              timeSpent: number
              spentAt: string
              user: {
                username: string
                email: string
              }
            }[]
          }
        }[]
        pageInfo: {
          endCursor: string
          hasNextPage: boolean
        }
      }
    }[]
    pageInfo: {
      endCursor: string
      hasNextPage: boolean
    }
  }
}

export interface GitlabTimeSpent {
  data: {
    project: {
      id: string
      name: string
      issues: {
        nodes: {
          id: string
          title: string
          timeSpent: number
          closedAt: string
        }[]
      }
    }
  }
} 