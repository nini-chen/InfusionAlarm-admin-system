import type { AppRouteRecordRaw, Menu } from '/@/router/types';

import { defineStore } from 'pinia';
import { store } from '/@/store';
import { useI18n } from '/@/hooks/web/useI18n';
import { useUserStore } from './user';
import { transformObjToRoute, flatMultiLevelRoutes } from '/@/router/helper/routeHelper';

import { transformRouteToMenu } from '/@/router/helper/menuHelper';
import { asyncRoutes } from '/@/router/routes';
import { ERROR_LOG_ROUTE, PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic';

import { filter, eachTree } from '/@/utils/helper/treeHelper';

import { RouterAuthNode } from '/@/api/sys/model/userModel';

import { useMessage } from '/@/hooks/web/useMessage';
import { PageEnum } from '/@/enums/pageEnum';

interface PermissionState {
  // Permission code list
  permCodeList: string[] | number[];
  permissionRoutes: RouterAuthNode[];
  // Whether the route has been dynamically added
  isDynamicAddedRoute: boolean;
  // To trigger a menu update
  lastBuildMenuTime: number;
  // Backstage menu list
  backMenuList: Menu[];
  frontMenuList: Menu[];
}

export const usePermissionStore = defineStore({
  id: 'app-permission',
  state: (): PermissionState => ({
    permCodeList: [], // 用户能访问的路由name字符串集合
    permissionRoutes: [], // 用户能访问的路由数据（一维数组）
    // Whether the route has been dynamically added
    isDynamicAddedRoute: false,
    // To trigger a menu update
    lastBuildMenuTime: 0,
    // Backstage menu list
    backMenuList: [],
    // menu List
    frontMenuList: [],
  }),
  getters: {
    getPermCodeList(): string[] | number[] {
      return this.permCodeList;
    },
    getPermissionRoutes(): RouterAuthNode[] {
      return this.permissionRoutes;
    },
    getBackMenuList(): Menu[] {
      return this.backMenuList;
    },
    getFrontMenuList(): Menu[] {
      return this.frontMenuList;
    },
    getLastBuildMenuTime(): number {
      return this.lastBuildMenuTime;
    },
    getIsDynamicAddedRoute(): boolean {
      return this.isDynamicAddedRoute;
    },
  },
  actions: {
    setPermCodeList(codeList: string[]) {
      this.permCodeList = codeList;
    },
    setPermissionRoutes(routes: RouterAuthNode[]) {
      this.permissionRoutes = routes;
    },
    findPermissionRoutesTitleByName(routeName: string): string {
      const match = this.permissionRoutes.find((route) => route.node_name === routeName);
      return match ? match.node_title : '';
    },
    setBackMenuList(list: Menu[]) {
      const userStore = useUserStore();
      const isICU = userStore.getCurrentPartition.is_icu == 1;
      this.backMenuList = list;
      this.changePatientsRoutesTitle(isICU);
      list?.length > 0 && this.setLastBuildMenuTime();
    },
    // 修改患者管理模块路由的标题
    changePatientsRoutesTitle(isICU = false) {
      eachTree(this.backMenuList, (menu) => {
        if (menu.path === '/patients/room') {
          menu.name = isICU ? '病床分机' : '病房一览';
          menu.title = isICU ? '病床分机' : '病房一览';
          menu.meta.title = isICU ? '病床分机' : '病房一览';
        } else if (menu.path === '/patients/bed') {
          menu.name = isICU ? '家属分机' : '床位一览';
          menu.title = isICU ? '家属分机' : '床位一览';
          menu.meta.title = isICU ? '家属分机' : '床位一览';
        }
      });
    },
    setFrontMenuList(list: Menu[]) {
      this.frontMenuList = list;
    },
    setLastBuildMenuTime() {
      this.lastBuildMenuTime = new Date().getTime();
    },
    setDynamicAddedRoute(added: boolean) {
      this.isDynamicAddedRoute = added;
    },
    resetState(): void {
      this.isDynamicAddedRoute = false;
      this.permCodeList = [];
      this.backMenuList = [];
      this.lastBuildMenuTime = 0;
    },
    // 构建路由
    async buildRoutesAction(): Promise<AppRouteRecordRaw[]> {
      const { t } = useI18n();
      const userStore = useUserStore();

      let routes: AppRouteRecordRaw[] = [];

      const routeRemoveIgnoreFilter = (route: AppRouteRecordRaw) => {
        const { meta } = route;
        const { ignoreRoute } = meta || {};
        return !ignoreRoute;
      };

      // 遍历routes每一层的第一项，拼接成path
      const getFirstRoutePath = (data, parentPath) => {
        const { path, children } = data;
        const currentPath = path.startsWith('/') ? `${parentPath}${path}` : `${parentPath}/${path}`;
        if (!children) {
          return currentPath;
        }
        return getFirstRoutePath(children[0], currentPath);
      };

      /**
       * @description 根据设置的首页path，修正routes中的affix标记（固定首页）
       * */
      const patchHomeAffix = (routes: AppRouteRecordRaw[]) => {
        if (!routes || routes.length === 0) return;

        // 将后端返回的路由权限第一个页面的路由当做首页地址
        routes.push(ERROR_LOG_ROUTE);
        const userInfo = userStore.getUserInfo;
        let homePath = routes[1] ? getFirstRoutePath(routes[1], '') : PageEnum.BASE_HOME;
        userStore.setUserInfo({ ...userInfo, homePath: String(homePath) });

        // let homePath: string = userStore.getUserInfo.homePath || PageEnum.BASE_HOME;
        function patcher(routes: AppRouteRecordRaw[], parentPath = '') {
          if (parentPath) parentPath = parentPath + '/';
          routes.forEach((route: AppRouteRecordRaw) => {
            const { path, children, redirect } = route;
            const currentPath = path.startsWith('/') ? path : parentPath + path;
            if (currentPath === homePath) {
              if (redirect) {
                homePath = route.redirect! as string;
              } else {
                route.meta = Object.assign({}, route.meta, { affix: true });
                throw new Error('end');
              }
            }
            children && children.length > 0 && patcher(children, currentPath);
          });
        }

        try {
          patcher(routes);
        } catch (e) {
          // 已处理完毕跳出循环
        }
        return;
      };

      const { createMessage } = useMessage();
      const permissionRouteNames: string[] = [];
      const permissionRouteTitles: string[] = [];
      const permissionRoutes: RouterAuthNode[] = [];

      createMessage.loading({
        content: t('sys.app.menuLoading'),
        duration: 1,
      });

      // Simulate to obtain permission codes from the background, this function may only need to be executed once, and the actual project can be put at the right time by itself
      let routeList: AppRouteRecordRaw[] = [];

      // Dynamically introduce components
      routeList = transformObjToRoute(routeList);

      // 获取当前用户的所有权限路由路径，后期可能用于按钮、菜单等小颗粒度权限功能的控制判断
      eachTree(userStore.getUserInfo?.node, (node) => {
        permissionRouteNames.push(node.node_name);
        permissionRouteTitles.push(node.node_title);
        permissionRoutes.push(node);
      });

      // 根据用户的路由权限，去筛选出用户能访问的路由, 这里是通过前端的路由name字段匹配
      const routeAuthFilter = (route: AppRouteRecordRaw) => {
        const { name } = route;
        if (!name) return false;
        const matchIndex = permissionRouteNames.findIndex((url) => url === name);
        route.meta.title = t(route.meta.title);
        // matchIndex > -1 ? permissionRouteTitles[matchIndex] : t(route.meta.title); // 使用后台接口返回的路由名字，如果没有，则用前端自己写的路由名字
        return matchIndex > -1;
      };
      routeList = filter(asyncRoutes, routeAuthFilter);
      routeList.sort((a, b) => {
        return (a.meta?.orderNo || 0) - (b.meta?.orderNo || 0);
      });
      // Background routing to menu structure
      const backMenuList = transformRouteToMenu(routeList);
      this.setBackMenuList(backMenuList);

      // remove meta.ignoreRoute item
      routeList = filter(routeList, routeRemoveIgnoreFilter);
      routeList = routeList.filter(routeRemoveIgnoreFilter);

      routeList = flatMultiLevelRoutes(routeList);
      routes = [PAGE_NOT_FOUND_ROUTE, ...routeList];

      // 存起当前用户能访问的路由的名字
      this.setPermCodeList(permissionRouteNames);
      // 存起当前用户能访问的路由
      this.setPermissionRoutes(permissionRoutes);
      patchHomeAffix(routes);

      // const treeMap = buildTreeMap(userStore.getUserInfo?.node);
      // routes = filterLocalData(userStore.getUserInfo?.node, routes, treeMap);

      return routes;
    },
  },
});

// 将treeData转换为哈希表
// function buildTreeMap(tree: RouterAuthNode): { [key: string]: RouterAuthNode } {
//   const treeMap: { [key: string]: RouterAuthNode } = {};
//   function buildMap(node: RouterAuthNode) {
//     if (node.children) {
//       node.children.forEach((child) => {
//         treeMap[child.node_title] = child;
//         buildMap(child);
//       });
//     }
//   }
//   buildMap(tree);
//   return treeMap;
// }

// 递归函数，用于筛选出本地的树形json路由，并将对应的node_title赋值给meta.title
// function filterLocalData(
//   tree: RouterAuthNode,
//   local: AppRouteRecordRaw,
//   treeMap: { [key: string]: RouterAuthNode },
// ): AppRouteRecordRaw {
//   const result: AppRouteRecordRaw = { ...local };
//   if (tree.children && local.children) {
//     result.children = local.children
//       .filter((localChild) => {
//         return treeMap[localChild.name];
//       })
//       .map((localChild) => {
//         const treeChild = treeMap[localChild.name];
//         if (treeChild) {
//           localChild.meta = { ...localChild.meta, title: treeChild.node_title };
//         }
//         return filterLocalData(treeChild, localChild, treeMap);
//       });
//   }
//   return result;
// }

// Need to be used outside the setup
export function usePermissionStoreWithOut() {
  return usePermissionStore(store);
}
