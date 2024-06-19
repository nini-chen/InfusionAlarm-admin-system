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
        <div class="pl-100px">
          <span class="text-gray-400" v-if="!isIcu">提示：走廊显示屏无法显示笔划复杂文字</span>
        </div>
      </div>
    </BasicModal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, unref, inject } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { sloganFormSchemas } from '../table.data';

  const emit = defineEmits(['success']);

  const isIcu = inject('is_icu');

  //是否编辑
  const isEdit = ref(false);
  const newIndex = ref(0);

  const [register, { getFieldsValue, setFieldsValue, resetFields, validate }] = useForm({
    labelWidth: 100,
    schemas: sloganFormSchemas,
    colon: true,
    showActionButtonGroup: false,
    hideRequiredMark: true,
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner((data) => {
    isEdit.value = JSON.stringify(data.data) == '{}' ? false : true;
    setModalProps({ title: JSON.stringify(data.data) == '{}' ? '新建病区标语' : '编辑病区标语' });
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
    bottom: 30px;
    right: 10px;
  }
</style>
