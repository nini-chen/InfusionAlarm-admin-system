<template>
  <BasicModal v-bind="$attrs" @register="registerModal" @ok="handleSubmit">
    <div class="px-24px py-30px">
      <div class="flex justify-center items-center">
        <Icon icon="ant-design:exclamation-circle-filled" color="#FF4F4F" size="23" />
        <span class="flex-1 rounded-sm ml-2 p-8px text-base"> 确认删除该职级权重吗 </span>
      </div>
    </div>
    <!-- <div class="box-message">确认删除该职级权重吗</div> -->
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { Icon } from '/@/components/Icon';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { deletePosition } from '/@/api/system/inconfig';
  import { message } from 'ant-design-vue';

  /*emits*/
  const emit = defineEmits(['success']);

  /*弹框title修改,数据回显*/
  let params = ref({
    id: 0,
  });
  const [registerModal, { setModalProps, closeModal }] = useModalInner((data) => {
    console.log(data.record);
    params.value.id = data.record.id;
    setModalProps({
      title: '删除职级权重',
    });
  });

  /*数据提交*/
  async function handleSubmit() {
    await deletePosition(params.value);
    emit('success');
    closeModal();
    message.success('删除成功');
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
