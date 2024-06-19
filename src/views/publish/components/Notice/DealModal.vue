<template>
  <div class="editInfo">
    <BasicModal
      v-bind="$attrs"
      @register="registerModal"
      @ok="handleSubmit"
      okText="发布"
      :showCancelBtn="false"
      @visible-change="handlecancel"
    >
      <div class="p-30px pl-0 w-full">
        <BasicForm @register="register" />
      </div>
    </BasicModal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { modalFormSchemas } from '../table.data';

  const emit = defineEmits(['success']);

  //是否编辑
  const isEdit = ref(false);
  const newIndex = ref(0);

  const [register, { getFieldsValue, setFieldsValue, resetFields, validate }] = useForm({
    labelWidth: 100,
    schemas: modalFormSchemas,
    colon: true,
    showActionButtonGroup: false,
    hideRequiredMark: true,
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner((data) => {
    isEdit.value = JSON.stringify(data.data) == '{}' ? false : true;
    setModalProps({ title: JSON.stringify(data.data) == '{}' ? '新建通知提示' : '编辑通知提示' });
    if (JSON.stringify(data.data) == '{}') {
      newIndex.value = data.index;
    }

    //编辑
    if (JSON.stringify(data.data) != '{}') {
      setFieldsValue({ remarks: data.data.content, id: data.data.id, index: data.data.index });
    }
  });

  async function handleSubmit() {
    const { remarks, id, index } = getFieldsValue();
    await validate();
    let params = {};
    if (unref(isEdit)) {
      params = {
        content: remarks,
        id: id,
        index: index,
      };
    } else {
      params = {
        content: remarks,
        id: 0,
        index: newIndex.value + 1,
      };
    }

    resetFields();
    closeModal();
    emit('success', params, unref(isEdit));
  }

  function handlecancel(val: any) {
    !val && resetFields();
  }
</script>

<style lang="less" scoped>
  :deep(.ant-modal-header) {
    background: #dae6f5;
  }

  :deep(.ant-modal-body) {
    height: 154px;
  }

  :deep(.ant-input-textarea-show-count::after) {
    position: absolute;
    bottom: 20px;
    right: 10px;
  }
</style>
