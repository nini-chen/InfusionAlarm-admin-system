<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    @ok="handleSubmit"
    @visible-change="handlecancel"
  >
    <div class="pt-6">
      <a-form
        ref="formRef"
        :model="formState"
        name="basic"
        :label-col="{ span: 4 }"
        autocomplete="off"
        :rules="rules"
      >
        <a-form-item label="职级名称" name="position_name">
          <a-input
            :maxlength="10"
            v-model:value="formState.position_name"
            placeholder="请输入类型名称"
            allowClear
          />
          <!-- @input="(e) => (formState.position_name = oninputDeal(e))" -->
        </a-form-item>

        <a-form-item
          label="所属类型"
          name="position_type"
          :rules="[{ required: true, message: '请选择所属人群' }]"
        >
          <a-select
            v-model:value="formState.position_type"
            style="width: 100%"
            :options="selects"
          ></a-select>
        </a-form-item>

        <a-form-item label="权重" name="position_order">
          <a-input
            :maxlength="2"
            v-model:value="formState.position_order"
            placeholder="可输入范围1-99，数字越大权重越高"
            allowClear
          />
        </a-form-item>

        <a-form-item label="备注" name="remarks">
          <div class="relative">
            <!-- <textarea
              maxlength="100"
              placeholder="请输入备注"
              id="textarea"
              v-model="formState.remarks"
            ></textarea> -->
            <a-textarea
              maxlength="100"
              placeholder="请输入备注"
              v-model:value="formState.remarks"
              :rows="4"
              allowClear
            >
            </a-textarea>
            <span class="absolute right-2 bottom-2"
              >{{ formState.remarks!.length }} / 100</span
            ></div
          >
        </a-form-item>
      </a-form>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { titleList, PositionFormState } from './data';
  import { message as Message } from 'ant-design-vue';
  import { addPosition } from '/@/api/system/inconfig';
  // import { oninputDeal } from '/@/utils/formRender';

  const formRef = ref<any>();

  const formState = reactive<PositionFormState>({
    position_name: '',
    position_type: 1,
    position_order: '',
    remarks: '',
  });

  /*emits*/
  const emit = defineEmits(['success']);

  /*弹框title修改*/
  const [registerModal, { setModalProps, closeModal }] = useModalInner((data) => {
    const { titleIndex } = data;
    setModalProps({
      title: titleList[+titleIndex - 1],
    });
  });

  /*所属人群*/
  let selects = [
    { label: '医疗人员职级', value: 1 },
    { label: '护理人员职级', value: 2 },
  ];

  /*数据提交*/
  function handleSubmit() {
    /*表单校验和发送请求*/
    formRef.value?.validateFields().then(async () => {
      let res = await addPosition(formState);
      if (res) {
        formRef.value?.clearValidate();
        formRef.value?.resetFields();
        closeModal();
        emit('success');
        Message.success('操作成功');
      }
    });
  }

  /*关闭弹框*/
  function handlecancel(val) {
    !val && formRef.value?.resetFields();
  }

  /*rules*/
  const rules = {
    position_order: [{ required: true, validator: inputCheck, trigger: 'blur' }],
    position_name: [{ required: true, validator: inputCheck2, trigger: 'blur' }],
  };
  async function inputCheck(_, value: string) {
    if (!value) return Promise.reject('输入不能为空');
    let v = Number(value);
    if (v != 0 && !v) return Promise.reject('只允许输入数字');
    if (v < 1 || v > 99) return Promise.reject('只允许输入1-99之间的数字');
    return Promise.resolve();
  }
  async function inputCheck2(_, value: string) {
    let reg =
      /[`~!@#%$^\-&*()=_+|{}':;',\\\[\]\.<>\/?~！@#%_+￥……&*（）——|{}【】'；：""'。，、？\s]/g;
    if (!value) return Promise.reject('输入不能为空');
    if (reg.test(value)) return Promise.reject('不允许输入空格或特殊字符');
    return Promise.resolve();
  }
</script>

<style scoped>
  #textarea {
    resize: none;
    width: 31.8rem;
    height: 6rem;
    padding: 0.5rem;
    outline: none;
    border: 1px solid #d9d9d9;
    border-radius: 3px;
  }
</style>
