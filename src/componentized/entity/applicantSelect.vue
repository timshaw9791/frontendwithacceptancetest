<template>
  <div class="applicant-select-container">
    <define-input label="搜索" placeholder="警号/姓名" v-model="paginator.search"></define-input>
    <div class="table">
      <define-table :data="list" height="550.0032px" :pageInfo="paginator" 
        :highLightCurrent="true" @changeCurrent="changeCurrent" @changePage="changePage">
        <define-column label="警号" field="policeSign"></define-column>
        <define-column label="姓名" field="name"></define-column>
      </define-table>
    </div>
    <div class="footer">
      <base-button label="取消" type="none" @click="cancel"></base-button>
      <base-button label="确定" @click="select"></base-button>
    </div>
  </div>
</template>

<script>
import { getUser } from 'api/user'
export default {
  name: 'applicantSelect',
  data() {
    return {
      list: [],
      selected: '',
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
    cancel() {
      this.$emit('cancel');
    },
    select() {
      this.$emit('select', {data: this.selected, ref: 'applicant'});
    },
    changeCurrent(data) {
      this.selected = data;
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
  }
}
</script>

<style lang="scss" scoped>
  /deep/ .el-table {
    font-size: 18px;
  }
  .table {
    margin-top: 10px;
  }
  .footer {
    text-align: center;
  }
</style>