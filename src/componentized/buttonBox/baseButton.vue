<template>
  <div class="base-button-container" style="'width:'+width+'px;height:'+height+'px'">
    <el-button :type="type" :disabled="disabled">{{ name }}</el-button>
  </div>
</template>

<script>
export default {
  name: "baseButton",
  data() {
    return {

    }
  },
  props: {
    type: {
      type: String,
      default: 'primary'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 64
    },
    height: {
      type: Number,
      default: 40
    },
    name
  }
}
</script>

<style lang="scss" scoped>
  .base-button-container {
    float: left;
    font-size:16px;
  }
</style>