<template>
  <div class="applicant-select-container">
    <text-input label="搜索" placeholder="警号/姓名" v-model="paginator.search"></text-input>
    <div class="table">
      <define-table :data="list" height="2.8646rem" :pageInfo="paginator" @changePage="changePage">
        <define-column label="序号" columnType="index" width="65"></define-column>
        <define-column label="警号" field="policeSign"></define-column>
        <define-column label="姓名" field="name"></define-column>
        <define-column label="操作" v-slot="{ data }">
          <base-button label="选择" @click="select(data.row)" :width="40" :height="25"></base-button>
        </define-column>
      </define-table>
    </div>
  </div>
</template>

<script>
import textInput from '../textBox/textInput'
import baseButton from '../buttonBox/baseButton'
import { getUser } from 'api/user'
export default {
  name: 'applicantSelect',
  data() {
    return {
      list: [],
      paginator: {size: 10, page: 1, totalPages: 0, totalElements: 0, search: ''},
    }
  },
  methods: {
    getUserList() {
      getUser(this.paginator).then(res => {
        this.list = res.content;
        this.paginator.totalPages = res.totalPages;
        this.paginator.totalElements = res.totalElements;
      })
    },
    changePage(page) {
      this.paginator.page = page;
      this.getUserList();
    },
    select(data) {
      this.$emit('select', {data, ref: 'applicant'});
    }
  },
  watch: {
    'paginator.search': {
      handler() {
        this.getUserList();
      }
    }
  },
  created() {
    this.getUserList();
  },
  components: {
    textInput,
    baseButton
  },
}
</script>

<style lang="scss" scoped>
  /deep/ .el-table {
    font-size: 18px;
  }
  .table {
    margin-top: 10px;
  }
</style>