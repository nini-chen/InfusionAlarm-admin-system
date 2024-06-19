<template>
  <BasicModal
    title="批量导入"
    v-bind="$attrs"
    @register="registerModal"
    @ok="importData"
    @cancel="handleCancel"
    :okButtonProps="{ disabled: okButtonDisabled }"
    destroyOnClose
  >
    <div class="my-8">
      <div class="flex items-center">
        <div class="mr-8">IC卡信息模板: </div>
        <a-button @click="downloadDemo">点击下载导入模板</a-button>
      </div>
      <div class="h-8"></div>
      <div class="flex items-center">
        <Upload ref="uploadRef" @success="uploadSuccess" />
      </div>
    </div>
    <!-- <div class="box-message">确认删除数据吗</div> -->
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, h } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { downICCardDemo, uplaodICCardDemo } from '/@/api/system/iccard';
  import { message, Modal } from 'ant-design-vue';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import Upload from '../upload.vue';
  import { createVNode } from 'vue';

  const emit = defineEmits(['success']);

  const [registerModal, { closeModal }] = useModalInner();

  /*ref*/
  const uploadRef = ref<any>(null);
  const okButtonDisabled = ref(true);

  /*上传成功*/
  let uploadRes: any;
  async function uploadSuccess(payload) {
    // 调取最新版本库
    uploadRes = payload;
    message.success('上传成功');
    okButtonDisabled.value = false;
  }

  async function downloadDemo() {
    let res = await downICCardDemo();
    let url = window.URL.createObjectURL(res.data);

    let a = document.createElement('a');
    a.href = url;
    a.download = '导入模板.xls'; //下载后的文件名
    a.click();
    a.remove();
  }

  async function importData() {
    try {
      const res = await uplaodICCardDemo(uploadRes);
      if (res.data === false) {
        let errorArr = res.return_message;
        const rows = errorArr.map((tip) =>
          h(
            'span',
            {
              class: 'min-w-2/5 py-7px flex-1 box-border mr-1em',
            },
            tip,
          ),
        );
        const content = h(
          'div',
          {
            class: 'max-h-350px overflow-auto flex flex-wrap',
          },
          rows,
        );
        Modal.confirm({
          title: '请检查以下异常数据',
          icon: createVNode(ExclamationCircleOutlined),
          width: '446',
          content: content,
          closable: true,
          maskClosable: true,
          class: 'import-warning-modal',
        });
      }

      emit('success');
      closeModal();
    } catch (err: any) {
      message.error(err?.message);
      closeModal();
    }
  }

  function handleCancel() {
    okButtonDisabled.value = true;
    closeModal();
    // 清空上传组件数据
    uploadRef.value.filename = '';
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
