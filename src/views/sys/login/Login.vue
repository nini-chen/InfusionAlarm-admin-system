<template>
  <div :class="prefixCls" class="relative w-full h-full px-4 login-bg-img">
    <!-- <AppLocalePicker
      class="absolute text-white top-4 right-4 enter-x xl:text-gray-600"
      :showText="false"
      v-if="!sessionTimeout && showLocale"
    /> -->
    <!-- <AppDarkModeToggle class="absolute top-3 right-7 enter-x" v-if="!sessionTimeout" /> -->
    <div class="container relative h-full py-2 mx-auto sm:px-10 flex flex-col">
      <div class="flex h-full">
        <div class="hidden min-h-full pl-4 mr-4 xl:flex xl:flex-col xl:w-6/12">
          <div class="my-auto">
            <img :alt="title" src="../../../assets/images/login-img.png" class="-mt-16 -enter-x" />
          </div>
        </div>
        <div class="flex w-full h-full py-5 xl:h-auto xl:py-0 xl:my-0 xl:w-6/12">
          <div
            :class="`${prefixCls}-form`"
            class="relative px-10 pt-21 pb-23 mx-auto my-auto rounded-md shadow bg-white enter-x"
          >
            <!-- class="relative w-full px-5 py-8 mx-auto my-auto rounded-md shadow-md xl:ml-8 bg-white sm:px-10 xl:p-10 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto enter-x" -->
            <LoginForm />
          </div>
        </div>
      </div>
      <div class="text-sm text-gray-400 text-center" v-if="version">版本号：{{ version }}</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  import LoginForm from './LoginForm.vue';
  import { useGlobSetting } from '/@/hooks/setting';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { getWebVersionApi } from '/@/api/sys/user';

  defineProps({
    sessionTimeout: {
      type: Boolean,
    },
  });

  const globSetting = useGlobSetting();
  const { prefixCls } = useDesign('login');

  const title = computed(() => globSetting?.title ?? '');
  const version = ref<string>('');

  async function getVersion() {
    const res = await getWebVersionApi();
    version.value = res?.version || '';
  }

  onMounted(() => {
    getVersion();
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-login';
  @logo-prefix-cls: ~'@{namespace}-app-logo';
  @countdown-prefix-cls: ~'@{namespace}-countdown-input';
  @dark-bg: #293146;

  .login-bg-img {
    background-image: url(/@/assets/images/login-bg.png);
    background-position: 100%;
    background-repeat: no-repeat;
    background-size: cover;
  }

  html[data-theme='dark'] {
    .@{prefix-cls} {
      background-color: @dark-bg;

      .ant-input,
      .ant-input-password {
        background-color: #232a3b;
      }

      .ant-btn:not(.ant-btn-link):not(.ant-btn-primary) {
        border: 1px solid #4a5569;
      }

      &-form {
        background: transparent !important;
        box-shadow: 0px 2px 8px 0px rgba(200, 201, 204, 0.5);
      }

      .app-iconify {
        color: #fff;
      }
    }

    input.fix-auto-fill,
    .fix-auto-fill input {
      -webkit-text-fill-color: #c9d1d9 !important;
      box-shadow: inherit !important;
    }
  }

  .@{prefix-cls} {
    min-height: 100%;
    overflow: hidden;

    @media (max-width: @screen-xl) {
      background-color: #293146;
    }

    .@{logo-prefix-cls} {
      position: absolute;
      top: 12px;
      height: 30px;

      &__title {
        font-size: 16px;
        color: #fff;
      }

      img {
        width: 32px;
      }
    }

    .container {
      .shadow {
        box-shadow: 0px 2px 8px 0px rgba(200, 201, 204, 0.5);
      }
      .@{logo-prefix-cls} {
        display: flex;
        width: 60%;
        height: 80px;

        &__title {
          font-size: 24px;
          color: #fff;
        }

        img {
          width: 48px;
        }
      }
    }

    &-sign-in-way {
      .anticon {
        font-size: 22px;
        color: #888;
        cursor: pointer;

        &:hover {
          color: @primary-color;
        }
      }
    }

    input:not([type='checkbox']) {
      min-width: 360px;

      @media (max-width: @screen-xl) {
        min-width: 320px;
      }

      @media (max-width: @screen-lg) {
        min-width: 260px;
      }

      @media (max-width: @screen-md) {
        min-width: 240px;
      }

      @media (max-width: @screen-sm) {
        min-width: 160px;
      }
    }

    .@{countdown-prefix-cls} input {
      min-width: unset;
    }

    .ant-divider-inner-text {
      font-size: 12px;
      color: @text-color-secondary;
    }
  }
</style>
