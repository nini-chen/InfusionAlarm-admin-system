export interface getWeblogListModel {
  page_index: number | string;
  page_size: number | string;
  start_time?: string;
  end_time?: string;
  partition_id?: string | number;
  type?: string;
  module?: string;
}
