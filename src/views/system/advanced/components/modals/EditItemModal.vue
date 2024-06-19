<!--
 * @Author: 朱开 1396509050@qq.com
 * @Date: 2022-05-31 11:18:15
 * @LastEditors: 朱开 1396509050@qq.com
 * @LastEditTime: 2022-08-12 16:57:44
 * @FilePath: \医疗vben简化版\MedicalIntercomSystem_PCWeb_Vue\src\views\system\advanced\components\modals\EditItemModal.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <BasicModal title="编辑定义时间" v-bind="$attrs" @register="registerModal" @ok="submit">
    <div class="pt-16">
      <a-form
        ref="formRef"
        :model="formState"
        name="basic"
        :label-col="{ span: 4 }"
        autocomplete="off"
      >
        <a-form-item label="白天定义时间">
          <div class="flex">
            <a-time-picker
              v-model:value="formState.day_start_time"
              format="HH:mm"
              value-format="HH:mm"
              class="flex-1"
            />
            <i class="leading-loose"> - </i>
            <a-time-picker
              v-model:value="formState.day_end_time"
              value-format="HH:mm"
              format="HH:mm"
              class="flex-1"
            />
          </div>
        </a-form-item>

        <span class="text-gray-400 ml-26">提示：一天中白天以外的时间为黑夜时间</span>
      </a-form>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { reactive, computed, watch } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { editBackLightTime, getBackLightList } from '/@/api/system/advanced';
  import { useUserStore } from '/@/store/modules/user';
  import { message } from 'ant-design-vue';

  const userStore = useUserStore();
  const currentPartition = computed(() => userStore.getCurrentPartition);

  watch(
    () => currentPartition.value,
    (n) => {
      if (!n) return;
      formState.partition_id = n.id;
      getList();
    },
    { deep: true },
  );

  /*emits*/
  const emit = defineEmits(['success']);

  const [registerModal, { closeModal }] = useModalInner(() => {});

  const formState = reactive({
    day_start_time: '06:00',
    day_end_time: '18:00',
    night_start_time: '18:00',
    night_end_time: '06:00',
    partition_id: currentPartition.value.id,
  });

  async function getList() {
    let res = await getBackLightList({
      partition_id: currentPartition.value.id,
      page_index: 1,
      page_size: 10,
    });
    let info = res.data[0];
    formState.day_start_time = info.day_start_time;
    formState.day_end_time = info.day_end_time;
    formState.night_start_time = info.night_start_time;
    formState.night_end_time = info.night_end_time;
  }
  getList();

  async function submit() {
    if (!formState.day_start_time) return message.warn('请填写开始时间');
    if (!formState.day_end_time) return message.warn('请填写结束时间');

    formState.night_start_time = formState.day_end_time;
    formState.night_end_time = formState.day_start_time;

    await editBackLightTime(formState);
    emit('success');
    message.success('操作成功');
    closeModal();
  }
</script>
