import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const doctors: AppRouteModule = {
  path: '/doctors',
  name: 'Doctors',
  component: LAYOUT,
  redirect: '/doctors/doctor',
  meta: {
    icon: 'menu-doctors|svg',
    title: t('routes.doctors.doctors'),
    orderNo: 5,
  },
  children: [
    {
      path: 'nurse',
      name: 'DoctorsNurse',
      component: () => import('/@/views/doctors/schedule/index.vue'),
      meta: {
        title: t('routes.doctors.nurse.arrange'),
      },
    },
    {
      path: 'doctor',
      name: 'DoctorsDoctor',
      component: () => import('/@/views/doctors/schedule/index.vue'),
      meta: {
        title: t('routes.doctors.doctor.arrange'),
      },
    },
    {
      path: 'personnel',
      name: 'DoctorsPersonnel',
      component: () => import('/@/views/doctors/personnel/index.vue'),
      meta: {
        title: t('routes.doctors.personnel.manage'),
      },
    },
  ],
};

export default doctors;
