<template>
  <div class="new-proess-container">
    <my-header title="新建流程" :haveBlack="false"></my-header>
    <div class="new-process-body">
      <define-table :data="list" height="600px" :pageInfo="paginator" @changePage="changePage">
        <define-column label="序号" columnType="index" width="65"></define-column>
        <define-column label="操作" align="center" v-slot="{ data }">
          <i class="iconfont iconjiahao" @click="apply(data.row)"></i>
        </define-column>
        <define-column label="工作流名称" field="name" align="center"></define-column>
        <define-column label="部署时间" :filter="(row)=>$filterTime(row.deploymentTime)" align="center"></define-column>
      </define-table>
    </div>
    <entity-input label="测试" :options="{search: 'organUnits'}" format="[{name}]"></entity-input>
  </div>
</template>

<script>
import entityInput from '@/componentized/entity/entityInput'
import myHeader from 'components/base/header/header'
import { processDefinitions } from 'api/process'
import defineTable from '@/componentized/entity/defineTable'
import defineColumn from '@/componentized/entity/defineColumn'
export default {
  name: 'newProcess',
  data() {
    return {
      list: [],
      paginator: {size: 10, page: 1, totalElements: 0, totalPages: 0}
    }
  },
  methods: {
    getList() {
      processDefinitions().then(res => {
        this.list = res
      })
    },
    apply(data) {
      switch (data.key) {
        case 'scrap':
          this.$router.push({
            name: 'scrapApply',
            params: {info : data}
          })
          break;
        case 'transfer':
          this.$router.push({
            name: 'transferApply',
            params: {info : data}
          })
          break;
        default:
          break;
      }
    },
    changePage(page) {
      this.paginator.page = page;
    }
  },
  created() {
    this.getList();
  },
  components: {
    myHeader,
    defineColumn,
    defineTable,
    entityInput
  }
}
</script>

<style scoped>
.new-process-body {
  padding: 0 17px;
}
</style>