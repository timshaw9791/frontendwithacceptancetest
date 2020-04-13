<template>
  <div class="bos-card-container">
    <div class="top-tabs">
      <div v-for="(item, i) in label" :key="i" 
        :class="{'tabs':true,'selected':selectedIndex==i}"
        @click="changeTab(i)">{{ item.label }}</div>
    </div>
    <div class="slot-component">
      <slot name="slotHeader"></slot>
    </div>
    <div v-for="(item, i) in label" :key="'slot'+i"  v-show="label[selectedIndex].key == item.key">
      <slot :name="item.key"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'bosTabs',
  data() {
    return {
      selectedIndex: 0
    }
  },
  props: {
    label: {
      type: Array,
      default() {
        return [{
          label: '总清单',
          key: 'total'
        }, {
          label: '明细',
          key: 'detail'
        }]
      }
    }
  },
  methods: {
    changeTab(index) {
      this.selectedIndex = index
    }
  }
}
</script>

<style lang="scss" scoped>
.bos-card-container {
  border: 1px solid black;
  font-size: 16px;
  min-height: 50px;
}
.top-tabs {
  width: 50%;
  min-width: 400px;
  min-height: 50px;
  max-height: 50px;
  float: left;
}
.tabs {
  display: inline-block;
  height: 40px;
  line-height: 40px;
  padding: 0 16px;
  background-color: #EAEAEA;
  border: 1px solid #EAEAEA;
  vertical-align: bottom;
  cursor: pointer;
}
.tabs:hover {
  color: deepskyblue;
}
.slot-component {
  width: 50%;
  min-height: 50px;
  max-height: 50px;
  float: right;
  text-align: right;
}
.selected {
  height: 50px;
  line-height: 50px;
  background-color: white;
}
</style>