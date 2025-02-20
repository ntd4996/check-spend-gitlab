import { ApolloClient, InMemoryCache, createHttpLink, gql } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import dayjs from 'dayjs'

interface GitLabTimeLog {
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
  webUrl: string
  state: string
  timeEstimate: number
  totalTimeSpent: number
  timelogs: {
    nodes: GitLabTimeLog[]
  }
}

interface GitLabProject {
  id: string
  name: string
  fullPath: string
  issues: {
    nodes: GitLabIssue[]
    pageInfo: {
      endCursor: string
      hasNextPage: boolean
    }
  }
}

interface GitLabResponse {
  projects: {
    nodes: GitLabProject[]
    pageInfo: {
      endCursor: string
      hasNextPage: boolean
    }
  }
}

const httpLink = createHttpLink({
  uri: `${process.env.NEXT_PUBLIC_GITLAB_URL}/api/graphql`,
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    )

  if (networkError) console.error(`[Network error]: ${networkError}`)
})

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${process.env.NEXT_PUBLIC_GITLAB_TOKEN}`,
    },
  }
})

export const client = new ApolloClient({
  link: errorLink.concat(authLink.concat(httpLink)),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
})

export const CURRENT_USER_QUERY = gql`
  query {
    currentUser {
      id
      name
      username
      email
    }
  }
`

export const TIME_SPENT_QUERY = gql`
  query GetTimeSpent($after: String) {
    projects(membership: true, first: 100, after: $after) {
      nodes {
        id
        name
        fullPath
        issues(first: 100) {
          nodes {
            id
            iid
            title
            webUrl
            state
            timeEstimate
            totalTimeSpent
            timelogs(first: 100) {
              nodes {
                timeSpent
                spentAt
                user {
                  username
                  email
                }
              }
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`

export { type GitLabResponse } 