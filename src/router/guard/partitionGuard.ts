import type { Router } from 'vue-router';
import { PageEnum } from '/@/enums/pageEnum';
import { useUserStoreWithOut } from '/@/store/modules/user';
import { getUserInfoApi } from '/@/api/sys/user';
import { GetUserInfoModel } from '/@/api/sys/model/userModel';

const LOGIN_PATH = PageEnum.BASE_LOGIN;

// 页面切换的时候，请求用户信息接口，查看病区数据是否变化了；
export function createPartitionGuard(router: Router) {
  const userStore = useUserStoreWithOut();
  router.beforeEach(async (to, from) => {
    // 以下3种情况除外：刷新页面（store里面已经有刷新页面获取用户信息操作，也会更新病区信息，此处不需要重复操作）、登录、退出登录
    if (from.path != '/' && from.path != LOGIN_PATH && to.path != LOGIN_PATH) {
      try {
        const { user_partition } = (await getUserInfoApi()) as GetUserInfoModel;
        if (user_partition) {
          userStore.setAllPartitions(user_partition);
          const matchIndex = user_partition.findIndex(
            (p) => p.id == userStore.getCurrentPartition.id,
          );
          // 如果当前选中的病区被删掉或者切换成别的，默认使用第一个病区
          if (matchIndex === -1) {
            userStore.setCurrentPartition(user_partition[0] || []);
          }
        }
      } catch (error) {
        console.log(
          '切换路由时，刷新用户信息（目的是更新病区信息，避免病区被删除等情况）失败',
          error,
        );
        // 用户信息获取失败，退出登录（此处常见于token过期，接口返回400状态码）
        // userStore.logout(true);
      }
    }
  });
}
