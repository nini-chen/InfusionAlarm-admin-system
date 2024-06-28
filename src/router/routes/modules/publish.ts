import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const publish: AppRouteModule = {
  path: '/publish',
  name: 'Publish',
  component: LAYOUT,
  redirect: '/publish/publisher',
  meta: {
    icon: 'menu-publish|svg',
    title: t('routes.publish.publish'),
    orderNo: 2,
  },
  children: [
    // {
    //   path: 'content',
    //   name: 'PublishContent',
    //   component: () => import('/@/views/publish/content/index.vue'),
    //   meta: {
    //     title: t('routes.publish.content.contentManage'),
    //   },
    // },
    {
      path: 'publisher',
      name: 'PublishPublisher',
      component: () => import('/@/views/publish/index.vue'),
      meta: {
        title: t('routes.publish.publisher.publisherManage'),
      },
    },
  ],
};

export default publish;
