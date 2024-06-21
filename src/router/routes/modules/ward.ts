import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const ward: AppRouteModule = {
  path: '/ward',
  name: 'Ward',
  component: LAYOUT,
  redirect: '/ward/hospital',
  meta: {
    icon: 'menu-ward|svg',
    title: t('routes.ward.ward'),
    orderNo: 4,
  },
  children: [
    {
      path: 'hospital',
      name: 'WardHospital',
      component: () => import('/@/views/ward/hospital/index.vue'),
      meta: {
        title: t('routes.ward.hospital.hospitalArea'),
      },
    },

    // {
    //   path: 'device',
    //   name: 'WardDevice',
    //   component: () => import('/@/views/ward/device/index.vue'),
    //   meta: {
    //     title: t('routes.ward.device.wardAndDevice'),
    //   },
    // },
  ],
};

export default ward;
