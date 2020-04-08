<template>
  <div class="div-tmp" :style="'width:'+fixWidth">

  </div>
</template>

<script>
export default {
  name: 'divTmp',
  props: {
    column: {
      type: Number,
      default: 3
    }
  },
  computed: {
    fixWidth() {
      return `calc(${8.33*this.column}% - 20px)`;
    }
  }
}
</script>

<style scoped>
  .div-tmp {
    min-height: 1px;
    max-height: 1px;
    margin: 0 10px;
    display: inline-block;
    box-sizing: border-box;
  }
</style>