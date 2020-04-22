<template>
  <div class="bos-card-container" :style="'width:'+width">
    <div class="top-tabs" v-if="tabs">
      <div v-for="(item, i) in label" :key="i" 
        :class="{'tabs':true,'selected':selectedIndex==i}"
        @click="changeTab(i, item)">{{ item.label }}</div>
    </div>
    <div class="slot-component">
      <slot name="slotHeader"></slot>
    </div>
    <div class="bos-card-body" :style="'grid-template-columns:'+gridColumn">
      <div v-for="(item, i) in label" :key="'slot'+i"  v-show="label[selectedIndex].key == item.key" class="slot">
        <slot :name="item.key"></slot>
      </div>
      <div class="contrast-component" v-for="(slotName, j) in contrastKey" :key="j" v-show="contrast">
        <slot :name="slotName"></slot>
        <div class="mask" v-show="contrastMask"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'bosTabs',
  data() {
    return {
      selectedIndex: 0,
      tabs: false,
      contrast: false
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
    },
    width: {
      type: String,
      default: '100%'
    },
    option: {
      type: Array,
      default() {
        return ['tabs']
      }
    },
    contrastKey: {
      type: Array,
      default() {
        return ['contrast']
      }
    },
    contrastMask: {
      type: Boolean,
      default: true
    },
    layoutRatio: {
      type: Array,
      default() {
        return [1,1]
      }
    },
  },
  computed: {
    gridColumn() {
      if(!this.contrast) return '1fr';
      return this.layoutRatio.reduce((pre, cur) => {
        if(!/^\d+(\.\d+)?(fr|px|vw|%|rem)?$/g.test(cur)) {
          console.error("参数："+cur+",格式不正确")
        }
        pre += isNaN(cur)?cur+' ':cur+'fr ';
        return pre;
      }, "");
    }
  },
  methods: {
    changeTab(index, item) {
      this.selectedIndex = index;
      this.$emit('changeTab', Object.assign({index}, item));
    }
  },
  created() {
    this.option.forEach(key => {
      if(['tabs', 'contrast'].includes(key)){
        this[key] = true;
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.bos-card-container {
  font-size: 16px;
  min-height: 50px;
  padding: 0 10px;
}
.bos-card-body {
  width: 100%;
  display: grid;
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
.slot {
  width: auto;
}
.selected {
  height: 50px;
  line-height: 50px;
  background-color: white;
}
.contrast-component {
  position: relative;
  width: auto;
  // box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(244,244,248,0.3);
  pointer-events: none;
  z-index: 999;
}
</style>