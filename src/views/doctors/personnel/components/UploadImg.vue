<template>
  <div class="img-uploader">
    <!-- 删除图片的icon -->
    <CloseCircleOutlined class="del-icon" title="删除" v-show="imageUrl" @click="handleDelete" />
    <!-- 上传插件 -->
    <uploader
      :options="options"
      @file-added="fileAdded"
      @file-progress="fileProgress"
      @file-success="fileSuccess"
      @file-error="fileError"
    >
      <uploader-drop>
        <uploader-btn :attrs="attrs" :single="true" :directory="false">
          <!-- 未上传 -->
          <div class="upload-select" v-show="!imageUrl">
            <PlusOutlined />
            <div class="ant-upload-text pt-2">点击上传照片</div>
          </div>
          <!-- 上传中，进度提示 -->
          <!-- <div v-if="progress != 0" class="upload-progress">
            <Progress :width="80" type="circle" :percent="progress" :status="progressStatus" />
          </div> -->
          <!-- 上传成功 -->
          <div class="preview-img" v-if="imageUrl" title="点击可重新上传">
            <img :src="filePrefix + imageUrl" alt="img" />
          </div>
        </uploader-btn>
      </uploader-drop>
    </uploader>
  </div>
</template>
<script setup lang="ts">
  //  基于vue-simple-uploader^1.0.0-beta.3 单张图片上传组件
  import { ref, watch, getCurrentInstance } from 'vue';
  import {
    // Progress,
    message,
  } from 'ant-design-vue';
  import { PlusOutlined, CloseCircleOutlined } from '@ant-design/icons-vue';

  import { useUserStore } from '/@/store/modules/user';
  import { useGlobSetting } from '/@/hooks/setting';
  const { uploadUrl } = useGlobSetting();
  const userStore = useUserStore();
  const Message = message;
  const filePrefix = getCurrentInstance().appContext.config.globalProperties.$filePrefix;
  // 进度条
  // const progress = ref<number>(0);
  // const progressStatus = ref<'normal' | 'exception' | 'success'>('normal');
  // 上传成功接口返回的图片地址
  const imageUrl = ref<string>('');
  // 上传插件配置
  const options = {
    autoStart: true,
    // 服务器上传的代理地址
    target: uploadUrl,
    // 分块大小
    // chunkSize: '2048000',
    // 上传文件时文件的参数名，默认file
    fileParameterName: 'file',
    // 最大自动失败重试上传次数
    maxChunkRetries: 3,
    // 是否开启服务器分片校验
    testChunks: true,
    // 已经上传过的文件，允许再次上传
    allowDuplicateUploads: true,
    // 服务器分片校验函数，秒传及断点续传基础
    checkChunkUploadedByResponse: function (chunk, message) {
      console.log('--->', chunk, message);
      // let objMessage = JSON.parse(message);
      // if (objMessage.skipUpload) {
      //   return true;
      // }

      // return (objMessage.uploaded || []).indexOf(chunk.offset + 1) >= 0;
    },
    // 请求头设置
    headers: {
      Authorization: `Bearer ${userStore.getAccessToken}`,
    },
    // 额外的自定义查询参数
    query: (file, chunk) => {
      console.log(file, chunk);
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
      imageUrl.value = val;
    },
    {
      immediate: true,
    },
  );

  const attrs = {
    // accept: 'image/*',
    accept: 'image/jpeg, image/png',
  };

  function fileAdded(file) {
    // 根据图片名称，获取图片后缀
    const fileExtension = file.name.split('.').pop().toLowerCase();
    // 判断是否超过5M
    const isLt = file.size / 1024 / 1024 < 5;
    // 判断是否是png、jpg、jpeg格式
    const isRightType = file.fileType === 'image/jpeg' || file.fileType === 'image/png';
    // 判断是否是png、jpg、jpeg后缀（大小写一样）
    const isRightExtension =
      fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png';

    if (!(isRightType && isRightExtension)) {
      message.error('请选择正确格式!');
      file.ignored = true;
      return false;
    }

    if (!isLt) {
      message.error('照片大小不超过5Mb!');
      file.ignored = true;
      return false;
    }

    return true;
  }

  function fileProgress() {
    // console.log('fileProgress--->', rootFile, file, chunk);
  }

  function fileSuccess(rootFile, file, message) {
    const res = JSON.parse(message);
    if (res.result === 200) {
      const { file_path } = res.data;
      imageUrl.value = file_path;
      emit('update:value', file_path);
      emit('change', file_path);
    } else {
      Message.error(res.return_message);
    }
  }

  function fileError(rootFile, file, message, chunk) {
    console.log('fileError--->', rootFile, file, message, chunk);
    Message.error('上传失败');
  }

  function handleDelete() {
    imageUrl.value = '';
    emit('update:value', '');
    emit('change', '');
  }
</script>
<style lang="less">
  .img-uploader {
    position: relative;
    min-height: 144px;

    .del-icon {
      padding: 0 0 6px 6px;
      font-size: 24px;
      color: red;
      position: absolute;
      left: calc(108px - 30px);
      top: 0;
      cursor: pointer;
      z-index: 55;
      &:hover {
        opacity: 0.6;
      }
    }

    > div {
      display: inline-block;
    }

    .uploader-drop {
      padding: 0;
      border: none;
      background-color: transparent;
    }

    .uploader-btn {
      border: none;
      padding: 0;
      background-color: #fafafa;
    }

    .upload-select {
      cursor: pointer;
      svg {
        font-size: 24px;
      }
    }

    .preview-img,
    .upload-progress {
      background-color: #fafafa;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 5;
    }

    .upload-select,
    .preview-img,
    .upload-progress {
      box-sizing: border-box;
      width: 108px;
      height: 150px;
      border-radius: 2px;
      border: 1px dashed #d9d9d9;
      background-color: #fafafa;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;

      &:hover {
        border: 1px dashed #1e80ff;
      }
    }
    .preview-img {
      overflow: hidden;
      position: relative;

      img {
        width: auto;
        height: 100%;
      }
    }
  }
</style>
