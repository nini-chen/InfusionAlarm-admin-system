<template>
  <BasicModal title="提示" v-bind="$attrs" @register="registerModal" @ok="handleSubmit">
    <div class="px-24px py-30px">
      <div class="flex justify-center items-center">
        <Icon icon="ant-design:exclamation-circle-filled" color="#FAAD14" size="23" />
        <span class="flex-1 rounded-sm ml-2 p-8px leading-initial">
          <span class="text-base leading-initial"> 确认修改隐私设置吗？ </span>
        </span>
      </div>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { message } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';

  /*emits*/
  const emit = defineEmits(['success']);

  const [registerModal, { closeModal }] = useModalInner(() => {});

  /*数据提交*/
  function handleSubmit() {
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
