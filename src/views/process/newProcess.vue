<template>
  <div class="new-proess-container">
    <my-header title="新建流程" :haveBlack="false"></my-header>
    <div class="new-process-body">
      <el-table :data="list" fit height="600px">
        <el-table-column label="序号" type="index" width="100px" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <i class="iconfont iconjiahao" @click="apply(scope.row)"></i>
          </template>
        </el-table-column>
        <bos-table-column lable="工作流名称" field="name" align="center"></bos-table-column>
        <bos-table-column lable="部署时间" field="time" align="center"></bos-table-column>
      </el-table>
      <bos-paginator v-if="this.list!=''" :pageInfo="paginator" @bosCurrentPageChanged="changePage"/>
    </div>
  </div>
</template>

<script>
import entityInput from '@/componentized/entity/entityInput'
import myHeader from 'components/base/header/header'
import { processDefinitions } from 'api/process'
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
      this.$router.push({
        name: 'processApply',
        params: {type: 'apply', info: data}
      })
    },
    changePage(page) {
      this.paginator.page = page;
    }
  },
  created() {
    this.getList();
  },
  components: {
    myHeader
  }
}
</script>

<style scoped>

</style>