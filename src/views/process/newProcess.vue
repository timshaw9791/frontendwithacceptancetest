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

    <!-- <define-input label="测试" v-model="test2" :required="true" :disabled="false" :column="1"></define-input> -->
    <!-- <bos-tabs :option="['tabs','contrast']" :layoutRatio="[2,1]" :contrastKey="['contrast', 'slot2']">
      <define-input label="上部控件" v-model="test2" slot="slotHeader"></define-input>
      <define-table :data="testList" :havePage='false' slot="total">
        <define-column label="测试列" v-slot="{ data }">
          <text-input v-model="data.row.val" type="Number"></text-input>
        </define-column>
        <define-column label="测试列2" v-slot="{ data }">
          <define-input v-model="data.row.val" type="Number" :tableEdit="edit"></define-input>
        </define-column>
      </define-table>
      <define-table :data="testList2" :havePage="false" slot="contrast">
        <define-column label="序号" columnType="index" width="65"></define-column>
        <define-column label="测试对照列" field="val"></define-column>
      </define-table>
    </bos-tabs> -->
  </div>
</template>

<script>
import myHeader from 'components/base/header/header'
import textInput from '@/componentized/textBox/textInput.vue'
import defineInput from '@/componentized/textBox/defineInput.vue'
import { processDefinitions } from 'api/process'
import bosTabs from '@/componentized/table/bosTabs'
export default {
  name: 'newProcess',
  data() {
    return {
      list: [],
      paginator: {size: 10, page: 1, totalElements: 0, totalPages: 0},
      test: '',
      test2: '123',
      edit: true,
      testList: [{
        val: ''
      }],
      testList2: [{
        val: '',
      }]
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
    textInput,
    defineInput,
    bosTabs
  }
}
</script>

<style scoped>
.new-process-body {
  padding: 0 17px;
}
</style>