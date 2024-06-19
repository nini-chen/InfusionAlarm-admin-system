import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const patients: AppRouteModule = {
  path: '/patients',
  name: 'Patients',
  component: LAYOUT,
  redirect: '/patients/bed',
  meta: {
    // icon: 'ant-design:medicine-box-outlined',
    icon: 'menu-patients|svg',
    title: t('routes.patients.patients'),
    orderNo: 1,
  },
  children: [
    {
      path: 'room',
      name: 'PatientsRoom',
      component: () => import('/@/views/patients/room/index.vue'),
      meta: {
        title: t('routes.patients.room.roomLook'),
      },
    },
    {
      path: 'bed',
      name: 'PatientsBed',
      component: () => import('/@/views/patients/bed/index.vue'),
      meta: {
        title: t('routes.patients.bed.bedLook'),
      },
    },
  ],
};

export default patients;
