<template>
  <div class="platform-expired w-full h-full flex items-center justify-center">
    <div class="wrapper">
      <div class="tips">
        <h1>平台使用已到期</h1>
        <p>
          <Icon
            class="cursor-pointer"
            icon="ant-design:info-circle-outlined"
            color="#f59e0b"
            size="14"
          />
          <span class="border-yellow-100 border-b-1 leading-6 ml-1 inline-block"
            >复制下面的机器码，发给管理员获取激活码，重新激活后可以继续使用!</span
          >
        </p>
      </div>
      <div class="machine-code flex items-center pb-2 pt-4 text-sm">
        <span class="mx-3">机器码</span>
        <span class="flex-1 text-center">{{ machineCode }}</span>
        <Button type="text" @click="handleCopy">
          <Icon
            class="cursor-pointer"
            icon="ant-design:copy-outlined"
            color="#1764e7"
            size="20"
            @click="handleCopy"
          />
        </Button>
      </div>
      <div class="pt-2 pb-8">
        <Input v-model:value="activatedCode" addon-before="激活码" placeholder="请输入激活码" />
      </div>
      <Button class="w-full" type="primary" :loading="loading" @click="handleActivating">
        激活
      </Button>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, unref, onMounted } from 'vue';
  import moment from 'moment';
  import { useRouter } from 'vue-router';
  import { Button, Input } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {
    getExpireDateRangeApi,
    getMachineCodeApi,
    activatePlatformApi,
  } from '/@/api/sys/expired';
  import { PageEnum } from '/@/enums/pageEnum';
  import { useUserStore } from '/@/store/modules/user';

  const router = useRouter();
  const { createMessage } = useMessage();
  const { clipboardRef, copiedRef } = useCopyToClipboard();
  const machineCode = ref('');
  const activatedCode = ref('');
  const loading = ref(false);

  // 复制
  function handleCopy() {
    clipboardRef.value = machineCode.value;
    if (unref(copiedRef)) {
      createMessage.success(`已复制：${machineCode.value}`);
    }
  }

  // 判断平台使用期限
  async function checkExpiredTime() {
    try {
      const { startDate, endDate } = await getExpireDateRangeApi();
      if (startDate && endDate) {
        const start = moment(startDate);
        const end = moment(endDate);
        const current = moment(); // 获取当前日期
        /**
         * 1. startDate === endDate 说明用户可永久使用
         * 2. current.isBetween(start, end)  说明现在还处于使用范围
         */
        if (startDate === endDate || current.isBetween(start, end)) {
          // 日期未过期，跳去首页
          gotoHomePage();
        } else {
          // 日期已过期
        }
      }
    } catch (error) {}
  }

  // 跳首页
  function gotoHomePage() {
    const userStore = useUserStore();
    const homePath = userStore.getUserInfo?.homePath || PageEnum.BASE_HOME;
    router.push(homePath);
  }

  // 获取机器码
  async function getMachine() {
    const code = await getMachineCodeApi();
    machineCode.value = code || '';
  }

  // 激活
  async function handleActivating() {
    if (activatedCode.value === '') {
      createMessage.warning('请输入激活码！');
      return;
    }
    try {
      loading.value = true;
      const flag = await activatePlatformApi(activatedCode.value);
      if (flag) {
        createMessage.success('已激活使用权限！');
        gotoHomePage();
      }
      setTimeout(() => {
        loading.value = false;
      }, 1500);
    } catch (error) {
      loading.value = false;
    }
  }

  onMounted(() => {
    checkExpiredTime();
    getMachine();
  });
</script>
<style lang="less">
  .platform-expired {
    background-color: #387af6;
    position: relative;
    overflow: hidden;

    &::before,
    &::after {
      content: '';
      display: inline-block;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.05);
      position: fixed;
    }

    &::before {
      width: 80vh;
      height: 80vh;
      right: -60vh;
      top: -60vh;
    }

    &::after {
      width: 100vh;
      height: 100vh;
      left: -63vh;
      bottom: -48vh;
    }

    .wrapper {
      padding: 40px 80px 60px;
      background-color: #fff;
      border-radius: 4px;

      .tips {
        h1 {
          text-align: center;
          font-size: 24px;
          color: #62728c;
          font-weight: bolder;
        }
        p {
          font-size: 12px;
          color: #8895aa;
        }
      }
    }
  }
</style>
