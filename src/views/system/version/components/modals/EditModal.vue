<template>
  <BasicModal title="版本文件上传" v-bind="$attrs" @register="registerModal" @ok="handleSubmit">
    <a-form
      ref="formRef"
      :model="formState"
      name="basic"
      :label-col="{ span: 3 }"
      autocomplete="off"
    >
      <a-form-item label="文件">
        <a-input style="width: 31.5rem" disabled v-model:value="formState.name" allowClear />
      </a-form-item>

      <a-form-item label="类型" :rules="[{ required: true, message: '请选择上传文件类型' }]">
        <a-select
          style="width: 31.5rem"
          placeholder="请选择设备类型"
          v-model:value="formState.device_type"
          :options="deviceTypeList"
          @change="formState.range = []"
        />
      </a-form-item>

      <a-form-item label="升级范围" :rules="[{ required: true, message: '请选择升级区域' }]">
        <n-cascader
          class="!w-126"
          v-model:value="formState.range"
          multiple
          clearable
          placeholder="请选择升级区间"
          max-tag-count="responsive"
          expand-trigger="hover"
          :options="optionsList"
          check-strategy="child"
        />
      </a-form-item>

      <a-form-item label="备注" name="comment">
        <div class="relative">
          <!-- <textarea
            maxlength="100"
            id="textarea"
            placeholder="请输入版本说明"
            v-model="formState.comment"
          ></textarea> -->
          <a-textarea
            maxlength="100"
            placeholder="请输入版本说明"
            v-model:value="formState.comment"
            :rows="4"
            :style="{ width: '97%' }"
            allowClear
          />
          <span class="absolute right-10 bottom-2"
            >{{ formState.comment?.length || 0 }} / 100</span
          ></div
        >
      </a-form-item>
    </a-form>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, computed, watch } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { getDevice, getDeviceOne, editVersion } from '/@/api/system/version';
  import { deviceTypeList } from './data';
  import { NCascader, CascaderOption } from 'naive-ui';
  import { useUserStore } from '/@/store/modules/user';
  import { message } from 'ant-design-vue';

  /*userstore partition*/
  const userStore = useUserStore();

  /*emits*/
  const emit = defineEmits(['success']);

  /*文件信息*/
  const formState = ref<any>({});

  /*弹框title修改,数据回显*/
  const [registerModal, { setModalProps, closeModal }] = useModalInner(({ record }) => {
    setModalProps({
      title: '编辑版本文件信息',
    });
    getDeviceOneApi(record);
  });

  /*选择分区相关*/
  let optionsList = ref<CascaderOption[]>([]);

  /*获取所有分区*/
  const allPartition = computed(() => userStore.getAllPartitions);
  allPartition.value.forEach((i) =>
    optionsList.value.push({ label: i.partition_name, value: i.id }),
  );

  /*获取单个升级信息*/
  async function getDeviceOneApi(record) {
    let params = {
      with_status: 1,
      id: record.id,
    };
    let res = await getDeviceOne(params);

    formState.value.id = res.id;
    formState.value.name = res.name;
    formState.value.comment = res.comment;
    formState.value.device_type = res.device_type;
    formState.value.range = res.range.map((i) => `${i.device_id};${i.device_mac}`);
  }

  /*根据分区获取所有设备*/
  async function getDeviceApi() {
    for (let i = 0; i < optionsList.value.length; i++) {
      let params = {
        partition_id: optionsList.value[i].value,
        device_type: formState.value.device_type,
      };
      let res = await getDevice(params);
      if (res.length) {
        res.forEach((i) => {
          i.label = i.device_name;
          i.value = `${i.id};${i.device_mac}`;
        });
        optionsList.value[i].children = res;
      } else {
        optionsList.value[i].disabled = true;
      }
    }
    optionsList.value = [
      {
        label: '选择全部分区',
        value: 999999,
        children: [...optionsList.value],
      },
    ];
  }

  watch(
    () => formState.value.device_type,
    () => {
      optionsList.value = [];
      allPartition.value.forEach((i) =>
        optionsList.value.push({ label: i.partition_name, value: i.id }),
      );
      getDeviceApi();
    },
    { immediate: true },
  );

  function formSateRangeSplit() {
    let res: any[] = [];
    formState.value.range.forEach((i) => {
      let arr = i.split(';');
      let item = { device_id: arr[0], device_mac: arr[1] };
      res.push(item);
    });
    formState.value.range = res;
  }

  /*弹框处理*/
  async function handleSubmit() {
    /*formState的range参数处理*/
    formSateRangeSplit();

    await editVersion(formState.value);
    emit('success');
    closeModal();
    message.success('操作成功');
  }
</script>

<style scoped>
  #textarea {
    resize: none;
    width: 31.5rem;
    height: 6rem;
    padding: 0.5rem;
    outline: none;
    border: 1px solid #d9d9d9;
    border-radius: 3px;
  }
</style>
