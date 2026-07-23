const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '/api/').replace(/\/$/, '')
const AUTH_STORAGE_KEY = 'petfit-auth-session'

export type AuthSession = {
  username: string
  access: string
  refresh: string
}

export type ReflectionPayload = {
  log_date: string
  action: string
  mood: number
  notes: string
  emotion_tags: string[]
  next_step: string
  success: boolean
  reason_id: string
  counter_duration_seconds: number | null
}

export type ReflectionResponse = ReflectionPayload & {
  id: number
  logged_at: string
}

export class ApiError extends Error {
  readonly status: number

  constructor(
    message: string,
    status: number,
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export const loadAuthSession = (): AuthSession | null => {
  try {
    const stored = window.localStorage.getItem(AUTH_STORAGE_KEY)
    if (!stored) return null
    const parsed = JSON.parse(stored) as Partial<AuthSession>
    if (
      typeof parsed.username !== 'string' ||
      typeof parsed.access !== 'string' ||
      typeof parsed.refresh !== 'string'
    ) {
      return null
    }
    return parsed as AuthSession
  } catch {
    return null
  }
}

export const saveAuthSession = (session: AuthSession) => {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
}

export const clearAuthSession = () => {
  window.localStorage.removeItem(AUTH_STORAGE_KEY)
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, headers, ...requestOptions } = options
  const response = await fetch(`${API_BASE_URL}/${path.replace(/^\//, '')}`, {
    ...requestOptions,
    headers: {
      Accept: 'application/json',
      ...(requestOptions.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  })

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as Record<string, unknown> | null
    const validationMessage = payload
      ? Object.values(payload).find(
          (value): value is string[] => Array.isArray(value) && typeof value[0] === 'string',
        )?.[0]
      : undefined
    const message =
      (typeof payload?.detail === 'string' && payload.detail) ||
      (typeof payload?.error === 'string' && payload.error) ||
      validationMessage ||
      '通信に失敗しました。'
    throw new ApiError(message, response.status)
  }

  return response.json() as Promise<T>
}

export const registerAccount = (username: string, password: string) =>
  apiRequest<{ username: string }>('register/', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })

export const login = (username: string, password: string) =>
  apiRequest<{ access: string; refresh: string }>('login/', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })

export const refreshAccessToken = (refresh: string) =>
  apiRequest<{ access: string }>('token/refresh/', {
    method: 'POST',
    body: JSON.stringify({ refresh }),
  })
