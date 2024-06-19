<template>
  <BasicModal v-bind="$attrs" @register="registerModal" @ok="handleSubmit">
    <div class="pt-6">
      <a-form
        ref="formRef"
        :model="formState"
        name="basic"
        autocomplete="off"
        :label-col="{ span: 2 }"
      >
        <a-form-item label="名称" name="name" :rules="[{ required: true, message: '请输入名称' }]">
          <a-input
            :disabled="formState.type == '1'"
            :maxlength="6"
            v-model:value="formState.name"
            allowClear
          />
        </a-form-item>

        <a-form-item label="颜色" name="color" :rules="[{ required: true }]">
          <a-popover v-model:visible="colorVisible" title="请选择颜色" trigger="click">
            <template #content>
              <div class="flex flex-wrap w-56">
                <div
                  v-for="item in colorList"
                  class="h-5 w-5 m-1 cursor-pointer"
                  :style="{ 'background-color': item.label }"
                  @click="selectColor(item)"
                ></div>
              </div>
            </template>
            <div class="flex relative justify-center items-center h-7 w-31 border border-gray-300">
              <div
                class="h-6 w-30"
                :style="{
                  'background-color': colorList[formState.color as unknown as number - 1]?.label,
                }"
              ></div>
              <div class="text-gray-500 absolute right-0 transform translate-x-26"
                >点击选择颜色</div
              >
            </div>
          </a-popover>
        </a-form-item>

        <a-form-item label="备注" name="content">
          <div class="relative">
            <!-- <textarea :maxlength="100" id="textarea" v-model="formState.comment"></textarea> -->
            <a-textarea
              maxlength="100"
              placeholder="请输入备注"
              v-model:value="formState.comment"
              :rows="4"
              allowClear
              class="!pl-2 !pr-8"
            >
            </a-textarea>
            <span class="absolute right-2 bottom-2">{{ formState.comment.length }} / 100</span></div
          >
        </a-form-item>
      </a-form>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { colorList, editTitleList } from './data';
  import { editConfig } from '/@/api/system/interaction';
  import { message } from 'ant-design-vue';

  /*emits*/
  const emit = defineEmits(['success']);

  //form 实例
  const formRef = ref<any>();

  //colorDialog
  const colorVisible = ref(false);

  interface FormState {
    id: string | number;
    name: string;
    color: string;
    comment: string;
    type: number | string;
  }

  const formState = ref<FormState>({
    id: '',
    name: '',
    color: '',
    comment: '',
    type: '',
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner((data) => {
    const { tab, id, name, color, comment } = data;
    formState.value = { id, name, color, comment, type: tab };
    setModalProps({
      title: editTitleList[tab - 1],
    });
  });

  function selectColor(color) {
    formState.value.color = color.value;
    colorVisible.value = false;
  }
  /*数据提交*/
  function handleSubmit() {
    /*表单校验和发送请求*/
    formRef.value?.validateFields().then(async () => {
      let res = await editConfig(formState.value);
      if (res) {
        formRef.value?.clearValidate();
        formRef.value?.resetFields();
        closeModal();
        emit('success');
        message.success('操作成功');
      }
    });
  }
</script>

<style scoped>
</style>
