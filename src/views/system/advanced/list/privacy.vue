<template>
  <div class="mt-4 h-180 bg-light-50">
    <div class="p-4 flex items-center">
      <span style="font-size: 1rem; font-weight: 600" class="mr-4">启用隐私保护功能</span>
      <a-switch v-model:checked="checked" />
      <span class="text-gray-500 ml-4"
        >提示：启用后，可以控制终端设备是否显示患者姓名的某几个字</span
      >
    </div>

    <div class="p-4">
      <a-form
        ref="formRef"
        :label-col="{ style: { width: '180px', 'padding-right': '20px' } }"
        :rules="rules"
        autocomplete="off"
        :model="formState"
      >
        <a-form-item label="隐私保护功能作用范围" name="range">
          <a-checkbox-group v-model:value="formState.range" :options="deviceTypeList" />
        </a-form-item>
        <a-form-item label="起始字符位置" name="start_position">
          <a-input
            class="!w-100"
            v-model:value="formState.start_position"
            placeholder="请输入起始字符"
            @change="inputCheck"
            allowClear
          />
        </a-form-item>
        <a-form-item label="隐藏字数" name="hide_number">
          <a-input
            class="!w-100"
            v-model:value="formState.hide_number"
            placeholder="请输入隐藏字数"
            allowClear
          />
        </a-form-item>
        <a-form-item label="提示">
          <div class="text-gray-400 pt-1">
            <div>例如起始位置为2，隐藏字数为2，若病人输入姓名为“李晓明”，则显示“李**”</div>
            <div>例如起始位置为2，隐藏字数为1，若病人输入姓名为“李晓明”，则显示“李*明”</div>
          </div>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" class="w-30 ml-50 mt-10" @click="submit">保存</a-button>
        </a-form-item>
      </a-form>
    </div>

    <EnsureModal :minHeight="50" @register="registerModal" @success="ensure" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, watch } from 'vue';
  import EnsureModal from '../components/modals/EnsureModal.vue';
  import { deviceTypeList } from '../data';
  import { getPrivacy, setPrivacy } from '/@/api/system/advanced';
  // import { message } from 'ant-design-vue';
  import { useModal } from '/@/components/Modal';
  import { useUserStore } from '/@/store/modules/user';

  const [registerModal, { openModal: openRegisterModal }] = useModal();
  function ensureModal() {
    openRegisterModal(true);
  }

  const userStore = useUserStore();
  const currentPartition = computed(() => userStore.getCurrentPartition);

  interface FormState {
    partition_id: string | number;
    start_position: string | number;
    hide_number: string | number;
    range: any[];
    open: number;
  }
  const formState = ref<FormState>({
    partition_id: currentPartition.value.id,
    start_position: '2',
    hide_number: '1',
    range: [],
    open: 0,
  });

  const formRef = ref<any>();

  const checked = ref<boolean>(Boolean(formState.value.open));

  /*watch*/
  watch(
    () => currentPartition.value,
    (n) => {
      if (!n) return;
      console.log(currentPartition, 'ioioio');
      getPrivacyApi(n.id);
    },
    { immediate: true, deep: true },
  );

  /*get*/
  async function getPrivacyApi(id) {
    let res = await getPrivacy({ partition_id: id });
    formState.value = res;
    checked.value = !!res.open;
  }

  /*submit*/
  function submit() {
    formRef.value?.validateFields().then(() => {
      ensureModal();
    });
  }

  async function ensure() {
    formState.value.open = checked.value ? 1 : 0;
    await setPrivacy(formState.value);
    // message.info('操作成功');
    // formRef.value?.clearValidate();
    // formRef.value?.resetFields();
  }

  /*rules*/
  const rules = {
    start_position: [{ required: true, validator: inputCheck, trigger: 'change' }],
    hide_number: [{ required: true, validator: inputCheck, trigger: 'change' }],
    range: [{ required: true, message: '请选择作用范围' }],
  };
  async function inputCheck(_, value: string) {
    if (!value) return Promise.reject('输入不能为空');
    let v = Number(value);
    if (v != 0 && !v) return Promise.reject('只允许输入数字');
    if (v < 1 || v > 9) return Promise.reject('只允许输入1-9之间的数字');
    return Promise.resolve();
  }
</script>
