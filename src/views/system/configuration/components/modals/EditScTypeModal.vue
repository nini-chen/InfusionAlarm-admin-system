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
            disabled
            :options="selects"
          />
        </a-form-item>

        <a-form-item
          label="值班时间"
          prop="start"
          :rules="[{ required: true, message: '请选择值班时间' }]"
        >
          <a-time-picker
            v-model:value="formState.start"
            value-format="HH:mm:ss"
            style="width: 15rem"
          />
          -
          <a-time-picker
            v-model:value="formState.end"
            value-format="HH:mm:ss"
            style="width: 15rem"
          />
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
          <!-- <a-cascader
            v-model:value="optionsValue"
            style="width: 100%"
            multiple
            max-tag-count="responsive"
            placeholder="请选择病房和病床"
            :options="options"
            :fieldNames="{ label: 'name', value: 'id' }"
            @change="changeSelect"
          ></a-cascader> -->
          <n-cascader
            class="!w-126"
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
  import { ref, reactive, computed } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { getHRoomBedTree, editSchedulingType } from '/@/api/system/inconfig';
  import { useUserStore } from '/@/store/modules/user';
  import { FormState } from './data';
  import { NCascader, CascaderOption } from 'naive-ui';
  import { message } from 'ant-design-vue';

  /*emits*/
  const emit = defineEmits(['success']);

  const formRef = ref<any>();
  const userStore = useUserStore();
  const currentPartition = computed(() => userStore.getCurrentPartition);

  const formState = reactive<FormState>({
    id: 0,
    schedulingtype_name: '',
    schedulingtype_population: 1,
    schedulingtype_is_managebed: 1,
    schedulingtype_managebed_range: '',
    schedulingtype_partition: currentPartition.value.id,
    schedulingtype_starttime: '',
    schedulingtype_endtime: '',
    start: '',
    end: '',
  });

  /*弹框title修改,数据回显*/
  const [registerModal, { setModalProps, closeModal }] = useModalInner((data) => {
    viewData(data.record);
    setModalProps({
      title: '编辑排班类型',
    });
  });

  async function viewData(data) {
    // console.log(data);
    formState.id = data.id;
    formState.schedulingtype_population = data.schedulingtype_population;
    formState.schedulingtype_is_managebed = data.schedulingtype_is_managebed;
    formState.schedulingtype_name = data.schedulingtype_name;
    formState.start = data.schedulingtype_starttime.split(' ')[1];
    formState.end = data.schedulingtype_endtime.split(' ')[1];
    await getHRoomBedTreeAPI();
    optionsValue.value = data.schedulingtype_managebed_range
      .split(',')
      .filter((i) => i)
      .map((i) => 'cid' + i);
  }

  /*所属人群*/
  let selects = [
    { label: '医疗人员职级', value: 1 },
    { label: '护理人员职级', value: 2 },
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
  const options = ref<CascaderOption[]>();
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
      let res = await editSchedulingType(formState);
      if (res) {
        closeModal();
        setTimeout(() => handlecancel(false));
        emit('success');
        message.success('操作成功');
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
      (sArr[0] == eArr[0] && sArr[1] < eArr[1]) ||
      (sArr[0] == eArr[0] && sArr[1] == eArr[1] && sArr[2] < eArr[2]) ||
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
