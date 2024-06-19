import { MockMethod } from 'vite-plugin-mock';
import { resultSuccess } from '../_util';
const info = {
  data: [
    {
      //类型：Object  必有字段  备注：无
      id: 1, //类型：Number  必有字段  备注：无
      visitor_id: 1, //类型：Number  必有字段  备注：预约用户ID
      patient_name: '李四', //类型：String  必有字段  备注：病人名
      name: '王五', //类型：String  必有字段  备注：本人名
      relation: '儿子', //类型：String  必有字段  备注：关系
      state: 1, //类型：Number  必有字段  备注：状态 0 审批中 1 审批通过 2 已逾期 3 审批不通过
      note: 'mock', //类型：String  必有字段  备注：备注
      datetime: '2024-05-12 12:00~13:00', //类型：String  必有字段  备注：探视时间
      isvisit: 1, //类型：Number  必有字段  备注：是否已经发起过探视
      visitnote: '已结束探视', //类型：String  必有字段  备注：探视备注
      visittime: '25分钟', //类型：String  必有字段  备注：探视时长
      state_name: '审批通过', //类型：String  必有字段  备注：无
    },
    {
      //类型：Object  必有字段  备注：无
      id: 1, //类型：Number  必有字段  备注：无
      visitor_id: 1, //类型：Number  必有字段  备注：预约用户ID
      patient_name: '李四2', //类型：String  必有字段  备注：病人名
      name: '王五2', //类型：String  必有字段  备注：本人名
      relation: '儿子', //类型：String  必有字段  备注：关系
      state: 0, //类型：Number  必有字段  备注：状态 0 审批中 1 审批通过 2 已逾期 3 审批不通过
      note: 'mock', //类型：String  必有字段  备注：备注
      datetime: '2024-05-12 12:00~13:00', //类型：String  必有字段  备注：探视时间
      isvisit: 1, //类型：Number  必有字段  备注：是否已经发起过探视
      visitnote: '已结束探视', //类型：String  必有字段  备注：探视备注
      visittime: '25分钟', //类型：String  必有字段  备注：探视时长
      state_name: '审批中', //类型：String  必有字段  备注：无
    },
  ],
  data_sum: 2, //类型：Number  必有字段  备注：无
  page_size: 1, //类型：Number  必有字段  备注：无
  page_index: 10,
};
export default [
  {
    url: '/basic-api/api/v2/IcuReserve/list',
    timeout: 1000,
    method: 'get',
    response: () => {
      return resultSuccess(info);
    },
  },
] as MockMethod[];
