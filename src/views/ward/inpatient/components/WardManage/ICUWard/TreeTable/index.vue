<template>
  <div class="pt-4">
    <BasicTable class="ward-manage-table" @register="register">
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              label: '详情',
              onClick: handleDetail.bind(null, record),
              ifShow: () => record.datatype == 'room',
            },
            {
              label: '编辑',
              onClick: handleEdit.bind(null, record),
              ifShow: () => record.datatype == 'device' || record.datatype == 'room',
            },
            {
              color: 'error',
              label: '删除',
              onClick: handleDelete.bind(null, record),
              ifShow: () => record.datatype == 'room',
            },
            {
              color: 'error',
              label: '解绑',
              onClick: handleUnbind.bind(null, record),
              ifShow: () => record.datatype == 'device',
            },
          ]"
        />
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getBasicColumns } from './table.config';
  // 箭头
  import TreeTableExpandIcon from './ExpandIcon';
  import { ICUWardTreeRoomNode } from '/@/api/ward/model/patientModel';

  const props = defineProps({
    dataSource: { type: [Array] as PropType<ICUWardTreeRoomNode[]>, default: () => [] },
  });

  const emit = defineEmits(['handleDetail', 'handleEdit', 'handleDelete', 'handleUnbind']);

  // table未展开的行的唯一id，即new_id字段 (因为接口tree型数据结构，每一层的id有重复的情况，在前面获取数据后，已经新建了一个新的主键字段new_id, 作为每层唯一值)
  const notExpandeIds = ref<number[]>([]);

  const [register, { setLoading, setTableData, expandAll }] = useTable({
    // 开启树形table
    isTreeTable: true,
    // 自定义箭头图标
    expandIcon: TreeTableExpandIcon(),
    // 展示树形数据时，每层缩进的宽度，以 px 为单位, 默认值是15
    indentSize: 24,
    // 动态设置行的类名，此处配合样式设置展开的行的背景颜色
    rowClassName: (record) => {
      return record?.children?.length > 0 && !notExpandeIds.value.includes(record.new_id)
        ? 'expand-row-active'
        : '';
    },
    // 可展开行点击事件：当收起某一行时，expande: false
    onExpand: (expande, record) => {
      notExpandeIds.value = expande
        ? notExpandeIds.value.filter((idVal) => record.new_id != idVal)
        : [...notExpandeIds.value, record.new_id];
    },
    bordered: false,
    columns: getBasicColumns(),
    dataSource: [],
    striped: false,
    actionColumn: {
      title: '操作',
      dataIndex: 'action',
      width: 200,
      slots: { customRender: 'action' },
      fixed: 'right',
      align: 'left',
    },
  });

  watch(
    () => props.dataSource,
    (val) => {
      // 开启loading
      setLoading(true);
      // 设置table数据
      setTableData(val);

      setTimeout(() => {
        // 展开全部行
        notExpandeIds.value = [];
        expandAll();
        // 关闭loading
        setLoading(false);
      }, 100);
    },
    {
      deep: true,
    },
  );

  function handleDetail(record: Recordable) {
    emit('handleDetail', record);
  }
  function handleEdit(record: Recordable) {
    emit('handleEdit', record);
  }
  function handleDelete(record: Recordable) {
    emit('handleDelete', record);
  }
  function handleUnbind(record: Recordable) {
    emit('handleUnbind', record);
  }
</script>
<style lang="less">
  .ward-manage-table {
    .ant-table-wrapper {
      padding: 0;
      height: 635px;
      overflow: hidden;

      .ant-table-header,
      .ant-table-thead {
        tr th {
          height: 49px;
          padding: 0 8px !important;
          background-color: #f9fbff;
        }
      }

      .ant-table-body {
        height: 580px;
        min-height: 580px;

        tr td {
          height: 49px;
          padding: 0 8px !important;
          border-bottom: none;
          border-top: none;
        }

        .ant-table-row-expand-icon {
          display: none;
        }

        .medical-basic-arrow--active {
          color: #4879fb;
        }
      }

      .ant-table-empty {
        .ant-table-body {
          height: 0;
          min-height: 0;
          // border-bottom: 6px solid #f0f2f5;
        }

        .ant-table-placeholder {
          border-bottom: none;

          .ant-empty-normal {
            min-height: 480px;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
        }
      }
    }

    // 设置展开行的背景颜色
    .expand-row-active {
      background-color: #f7f7f7;
      &.ant-table-row-level-1 .ant-table-cell-fix-left {
        &::before {
          position: absolute;
          left: 0;
          top: 0;
          content: '';
          width: 30px;
          height: 49px;
          background-color: #fff;
          z-index: 2;
        }
      }

      .ant-table-cell-fix-left,
      .ant-table-cell-fix-right {
        background-color: #f7f7f7;
      }
    }

    // 表格每一行hover上去，不变颜色
    .ant-table-thead
      > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)
      > td,
    .ant-table-tbody
      > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)
      > td,
    .ant-table-thead > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td,
    .ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
      background: transparent;
    }
  }
</style>
