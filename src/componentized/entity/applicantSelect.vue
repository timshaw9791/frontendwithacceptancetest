<template>
  <div class="applicant-select-container">
    <text-input label="搜索" placeholder="警号/姓名" v-model="paginator.search"></text-input>
    <div class="table">
      <el-table :data="list" fit height="2.8646rem" border>
        <el-table-column type="index"></el-table-column>
        <bos-table-column lable="警号" field="name"></bos-table-column>
        <bos-table-column lable="姓名" field="policeSign"></bos-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <base-button label="选择" @click="select(scope.row)" :width="40" :height="25"></base-button>
          </template>
        </el-table-column>
      </el-table>
      <bos-paginator v-if="this.list!=''" :pageInfo="paginator" @bosCurrentPageChanged="changePage"/>
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
      this.$emit('select', data);
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