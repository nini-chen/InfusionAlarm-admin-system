<template>
  <div class="bg-white p-4" style="height: calc(100vh - 220px)">
    <BasicTable :pagination="pagination" @register="registerTable">
      <template #tableTitle>
        <span class="text-base font-medium">信息列表</span>
        <span v-if="isUrgent" class="font-medium ml-8 text-red-600"
          >紧急通知发布中，当前状态不支持编辑更改通知提示与病区标语
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

    <div class="mt-4 bg-white pt-4 px-4 flex items-baseline">
      <span class="text-base font-medium">发布范围：</span>
      <span class="text-sm">信息看板屏</span>
      <span class="text-xs text-gray-400 ml-4">病区内全部该类型设备</span>
    </div>

    <DealModal :width="600" @register="registerDealModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { ref, computed, onMounted, unref, watch } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { listColumns } from '../table.data';
  import { Button } from 'ant-design-vue';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import DealModal from './DealModal.vue';
  import { useModal } from '/@/components/Modal';
  import { getNoticeList, saveNoticeList } from '/@/api/publish/publish';
  import { useUserStore } from '/@/store/modules/user';

  const pagination = ref<any>(false);
  let dataSource: any = ref([]);
  let source = 0; // 源目标数据序号
  let target = 0; // 目标数据序号
  let isShowAction: any = ref(false); //是否显示操作栏
  let isEditStatus = ref(false); //是否为编辑状态
  const userStore = useUserStore();

  const isUrgent = computed(() => userStore.getIsUrgentStatus);

  let stopDraggable = ref(false); //是否开始拖拽
  // 当前用户所处的病区的id
  let partitionId = computed(() => userStore.getCurrentPartition.id);

  const copyList: any = ref([]);
  const [registerDealModal, { openModal: openDealModal }] = useModal();

  onMounted(() => {
    getList();
  });

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
    resizeHeightOffset: 200,
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
    const res = await getNoticeList(params);
    const { data } = res;
    data.forEach((v, index) => {
      Object.assign(v, { index });
    });

    dataSource.value = data;
    setLoading(false);
  }

  // 发布
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

  // 编辑
  function handleEdit(obj) {
    openDealModal(true, { data: obj });
  }

  // 删除
  function handleDelete(obj) {
    dataSource.value = unref(dataSource).filter((v) => v.index != obj.index);
  }

  // 取消发布
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

  // 编辑所有
  function statusEdit() {
    copyList.value = JSON.parse(JSON.stringify(unref(dataSource)));
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
    };
    const res = await saveNoticeList(params);
    if (res) {
      isEditStatus.value = false;
      isShowAction.value = false;
      getList();
    }
  }

  // 新建通知提示
  function addNoticeMsg() {
    let index = dataSource.value.length;
    openDealModal(true, { data: {}, index });
  }

  // 弹窗操作成功
  function handleSuccess(obj, isEdit) {
    // 编辑
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
</script>

<style lang="less">
  .ellipsis > td:nth-child(2) {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
