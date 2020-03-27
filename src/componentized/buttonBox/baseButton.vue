<template>
  <div class="base-button-container" :style="'width:'+width+'px;height:'+height+'px'">
    <el-button :type="type" :disabled="disabled" @click="emitOut" :style="'width:'+width+'px;padding:0;height:'+height+'px;font-size:'+fontSize+'px'">{{ name }}</el-button>
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
    fontSize: {
      type: Number,
      default: 16
    },
    name
  },
  methods: {
    emitOut() {
      this.$emit('inClick');
    }
  }
}
</script>

<style lang="scss" scoped>
  .base-button-container {
    float: left;
    font-size:16px;
  }
</style>