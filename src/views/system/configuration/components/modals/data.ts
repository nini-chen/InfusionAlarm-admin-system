export const titleList: string[] = ['添加排班类型', '添加职级权重'];

export interface FormState {
  id?: number | string /*修改时id必传*/;
  schedulingtype_name: string /*类型*/;
  schedulingtype_population: number /*所属人群*/;
  schedulingtype_is_managebed: number /*是否管床*/;
  schedulingtype_managebed_range: string /*管床范围*/;
  schedulingtype_partition: string | number /*所属病区*/;
  schedulingtype_starttime: string /*开始时间*/;
  schedulingtype_endtime: string /*结束时间*/;
  start: string;
  end: string;
}

export interface PositionFormState {
  position_name: string;
  position_type: number | string;
  position_order: string | number;
  id?: string | number;
  key?: string;
  remarks?: string;
  position_remarks?: string;
  position_create_time?: string;
}
