<template>
  <div class="define-tree-container">
    <el-tree :data="data" :empty-text="placeHolder" :props="prop" :default-expand-all="expandAll" :accordion="accordion"></el-tree>
  </div>
</template>

<script>
export default {
  name: 'defineTree',
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    placeHolder: { // 当无数据时显示的文字
      type: String,
      default: '暂无内容'
    },
    prop: { // 节点渲染树形配置
      type: Object,
      default() {
        return {
          label: 'label',
          children: 'children'
        }
      }
    },
    expandAll: { // 是否默认展开所有节点
      type: Boolean,
      default: true
    },
    accordion: { // 是否同时只能展开一级 手风琴模式
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>