// JSON:API envelope shapes used by the Trelly API.
// https://jsonapi.org/format/#document-structure

export interface JsonApiResource<Attributes> {
  id: string
  type: string
  attributes: Attributes
}

export interface JsonApiErrorSource {
  pointer?: string
  parameter?: string
  header?: string
}

export interface JsonApiError {
  status: string
  code: string
  title: string
  detail?: string
  source?: JsonApiErrorSource
  meta?: Record<string, unknown>
}

export interface JsonApiErrorDocument {
  errors: JsonApiError[]
}
