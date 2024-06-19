<template>
  <div class="editInfo">
    <!-- 云探视配置-编辑弹窗 -->
    <BasicModal
      destroyOnClose
      v-bind="$attrs"
      @register="registerModal"
      @ok="handleSubmit"
      :body-style="bodyStyle"
    >
      <div class="px-30px pl-0 w-full">
        <div class="text-base font-medium pb-3 text-center">云服务器</div>
        <BasicForm @register="register">
          <template #title="{}">
            <div class="text-base font-medium pb-3 text-center">H5客户端</div>
          </template>
          <template #visitTime="{}">
            <div class="flex flex-wrap">
              <div class="flex w-220px my-10px" v-for="(item, index) in visitTimeArr" :key="index">
                <div
                  class="w-200px flex text-center border-1 border-slate-400 bg-white px-10px py-5px rounded"
                  ><div class="w-80px">{{ item.start }}</div
                  >-<div class="w-80px">{{ item.end }}</div>
                </div>
                <div class="my-auto ml-5px mr-20px">
                  <a-checkbox
                    v-model:checked="item.is_check"
                    @change="onCheckAllChange(item, index)"
                /></div>
              </div>
            </div>
          </template>
        </BasicForm>
        <div class="px-5 ml-60px">
          <p class="text-gray-400 text-xs"
            >提示：云探视服务器IP修改后会影响远程探视功能，如需修改请联系售后人员</p
          >
        </div>
      </div>
    </BasicModal>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form/index';
  import { setVisitInfoApi, checkIcuHostApi } from '/@/api/ward/facility';
  import { verificationNull } from '/@/views/ward/wardRules';
  import { visitTimeArr as timeList } from './config.data';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { createMessage } = useMessage();
  const emit = defineEmits(['success', 'register']);
  const visitTimeArr = ref(timeList);
  const modalFormSchemas: FormSchema[] = [
    {
      field: 'cloud_host',
      component: 'Input',
      label: '云探视域名',
      dynamicRules: verificationNull,
      required: true,
      colProps: {
        span: 24,
      },
      componentProps: {
        placeholder: '请输入云探视域名',
        maxlength: 100,
      },
    },
    {
      field: 'title',
      component: 'Input',
      label: '',
      slot: 'title',
    },
    {
      field: 'weixin_appid',
      component: 'Input',
      label: 'APP_ID',
      colProps: {
        span: 24,
      },
      dynamicRules: verificationNull,
      required: true,
      componentProps: {
        placeholder: '请输入APP_ID',
        maxlength: 100,
      },
    },
    {
      field: 'weixin_secret',
      component: 'Input',
      label: 'APP_SECRET',
      colProps: {
        span: 24,
      },
      dynamicRules: verificationNull,
      required: true,
      componentProps: {
        placeholder: '请输入APP_SECRET',
        maxlength: 100,
      },
    },
    {
      field: 'weixin_template_id',
      component: 'Input',
      label: '模板ID',
      colProps: {
        span: 24,
      },
      dynamicRules: verificationNull,
      required: true,
      componentProps: {
        placeholder: '请输入模板ID',
        maxlength: 100,
      },
    },
    {
      field: 'weixin_template',
      component: 'InputTextArea',
      label: '微信模板',
      required: true,
      colProps: {
        span: 24,
      },
      dynamicRules: verificationNull,
      componentProps: {
        placeholder: '请输入微信模板',
        rows: 2,
        maxlength: 200,
        showCount: true,
        allowClear: true,
      },
    },
    {
      field: 'icu_times',
      component: 'Input',
      label: '探视时段',
      slot: 'visitTime',
      colProps: {
        span: 24,
      },
    },
    {
      field: 'icu_note',
      component: 'InputTextArea',
      label: '预约须知',
      rules: [{ required: true, message: '不能为空', trigger: 'blur' }],
      componentProps: {
        placeholder: '请输入预约须知',
        rows: 2,
        maxlength: 200,
        showCount: true,
        allowClear: true,
      },
    },
  ];

  const bodyStyle = {
    height: '600px',
    width: '640px',
  };

  const [register, { getFieldsValue, setFieldsValue, resetFields, validate }] = useForm({
    labelWidth: 110,
    schemas: modalFormSchemas,
    colon: true,
    showActionButtonGroup: false,
    hideRequiredMark: true,
  });
  const [registerModal, { setModalProps, closeModal }] = useModalInner((data) => {
    if (data.icu_times) {
      let timeRanges = data.icu_times.split(',');
      visitTimeArr.value.forEach((slot) => {
        const { start, end } = slot;
        const found = timeRanges.some((range) => {
          const [rangeStart, rangeEnd] = range.split('~');
          return start === rangeStart && end === rangeEnd;
        });
        slot.is_check = found;
      });
    }
    setFieldsValue(data);
    setModalProps({ title: '编辑云探视配置' });
  });
  function onCheckAllChange(e) {
    Object.assign({ e, ...visitTimeArr.value });
  }
  // 提交
  async function handleSubmit() {
    try {
      await validate();
      setModalProps({ confirmLoading: true });
      const formValues = getFieldsValue();
      const resdata: any = await checkIcuHostApi({ cloud_host: formValues.cloud_host });
      if (resdata.data === false) {
        createMessage.error(resdata.return_message);
        return;
      }
      let arr = [];
      visitTimeArr.value.forEach((item) => {
        if (item.is_check) {
          arr.push(`${item.start}~${item.end}`);
        }
      });

      let params = {
        ...formValues,
        icu_times: arr.join(','),
      };
      const res: any = await setVisitInfoApi(params);
      if (res) {
        resetFields();
        closeModal();
        setModalProps({ confirmLoading: false, visible: false });
        emit('success');
        createMessage.success('编辑成功');
      }
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>

<style lang="less" scoped>
  :deep(.ant-modal-header) {
    background: #dae6f5;
  }

  :deep(.ant-modal-body) {
    height: 154px;
  }
</style>
