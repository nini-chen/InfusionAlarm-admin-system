<template>
  <div>
    <Popover trigger="hover" :overlayClassName="`${prefixCls}-dropdown-overlay`">
      <span :class="prefixCls" class="flex">
        <span :class="`${prefixCls}__info hidden md:flex flex-col`">
          <span :class="`${prefixCls}__name truncate max-w-7em`">
            {{ userInfo.realName }}
          </span>
          <span :class="`${prefixCls}__name flex items-center`">
            <i
              class="inline-block not-italic truncate max-w-8em font-PingFangSCMedium mr-1em align-bottom"
            >
              {{ userInfo.username }}
            </i>
            <CaretDownOutlined :class="`${prefixCls}__name`" />
          </span>
        </span>
        <div :class="`${prefixCls}__header`">
          <img :src="userInfo.avatar || headerImg" />
        </div>
      </span>

      <template #content>
        <div class="flex flex-col text-sm text-ok cursor-pointer">
          <div
            class="px-10px py-4px mb-10px"
            style="
              background-color: #ececec;
              box-shadow: inset 0px -1px 1px 0px rgba(0, 0, 0, 0.05);
            "
            @click="showUserInfoModal"
          >
            {{ t('layout.header.dropdownItemUserInfo') }}
          </div>
          <div
            class="px-10px py-4px"
            style="
              background: linear-gradient(134deg, #dae7f6 0%, #98cbfa 100%);
              box-shadow: inset 0px -1px 1px 0px rgba(0, 0, 0, 0.05);
            "
            @click="showLogoutModal"
          >
            {{ t('layout.header.dropdownItemLoginOut') }}
          </div>
        </div>
      </template>
    </Popover>
    <!-- 查看/编辑 弹窗 -->
    <EditModal :width="620" :canFullscreen="false" @register="registerEditUserModal" />
    <!-- 账号退出 弹窗 -->
    <Modal v-model:visible="logoutVisible" width="446" title="安全退出" okText="确认" @ok="confirmLogout">
      <div class="px-24px py-30px text-base">
        <span class="tip-txt">确定退出账号吗？</span>
      </div>
    </Modal>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { Popover, Modal } from 'ant-design-vue';
  import { CaretDownOutlined } from '@ant-design/icons-vue';
  import { useModal } from '/@/components/Modal';

  import { useUserStore } from '/@/store/modules/user';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import EditModal from './EditModal.vue';

  import headerImg from '/@/assets/images/header.png';

  const logoutVisible = ref<boolean>(false);

  const { t } = useI18n();
  const userStore = useUserStore();
  const { prefixCls } = useDesign('header-user-dropdown');
  const [registerEditUserModal, { openModal: openEditModal }] = useModal();

  const userInfo = userStore.getUserInfo;

  function showUserInfoModal() {
    openEditModal(true);
  }

  function showLogoutModal() {
    logoutVisible.value = true;
  }

  function confirmLogout() {
    userStore.confirmLoginOut();
    logoutVisible.value = false;
  }
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-header-user-dropdown';

  .@{prefix-cls} {
    height: @header-height;
    padding: 0 20px 0 30px;
    overflow: hidden;
    font-size: 12px;
    cursor: pointer;
    align-items: center;
    color: #fff;

    &__header {
      width: 40px;
      height: 40px;
      margin: 0 0 0 15px;
      border-radius: 50%;
      background-color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;

      img {
        border-radius: 50%;
        padding: 5px;
        object-fit: cover;
      }
    }

    &__name {
      font-size: 14px;
    }
  }
</style>
