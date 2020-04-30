<template>
  <div class="define-tree-container">
    <el-tree :data="data" :node-key="nodeKey" :empty-text="placeHolder" :props="options" 
      :default-expand-all="expandAll" :accordion="accordion" :show-checkbox="showCheckBox"
      :check-strictly="checkStrictly" :expand-on-click-node="false" ref="tree"
      @check-change="checkChange" @node-click="nodeClick" :filter-node-method="filterNode"></el-tree>
  </div>
</template>

<script>
export default {
  name: 'defineTree',
  props: {
    value: {
      
    },
    data: {
      type: Array,
      default() {
        return {
          selectedId: '',
          selectedData: ''
        }
      }
    },
    placeHolder: { // 当无数据时显示的文字
      type: String,
      default: '暂无内容'
    },
    options: { // 节点渲染树形配置
      type: Object,
      default() {
        return {
          label: 'label',
          children: 'children'
        }
      }
    },
    search: {
      type: String,
      default: ''
    },
    expandAll: { // 是否默认展开所有节点
      type: Boolean,
      default: true
    },
    accordion: { // 是否同时只能展开一级 手风琴模式
      type: Boolean,
      default: false
    },
    nodeKey: { //每个树节点用来作为唯一标识的属性，整棵树应该是唯一的
      type: String,
      default: 'id'
    },
    showCheckBox: { // 节点是否可选
      type: Boolean,
      default: false
    },
    checkStrictly: { // 开启选择后，是否父子级不关联
      type: Boolean,
      default: true
    }
  },
  methods: {
    checkChange(data, check, self) {
      if(check) {
        this.selectedId = data[this.nodeKey];
        this.$refs.tree.setCheckedKeys([data[this.nodeKey]]);
        this.$emit('input', data);
      } else if(this.selectedId == data[this.nodeKey]) { // 保证至少选中一个
        this.$refs.tree.setCheckedKeys([data[this.nodeKey]]);
      }
    },
    nodeClick(data, node, self) {
      this.$emit('nodeClick', {data, node, self});
    },
    filterNode(value, data, node) {
      return !value||data[this.options.label].includes(value);
    }
  },
  watch: {
    search(val) {
      this.$refs.tree.filter(val);
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-tree {
  .el-tree-node__content {
    height: 30px;
  }
  .el-tree-node__label {
    font-size: 18px;
  }
  .el-tree-node__expand-icon {
    font-size: 35px;
  }
}
</style>