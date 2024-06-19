// 患者管理-病房一览模块

import { defHttp } from '/@/utils/http/axios';
import {
  RoomListSearchParams,
  RoomListResult,
  RoomSelectParams,
  RoomSelectOption,
  RoomBedStatusParams,
  RoomBedStatusResult,
} from './model/roomModel';

enum Api {
  ROOM_LIST = '/api/v2/partition/roomPreviewList',
  ROOM_SELECT = '/api/v2/partition/getAllHospitalRoom',
  ROOM_ONLINE_STATUS = '/api/v2/partition/getRoomIsOutLine',
}

/**
 * @description: 病房一览-获取病房列表
 */
export const getRoomListApi = (params: RoomListSearchParams) =>
  defHttp.get<RoomListResult>({ url: Api.ROOM_LIST, params });

/**
 * 病房一览-获取所有病房 （仅id与名字 用于筛选）
 */
export const getRoomSelectApi = (params: RoomSelectParams) =>
  defHttp.get<RoomSelectOption[]>({ url: Api.ROOM_SELECT, params });

/**
 * 病房一览-获取某个病床的上线下线状态和它所属病房的id
 */
export const getRoomBedStatusApi = (params: RoomBedStatusParams) =>
  defHttp.get<RoomBedStatusResult>({ url: Api.ROOM_ONLINE_STATUS, params });
