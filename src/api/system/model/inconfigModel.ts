export interface getHRoomBedTreeResultModel {
  partition_id: number | string;
}

export interface addSchedulingTypeResultModel {
  schedulingtype_name: string;
  schedulingtype_population: number;
  schedulingtype_is_managebed: number;
  schedulingtype_managebed_range: string;
  schedulingtype_partition: number | string;
  schedulingtype_starttime: string;
  schedulingtype_endtime: string;
}

export interface editSchedulingTypeResultModel {
  id: string;
  schedulingtype_name?: string;
  schedulingtype_population?: number;
  schedulingtype_is_managebed?: number;
  schedulingtype_managebed_range?: string;
  schedulingtype_partition?: number | string;
  schedulingtype_starttime?: string;
  schedulingtype_endtime?: string;
}

export interface getSchedulingTypeListResultModal {
  partition_id: number | string;
  schedulingtype_population?: string | number;
  page_index?: number | string;
  page_size?: number | string;
}

export interface deleteSchedulingTypeResultModal {
  id: number | string;
}

export interface getPositionListResultModal {
  page_index: number | string;
  page_size?: number | string;
}

export interface addPositionResultModal {
  position_name: string;
  position_type: number | string;
  position_order: number | string;
  remarks: string;
}

export interface editPositionResultModal {
  id: string;
  position_name: string;
  position_type: number | string;
  position_order: number | string;
  remarks: string;
}

export interface deletePositionResultModal {
  id: string | number;
}
