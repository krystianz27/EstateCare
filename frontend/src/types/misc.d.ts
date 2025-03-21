export interface QueryParams {
  page?: number;
  searchTerm?: string;
  city?: string;
}

export interface PaginationParams extends QueryParams {
  page?: number;
}
