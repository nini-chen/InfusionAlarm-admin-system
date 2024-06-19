import type { UserInfo } from '/#/store';
import type { ErrorMessageMode } from '/#/axios';
import { defineStore } from 'pinia';
import { store } from '/@/store';
import { RoleEnum } from '/@/enums/roleEnum';
import { PageEnum } from '/@/enums/pageEnum';
import {
  ROLES_KEY,
  TOKEN_KEY,
  USER_INFO_KEY,
  ACCESS_TOKEN_KEY,
  USER_PARTITIONS_KEY,
  USER_CURRENT_PARTITION_KEY,
} from '/@/enums/cacheEnum';
import { getAuthCache, setAuthCache } from '/@/utils/auth';
import { GetUserInfoModel, LoginParams, UserPartition } from '/@/api/sys/model/userModel';
import { getAccessTokenApi, doLogout, getUserInfoApi, loginApi } from '/@/api/sys/user';
import { router } from '/@/router';
import { usePermissionStore } from '/@/store/modules/permission';
import { useMqttStore } from '/@/store/modules/mqtt';

import { RouteRecordRaw } from 'vue-router';
import { PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic';

interface UserState {
  userInfo: Nullable<UserInfo>;
  token?: string;
  roleList: RoleEnum[];
  sessionTimeout?: boolean;
  isUrgent: boolean;
  showSelectWard: boolean;
  lastUpdateTime: number;

  accessToken: string;
  allPartitions: UserPartition[];
  currentPartition: Nullable<UserPartition>;
}

interface PartitionSelectOptions extends UserPartition {
  value: number;
  label: string;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    accessToken: '',
    // user info
    userInfo: null,
    // token
    token: undefined,
    // roleList
    roleList: [],
    // Whether the login expired
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
    // 用能选择的所有病区（普通用户只有一个病区，页面右上角不展示选择框；管理员可能存在多个病区选择，默认选中第一个）
    allPartitions: [],
    // 用户账号当前在的病区
    currentPartition: null,
    //是否为紧急发布状态
    isUrgent: false,
    //指定逻辑需要显示病区下拉框
    showSelectWard: false,
  }),
  getters: {
    getUserInfo(): UserInfo {
      return this.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    },
    getAccessToken(): string {
      return this.accessToken || getAuthCache<string>(ACCESS_TOKEN_KEY);
    },
    getToken(): string {
      return this.token || getAuthCache<string>(TOKEN_KEY);
    },
    getRoleList(): RoleEnum[] {
      return this.roleList.length > 0 ? this.roleList : getAuthCache<RoleEnum[]>(ROLES_KEY);
    },
    getSessionTimeout(): boolean {
      return !!this.sessionTimeout;
    },
    getLastUpdateTime(): number {
      return this.lastUpdateTime;
    },
    getAllPartitions(): UserPartition[] {
      return this.allPartitions || getAuthCache<UserPartition>(USER_PARTITIONS_KEY);
    },
    getSelectPartitions(): PartitionSelectOptions[] {
      return this.getAllPartitions.map((item, key) => {
        const { id: value, partition_name: label, is_icu } = item;
        // 给下拉框option文字设置一个颜色，设置一个类名即可
        const textClassColor = is_icu == 1 ? 'icu-option-color' : '';
        return { ...item, value, label, key, class: textClassColor };
      });
    },
    getCurrentPartition(): UserPartition {
      return this.currentPartition || getAuthCache<UserPartition>(USER_CURRENT_PARTITION_KEY);
    },
    getIsUrgentStatus(): boolean {
      return this.isUrgent;
    },
    getShowSelectWardStatus(): boolean {
      return this.showSelectWard;
    },
  },
  actions: {
    setAccessToken(info: { access_token: string; expires: number }) {
      const { access_token } = info;
      this.accessToken = access_token;
      setAuthCache(ACCESS_TOKEN_KEY, access_token);
    },
    setToken(info: string | undefined) {
      this.token = info ? info : ''; // for null or undefined value
      setAuthCache(TOKEN_KEY, info);
    },
    setRoleList(roleList: RoleEnum[]) {
      this.roleList = roleList;
      setAuthCache(ROLES_KEY, roleList);
    },
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info;
      this.lastUpdateTime = new Date().getTime();
      setAuthCache(USER_INFO_KEY, info);
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    setIsUrgentStatus(flag: boolean) {
      this.isUrgent = flag;
    },
    setShowSelectWardStatus(flag: boolean) {
      this.showSelectWard = flag;
    },
    setAllPartitions(info: UserPartition[]) {
      this.allPartitions = info;
      setAuthCache(USER_PARTITIONS_KEY, info);
    },
    setCurrentPartition(info: UserPartition) {
      this.currentPartition = info;
      setAuthCache(USER_CURRENT_PARTITION_KEY, info);
      const permissionStore = usePermissionStore();
      const isICU = info.is_icu == 1;
      permissionStore.changePatientsRoutesTitle(isICU);
    },
    resetState() {
      this.userInfo = null;
      this.accessToken = '';
      this.token = '';
      this.roleList = [];
      this.allPartitions = [];
      this.currentPartition = null;
      this.sessionTimeout = false;
    },
    async doRefreshToken() {
      const res = await getAccessTokenApi();
      this.setAccessToken(res);
      return res;
    },
    /**
     * @description: login
     */
    async login(
      params: LoginParams & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
      },
    ): Promise<UserInfo | null> {
      try {
        const { goHome = true, mode, ...loginParams } = params;
        // 获取access_token，存到pinia
        const res = await getAccessTokenApi();
        this.setAccessToken(res);
        // 获取token，存到pinia
        const data = await loginApi(loginParams, mode);
        this.setToken(data);
        // 获取用户详细的信息
        return this.afterLoginAction(goHome);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async afterLoginAction(goHome?: boolean): Promise<UserInfo | null> {
      if (!this.getToken) return null;
      // get user info
      const userInfo = await this.getUserInfoAction();

      const sessionTimeout = this.sessionTimeout;
      if (sessionTimeout) {
        this.setSessionTimeout(false);
      } else {
        const permissionStore = usePermissionStore();
        if (!permissionStore.isDynamicAddedRoute) {
          const routes = await permissionStore.buildRoutesAction();
          routes.forEach((route) => {
            router.addRoute(route as unknown as RouteRecordRaw);
          });
          router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);
          permissionStore.setDynamicAddedRoute(true);
        }
        goHome && (await router.replace(userInfo?.homePath || PageEnum.BASE_HOME));
      }
      return userInfo;
    },
    /**
     * @description: 处理病区数据
     */
    getUserPartition(data: UserPartition[]) {
      // 1. 存起所有病区数据：普通用户只有一个；管理员身份可能有多个
      this.setAllPartitions(data);
      // 2. 获取默认选中的病区：如果之前有历史记录，得判断是否被删除，没被删除，则用此病区；否则默认选中第一个：
      const historySelected = this.getCurrentPartition;
      if (historySelected) {
        const matchIndex = data.findIndex((p) => p.id == historySelected.id);
        matchIndex > -1
          ? this.setCurrentPartition(data[matchIndex])
          : this.setCurrentPartition(data[0]);
      } else {
        this.setCurrentPartition(data[0]);
      }
    },
    async getUserInfoAction(): Promise<UserInfo | null> {
      const mqttStore = useMqttStore();
      let newUserInfo: any = {};
      if (!this.getToken) return null;
      try {
        // 获取用户信息，并获取需要的字段
        const { userinfo, user_partition, ...otherAttrs } =
          (await getUserInfoApi()) as GetUserInfoModel;
        const {
          id: userId,
          user_number: username,
          user_name: realName,
          role_name: roleName,
          user_role: roleId,
          user_email: userEmail,
          user_status: userStatus,
          user_telphone: userTelphone,
          is_default: isDefault,
          remarks,
        } = userinfo;
        const role = userId === 1 ? 'admin' : 'normal';
        newUserInfo = {
          userId,
          username,
          realName,
          roleName,
          roleId,
          userEmail,
          userStatus,
          userTelphone,
          isDefault,
          remarks,
          avatar: '',
          homePath: '',
          roles: [
            {
              roleName,
              value: role,
            },
          ],
          ...otherAttrs,
        };
        this.setRoleList([role] as RoleEnum[]);
        this.setUserInfo(newUserInfo);
        this.getUserPartition(user_partition);
      } catch (error) {
        console.log('error');
        this.logout(true);
      }

      // 初始化连接mqtt
      mqttStore.mqConnect();
      // 初始化要刷新一下，全局的离线设备数量
      mqttStore.getAllOffDevices();
      return newUserInfo;
    },
    /**
     * @description: 退出登录
     * @param {boolean} goLogin 是否需要退出登录后需要跳去首页
     * @param {boolean} requestLogout 是否需要请求退出登录的接口
     */
    async logout(goLogin = false, requestLogout = true) {
      if (requestLogout && this.getToken) {
        try {
          await doLogout();
        } catch (error) {
          console.log('注销Token', error);
        }
      }
      this.setToken(undefined);
      this.setSessionTimeout(false);
      this.setUserInfo(null);
      const mqttStore = useMqttStore();
      mqttStore.close();
      goLogin && router.push(PageEnum.BASE_LOGIN);
    },
    /**
     * @description: Confirm before logging out
     */
    async confirmLoginOut() {
      await this.logout(true);
    },
    /**
     * @description: 平台权限已经到期，跳转到过期激活页面
     */
    platformAuthExpired() {
      router.push('/expired');
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}
