<!--
 * @Author: 朱开 1396509050@qq.com
 * @Date: 2022-06-07 13:57:21
 * @LastEditors: 朱开 1396509050@qq.com
 * @LastEditTime: 2022-08-02 08:53:58
 * @FilePath: \医疗vben简化版\MedicalIntercomSystem_PCWeb_Vue\src\views\system\version\components\modals\DeleteModal.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <BasicModal v-bind="$attrs" @register="registerModal" @ok="handleSubmit">
    <div class="px-24px py-30px">
      <div class="flex justify-center items-center">
        <Icon icon="ant-design:exclamation-circle-filled" color="#FF4F4F" size="23" />
        <span class="flex-1 rounded-sm ml-2 p-8px text-base"> 确定删除数据吗？ </span>
      </div>
    </div>
    <!-- <div class="box-message">确认删除数据吗</div> -->
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { Icon } from '/@/components/Icon';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { delVersion } from '/@/api/system/version';
  import { message } from 'ant-design-vue';

  /*emits*/
  const emit = defineEmits(['success']);

  /*params*/
  const params = ref<any>({
    id: '',
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner(({ record }) => {
    console.log(record);
    params.value.id = record.id;
    setModalProps({
      title: '删除提示',
    });
  });

  /*数据提交*/
  async function handleSubmit() {
    await delVersion(params.value);
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
