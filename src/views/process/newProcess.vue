<template>
  <div class="new-proess-container">
    <my-header title="新建流程" :haveBlack="false"></my-header>
    <div class="new-process-body">
      <define-table :data="list" height="600px" :pageInfo="paginator" @changePage="changePage">
        <define-column label="操作" v-slot="{ data }">
          <i class="iconfont iconjiahao" @click="apply(data.row)"></i>
        </define-column>
        <define-column label="工作流名称" field="name"></define-column>
        <define-column label="部署时间" :filter="(row)=>$filterTime(row.deploymentTime)"></define-column>
      </define-table>
    </div>
    <define-form ref="form">
      <define-input v-model="test" :required="true" slot="form"></define-input>
      <define-input v-model="test" type="Number" slot="form"></define-input>
      <base-select v-model="test" :required="true" slot="form"></base-select>
    </define-form>
    <base-button label="验证" type="simple" @click="testFunc()"></base-button>
  </div>
</template>

<script>
import myHeader from 'components/base/header/header'
import textInput from '@/componentized/textBox/textInput.vue'
import { processDefinitions } from 'api/process'
import bosTabs from '@/componentized/table/bosTabs'
export default {
  name: 'newProcess',
  data() {
    return {
      list: [],
      test: '',
      paginator: {size: 10, page: 1, totalElements: 0, totalPages: 0}
    }
  },
  methods: {
    testFunc() {
      this.$refs.form.validate(valid => {
        if(valid) {
          console.log("验证通过");
        } else {
          console.log("验证失败");
        }
      })
    },
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
    textInput,
    bosTabs
  }
}
</script>

<style scoped>
.new-proess-container {
  font-size: 16px;
}
.new-process-body {
  padding: 0 17px;
}
</style>