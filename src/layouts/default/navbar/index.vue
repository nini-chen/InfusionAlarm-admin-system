<template>
  <div class="w-full flex justify-between items-center px-4" :class="prefixCls">
    <!-- 页面顶部栏左侧-->
    <!-- logo和平台名称 -->
    <div class="flex items-center">
      <img class="w-40px h-24px" src="../../../assets/images/logo.png" @click="changeAccessToken" />
      <div class="ml-3 text-white text-2xl font-extrabold font-PingFangSCHeavy leading-initial">
        {{ title }}
      </div>
    </div>
    <div class="flex items-center">
      <!-- 设备警告提示 -->
      <Notify :class="`${prefixCls}-action__item notify-item`" />
      <!-- 用户信息 -->
      <UserDropDown :class="`${prefixCls}-action__item notify-item`" />
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { useGlobSetting } from '/@/hooks/setting';
  import { useDesign } from '/@/hooks/web/useDesign';

  import Notify from '../header/components/notify/index.vue';
  import UserDropDown from '../header/components/user-dropdown/index.vue';
  const { title } = useGlobSetting();

  import { useUserStore } from '/@/store/modules/user';

  export default defineComponent({
    name: 'LayoutNavbar',
    components: {
      Notify,
      UserDropDown,
    },
    setup() {
      const { prefixCls } = useDesign('layout-navbar');

      // 改一个无用的accesstoken, 用于模拟过期================
      function changeAccessToken() {
        const userStore = useUserStore();
        userStore.setAccessToken({ access_token: '111', expires: 0 });
        // userStore.setToken('ssss');
      }

      return {
        prefixCls,
        title,
        changeAccessToken,
      };
    },
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-layout-navbar';
  .@{prefix-cls} {
    position: fixed;
    top: 0;
    left: 0;
    height: @navbar-height;
    z-index: @layout-header-fixed-z-index;
    background-color: @primary-color;
  }
</style>
