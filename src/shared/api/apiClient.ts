import axios, { type AxiosRequestConfig } from 'axios'
import { env } from '@shared/config/env'
import { toApiError } from './errors'

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  headers: {
    Authorization: `Bearer ${env.authToken}`,
    'api-key': env.apiKey,
    Accept: 'application/json, application/vnd.api+json',
    'Content-Type': 'application/json',
  },
})

/**
 * Performs a request and returns the `data` member of the JSON:API document.
 * Errors are normalized to `ApiError`; an empty 204 response yields `undefined`.
 */
export async function apiRequest<Data>(config: AxiosRequestConfig): Promise<Data> {
  try {
    const response = await apiClient.request<{ data: Data }>(config)
    return response.data.data
  } catch (error) {
    throw toApiError(error)
  }
}
