<template>
  <BasicModal
    title="批量导入"
    :destroy-on-close="true"
    v-bind="$attrs"
    @register="register"
    @ok="validateForm"
    @cancel="importFailReset"
    :okButtonProps="{ disabled: okButtonDisabled }"
  >
    <div class="px-2 pt-2 batch-import-modal min-h-420px">
      <BasicForm @register="registerForm" />
      <div class="px-5">
        <div>
          <p class="text-gray-400 text-xs"
            >提示：科室（病区）信息需先在后台管理系统的院区管理页面编辑录入，否则视为无效数据。</p
          >
        </div>
      </div>
      <div class="ml-20px bg-slate-200 px-20px rounded pb-20px" v-if="errorList.length">
        <p class="text-red-500 leading-10 mb-0 text-xs"
          >文件中包含无效数据无法进行导入，请将以下无效数据删除或修改后重新上传文件。</p
        >
        <a-table
          :dataSource="errorList"
          :columns="columns"
          bordered
          :scroll="{ y: 300 }"
          :pagination="false"
          :align="center"
        >
          <template #index="{ index }">{{ index + 1 }}</template>
        </a-table>
        <!-- <p class="text-red-500 leading-7 mb-0" v-for="(item, index) in errorList" :key="index"
          >错误：{{ item }}</p
        > -->
      </div>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { h, ref, getCurrentInstance } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { downloadByUrl } from '/@/utils/file/download';
  import { useUserStore } from '/@/store/modules/user';
  import { getPopupContainer } from '/@/utils';

  import { BasicModal, useModal } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import UploadFile from './UploadFile.vue';
  // import { Modal } from 'ant-design-vue';
  import { DownloadOutlined } from '@ant-design/icons-vue';
  import { uploadTemplateApi } from '/@/api/doctors/personnel';

  const emit = defineEmits(['success']);
  const userStore = useUserStore();
  const filePrefix = getCurrentInstance()!.appContext.config.globalProperties.$filePrefix;
  const templateRender = () =>
    h(
      'div',
      {
        class:
          'ml-2 w-178px h-32px flex justify-center items-center border border-blue-600 rounded-sm cursor-pointer',
        onClick: () => {
          downloadByUrl({
            url: `${filePrefix}/api/staff/downStaffDemo?access_token=${userStore.getAccessToken}`,
            target: '_self',
          });
        },
      },
      [h(DownloadOutlined), '点击下载导入模板'],
    );

  const { createMessage } = useMessage();
  const [register, { setModalProps }] = useModal();
  const [registerForm, { validateFields, setFieldsValue }] = useForm({
    labelWidth: 100,
    schemas: [
      {
        field: 'download',
        component: 'Input',
        label: '人员信息模板',
        colProps: {
          span: 20,
        },
        render: templateRender,
      },
      {
        field: 'path',
        component: 'Input',
        label: '文件名称',
        colProps: {
          span: 20,
        },
        rules: [
          {
            required: true,
            validator(_, value) {
              return new Promise((resolve, reject) => {
                /**
                 * 此处解决: 表单初始化->选择文件之后, 会出现 '请输入文件名称'的红色报错闪一下消失;
                 * 原因: 此选项初始化值是undefined, 选择文件先触发了验证导致
                 * 处理方式: 值为undefined不验证即可; 值为 "" 是手动清除的时候赋的值,所以要提示错误
                 * */
                if (value === '') {
                  reject('请选择文件并上传');
                  return;
                }
                resolve();
              });
            },
          },
        ],
        defaultValue: '',
        render: ({ model, field }) => {
          return h(UploadFile, {
            value: model[field],
            onChange: (val) => {
              console.log('--onChange', val);
              errorList.value = [];
              // okButtonDisabled.value = false;
              setModalProps({
                confirmLoading: false,
              });
              setFieldsValue({
                path: val,
              });
              okButtonDisabled.value = val === '';
            },
          });
        },
      },
      {
        field: 'partition_id',
        component: 'Select',
        colProps: {
          span: 17,
        },
        label: '选择病区',
        required: true,
        dynamicRules: [{ required: true, message: '请选择病区', trigger: ['change', 'blur'] }],
        getPopupContainer, // 定位在父元素
        componentProps: ({ formModel }) => {
          formModel.partition_id = userStore.getCurrentPartition.id;
          return {
            placeholder: '请选择病区',
            fieldNames: { label: 'partition_name', value: 'id' },
            options: userStore?.getSelectPartitions,
          };
        },
      },
    ],
    showActionButtonGroup: false,
  });
  const errorList = ref([]);
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      slots: { customRender: 'index' },
    },
    {
      title: '无效数据原因',
      dataIndex: 'data',
      key: 'data',
    },
  ];

  // 未选择上传到文件，确认按钮（提交按钮）禁止点击
  const okButtonDisabled = ref(true);

  // 表单验证
  async function validateForm() {
    setModalProps({
      confirmLoading: true,
    });
    try {
      const res = await validateFields();
      postData(res);
    } catch (error) {
      setModalProps({
        confirmLoading: false,
      });
    }
  }

  // 导入异常：通常是内容没天完成，需要弹出警告
  // function importWarning(waringTips: string[]) {
  //   const rows = waringTips?.map((tip) =>
  //     h(
  //       'span',
  //       {
  //         class: 'min-w-2/5 py-7px flex-1 box-border mr-1em',
  //       },
  //       tip,
  //     ),
  //   );
  //   const content = h(
  //     'div',
  //     {
  //       class: 'max-h-350px overflow-auto flex flex-wrap',
  //     },
  //     rows,
  //   );
  //   Modal.confirm({
  //     title: '请检查以下异常数据',
  //     icon: createVNode(ExclamationCircleOutlined),
  //     width: '446',
  //     content,
  //     closable: true,
  //     maskClosable: true,
  //     class: 'import-warning-modal',
  //   });
  //   // 重置
  //   importFailReset();
  // }

  // 导入失败：进行重置操作
  function importFailReset() {
    errorList.value = [];
    setFieldsValue({ path: '' });
    setModalProps({
      confirmLoading: false,
    });
    okButtonDisabled.value = true;
  }

  // 导入成功：关闭弹窗
  function importSuccessClose() {
    emit('success');
    setModalProps({
      confirmLoading: false,
      visible: false,
    });
    okButtonDisabled.value = true;
  }

  // 操作失败：进行重置操作
  function oprateFail() {
    // 重置
    importFailReset();
  }

  // 提交数据
  async function postData(values) {
    const { path, partition_id } = values;
    const res = await uploadTemplateApi({
      partition_id,
      path,
    });

    // 导入成功
    if (res.data.data) {
      createMessage.success('操作成功');
      importSuccessClose();
      return;
    }

    // 导入异常：导入了非模板文件、模板文件内容不按要求填写、漏填等情况
    if (!res.data.data) {
      // importWarning(res.data.return_message);
      if (Array.isArray(res.data.return_message.length)) {
        let returnRes = res.data.return_message;
        if (returnRes.length) {
          returnRes.forEach((item, index) => {
            errorList.value.push({
              index: index,
              data: item,
            });
          });
          return;
        }
        return;
      }
      if (res.data.return_message) {
        errorList.value.push({
          index: 0,
          data: res.data.return_message,
        });
        return;
      }
      
    }

    // 其他异常
    createMessage.error(res.data.return_message || '导入失败！');
    oprateFail();
  }
</script>
<style lang="less">
  .batch-import-modal {
    .ant-select {
      width: 178px;
      margin-left: 8px;
    }

    .ant-form-item-explain.ant-form-item-explain-error {
      padding-left: 8px;
    }
  }

  .import-warning-modal .ant-modal-confirm-btns {
    display: none;
  }
</style>
