<template>
  <div>
    <div class="flex w-full justify-between items-center">
      <div class="text-base"> 院区信息 </div>
      <div>
        <Button type="primary" @click="rushInfo">
          <template #icon><SyncOutlined /></template>
          刷新
        </Button>
        <Button type="primary" class="ml-4" @click="editInfo">
          <template #icon><EditOutlined /></template>
          编辑
        </Button>
      </div>
    </div>
    <div class="content w-full bg-white rounded-md mt-4">
      <div class="top p-4">
        <div class="flex w-full py-8px font-color">
          <span>院区名称：</span>
          <span class="text-black">{{ msgInfo.hospital_name }}</span>
        </div>
        <div class="flex w-full font-color">
          <div class="w-1/3 py-8px">
            <span>病区数量：</span>
            <span class="text-black">{{ msgInfo.partition_num }}</span>
          </div>
          <div class="w-1/3 py-8px">
            <span>病房数量：</span>
            <span class="text-black">{{ msgInfo.hospital_room_num }}</span>
          </div>
        </div>
        <div class="flex w-full font-color border-bottom pb-4">
          <div class="w-1/3 py-8px">
            <span>医护主机数量：</span>
            <span class="text-black">{{ msgInfo.medical_host_num }}</span>
          </div>
          <div class="w-1/3 py-8px">
            <span>终端数量：</span>
            <span class="text-black">{{ msgInfo.device_num }}</span>
          </div>
        </div>
      </div>
      <div class="bottom pl-4">
        <div>服务器信息</div>
        <div class="flex w-full font-color">
          <div class="w-4/4 py-8px">
            <span class="inline-block w-auto">存储空间：</span>
            <span class="inline-block w-4/12"
              ><Progress
                :percent="proportion"
                :showInfo="false"
                strokeLinecap="square"
                :strokeWidth="20"
            /></span>
            <span class="inline-block min-w-70px text-blue-400 py-8px ml-20px"
              >{{ 100 - proportion }}%可用</span
            >
            <span class="inline-block min-w-150px py-8px ml-20px"
              >总空间：{{ msgInfo.memory_sum }}</span
            >
            <span class="inline-block min-w-150px py-8px ml-20px"
              >已用空间：{{ msgInfo.memory_used }}</span
            >
            <span class="inline-block min-w-150px py-8px ml-20px"
              >剩余空间：{{ msgInfo.memory_free }}</span
            >
          </div>
        </div>
        <!-- <div class="flex w-full font-color">
          <div class="w-2/4 py-8px">
            <span>主机型号：</span>
            <span class="text-black">{{ msgInfo.host_model }}</span>
          </div>
        </div> -->
        <div class="flex w-full font-color">
          <div class="w-2/4 py-8px">
            <span>设备地址：</span>
            <span class="text-black">{{ msgInfo.host_address }}</span>
          </div>
          <div v-if="isShowVisitPower" class="w-2/4 py-8px">
            <span>云探视配置：</span>
            <span @click="setVisitInfoModal(true)" class="text-blue-400 text-[#4879FB]">{{
              visitInfo.cloud_host ?? '编辑'
            }}</span>
          </div>
        </div>
        <div class="flex w-full font-color">
          <div class="w-2/4 py-8px">
            <span>版本号：</span>
            <span class="text-black">{{ msgInfo.Version }}</span>
          </div>
        </div>
        <div class="flex w-full font-color pb-4">
          <div class="w-2/4 py-8px">
            <span>设备序列号：</span>
            <span class="text-black">{{ msgInfo.uuid }}</span>
          </div>
        </div>
      </div>
    </div>
    <VisitInfoModal :width="620" @register="visitInfoModal" @success="handleVisitSuccess" />
    <EditAreaModal :width="600" @register="registerEditAreaModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { Button, Progress } from 'ant-design-vue';
  import { SyncOutlined, EditOutlined } from '@ant-design/icons-vue';
  import EditAreaModal from './EditAreaModal.vue';
  import VisitInfoModal from './VisitInfoModal.vue';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { createMessage } = useMessage();
  import { getFacilityInfoApi, getVisitInfoApi, getIsVisitPowerApi } from '/@/api/ward/facility.ts';

  const [registerEditAreaModal, { openModal: openEditAreaModal }] = useModal();
  const [visitInfoModal, { openModal: openVisitModal }] = useModal();
  let msgInfo = ref({
    hospital_name: '--',
    partition_num: 0,
    hospital_room_num: 0,
    device_num: 0,
    medical_host_num: 0,
    memory_sum: '--',
    memory_free: '--',
    host_model: '--',
    host_address: '--',
    Version: '--',
    uuid: '--',
    memory_used: '--',
  });
  const visitInfo = ref({});
  const proportion = ref(0);
  const isShowVisitPower = ref(false);
  getInfo();

  async function getInfo() {
    let params = {};
    const res: any = await getFacilityInfoApi(params);
    msgInfo.value = res;
    proportion.value = Math.ceil(
      (parseInt(msgInfo.value.memory_used.split('GB')[0]) /
        parseInt(msgInfo.value.memory_sum.split('GB')[0])) *
        100,
    );
  }

  function handleSuccess() {
    getInfo();
  }
  getIsVisitPower();

  async function getIsVisitPower() {
    const res: any = await getIsVisitPowerApi();
    isShowVisitPower.value = res.is_show;
    if (res.is_show) getVisitInfo();
  }

  async function getVisitInfo() {
    const res: any = await getVisitInfoApi();
    if (res.result == 200) {
      visitInfo.value = res.data;
    } else if (res.result !== 200 && res.return_message != '项目配置的域名有误，请重新配置') {
      createMessage.error(res.return_message);
    }
  }
  function handleVisitSuccess() {
    getVisitInfo();
  }
  function editInfo() {
    openEditAreaModal(true, {
      name: msgInfo.value.hospital_name,
    });
  }
  function setVisitInfoModal() {
    openVisitModal(true, visitInfo.value);
  }

  function rushInfo() {
    getInfo();
  }
</script>
<style lang="less" scoped>
  .border-bottom {
    border-bottom: 1px solid #e9e9e9;
  }

  .font-color {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.45);
  }

  :deep(.ant-progress-inner) {
    border-radius: 0;
  }
</style>
