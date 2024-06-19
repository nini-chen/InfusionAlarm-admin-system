import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import { AgentResModel } from './model/agentModel';

enum Api {
  GET_AGENT_LIST = '/api/v2/agentlog/lists',
}

/**
 * @description 托管记录列表
 */
export const getAgentList = (params: AgentResModel, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    {
      url: Api.GET_AGENT_LIST,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};
