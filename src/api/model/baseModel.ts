export interface BasicPageParams {
  page: number;
  pageSize: number;
}

export interface BasicFetchResult<T> {
  data: T[];
  data_sum: number;
  page_index: number;
  page_size: number;
}
