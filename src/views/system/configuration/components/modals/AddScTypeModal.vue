<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    @ok="handleSubmit"
    @visible-change="handlecancel"
    ok-text="保存"
  >
    <div class="pt-6">
      <a-form
        ref="formRef"
        :model="formState"
        name="basic"
        :label-col="{ span: 4 }"
        autocomplete="off"
        :rules="rules"
      >
        <a-form-item label="类型名称" name="schedulingtype_name">
          <a-input
            :maxlength="10"
            v-model:value="formState.schedulingtype_name"
            placeholder="请输入类型名称"
            allowClear
          />
        </a-form-item>

        <a-form-item
          label="所属人群"
          name="schedulingtype_population"
          :rules="[{ required: true, message: '请选择所属人群' }]"
        >
          <a-select
            v-model:value="formState.schedulingtype_population"
            style="width: 100%"
            :options="selects"
          />
        </a-form-item>

        <a-form-item
          label="值班时间"
          name="start"
          :rules="[{ required: true, message: '请选择值班时间' }]"
        >
          <div class="flex">
            <a-time-picker v-model:value="formState.start" value-format="HH:mm:ss" class="flex-1" />
            <i class="leading-loose">-</i>
            <a-time-picker v-model:value="formState.end" value-format="HH:mm:ss" class="flex-1" />
          </div>
        </a-form-item>

        <a-form-item label="是否预设管床">
          <a-switch
            :checkedValue="1"
            :unCheckedValue="0"
            v-model:checked="formState.schedulingtype_is_managebed"
            @change="changeSwitch"
          />
        </a-form-item>

        <a-form-item
          label="预设管床范围"
          :rules="[{ required: true }]"
          v-if="formState.schedulingtype_is_managebed"
        >
          <n-cascader
            class="!w-126 !inline-block"
            v-model:value="optionsValue"
            multiple
            clearable
            placeholder="点击选择分管床位范围"
            max-tag-count="responsive"
            expand-trigger="hover"
            label-field="name"
            value-field="id"
            check-strategy="child"
            :options="options"
          />
        </a-form-item>
      </a-form>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, reactive, computed, watch } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { titleList, FormState } from './data';
  import { getHRoomBedTree, addSchedulingType } from '/@/api/system/inconfig';
  import { useUserStore } from '/@/store/modules/user';
  import { NCascader, CascaderOption } from 'naive-ui';
  import { message } from 'ant-design-vue';

  const formRef = ref<any>();
  const userStore = useUserStore();
  const currentPartition = computed(() => userStore.getCurrentPartition);

  const formState = reactive<FormState>({
    schedulingtype_name: '',
    schedulingtype_population: 1,
    schedulingtype_is_managebed: 0,
    schedulingtype_managebed_range: '',
    schedulingtype_partition: currentPartition.value.id,
    schedulingtype_starttime: '',
    schedulingtype_endtime: '',
    start: '',
    end: '',
  });

  /*监听partition_id*/
  watch(
    () => currentPartition.value,
    (n) => {
      if (!n) return;
      formState.schedulingtype_partition = n.id;
      getHRoomBedTreeAPI();
    },
    { deep: true },
  );

  /*emits*/
  const emit = defineEmits(['success']);

  /*弹框title修改*/
  const [registerModal, { setModalProps, closeModal }] = useModalInner((data) => {
    const { titleIndex } = data;
    setModalProps({
      title: titleList[+titleIndex - 1],
    });
  });

  /*所属人群*/
  let selects = [
    { label: '医疗人员', value: 1 },
    { label: '护理人员', value: 2 },
  ];

  /*是否选床*/
  function changeSwitch(v: number) {
    formState.schedulingtype_is_managebed = v;
    if (v == 0) {
      optionsValue.value = undefined;
      formState.schedulingtype_managebed_range = '';
    }
  }

  /*获取分区下的病房和病床*/
  const options = ref<CascaderOption>();
  const optionsValue = ref<string[] | undefined>();
  async function getHRoomBedTreeAPI() {
    let params = { partition_id: currentPartition.value.id };
    let res = await getHRoomBedTree(params);
    /*由于房和床的id可能有重复，这里对床的id做一个处理*/
    res = idToString(res);
    options.value = res;
  }
  function idToString(tree) {
    tree.forEach((i) => {
      if (i.children) {
        i.children.forEach((c) => (c.id = 'cid' + c.id));
      }
    });
    return tree;
  }
  getHRoomBedTreeAPI();

  /*数据提交*/
  function handleSubmit() {
    message.destroy();

    /*处理成 ，病床管理分割的字符串*/
    if (optionsValue.value)
      formState.schedulingtype_managebed_range = optionsValue.value
        .map((i) => parseInt(i.split('id')[1]))
        .filter((i) => i) //去掉NaN
        .join(',');

    /*如果需要病床，那病床必填*/
    if (formState.schedulingtype_is_managebed && !formState.schedulingtype_managebed_range) {
      return message.warning('请选择管床范围');
    }
    /*如果没有选择结束时间*/
    if (!formState.end) return message.warning('请填写完整值班时间');

    /*表单校验和发送请求*/
    formRef.value?.validateFields().then(async () => {
      /*前端分析一下是否跨天，做一些小处理*/
      timeFormat();
      let res = await addSchedulingType(formState);
      if (res) {
        closeModal();
        setTimeout(() => handlecancel(false));
        message.success('操作成功');
        emit('success');
      }
    });
  }

  /*时间判断，跨天判断，数据处理*/
  function timeFormat() {
    let s = formState.start;
    let e = formState.end;
    let sArr = s.split(':');
    let eArr = e.split(':');
    /*如果s大于e，则判断为跨天*/
    if (
      sArr[0] > eArr[0] ||
      (sArr[0] == eArr[0] && sArr[1] >= eArr[1]) ||
      (sArr[0] == eArr[0] && sArr[1] == eArr[1] && sArr[2] >= eArr[2]) ||
      (sArr[0] == eArr[0] && sArr[1] == eArr[1] && sArr[2] == eArr[2])
    ) {
      formState.schedulingtype_starttime = '2022-01-01 ' + s;
      formState.schedulingtype_endtime = '2022-01-02 ' + e;
    } else {
      formState.schedulingtype_starttime = '2022-01-01 ' + s;
      formState.schedulingtype_endtime = '2022-01-01 ' + e;
    }
  }

  /*关闭弹框*/
  function handlecancel(val) {
    if (!val) {
      formRef.value?.clearValidate();
      formRef.value?.resetFields();
    }
    formState.start = '';
    formState.end = '';
    formState.schedulingtype_is_managebed = 0;
    formState.schedulingtype_managebed_range = '';
    optionsValue.value = [];
  }

  /*rules*/
  const rules = {
    schedulingtype_name: [{ required: true, validator: inputCheck, trigger: 'blur' }],
  };
  async function inputCheck(_, value: string) {
    let reg =
      /[`~!@#%$^\-&*()=_+|{}':;',\\\[\]\.<>\/?~！@#%_+￥……&*（）——|{}【】'；：""'。，、？\s]/g;
    if (!value) return Promise.reject('输入不能为空');
    if (reg.test(value)) return Promise.reject('不允许输入空格或特殊字符');
    return Promise.resolve();
  }
</script>

<style scoped></style>
