export interface QueryParams {
  page?: number;
  searchTerm?: string;
}

export interface PaginationParams extends QueryParams {
  page?: number;
}
