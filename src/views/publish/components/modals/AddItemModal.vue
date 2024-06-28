<template>
  <BasicModal
    title="上传升级文件"
    v-bind="$attrs"
    @register="registerModal"
    @ok="handleSubmit"
    @visible-change="handlecancel"
  >
    <a-form
      name="basic"
      ref="formRef"
      :model="formState"
      :label-col="{ span: 3 }"
      :rules="rules"
      autocomplete="off"
    >
      <a-form-item class="fix" label="文件" name="path">
        <Upload ref="uploadRef" :refresh="refresh" @success="uploadSuccess" />
      </a-form-item>

      <a-form-item label="文件库">
        <a-table
          style="width: 97%"
          sticky
          :dataSource="dataSource"
          :columns="versionColumn"
          :pagination="false"
          :scroll="{ y: 300 }"
          :rowKey="(record) => record.id"
        >
          <template #index="{ index }">
            {{ index + 1 }}
          </template>
          <template #op="{ record }">
            <n-button v-if="record.id === formState.file_id" size="tiny" quaternary type="info"
              >已选</n-button
            >
            <n-button v-else size="tiny" quaternary type="success" @click="selectVersion(record)"
              >选择</n-button
            >
            <n-button size="tiny" quaternary type="error" @click="delVersion(record)"
              >删除</n-button
            >
          </template>
        </a-table>
      </a-form-item>

      <a-form-item label="类型" name="device_type">
        <Select
          style="width: 31.5rem"
          placeholder="请选择所属设备类型"
          v-model:value="formState.device_type"
          :options="deviceTypeList"
        />
      </a-form-item>

      <a-form-item class="fix" label="升级范围" name="range">
        <n-cascader
          class="!w-126"
          v-model:value="formState.range"
          multiple
          clearable
          placeholder="请选择需要升级的设备"
          :max-tag-count="2"
          expand-trigger="hover"
          check-strategy="child"
          :options="optionsList"
          :disabled="!!!formState.device_type"
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
            :maxlength="100"
            placeholder="请输入版本说明"
            v-model:value="formState.comment"
            :rows="4"
            :style="{ width: '97%' }"
            allowClear
          />
          <span class="absolute right-10 bottom-2">{{ formState.comment?.length || 0 }} / 100</span>
        </div>
      </a-form-item>
    </a-form>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, computed, watch } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import Upload from '../upload.vue';
  import { Select } from 'ant-design-vue';
  import { NButton } from 'naive-ui';
  import {
    getDevice,
    upload,
    getFiles,
    addFile,
    delFile,
    getIcuDevice,
  } from '/@/api/deploy/area';
  import { deviceTypeList, versionColumn } from './data';
  import { NCascader, CascaderOption } from 'naive-ui';
  import { useUserStore } from '/@/store/modules/user';
  import { message } from 'ant-design-vue';

  /*ref*/
  const uploadRef = ref<any>(null);

  /*userstore partition*/
  const userStore = useUserStore();

  /*emits*/
  const emit = defineEmits(['success']);

  /*弹框title修改,数据回显*/
  const [registerModal, { closeModal }] = useModalInner(() => {});

  /*文件信息*/
  interface FormState {
    device_type: string | number | undefined;
    range: any;
    comment: string;
    file_id: string | number;
  }
  const formState = ref<FormState>({
    device_type: undefined,
    range: [],
    comment: '',
    file_id: '',
  });

  /*上传成功*/
  async function uploadSuccess(payload) {
    // 保存版本
    await addFile({ name: payload.name, path: payload.path });
    // 调取最新版本库
    setTimeout(() => {
      getVerionFiles();
    }, 1000);
  }

  /*版本库*/
  const dataSource = ref([]);
  async function getVerionFiles() {
    const res = await getFiles({ page_index: 1, page_size: 10000 });
    dataSource.value = res.data;
  }
  getVerionFiles();

  function selectVersion(record) {
    formState.value.file_id = record.id;
  }

  async function delVersion(record) {
    await delFile({ id: record.id });
    getVerionFiles();
  }

  /*选择分区相关*/
  let optionsList = ref<any[]>([]);

  /*获取所有分区*/
  const allPartition = computed(() => userStore.getAllPartitions);
  allPartition.value.forEach((i) => {
    optionsList.value.push({ label: i.partition_name, value: i.id });
  });

  /*根据分区获取所有设备*/
  async function getDeviceApi() {
    for (let i = 0; i < optionsList.value.length; i++) {
      // 拿到当前病区是不是icu病区
      const partition = allPartition.value.find((p) => p.id === optionsList.value[i].value);
      const is_icu = partition?.is_icu;

      let params = {
        partition_id: optionsList.value[i].value,
        device_type: formState.value.device_type,
      };

      // 根据是否icu来处理
      let res: any[] = is_icu ? await getIcuDevice(params) : await getDevice(params);

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
        label: '全部分区',
        value: 999999,
        children: [...optionsList.value],
      },
    ];
  }

  watch(
    () => formState.value.device_type,
    () => {
      optionsList.value = [];
      formState.value.range = [];
      allPartition.value.forEach((i) => {
        optionsList.value.push({ label: i.partition_name, value: i.id });
      });
      getDeviceApi();
    },
    { immediate: true },
  );

  /*弹框处理*/
  const refresh = ref(0);
  const formRef = ref<any>();

  function formSateRangeSplit() {
    let res: any[] = [];
    formState.value.range.forEach((i) => {
      let arr = i.split(';');
      let item = { device_id: arr[0], device_mac: arr[1] };
      res.push(item);
    });
    formState.value.range = res;
  }

  const rules = {
    device_type: [{ required: true, message: '请选择设备类型', trigger: 'blur' }],
    // range: [{required: true, message: "请选择升级范围", trigger: "blur" }]
  };

  function handleSubmit() {
    /*确认用户已经选择版本*/
    if (!formState.value.file_id) return message.warning('请选择版本');
    /*formState的range参数处理*/
    formSateRangeSplit();
    if (formState.value.range.length == 0) return message.warning('请选择分区');
    formRef.value?.validate().then(async () => {
      // console.log(e);
      let res;
      try {
        res = await upload(formState.value);
      } catch {
        //手动清除
        formState.value = {
          device_type: '',
          range: [],
          comment: '',
          file_id: '',
        };
        uploadRef.value.filename = '';
      }
      if (res) {
        closeModal();
        handlecancel(false);
        emit('success');
        message.success('操作成功');
      }
    });
  }

  function handlecancel(val) {
    if (!val) {
      refresh.value = Math.random();
      formRef.value?.clearValidate();
      formRef.value?.resetFields();
      //手动清除
      formState.value = {
        device_type: '',
        range: [],
        comment: '',
        file_id: '',
      };
    }
  }
</script>

<style>
  .fix .ant-form-item-label label::before {
    content: '*\00A0 ';
    color: red;
  }
</style>
