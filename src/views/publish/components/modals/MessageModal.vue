<template>
  <BasicModal v-bind="$attrs" @register="registerModal" @ok="handleSubmit" title="提示">
    <div class="px-24px py-30px">
      <div class="flex justify-center items-center">
        <Icon icon="ant-design:exclamation-circle-filled" color="#FF4F4F" size="23" />
        <div class="flex-1 rounded-sm ml-2 p-8px text-base">
          {{
            status == 0
              ? '点击确认后，将在五分钟内开启主机【挂断】按钮。 医护人员在医护主机即可挂断通话'
              : '点击确认后，将在五分钟内屏蔽主机【挂断】按钮。 医护人员须到达病床分机挂断通话'
          }}
        </div>
      </div>
      <div class="text-center font-bold">(探视医护主机不受影响)</div>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { Icon } from '/@/components/Icon';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { setAppStatus } from '/@/api/deploy/area';
  import { message } from 'ant-design-vue';

  /*emits*/
  const emit = defineEmits(['success']);

  /*params*/
  const params = ref<any>({
    status: '',
  });
  const status = ref(0);
  const [registerModal, { setModalProps, closeModal }] = useModalInner((record) => {
    status.value = record.status;
  });

  /*数据提交*/
  async function handleSubmit() {
    if (status.value == 0) params.value.status = 1;
    else params.value.status = 0;
    await setAppStatus(params.value);
    emit('success');
    closeModal();
    message.success('操作成功');
  }

  /*关闭弹框*/
</script>

<style scoped>
  .box-message {
    height: 100%;
    display: flex;
    align-items: center;
    font-size: 0.9rem;
    font-weight: 600;
  }
</style>
