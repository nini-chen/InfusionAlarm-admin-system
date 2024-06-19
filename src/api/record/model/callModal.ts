export interface CallResModal {
  page_index: number | string;
  page_size: number | string;
  start_time?: string;
  end_time?: string;
  dial_type?: string;
  answer_type?: string;
  dial_mac?: string;
}

export interface DeviceResModal {
  partition_id?: string | number;
  device_type?: string;
  keyword?: string;
  is_call?: number;
}

export interface IcuCallResModal {
  partition_id: string | number;
  page_index: number | string;
  page_size: number | string;
  start_time?: string;
  end_time?: string;
  handle_type?: string;
  caller_name?: string;
  call_type?: string;
}

export interface IcuCaller {
  partition_id: string | number;
}
