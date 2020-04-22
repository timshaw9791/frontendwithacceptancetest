<template>
  <div class="applicant-select-container">
    <define-input label="搜索" placeholder="警号/姓名" v-model="paginator.search"></define-input>
    <div class="table">
      <define-table :data="list" height="550.0032px" :pageInfo="paginator" 
        :highLightCurrent="true" @changeCurrent="changeCurrent" @changePage="changePage">
        <define-column label="图片" v-slot="{ data }">
          <img :src="data.row.faceInformation" alt="暂无图片">
        </define-column>
        <define-column label="警号" field="policeSign" width="180"></define-column>
        <define-column label="姓名" field="name" width="100"></define-column>
        <define-column label="性别" field="gender" width="100"></define-column>
        <define-column label="机构单位" field="organUnit.name" width="180"></define-column>
        <define-column label="角色" field="position" width="180"></define-column>
        <define-column label="职位" field="role" width="180"></define-column>
        <define-column label="联系方式" field="phone" width="180"></define-column>
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
      selected: {
        name: "王国康",
        policeSign: "000244",
        role: "管理员",
        gender: "男",
        organUnit: {
          name: "温州市局",
          level: "MUNICIPAL",
          upperId: "",
          id: "1",
          createTime: 0,
          updateTime: 0,
          number: "",
        },
        phone: "15886565651",
        fingerprintInformation: "04146f00a5a3880fc77ac9e6cef38663c66a3618f9f386e4078a4beeda8b891d877903e77d4c8757cdbb7a78a9748999c4ca33007692856ac22cf6e7f1c28566c32a38e8f5938455442cfeef4534865545597808591a85e3c2fc03ffe1128000000000000000000000b162",
        fingerId: null,
        faceInformation: "43ff352682fe4869923b86496f3e3884.jpg",
        position: "茶山分局警员",
        idNumber: "322255484595642",
        id: "000002",
        createTime: 0,
        updateTime: 1586921154556,
        number: "",
      },
      paginator: {size: 10, page: 1, totalPages: 0, totalElements: 0, search: ''},
    }
  },
  methods: {
    getUserList() {
      getUser(this.paginator).then(res => {
        this.list = res.content;
        this.paginator.totalPages = res.totalPages;
        this.paginator.totalElements = res.totalElements;
        for(let i in this.list){
          switch (this.list[i].role) {
            case 'ADMIN':
              this.list[i].role="管理员"
              break;
            case 'LEADER':
              this.list[i].role="领导"
              break;
            case 'POLICE':
              this.list[i].role="警员"
              break;
            default:
              break;
          }
        }
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