<template>
  <div :class="prefixCls">
    <Popover title="" trigger="hover" :overlayClassName="`${prefixCls}__overlay`">
      <Badge>
        <img class="inline device-icon" :src="offCount > 0 ? deviceError : deviceOk" />
      </Badge>
      <template #content>
        <div class="text-error cursor-pointer" v-if="offCount > 0" @click="onNoticeClick">
          设备离线 （{{ offCount }}）
        </div>
        <div class="text-ok" v-else> 设备运行正常 </div>
      </template>
    </Popover>
  </div>
</template>
<script lang="ts" setup>
  import { router } from '/@/router';
  import { computed } from 'vue';
  import { Popover, Badge } from 'ant-design-vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import deviceOk from '/@/assets/images/device-ok.png';
  import deviceError from '/@/assets/images/device-error.png';

  import { usePermissionStoreWithOut } from '/@/store/modules/permission';
  import { useMqttStore } from '/@/store/modules/mqtt';
  import { ExceptionEnum } from '/@/enums/exceptionEnum';

  const { prefixCls } = useDesign('header-notify');
  const userMqtt = useMqttStore();
  const permissionStore = usePermissionStoreWithOut();

  // 离线设备数量
  const offCount = computed(() => userMqtt.getOffDevicesCounts);

  // 跳去离线设备页面
  function onNoticeClick() {
    // 判断用户是否有权限, 有则跳去架构管理-设备管理-离线设备列表tab（tabActive: 3）; 否则跳去403无权限页面
    const query = permissionStore.getPermCodeList?.includes('WardDevice')
      ? {
          tabActive: 3,
          _t: new Date().getTime(),
        }
      : { status: ExceptionEnum.PAGE_NOT_ACCESS, _t: new Date().getTime() };
    sessionStorage.setItem(
      'fromInpatientEdit',
      JSON.stringify({
        tabActive: 3,
      }),
    );
    router.push({
      path: '/ward/device',
      query,
    });
  }
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-header-notify';

  .@{prefix-cls} {
    padding-top: 2px;
    cursor: pointer;

    &__overlay {
      max-width: 360px;
    }
    .ant-badge {
      font-size: 18px;

      .ant-badge-multiple-words {
        padding: 0 4px;
      }

      svg {
        width: 0.9em;
      }
    }
  }
  .device-icon {
    width: 32px;
    height: 32px;
  }
  .device-notification,
  .device-counts-notification {
    min-width: 402px;
    .ant-btn-default {
      width: 74px;
      height: 30px;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
      border-radius: 4px;
      border: 1px solid rgba(0, 0, 0, 0.15);
      margin-left: 8px;
    }

    .ant-btn-primary {
      width: 74px;
      height: 30px;
      font-size: 14px;
      border-radius: 4px;
    }
    .ant-notification-notice-close {
      display: none;
    }
  }
  .device-notification {
    .ant-notification-notice-with-icon {
      .ant-notification-notice-description,
      .ant-notification-notice-message {
        margin-left: 40px;
      }
    }
  }
  .device-counts-notification {
    .ant-notification-notice-message {
      width: 100%;
      margin-bottom: 0;
      padding-right: 0;
    }
  }
</style>
