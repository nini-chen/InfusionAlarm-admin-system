<template>
  <div class="bg-white pt-4 pb-18">
    <div class="flex w-11/12 pb-2">
      <div class="flex-1">
        <span v-if="isUrgent" class="font-medium ml-8 text-red-600 inline-block"
          >紧急通知发布中，当前状态不支持编辑更改<span v-if="!isIcu">通知提示与</span>病区标语
        </span>
      </div>

      <div class="flex-1 text-right">
        <Button v-if="isUrgent" type="primary" @click="cloneRelease">取消紧急通知</Button>
        <Button v-else type="primary" danger @click="releaseMsg" :disabled="contentText"
          >发布紧急通知</Button
        >
      </div>
    </div>

    <BasicForm @register="register">
      <template #content="{ model, field }">
        <InputTextarea
          v-model:value="model[field]"
          :rows="6"
          placeholder="请输入紧急通知内容"
          :maxlength="60"
          :showCount="true"
          :disabled="isUrgent"
          @change="halderContent"
          allowClear
        />
        <div class="pt-2">
          <span class="text-gray-400" v-if="!isIcu">提示：走廊显示屏无法显示笔划复杂文字</span>
        </div>
      </template>
    </BasicForm>
    <div class="w-11/12 text-right">
      <Button type="primary" @click="reset" :disabled="isUrgent">重置</Button>
    </div>
    <div class="w-11/12">
      <div class="pl-30px top-setting">发布范围:</div>
      <div class="release-box p-4" v-if="partitionInfo.is_icu === 0">
        <div v-for="(item, index) in device.list" :key="index" class="p-2">
          <span class="text-right inline-block w-100px text-sm pt-10px">{{ item.name }}</span>
          <span class="text-xs text-gray-400 ml-4">病区内全部该类型设备</span>
        </div>
      </div>
      <div class="release-box p-4" v-else>
        <div v-for="(item, index) in device.iculist" :key="index" class="p-2">
          <span class="text-right inline-block w-100px text-sm pt-10px">{{ item.name }}</span>
          <span class="text-xs text-gray-400 ml-4">病区内全部该类型设备</span>
        </div>
      </div>
    </div>

    <div class="ml-100px mt-20px text-xs text-gray-400">
      <div>提示：紧急通知发布后，将会在所选范围循环播报紧急通知直至取消紧急状态;</div>
      <div>紧急通知状态下，将不支持编辑更改<span v-if="!isIcu">通知提示与</span>病区标语。</div>
    </div>

    <Modal
      v-model:visible="deleteVisible"
      width="446"
      centered
      title="提示"
      okText="确认"
      @ok="confirmDelete"
      @cancel="isBatchOperate = false"
    >
      <div class="px-24px py-30px">
        <div class="flex justify-center items-center">
          <Icon icon="ant-design:exclamation-circle-filled" color="#FF4F4F" size="23" />
          <span class="flex-1 rounded-sm ml-2 p-8px text-base leading-initial">
            {{ isBatchOperate ? '确认发布紧急通知吗？' : '确认取消紧急通知吗？' }}
          </span>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script lang="ts" setup>
  import { ref, reactive, computed, onMounted, watch, inject } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { FormSchema } from '/@/components/Form/index';
  import { Button, Modal, Input } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';
  import { releaseOne, closeRelease, getOneStatus } from '/@/api/publish/publish';
  import { useUserStore } from '/@/store/modules/user';

  const isIcu = inject('is_icu');

  const InputTextarea = Input.TextArea;
  // 当前用户所处的病区的id
  const userStore = useUserStore();
  let partitionId = computed(() => userStore.getCurrentPartition.id);
  let partitionInfo: any;
  watch(
    () => partitionId.value,
    () => {
      partitionInfo = userStore.getCurrentPartition;
    },
    { immediate: true },
  );

  const msgInfo: any = ref({});

  const isUrgent = computed(() => userStore.getIsUrgentStatus);

  const contentText = ref(true);

  const modalFormSchemas: FormSchema[] = [
    {
      field: 'content',
      component: 'InputTextArea',
      label: '信息内容',
      colProps: {
        span: 22,
      },
      slot: 'content',
      rules: [{ required: true, message: '请输入紧急通知内容' }],
    },
  ];

  const device = reactive({
    list: [
      { name: '走廊显示屏', value: 'passageway' },
      { name: '病房门口机', value: 'doorway' },
      { name: '病床分机', value: 'sickbed' },
      { name: '信息看扳屏', value: 'bbs' },
      { name: '智慧护理屏', value: 'nurse' },
      {name: '安卓版病床分机', value: 'apk_sickbed'},
      {name:'安卓版走廊屏', value: 'apk_passageway'}
    ],
    iculist: [{ name: '探视病床分机', value: 'icu_sickbed' }], // icu的发布范围是探视病床分机
  });

  // 操作提示框
  const deleteVisible = ref<boolean>(false);
  // 操作判断
  const isBatchOperate = ref<boolean>(false);

  const [register, { getFieldsValue, setFieldsValue, resetFields, validate }] = useForm({
    labelWidth: 100,
    schemas: modalFormSchemas,
    colon: true,
    showActionButtonGroup: false,
  });

  onMounted(() => {
    isReleaseStatus();
  });

  function reset() {
    contentText.value = true;
    resetFields();
  }

  function halderContent(val) {
    setFieldsValue({
      content: val.target.value.replace(new RegExp(/( )/g), ''),
    });
    const { content } = getFieldsValue();
    contentText.value = content ? false : true;
  }

  //获取当前的紧急发布信息
  async function isReleaseStatus() {
    let params = {
      partition_id: partitionId.value,
    };
    let res = await getOneStatus(params);

    let relate = res?.id ? true : false;
    msgInfo.value = res;
    userStore.setIsUrgentStatus(relate);
    if (relate) {
      setFieldsValue({ content: res.content });
    }
  }

  // 确定删除、批量删除操作
  async function confirmDelete() {
    const type = isBatchOperate.value ? 'release' : 'cancel';
    if (type == 'release') {
      const { content } = getFieldsValue();
      let device_types = device.iculist.map((v) => v.value);
      if (partitionInfo.is_icu === 0) {
        device_types = device.list.map((v) => v.value);
      }
      let params = {
        content,
        partition_id: partitionId.value,
        device_type: device_types,
      };
      let res = await releaseOne(params);
      if (res) {
        userStore.setIsUrgentStatus(true);
        isReleaseStatus();
      }
    } else {
      let params = {
        id: msgInfo.value.id,
      };
      let res = await closeRelease(params);
      if (res) {
        userStore.setIsUrgentStatus(false);
        contentText.value = true;
        resetFields();
      }
    }

    deleteVisible.value = false;
    isBatchOperate.value = false;
  }

  async function releaseMsg() {
    await validate();
    deleteVisible.value = true;
    isBatchOperate.value = true;
  }

  function cloneRelease() {
    deleteVisible.value = true;
  }
</script>

<style lang="less" scoped>
  .top-setting {
    position: relative;
    top: 22px;
  }
  .release-box {
    margin-left: 100px;
    background: #f9f9f9;
    border-radius: 2px;
  }
  :deep(.ant-input-textarea-show-count::after) {
    position: absolute;
    bottom: 20px;
    right: 10px;
  }
</style>
