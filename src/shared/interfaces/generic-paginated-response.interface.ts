export interface GenericPaginatedResponse<T> {
  items: T[]
  totalCount: number
  totalPages: number
}