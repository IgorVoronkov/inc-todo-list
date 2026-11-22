type EnvVariable = 'VITE_API_URL' | 'VITE_AUTH_TOKEN' | 'VITE_API_KEY'

function readEnvVariable(name: EnvVariable): string {
  const value: unknown = import.meta.env[name]

  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(
      `Missing environment variable ${name}. ` +
        'Copy .env.example to .env.local and fill in the required values.',
    )
  }

  return value.trim()
}

export const env = {
  apiUrl: readEnvVariable('VITE_API_URL').replace(/\/+$/, ''),
  authToken: readEnvVariable('VITE_AUTH_TOKEN'),
  apiKey: readEnvVariable('VITE_API_KEY'),
} as const
