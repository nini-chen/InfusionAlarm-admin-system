<template>
  <BasicModal v-bind="$attrs" @register="registerModal" @ok="handleSubmit">
    <div class="px-24px py-30px">
      <div class="flex justify-center items-center">
        <Icon icon="ant-design:exclamation-circle-filled" color="#FAAD14" size="23" />
        <span class="flex-1 rounded-sm ml-2 p-8px leading-initial">
          <span class="text-base leading-initial"> 升级包已上传完成，立即执行升级操作？ </span>
        </span>
      </div>
      <div class="mt-2 pl-34px">
        <span class="text-sm text-gray-500 text-base">升级完成后各终端将自动重启</span>
      </div>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { upgrade } from '/@/api/system/version';
  import { message } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';

  /*emits*/
  const emit = defineEmits(['success']);

  /*弹框title修改,数据回显*/
  let params = ref({
    id: 0,
    partition_id: 0,
  });
  const [registerModal, { setModalProps, closeModal }] = useModalInner((data) => {
    console.log(data.record);
    params.value.id = data.record.id;
    params.value.partition_id = data.partition_id;
    setModalProps({
      title: '升级提示',
    });
  });

  /*数据提交*/
  async function handleSubmit() {
    await upgrade(params.value);
    emit('success');
    closeModal();
    message.success('操作成功');
  }
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
