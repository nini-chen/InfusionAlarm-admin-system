<template>
  <div class="file-uploader">
    <uploader
      ref="uploaderReference"
      :options="options"
      @file-added="fileAdded"
      @file-progress="fileProgress"
      @file-success="fileSuccess"
      @file-error="fileError"
    >
      <uploader-unsupport />
      <uploader-drop>
        <uploader-btn :attrs="attrs" :single="true" :directory="false"> 选择文件上传 </uploader-btn>
      </uploader-drop>
      <!-- <uploader-list /> -->
    </uploader>

    <div class="preview-file" v-if="fileUrl">
      <span :title="fileName">{{ fileName }}</span>
      <DeleteOutlined class="del-icon" @click="handleDelete" />
    </div>
    <div v-if="progress > 0 && progress < 100" class="upload-progress">
      <Progress :percent="progress" size="small" />
    </div>
  </div>
</template>
<script setup lang="ts">
  //  基于vue-simple-uploader^1.0.0-beta.3 单个文件上传组件
  import { ref, watch } from 'vue';
  import { message, Progress } from 'ant-design-vue';
  import { DeleteOutlined } from '@ant-design/icons-vue';

  import { useUserStore } from '/@/store/modules/user';
  import { useGlobSetting } from '/@/hooks/setting';

  const { uploadUrl } = useGlobSetting();
  const userStore = useUserStore();
  const Message = message;

  const fileName = ref('');
  // 进度条
  const progress = ref<number>(0);
  // 上传成功接口返回的图片地址
  const fileUrl = ref<string>('');
  // const loading = ref<boolean>(false);

  // 上传插件配置
  const options = {
    autoStart: true,
    // 服务器上传的代理地址
    target: uploadUrl,
    // 分块大小
    // chunkSize: '204800',
    // 上传文件时文件的参数名，默认file
    fileParameterName: 'file',
    // 最大自动失败重试上传次数
    maxChunkRetries: 3,
    // 是否开启服务器分片校验
    testChunks: true,
    // 已经上传过的文件，允许再次上传
    allowDuplicateUploads: true,
    // 服务器分片校验函数，秒传及断点续传基础
    checkChunkUploadedByResponse: (chunk) => {
      // const start = chunk.startByte / 1024 / 1024;
      // const end = chunk.endByte / 1024 / 1024;
      // progress.value = Math.round((start / end) * 100);
      // console.log(progress.value);
    },
    // 请求头设置
    headers: {
      Authorization: `Bearer ${userStore.getAccessToken}`,
    },
    // 额外的自定义查询参数
    query: (file) => {
      return {
        ...file.params,
      };
    },
  };

  const emit = defineEmits(['change', 'update:value']);

  const props = defineProps({
    value: { type: String },
    // mode: {
    //   type: String as PropType<MODE>,
    //   default: MODE.JSON,
    //   validator(value: any) {
    //     return Object.values(MODE).includes(value);
    //   },
    // },
  });

  watch(
    () => props.value,
    (val) => {
      fileUrl.value = val;
    },
    {
      immediate: true,
    },
  );

  const attrs = {
    accept: '.xlsx,.xls',
  };

  function fileAdded(file) {
    // console.log('fileAdded--->', file);
    const isJpgOrPng =
      file.fileType === 'application/vnd.ms-excel' ||
      file.fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    if (!isJpgOrPng) {
      message.error('请选择正确格式!');
      file.ignored = true;
    }
    // const isLt = file.size / 1024 / 1024 < 5;
    // if (!isLt) {
    //   message.error('文件大小不超过5Mb!');
    // }
    // return isJpgOrPng && isLt;
  }

  function fileSuccess(rootFile, file, message) {
    const res = JSON.parse(message);
    if (res.result === 200) {
      const { file_path, file_name } = res.data;
      fileUrl.value = file_path;
      fileName.value = file_name;
      emit('update:value', file_path);
      emit('change', file_path);
      progress.value = 100;
    } else {
      Message.error(res.return_message);
    }
  }

  function fileError(rootFile, file, message, chunk) {
    console.log('fileError--->', rootFile, file, message, chunk);
    Message.error('上传失败');
  }

  function fileProgress(rootFile, file, chunk) {
    const start = chunk.startByte / 1024 / 1024;
    const end = chunk.endByte / 1024 / 1024;
    progress.value = Math.round((start / end) * 100);
  }

  function handleDelete() {
    fileUrl.value = '';
    emit('update:value', '');
    emit('change', '');
  }
</script>
<style lang="less">
  .file-uploader {
    position: relative;

    .uploader-drop {
      padding: 0;
      border: none;
      background-color: transparent;
    }

    .uploader-btn {
      width: 178px;
      height: 32px;
      margin-left: 8px;
      text-align: center;
      color: #fff;
      border-color: #387af6;
      background-color: #387af6;
    }

    .uploader-file-info {
      display: none;
    }

    .preview-file {
      width: 300px;
      padding-top: 10px;
      color: rgba(0, 0, 0, 0.65);
      .del-icon {
        padding: 0 10px;
        font-size: 14px;
        color: red;
        cursor: pointer;
      }
    }
  }
</style>
