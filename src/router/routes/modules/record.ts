import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const record: AppRouteModule = {
  path: '/record',
  name: 'Record',
  component: LAYOUT,
  redirect: '/record/call',
  meta: {
    icon: 'menu-record|svg',
    title: t('routes.record.record'),
    orderNo: 3,
  },
  children: [
    {
      path: 'call',
      name: 'RecordCall',
      component: () => import('/@/views/record/call/index.vue'),
      meta: {
        title: t('routes.record.call.callRecord'),
      },
    },
    {
      path: 'managed',
      name: 'RecordManaged',
      component: () => import('/@/views/record/managed/index.vue'),
      meta: {
        title: t('routes.record.managed.managedRecord'),
      },
    },
    {
      path: 'operate',
      name: 'RecordOperate',
      component: () => import('/@/views/record/operate/index.vue'),
      meta: {
        title: t('routes.record.operate.operateLog'),
      },
    },
    {
      path: 'visit',
      name: 'RecordVisit',
      component: () => import('/@/views/record/visit/index.vue'),
      meta: {
        title: t('routes.record.visit.RecordVisit'),
      },
    },
  ],
};

export default record;
