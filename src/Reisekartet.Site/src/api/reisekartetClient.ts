const baseUrl: string = '/api'

export interface ReisekartetError {
  statusCode: number
  message: string
  errors: {}
}
interface ReisekartetResponse<T> {
  data: T | null
  error: ReisekartetError | null
}

function createEmptyError(statusCode: number, message: string): ReisekartetError {
  return {
    statusCode,
    message,
    errors: {}
  }
}

async function getResource<T>(path: string): Promise<ReisekartetResponse<T>> {
  const response = await fetch(baseUrl + path)

  if (response.ok) return { data: (await response.json()) as T, error: null }

  return { data: null, error: (await response.json()) as ReisekartetError }
}

async function deleteResource(path: string): Promise<ReisekartetResponse<undefined>> {
  const response = await fetch(baseUrl + path, {
    method: 'DELETE'
  })

  if (response.ok) return { data: undefined, error: null }

  if (
    response.headers.has('content-type') &&
    response.headers.get('content-type') === 'application/problem+json'
  ) {
    return { data: null, error: (await response.json()) as ReisekartetError }
  }
  return { data: undefined, error: createEmptyError(response.status, response.statusText) }
}

async function postResource(
  path: string,
  body: {} | FormData
): Promise<ReisekartetResponse<undefined>> {
  const hasFormData = body instanceof FormData
  const response = await fetch(baseUrl + path, {
    method: 'POST',
    headers: hasFormData ? {} : { 'Content-Type': 'application/json' },
    body: hasFormData ? body : JSON.stringify(body)
  })

  if (response.ok) return { data: undefined, error: null }

  if (
    response.headers.has('content-type') &&
    response.headers.get('content-type') === 'application/problem+json'
  ) {
    return { data: null, error: (await response.json()) as ReisekartetError }
  }
  return { data: undefined, error: createEmptyError(response.status, response.statusText) }
}

async function putResource(path: string, body: {}): Promise<ReisekartetResponse<undefined>> {
  const response = await fetch(baseUrl + path, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })

  if (response.ok) return { data: undefined, error: null }

  if (
    response.headers.has('content-type') &&
    response.headers.get('content-type') === 'application/problem+json'
  ) {
    return { data: null, error: (await response.json()) as ReisekartetError }
  }
  return { data: undefined, error: createEmptyError(response.status, response.statusText) }
}
export { getResource, deleteResource, postResource, putResource }
