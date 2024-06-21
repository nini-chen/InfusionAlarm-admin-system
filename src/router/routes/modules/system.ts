import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const system: AppRouteModule = {
  path: '/system',
  name: 'System',
  component: LAYOUT,
  redirect: '/system/interaction',
  meta: {
    // icon: 'ant-design:setting-filled',
    icon: 'menu-system|svg',
    title: t('routes.system.system'),
    orderNo: 5,
  },
  children: [
    {
      path: 'user',
      name: 'DoctorsUser',
      component: () => import('/@/views/doctors/user/index.vue'),
      meta: {
        title: t('routes.system.user.manage'),
      },
    },
    {
      path: 'role',
      name: 'DoctorsRole',
      component: () => import('/@/views/doctors/role/index.vue'),
      meta: {
        title: t('routes.system.role.manage'),
      },
    },
  ],
};

export default system;
