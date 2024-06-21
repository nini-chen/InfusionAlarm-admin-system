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
      path: 'operate',
      name: 'RecordOperate',
      component: () => import('/@/views/record/operate/index.vue'),
      meta: {
        title: t('routes.record.operate.operateLog'),
      },
    },
  ],
};

export default record;
