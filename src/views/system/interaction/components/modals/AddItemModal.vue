<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    @ok="handleSubmit"
    @visible-change="handlecancel"
  >
    <div class="pt-6">
      <a-form
        ref="formRef"
        :model="formState"
        name="basic"
        autocomplete="off"
        :label-col="{ span: 2 }"
      >
        <!-- 必填，长度在2-6个字符之间 -->
        <a-form-item
          label="名称"
          name="name"
          :rules="[
            { required: true, message: '请输入名称' },
            {
              min: 2,
              max: 6,
              message: '长度在 2 到 6 个字符',
            },
          ]"
        >
          <a-input
            v-model:value="formState.name"
            :maxlength="6"
            placeholder="请输入名称"
            allowClear
          />
        </a-form-item>

        <a-form-item label="颜色" name="color" :rules="[{ required: true, message: '请选择颜色' }]">
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
                  'background-color': colorList[formState.color - 1].label || colorList[0].label,
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
            <a-textarea
              maxlength="100"
              placeholder="请输入备注"
              v-model:value="formState.comment"
              :rows="4"
              allowClear
              class="!pl-2 !pr-8"
            />
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
  import { colorList, titleList } from './data';
  import { addConfig } from '/@/api/system/interaction';
  import { message } from 'ant-design-vue';

  /*emits*/
  const emit = defineEmits(['success']);

  //form 实例
  const formRef = ref<any>();

  interface FormState {
    name: string;
    color: string | number;
    comment: string;
    type: number;
  }
  const formState = ref<FormState>({
    name: '',
    color: colorList[0].value,
    comment: '',
    type: 1,
  });

  /*modal*/
  const [registerModal, { setModalProps, closeModal }] = useModalInner((data) => {
    console.log(data);
    const { titleIndex } = data;
    formState.value.type = +titleIndex;
    setModalProps({
      title: titleList[+titleIndex - 1],
    });
  });

  //颜色选择框
  const colorVisible = ref(false);
  function selectColor(color) {
    formState.value.color = color.value;
    colorVisible.value = false;
  }

  /*数据提交*/
  function handleSubmit() {
    /*表单校验和发送请求*/
    formRef.value?.validateFields().then(async () => {
      let res = await addConfig(formState.value);
      if (res) {
        handlecancel(false);
        closeModal();
        emit('success');
        message.success('操作成功');
      }
    });
  }

  /*关闭弹框*/
  function handlecancel(val) {
    if (!val) {
      formRef.value?.resetFields();
      formRef.value?.clearValidate();
      formState.value.comment = '';
    }
  }
</script>

<style scoped></style>
