<template>
  <div class="bg-white p-4" style="height: calc(100vh - 220px)">
    <BasicTable :pagination="pagination" @register="registerTable">
      <template #tableTitle>
        <span class="text-base font-medium">信息列表</span>
        <span v-if="isUrgent" class="font-medium ml-8 text-red-600"
          >紧急通知发布中，当前状态不支持编辑更改<span v-if="!isIcu">通知提示与</span>病区标语
        </span>
      </template>
      <template #toolbar>
        <template v-if="isEditStatus">
          <Button type="primary" @click="addNoticeMsg">
            <template #icon><PlusOutlined /></template>
            新建
          </Button>
          <Button class="ml-4" type="primary" @click="confirmEdit">保存</Button>
        </template>
        <Button v-else type="primary" @click="statusEdit" :disabled="isUrgent">编辑</Button>
      </template>
      <template #play_status="{ record }">
        <span
          :style="{
            color:
              record.play_status == 1 ? '#00C219' : record.play_status == 2 ? '#F59A23' : '#000000',
          }"
        >
          {{ record.play_status == 1 ? '发布中' : record.play_status == 2 ? '暂停发布' : '无' }}
        </span>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              label: '发布',
              onClick: handleRelease.bind(null, record),
              ifShow: (_action) => {
                return record.play_status != 1;
              },
            },
            {
              label: '编辑',
              onClick: handleEdit.bind(null, record),
              ifShow: (_action) => {
                return record.play_status != 1;
              },
            },
            {
              label: '删除',
              onClick: handleDelete.bind(null, record),
              color: 'error',
              ifShow: (_action) => {
                return record.play_status != 1;
              },
            },
            {
              label: '取消发布',
              onClick: handleClose.bind(null, record),
              color: 'warning',
              ifShow: (_action) => {
                return record.play_status == 1;
              },
            },
          ]"
        />
      </template>
    </BasicTable>

    <div class="bg-white px-4 flex content-start h-120px">
      <span class="text-base font-medium pt-8px">发布范围：</span>
      <template v-if="!isEditStatus">
        <div class="showTips">
          <div v-for="(item, index) in range" :key="index">
            <span class="text-sm pt-10px">{{ getDeviceName(item) }}</span>
            <span class="text-xs text-gray-400 ml-4 pt-12px">病区内全部该类型设备</span>
          </div>
        </div>
      </template>
      <template v-if="isEditStatus">
        <CheckboxGroup
          :disabled="dataSource.length == 0"
          v-model:value="range"
          name="checkboxgroup"
          :options="publishOptions"
        />
        <div class="tipsSelect">
          <span class="text-xs text-gray-400 ml-4">病区内全部该类型设备</span>
          <span v-if="partitionInfo.is_icu === 0" class="text-xs text-gray-400 ml-4"
            >病区内全部该类型设备</span
          >
          <span v-if="partitionInfo.is_icu === 0" class="text-xs text-gray-400 ml-4"
            >病区内全部该类型设备</span
          >
          <span v-if="partitionInfo.is_icu === 0" class="text-xs text-gray-400 ml-4"
            >病区内全部该类型设备</span
          >
          <span v-if="partitionInfo.is_icu === 0" class="text-xs text-gray-400 ml-4"
            >病区内全部该类型设备</span
          >
        </div>
      </template>
    </div>

    <AddModal :width="600" @register="registerAuthModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { ref, computed, onMounted, unref, watch, inject } from 'vue';

  import { useModal } from '/@/components/Modal';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import { Button, CheckboxGroup } from 'ant-design-vue';
  import AddModal from './AddModal.vue';

  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';

  import { listColumns } from '../table.data';
  import { getSloganList, saveSloganList } from '/@/api/publish/publish';

  const isIcu = inject('is_icu');

  const userStore = useUserStore();
  const { createMessage } = useMessage();

  const pagination = ref<any>(false);
  let dataSource: any = ref([]);
  let source = 0; // 源目标数据序号
  let target = 0; // 目标数据序号
  let isShowAction: any = ref(false); //是否显示操作栏
  let isEditStatus = ref(false); //是否为编辑状态

  const range = ref([]);

  const options = [
    { label: '走廊显示屏', value: 'passageway' },
    { label: '病房门口机', value: 'doorway' },
    { label: '病床分机', value: 'switch' }, //当前地方比较特殊，分机需要发音频管理的值
    { label: '安卓版走廊屏', value: 'apk_passageway' },
    { label: '安卓版病床分机', value: 'apk_sickbed' },
  ];
  const optionsICU = [{ label: '探视病床分机', value: 'icu_sickbed' }]; // icu的发布范围是探视病床分机
  const publishOptions = ref<any[]>(options);

  let stopDraggable = ref(false); //是否开始拖拽
  const copyList: any = ref([]);
  const copyRange: any = ref([]);

  // 当前用户所处的病区的id
  let partitionId = computed(() => userStore.getCurrentPartition.id);
  const isUrgent = computed(() => userStore.getIsUrgentStatus);
  let partitionInfo: any;

  watch(
    () => partitionId.value,
    () => {
      partitionInfo = userStore.getCurrentPartition;
      publishOptions.value = partitionInfo.is_icu === 0 ? options : optionsICU;
      console.log('publishOptions', publishOptions.value);
    },
    { immediate: true },
  );

  watch(
    () => dataSource.value,
    () => {
      if (isUrgent.value) {
        dataSource.value.forEach((v) => {
          if (v.play_status == 1) {
            v.play_status = 2;
          }
        });
      }
    },
    {
      deep: true,
    },
  );

  onMounted(() => {
    getList();
  });
  const [registerAuthModal, { openModal: openCpModal }] = useModal();

  // 注册表格组件
  const [registerTable, { setLoading }] = useTable({
    title: '信息列表',
    dataSource: dataSource,
    columns: listColumns,
    useSearchForm: false,
    customRow: customRow,
    bordered: true,
    clickToRowSelect: false,
    showIndexColumn: true,
    ellipsis: false,
    striped: false,
    indexColumnProps: {
      title: '次序',
    },
    rowKey: 'index',
    resizeHeightOffset: 220,
    actionColumn: isShowAction,
  });

  //拖动
  function customRow(record, index) {
    return {
      props: {
        // draggable: 'true'
      },
      style: {
        cursor: unref(isEditStatus) && record.play_status == 1 ? 'grabbing' : '',
      },
      // dataTip: 'ellipsis',
      class: 'ellipsis',
      title: unref(isEditStatus) && record.play_status == 1 ? '拖动以更改排序' : record.content,
      // 鼠标移入
      onMouseenter: (event) => {
        if (isUrgent.value || !unref(isEditStatus) || record.play_status != 1) {
          return false;
        }
        // 兼容IE
        let ev = event || window.event;
        ev.target.draggable = true; // 让你要拖动的行可以拖动，默认不可以
      },
      // 开始拖拽
      onDragstart: (event) => {
        if (isUrgent.value || !unref(isEditStatus) || record.play_status != 1) {
          return false;
        }
        // 兼容IE
        let ev = event || window.event;
        // 阻止冒泡
        ev.stopPropagation();
        // 得到源目标数据序号
        source = index;
        stopDraggable.value = true;
      },
      // 拖动元素经过的元素
      onDragover: (event) => {
        if (isUrgent.value || !unref(isEditStatus)) {
          return false;
        }
        // 兼容 IE
        let ev = event || window.event;
        // 阻止默认行为
        ev.preventDefault();
      },
      // 鼠标松开
      onDrop: (event) => {
        if (isUrgent.value || !unref(isEditStatus)) {
          return false;
        }
        // 兼容IE
        let ev = event || window.event;
        // 阻止冒泡
        ev.stopPropagation();
        // 得到目标数据序号
        target = index;
        // 这里就是让数据位置互换，让视图更新 你们可以看record，index的输出，看是什么
        [dataSource.value[source], dataSource.value[target]] = [
          dataSource.value[target],
          dataSource.value[source],
        ];
        stopDraggable.value = false;
        !unref(isEditStatus) && confirmEdit();
      },
    };
  }

  //获取列表
  async function getList() {
    let params = {
      partition_id: partitionId.value,
    };
    setLoading(true);
    const res = await getSloganList(params);
    const { data } = res;
    data.forEach((v, index) => {
      Object.assign(v, { index });
    });
    console.log(data);
    dataSource.value = data;
    if (data.length > 0) {
      range.value = data[0].range;
    }

    setLoading(false);
  }

  //发布
  function handleRelease(obj) {
    let release: any = [],
      notList: any = [];
    unref(dataSource).forEach((v) => {
      if (obj.index == v.index) {
        v.play_status = 1;
      }

      if (v.play_status == 1) {
        release.push(v);
      } else {
        notList.push(v);
      }
    });

    dataSource.value = [...release, ...notList];
  }

  //编辑
  function handleEdit(obj) {
    openCpModal(true, { data: obj });
  }

  //删除
  function handleDelete(obj) {
    dataSource.value = unref(dataSource).filter((v) => v.index != obj.index);
    if (dataSource.value.length == 0) range.value = [];
  }

  //取消发布
  function handleClose(obj) {
    let release: any = [],
      notList: any = [];
    unref(dataSource).forEach((v) => {
      if (obj.index == v.index) {
        v.play_status = 0;
      }
      if (v.play_status != 0) {
        release.push(v);
      } else {
        notList.push(v);
      }
    });
    dataSource.value = [...release, ...notList];
  }

  //编辑所有
  function statusEdit() {
    copyList.value = JSON.parse(JSON.stringify(unref(dataSource)));
    copyRange.value = JSON.parse(JSON.stringify(unref(range)));
    isEditStatus.value = true;
    isShowAction.value = {
      title: '操作',
      dataIndex: 'action',
      width: 220,
      slots: { customRender: 'action' },
    };
  }

  // 完成编辑
  async function confirmEdit() {
    // if (range.value.length === 0) {
    //   createMessage.destroy();
    //   createMessage.warning('请勾选发布范围!');
    //   return;
    // }
    let lists = unref(dataSource).map((v, index) => {
      let obj = {
        id: v.id,
        content: v.content,
        play_status: v.play_status,
        play_sort: index + 1,
      };

      return obj;
    });

    const params = {
      partition_id: partitionId.value,
      lists,
      range: range.value,
    };
    const res = await saveSloganList(params);
    if (res) {
      isEditStatus.value = false;
      isShowAction.value = false;
      getList();
      createMessage.success('发布成功!');
    }
  }

  //新建通知提示
  function addNoticeMsg() {
    let index = dataSource.value.length;
    if (index === 9) {
      createMessage.warning('已达最大值，请删除部分标语！');
      return;
    }
    openCpModal(true, { data: {}, index });
  }

  //弹窗操作成功
  function handleSuccess(obj, isEdit) {
    //编辑
    if (isEdit) {
      dataSource.value.forEach((v) => {
        if (v.index == obj.index) {
          v.content = obj.content;
        }
      });
    } else {
      let data = Object.assign(obj, { play_status: 0 });
      dataSource.value.push(data);
    }
    handleRelease(obj);
  }

  function getDeviceName(type: string | number) {
    const arrList = {
      host: '医护主机',
      // guest: '医护分机',
      passageway: '走廊显示屏',
      nurse: '智慧护理屏',
      bbs: '信息看板屏',
      doorway: '病房门口机',
      sickbed: '病床分机',
      switch: '病床分机', //当前地方比较特殊，分机需要发音频管理的值
      sos: '洗手间报警按钮',
      guard: '门禁',
      apk_sickbed: '安卓病床分机',
      apk_passageway: '安卓版走廊屏',

      // 以下是新加的
      icu_sickbed: '探视病床分机',
    };

    return arrList[type] ? arrList[type] : '--';
  }
</script>

<style lang="less">
  .button-action {
    position: absolute;
    bottom: 20px;
    right: 20px;
  }

  .ellipsis > td:nth-child(2) {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .ant-checkbox-group {
    display: flex;
    flex-direction: column;
  }

  .ant-checkbox-group-item {
    padding: 10px 0;
  }

  .tipsSelect {
    display: flex;
    flex-direction: column;
  }

  .tipsSelect > span {
    display: inline-block;
    padding: 13px 0;
  }

  .showTips {
    display: flex;
    flex-direction: column;
  }

  .showTips > div {
    padding: 10px 0;
  }
</style>
