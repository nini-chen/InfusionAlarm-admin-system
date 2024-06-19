<template>
  <BasicModal v-bind="$attrs" @register="registerModal" @ok="handleSubmit">
    <div class="px-24px py-30px">
      <div class="flex justify-center items-center">
        <Icon icon="ant-design:exclamation-circle-filled" color="#FF4F4F" size="23" />
        <span class="flex-1 rounded-sm ml-2 p-8px text-base"> 确认停用该IC卡吗 </span>
      </div>
    </div>
    <!-- <div class="box-message">确认删除数据吗</div> -->
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { Icon } from '/@/components/Icon';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { changeICStatus } from '/@/api/system/iccard';
  import { message } from 'ant-design-vue';

  /*emits*/
  const emit = defineEmits(['success']);

  /*params*/
  const params = ref({
    code_sign: [],
    status: 2,
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner(({ record }) => {
    console.log(record);
    params.value.code_sign = record.map((i) => i.code_sign);
    setModalProps({
      title: '停用提示',
    });
  });

  /*数据提交*/
  async function handleSubmit() {
    await changeICStatus(params.value);
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
