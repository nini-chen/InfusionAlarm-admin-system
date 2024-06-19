<template>
  <BasicModal
    class="bed-detail-modal"
    :minHeight="400"
    destroyOnClosed
    v-bind="$attrs"
    @register="registerModal"
    :showOkBtn="false"
    :showCancelBtn="false"
  >
    <div class="px-2" :key="freshKey">
      <Tabs>
        <template v-for="item in tabsOptions" :key="item.component">
          <TabPane :tab="item.name">
            <component :is="item.component" :key="bedData.bed_id" :bedData="bedData" />
          </TabPane>
        </template>
      </Tabs>
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { ref, defineComponent } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Tabs } from 'ant-design-vue';
  import BaseInfo from './BaseInfo.vue';
  import OnDuty from './OnDuty.vue';
  import OrderInfo from './OrderInfo.vue';
  // import Cost from './Cost.vue';
  // import CheckOut from './CheckOut.vue';
  // import Life from './Life.vue';
  import { ICUBedListRecord } from '/@/api/patients/model/bedExtensionModel';

  const freshKey = ref('1');
  const bedId = ref<number>(0);
  const bedData = ref({} as ICUBedListRecord);

  export default defineComponent({
    components: {
      BasicModal,
      Tabs,
      TabPane: Tabs.TabPane,
      // 基本信息
      BaseInfo,
      // 值班医护
      OnDuty,
      // 医嘱信息
      OrderInfo,
      // // 费用详情
      // Cost,
      // // 检验检查
      // CheckOut,
      // // 生命体征
      // Life,
    },
    setup() {
      const [registerModal, { setModalProps }] = useModalInner((data) => {
        freshKey.value = `${new Date()}`;
        if (!data.record) return;
        const { hospital_room_name, hospital_bed_name, bed_id } = data.record;
        bedData.value = data.record;
        bedId.value = bed_id;
        setModalProps({
          title: `${hospital_room_name} ${hospital_bed_name}`,
        });
      });

      const tabsOptions = [
        {
          name: '基本信息',
          component: 'BaseInfo',
        },
        {
          name: '值班医护',
          component: 'OnDuty',
        },
        {
          name: '医嘱信息',
          component: 'OrderInfo',
        },
        // {
        //   name: '费用详情',
        //   component: 'Cost',
        // },
        // {
        //   name: '检验查检',
        //   component: 'CheckOut',
        // },
        // {
        //   name: '生命体征',
        //   component: 'Life',
        // },
      ];
      return {
        registerModal,
        tabsOptions,
        bedId,
        bedData,
        freshKey,
      };
    },
  });
</script>

<style lang="less">
  .bed-detail-modal {
    .ant-tabs-tab {
      padding: 0 0 10px;
    }
    .ant-divider {
      margin: 10px 0 24px;
    }
    .ant-modal-content .ant-modal-footer {
      display: none;
    }
  }
</style>
