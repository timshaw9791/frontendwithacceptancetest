<template>
  <div class="equip-params-container">
    <text-input label="搜索" v-model="search" placeholder="装备名称/装备型号" :column="3"></text-input>
    <div class="table">
      <el-table :data="list" fit height="2.8646rem" @current-change="select" highlight-current-row border>
        <el-table-column label="序号" type="index" width="65" align="center"></el-table-column>
        <define-column label="装备图片" v-slot="{ data }">
          <img :src="data.row.image" alt="加载失败">
        </define-column>
        <define-column label="装备名称" field="name"></define-column>
        <define-column label="装备型号" field="model"></define-column>
        <define-column label="保质期(天)" :filter="(row)=>milliToDay(row.shelfLife)"></define-column>
        <define-column label="充电周期(天)" :filter="(row)=>milliToDay(row.chargeCycle)"></define-column>
        <define-column label="保养周期(天)" :filter="(row)=>milliToDay(row.upkeepCycle)"></define-column>
        <define-column label="供应商" field="supplier.name"></define-column>
      </el-table>
    </div>
    <div class="footer">
      <base-button label="确定" @click="selected"></base-button>
    </div>
  </div>
</template>

<script>
import textInput from '../textBox/textInput'
import baseButton from '../buttonBox/baseButton'
import defineColumn from './defineColumn'
import { equipArgsByNameModel } from 'api/storage'
export default {
  name: "equipParams",
  data() {
    return {
      search: '',
      currentSel: '', // 当前选中行数据
      list: []
    }
  },
  methods: {
    getList() {
      equipArgsByNameModel({search: this.search}).then(res => {
        this.list = res.content;
      })
    },
    select(current) {
      this.currentSel = current;
    },
    selected() {
      if(!this.currentSel) {
        this.$message.warning("请选择装备参数");
      } else {
        this.$emit('select', {data: this.currentSel, ref: 'equipParam'});
      }
    },
    milliToDay(data) {
      let date = JSON.parse(JSON.stringify(data));
      let day = Math.round(date / 24 / 60 / 60 / 1000);
      if(day<1){
          return day=1+'天';
      }else {
          return day+'天'
      }
    },
  },
  watch: {
    search: {
      handler() {
        this.getList();
      }
    }
  },
  created() {
    this.getList();
  },
  components: {
    textInput,
    baseButton,
    defineColumn
  }
}
</script>

<style scoped>
  .table {
    margin: 10px;
  }
  .footer {
    text-align: center;
  }
</style>