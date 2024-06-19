<template>
  <div class="schedule-table" ref="scheduleTableRef">
    <BasicTable @register="registerTable">
      <!-- 自定义 类型column -->
      <template
        v-for="col in [
          'scheduling_type1',
          'scheduling_type2',
          'scheduling_type3',
          'scheduling_type4',
          'scheduling_type5',
          'scheduling_type6',
          'scheduling_type7',
        ]"
        #[col]="{ text, record }"
        :key="col"
      >
        <Select
          v-if="currentEditKey && editableData[record.id] && minusDay < Number(col.substr(-1))"
          allowClear
          placeholder="类型"
          class="w-full"
          v-model:value="editableData[record.id][col]"
          :options="typeOptions"
          @change="
            editableData[record.id].placeholder[Number(col.substr(-1)) - 1] = '默认为排班中管床范围'
          "
          :getPopupContainer="() => scheduleTableRef"
        />
        <template v-else>
          <span :title="text">{{ text }}</span>
        </template>
      </template>
      <!-- 自定义 管床范围column -->
      <template
        v-for="col in [
          'scheduling_hospital_bed_id1',
          'scheduling_hospital_bed_id2',
          'scheduling_hospital_bed_id3',
          'scheduling_hospital_bed_id4',
          'scheduling_hospital_bed_id5',
          'scheduling_hospital_bed_id6',
          'scheduling_hospital_bed_id7',
        ]"
        #[col]="{ text, record }"
        :key="col"
      >
        <TreeSelect
          v-if="currentEditKey && editableData[record.id] && minusDay < Number(col.substr(-1))"
          v-model:value="editableData[record.id][col]"
          :disabled="!editableData[record.id][`scheduling_type${col.substr(-1)}`]"
          :placeholder="editableData[record.id].placeholder[Number(col.substr(-1)) - 1]"
          class="w-full"
          :tree-data="areaOptions"
          tree-checkable
          allow-clear
          :show-checked-strategy="SHOW_CHILD"
          search-placeholder="Please select"
          :replaceFields="{ children: 'children', title: 'name', key: 'key', value: 'key' }"
          @change="
            editableData[record.id].placeholder[Number(col.substr(-1)) - 1] = '默认为排班中管床范围'
          "
          :getPopupContainer="() => scheduleTableRef"
        />

        <template v-else>
          <span :title="text">{{ text }}</span>
        </template>
      </template>
      <!-- 自定义 操作column -->
      <template #action="{ record, column }">
        <TableAction
          :actions="[
            {
              label: '编辑',
              onClick: handleEdit.bind(null, record),
              disabled: (currentEditKey ? currentEditKey !== record.id : false) || minusDay > 7,
              ifShow: () => {
                return currentEditKey != record.id;
              },
            },
            {
              label: '保存',
              onClick: handleSave.bind(null, record, column),
              disabled: minusDay > 7,
              ifShow: () => {
                return currentEditKey == record.id;
              },
            },
            {
              label: '取消',
              popConfirm: {
                title: '是否取消编辑',
                confirm: cancelEditing.bind(null, record, column),
              },
              disabled: minusDay > 7,
              ifShow: () => {
                return currentEditKey == record.id;
              },
            },
          ]"
        />
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts" setup>
  import { ref, watch, nextTick, computed, UnwrapRef, reactive, onMounted, onUnmounted } from 'vue';
  import moment from 'moment';
  import { cloneDeep } from 'lodash-es';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Select, TreeSelect } from 'ant-design-vue';
  import { BasicTable, useTable, BasicColumn, TableAction } from '/@/components/Table';
  import {
    ScheduleListRecord,
    ScheduleListSearch,
    ScheduleTypeRecord,
    RoomManageRecord,
  } from '/@/api/doctors/model/scheduleModel';
  import { getScheduleListApi, setScheduleApi } from '/@/api/doctors/schedule';
  const SHOW_CHILD = TreeSelect.SHOW_CHILD;

  const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  const rowDefaultPlaceholders = new Array(7).fill('').map(() => '点击选择分管床位范围');
  const editableData: UnwrapRef<Record<string, ScheduleListRecord>> = reactive({});
  const currentEditKey = ref('');

  // 用户设置select框的相对定位在哪个元素
  const scheduleTableRef = ref<Nullable<HTMLElement>>(null);

  const { createMessage } = useMessage();
  const [registerTable, { setColumns, reload, getDataSource, scrollTo }] = useTable({
    title: '* 如需要更改排班类型，请进入“系统配置-排班类型”页面更新配置',
    beforeFetch(info) {
      return { params: { ...info, ...props.searchInfo }, isICU: props.isICU };
      // return { params: { ...info }, isICU: props.isICU };
    },
    afterFetch(data) {
      return createTableData(data);
    },
    fetchSetting: {
      pageField: 'page_index',
      sizeField: 'page_size',
      listField: 'data',
      totalField: 'data_sum',
    },
    api: getScheduleListApi,
    columns: [],
    bordered: true,
    canResize: true,
    resizeHeightOffset: 35,
    showIndexColumn: false,
    rowKey: 'id',
    clickToRowSelect: false,
    immediate: false,
    striped: false,
    actionColumn: {
      width: 150,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
    // table的筛选条件、dateSource数据、分页改变时触发
    onChange: () => {
      // 清空原来的编辑记录
      cancelEditing();
      // 滚动到顶部
      scrollTo('top');
    },
  });

  const props = defineProps({
    isICU: {
      type: Boolean,
      default: false,
    },
    searchInfo: {
      type: Object as ScheduleListSearch,
      default: () => {},
    },
    typeOptions: {
      type: [Array] as ScheduleTypeRecord[],
      default: () => [],
    },
    areaOptions: {
      type: [Array] as RoomManageRecord[],
      default: () => [],
    },
    isDetail: {
      type: Boolean,
      default: false,
    },
  });

  // table的父级Columns属性项
  function createParentsColumns(dateVal: string) {
    return new Promise<BasicColumn[]>(async (resolve) => {
      let columns: BasicColumn[] = [
        {
          width: 114,
          title: '姓名',
          dataIndex: 'staff_name',
          fixed: 'left',
        },
      ];
      for (let i = 1; i < 8; i++) {
        let childrenColumns: BasicColumn[] = [
          {
            width: 90,
            title: '类型',
            dataIndex: `schedulingtype_name${i}`,
            slots: { customRender: `scheduling_type${i}` },
          },
          {
            width: 242,
            title: '管床范围',
            dataIndex: `scheduling_hospital_bed_name${i}`,
            slots: { customRender: `scheduling_hospital_bed_id${i}` },
          },
        ];
        let column = {
          title: moment(dateVal).day(i).format('MM-DD') + weekDays[i - 1],
          dataIndex: `week${i}`,
          // 详细显示模式: 显示类型 + 管床范围; 缩略显示模式: 只显示类型;
          children: props.isDetail ? childrenColumns : [childrenColumns[0]],
          width: 332,
        };
        columns.push(column);
      }
      resolve(columns);
    });
  }

  // 将后端返回的数据改成符合vben表格格式的数据
  function createTableData(apiRes: []) {
    return apiRes?.map((schedule) => {
      for (let i = 0; i < schedule.scheduling.length; i++) {
        const temp = schedule.scheduling[i];
        schedule[`scheduling_type${i + 1}`] = temp.list.scheduling_type;
        schedule[`schedulingtype_name${i + 1}`] = temp.list.schedulingtype_name || '无';
        schedule[`scheduling_hospital_bed_id${i + 1}`] = temp.list.scheduling_hospital_bed_id
          ? temp.list.scheduling_hospital_bed_id?.split(',').map((x) => '2-' + x)
          : [];
        schedule[`scheduling_hospital_bed_name${i + 1}`] =
          temp.list.scheduling_hospital_bed_name || '无';

        // 设置table一行7个管床范围的 placeholder 默认值
        schedule.placeholder = [...rowDefaultPlaceholders];
      }
      return schedule;
    });
  }

  // 更新table的columns
  async function setTableColumns() {
    const data = await createParentsColumns(props.searchInfo.startDate);
    await nextTick();
    setColumns(data);
  }

  // 今天 与 当前选中周的周一相差多少天 (如果值为负数, 则说明此周一在今天之后)
  const minusDay = computed(() => moment().diff(moment(props.searchInfo.startDate), 'day'));

  // 准备编辑
  function handleEdit(record: EditRecordRow) {
    currentEditKey.value = record.id;
    editableData[record.id] = cloneDeep(getDataSource().filter((item) => record.id === item.id)[0]);
  }

  function refreshTable() {
    currentEditKey.value = '';
    reload();
  }

  // 取消编辑
  function cancelEditing() {
    delete editableData[currentEditKey.value];
    currentEditKey.value = '';
  }

  // 保存编辑
  async function handleSave(record: EditRecordRow) {
    Object.assign(
      getDataSource().filter((item) => record.id === item.id)[0],
      editableData[record.id],
    );
    delete editableData[record.id];
    // 转换一下数据
    const dateArray = record.scheduling.map((x) => x.date);
    let result = [];
    for (let i = 1; i < 8; i++) {
      const bed_id =
        record[`scheduling_hospital_bed_id${i}`]?.map((x) => x.split('-')[1]).toString() || '';
      result.push({
        staff_id: record.id,
        date: dateArray[i - 1],
        scheduling_type: record[`scheduling_type${i}`] || '',
        bed_id,
      });
    }
    // 提交数据
    const res = await setScheduleApi(
      {
        ...props.searchInfo,
        scheduling: result,
      },
      props.isICU,
    );
    if (res === true) {
      refreshTable();
      createMessage.success('操作成功');
    }
  }

  // 搜索条件变化，刷新列表
  watch(
    () => props.searchInfo,
    (val) => {
      if (!val) return;
      // 清空原来的编辑记录
      cancelEditing();
      // 重置columns
      setTableColumns();
      nextTick(() => {
        reload();
      });
    },
    {
      deep: true,
      immediate: true,
    },
  );

  // 监听缩略显示/详情显示的切换
  watch(
    () => props.isDetail,
    () => {
      setTableColumns();
    },
    {
      immediate: true,
    },
  );
  defineExpose({
    reload,
  });

  onMounted(() => {
    // 页面初始化，将body设置成禁止滚动；因为第10行的select框第一次点击的时候，弹出层会将页面顶高
    document.body.style = 'overflow:hidden!important;';
  });

  onUnmounted(() => {
    // 离开页面时，回复body的样式
    document.body.style = 'overflow:inherit;';
  });
</script>
<style lang="less">
  .schedule-table {
    // height: calc(100% - 124px);
    .medical-basic-title {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.46);
    }

    .ant-table-thead {
      tr:first-child {
        th:first-child {
          background: linear-gradient(136deg, #dae6f5 0%, #f9fbff 100%);
        }
        th:not(:first-child) {
          background-color: #dae6f5;
        }
      }
      tr:nth-child(2) {
        th {
          background-color: #f9fbff;
        }
      }
    }

    .bottom-bar {
      .ant-btn {
        width: 104px;
        height: 32px;
      }
    }

    .ant-select:not(.ant-select-customize-input) .ant-select-selector {
      background-color: #f7f7f7;
    }
  }
</style>
