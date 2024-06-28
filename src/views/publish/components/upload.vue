<template>
  <uploader
    class="uploader-example border-dotted border-4 border-light-blue-500 shadow-inner rounded"
    ref="uploaderVideo"
    :options="uploadOptionsVideo"
    :autoStart="true"
    :fileList="fileListArray"
    :file-status-text="statusText"
    @file-progress="fileProgressVideo"
    @file-added="fileSubmitVideo"
    @file-success="fileSuccessVideo"
    @file-error="fileFailVideo"
  >
    <uploader-unsupport />
    <uploader-btn :attrs="attrs" :directory="false" :single="true">
      <CloudUploadOutlined
        key="cloud-upload"
        class="text-blue-500 text-base mr-3 cursor-pointer"
        style="font-size: 40px"
      />
    </uploader-btn>
    <div class="tip"> <span class="text-red-400">*注意：</span>只允许上传zip,bin或apk格式文件 </div>
    <div class="tip">
      <span class="text-red-400">{{ filename && '文件名：' }}</span>
      <span>{{ filename || '暂未上传文件' }}</span>
    </div>
  </uploader>
  <Progress v-if="currentPrcent" :percent="currentPrcent" status="active" style="width: 97%" />
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { useGlobSetting } from '/@/hooks/setting';
  import { CloudUploadOutlined } from '@ant-design/icons-vue';
  import { useUserStore } from '/@/store/modules/user';
  import { message as Message, Progress } from 'ant-design-vue';
  import { addFile } from '/@/api/deploy/area';

  const userStore = useUserStore();
  const uploaderVideo = ref<any>(null);
  const fileListArray = ref<any[]>([]);
  const currentPrcent = ref(0);
  const { uploadUrl } = useGlobSetting();

  const filename = ref('');

  /*emits*/
  const emit = defineEmits(['success', 'submitDisable']);

  /*props*/
  interface Props {
    refresh: number;
  }
  const props = withDefaults(defineProps<Props>(), {
    refresh: 0,
  });

  /*watch*/
  watch(
    () => props.refresh,
    () => {
      clear();
      filename.value = '';
    },
  );

  const attrs = ref({
    accept: 'application/zip,.bin,.apk,.BIN,.APK',
  });

  const statusText = {
    success: '上传成功',
    error: '上传出错',
    uploading: '正在上传...',
    paused: '暂停',
    waiting: '等待上传',
  };

  const uploadOptionsVideo = {
    target: uploadUrl,
    testChunks: false, //是否开启服务器分片校验
    maxChunkRetries: 3, //最大自动失败重试上传次数
    simultaneousUploads: 3, //并发上传数
    chunkSize: (1024 * 1024 * 1) / 2, //分块大小
    allowDuplicateUploads: false, //同一文件是否重复上传
    withCredentials: false,
    headers: {
      // ApiToken: getToken(),
      Authorization: `Bearer ${userStore.getAccessToken}`,
    },
    // 服务器分片校验函数，秒传及断点续传基础
    checkChunkUploadedByResponse: function (chunk, message) {
      let objMessage = JSON.parse(message);
      if (objMessage.skipUpload) {
        return true;
      }
      return (objMessage.uploaded || []).indexOf(chunk.offset + 1) >= 0;
    },
  };

  //动态监听上传事件
  function fileProgressVideo(file) {
    // console.log(rootFile ,file , chunk, '动态监听上传事件' )
    filename.value = file.name + '  上传中......';
    emit('submitDisable', true);
    currentPrcent.value += uploaderVideo.value.uploader.progress() * 10;
    currentPrcent.value = Math.ceil(currentPrcent.value);
  }

  //过滤文件格式
  function fileSubmitVideo(files) {
    // console.log(files ,fileList , event , '过滤文件格式')
    const name = files.name;
    const idx = name.lastIndexOf('.');
    const ext = name.substr(idx + 1);
    if (ext.toUpperCase() !== 'ZIP' && ext.toUpperCase() !== 'BIN' && ext.toUpperCase() !== 'APK') {
      Message.warning('仅允许上传zip,bin或apk格式文件');
      files.ignored = true;

      return false;
    }
  }

  function clear() {
    //beat版的库，没有文档上面的api，手动清除，可以用那个
    uploaderVideo.value.fileList = [];
    uploaderVideo.value.files = [];
    uploaderVideo.value.uploader.fileList = [];
    uploaderVideo.value.uploader.files = [];
    currentPrcent.value = 0;
  }

  //上传成功
  async function fileSuccessVideo(_, file, message) {
    clear();
    Message.info('上传成功');
    filename.value = file.name;
    // emit
    emit('submitDisable', false);
    emit('success', {
      path: JSON.parse(message).data.file_path,
      name: file.name,
    });
  }

  //上传错误的事件
  function fileFailVideo() {
    clear();
    Message.error('上传失败');
  }

  defineExpose({
    filename,
  });
</script>

<style scoped>
  .uploader-example {
    width: 97%;
  }
  .uploader-btn {
    border: none;
    width: 100%;
    padding: 15px;
    text-align: center;
  }
  .uploader-btn:hover {
    background-color: transparent;
  }
  .anticon {
    color: #0ea5e9;
  }

  .tip {
    text-align: center;
    color: gray;
  }
</style>
