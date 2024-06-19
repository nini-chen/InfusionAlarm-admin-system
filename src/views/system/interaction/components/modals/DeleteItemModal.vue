<!--
 * @Author: 朱开 1396509050@qq.com
 * @Date: 2022-05-27 15:52:52
 * @LastEditors: 朱开 1396509050@qq.com
 * @LastEditTime: 2022-08-01 19:39:45
 * @FilePath: \医疗vben简化版\MedicalIntercomSystem_PCWeb_Vue\src\views\system\interaction\components\modals\DeleteItemModal.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <BasicModal v-bind="$attrs" @register="registerModal" @ok="handleSubmit">
    <div class="px-24px py-30px">
      <div class="flex justify-center items-center">
        <Icon icon="ant-design:exclamation-circle-filled" color="#FF4F4F" size="23" />
        <span class="flex-1 rounded-sm ml-2 p-8px text-base"> 确认删除该项配置吗 </span>
      </div>
    </div>
    <!-- <div class="box-message">确认删除该项配置吗</div> -->
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { Icon } from '/@/components/Icon';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { deleteConfig } from '/@/api/system/interaction';
  import { deleteTitleList } from './data';
  import { message } from 'ant-design-vue';

  /*emits*/
  const emit = defineEmits(['success']);

  /*弹框title修改,数据回显*/
  let params = ref({
    id: 0,
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner((data) => {
    let { id, tab } = data;
    params.value.id = id;
    setModalProps({
      title: deleteTitleList[tab - 1],
    });
  });

  /*数据提交*/
  async function handleSubmit() {
    await deleteConfig(params.value);
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
