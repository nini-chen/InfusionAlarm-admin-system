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
    {
      path: 'inpatient',
      name: 'WardInpatient',
      component: () => import('/@/views/ward/inpatient/index.vue'),
      meta: {
        title: t('routes.ward.inpatient.name'),
      },
    },
    {
      path: 'device',
      name: 'WardDevice',
      component: () => import('/@/views/ward/device/index.vue'),
      meta: {
        title: t('routes.ward.device.wardAndDevice'),
      },
    },
    {
      path: 'version',
      name: 'SystemVersion',
      component: () => import('/@/views/system/version/index.vue'),
      meta: {
        title: t('routes.ward.advanced.advancedManage'),
      },
    },
    {
      path: 'advanced',
      name: 'SystemAdvanced',
      component: () => import('/@/views/system/advanced/index.vue'),
      meta: {
        title: t('routes.ward.version.versionConf'),
      },
    },
    {
      path: 'configuration',
      name: 'SystemConfiguration',
      component: () => import('/@/views/system/configuration/index.vue'),
      meta: {
        title: t('routes.ward.configuration.sysConfiguration'),
      },
    },
    {
      path: 'ic',
      name: 'IcCard',
      component: () => import('/@/views/system/iccard/index.vue'),
      meta: {
        title: t('routes.ward.ic.icCard'),
      },
    },
  ],
};

export default ward;
