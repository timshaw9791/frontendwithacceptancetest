<template>
  <div class="equip-params-container">
    <define-input label="搜索" v-model="pageInfo.search" placeholder="装备名称/装备型号"></define-input>
    <div class="table">
      <define-table :data="list" height="560px" @changeCurrent="select" :pageInfo="pageInfo" @changePage="changePage" :highLightCurrent="true">
         <define-column label="装备图片" v-slot="{ data }">
          <img :src="data.row.image" alt="暂无图片">
        </define-column>
        <define-column label="装备名称" field="name"></define-column>
        <define-column label="装备型号" field="model"></define-column>
        <define-column label="保质期(天)" :filter="(row)=>milliToDay(row.shelfLife)"></define-column>
        <define-column label="充电周期(天)" :filter="(row)=>milliToDay(row.chargeCycle)"></define-column>
        <define-column label="保养周期(天)" :filter="(row)=>milliToDay(row.upkeepCycle)"></define-column>
        <define-column label="供应商" field="supplier.name"></define-column>
      </define-table>
    </div>
    <div class="footer">
      <base-button label="取消" type="none" @click="cancel"></base-button>
      <base-button label="确定" @click="selected"></base-button>
    </div>
  </div>
</template>

<script>
import { equipArgsByNameModel } from 'api/storage'
export default {
  name: "equipParams",
  data() {
    return {
      currentSel: '', // 当前选中行数据
      list: [],
      pageInfo: {page: 1, size: 10, totalPages: 1, totalElements: 0, search: ''}
    }
  },
  methods: {
    getList() {
      equipArgsByNameModel(this.pageInfo).then(res => {
        this.list = res.content;
        this.pageInfo.totalPages = res.totalPages;
        this.pageInfo.totalElements = res.totalElements;
      })
    },
    cancel() {
      this.$emit('cancel');
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
    changePage(page) {
      this.pageInfo.page = page;
      this.getList();
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