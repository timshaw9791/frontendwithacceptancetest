<template>
  <div class="organ-units-container">
    <div class="tree-box">
      <define-tree :data="list" :options="options" v-model="selected" :showCheckBox="true"></define-tree>
    </div>
    <div class="footer">
      <base-button label="取消" type="none" @click="cancel"></base-button>
      <base-button label="确定" :disabled="!!!selected.id" @click="select"></base-button>
    </div>
  </div>
</template>

<script>
import { getAllUnit } from '@/api/basic'
import defineTree from '../../defineTree'
export default {
  name: 'organUnits',
  components: {defineTree},
  data() {
    return {
      list: [],
      selected: {},
      options: {
        label: 'name',
        children: 'lowers'
      }
    }
  },
  methods: {
    getList() {
      getAllUnit().then(res => {
        this.list = [res];
      })
    },
    select() {
      this.$emit('select', {data: this.selected, ref: 'organUnits'});
    },
    cancel() {
      this.$emit('cancel');
    }
  },
  created() {
    this.getList();
  }
}
</script>

<style scoped>
.organ-units-container {
  height: 500px;
}
.tree-box {
  height: 450px;
  overflow-x: hidden;
  overflow-y: auto;
}
.footer {
  margin-top: 3px;
  text-align: center;
}
</style>