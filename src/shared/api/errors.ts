import axios from 'axios'
import type { JsonApiError, JsonApiErrorDocument } from './types'

interface ApiErrorOptions {
  status?: number
  code?: string
  detail?: string
  cause?: unknown
}

/**
 * A failed API call with a message ready for the UI.
 * Server `title`/`detail` are kept for debugging but never rendered:
 * the API answers in English while the UI copy is Russian.
 */
export class ApiError extends Error {
  readonly status: number | undefined
  readonly code: string | undefined
  readonly detail: string | undefined

  constructor(message: string, options: ApiErrorOptions = {}) {
    super(message, { cause: options.cause })
    this.name = 'ApiError'
    this.status = options.status
    this.code = options.code
    this.detail = options.detail
  }
}

function isJsonApiErrorDocument(value: unknown): value is JsonApiErrorDocument {
  return (
    typeof value === 'object' &&
    value !== null &&
    'errors' in value &&
    Array.isArray(value.errors) &&
    value.errors.length > 0
  )
}

// Assumptions about the Trelly API, fixed by its docs and observed answers:
// 401 means an expired or invalid VITE_AUTH_TOKEN, 403 is returned for any
// refused action (including the API rate limit), so only 401 names the cause.
function messageForStatus(status: number): string {
  switch (status) {
    case 400:
      return 'Проверьте введённые данные и попробуйте снова.'
    case 401:
      return 'Токен доступа истёк — обновите VITE_AUTH_TOKEN в .env.local.'
    case 403:
      return 'Действие недоступно.'
    case 404:
      return 'Запись не найдена.'
    case 429:
      return 'Слишком много запросов — попробуйте позже.'
    default:
      return status >= 500
        ? 'Сервер не смог обработать запрос — попробуйте позже.'
        : `Не удалось выполнить запрос (код ${status}).`
  }
}

function serverErrorOf(value: unknown): JsonApiError | undefined {
  if (!isJsonApiErrorDocument(value)) {
    return undefined
  }

  return value.errors[0]
}

/** Normalizes anything thrown by the API client into an `ApiError`. */
export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error
  }

  if (!axios.isAxiosError(error)) {
    return new ApiError('Не удалось выполнить запрос. Попробуйте ещё раз.', { cause: error })
  }

  if (!error.response) {
    return new ApiError(
      'Не удалось связаться с сервером. Проверьте подключение и попробуйте снова.',
      { cause: error },
    )
  }

  const serverError = serverErrorOf(error.response.data)

  return new ApiError(messageForStatus(error.response.status), {
    status: error.response.status,
    code: serverError?.code,
    detail: serverError?.detail,
    cause: error,
  })
}
