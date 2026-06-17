export type Response = Record<'meta' | 'data', Record<string, string>>

export type ResponseSetter = {
  value: Response
  setValue: null | (<K extends keyof Response>(key: K, value: Response[K]) => void)
}
