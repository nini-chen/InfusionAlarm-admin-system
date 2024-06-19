export interface BackLightListResModel {
  page_size: string | number;
  page_index: number | string;
  partition_id: number | string;
}

export interface AddBackLightResModel {
  device_type: string | number;
  partition_id: number | string;
  light: number | string;
  start_time: string;
  end_time: string;
  comment: string;
  range: any[];
}

export interface EditBackLightResModel {
  device_type: string | number;
  partition_id: number | string;
  light: number | string;
  start_time: string;
  end_time: string;
  comment: string;
  range: any[];
}

export interface GetDeviceListResModel {
  device_type?: string | number;
  partition_id?: number | string;
  keyword?: string;
}

export interface DelDeviceListResModel {
  partition_id: number | string;
  id: string | number;
}

export interface SetPrivacyResModel {
  open: number;
  partition_id: number | string;
  start_position: number | string;
  hide_number: number | string;
  range: any[];
}

export interface GetPrivacyResModel {
  partition_id: number | string;
}