<template>
  <div class="applicant-select-container">
    <define-input label="搜索" placeholder="警号/姓名" v-model="paginator.search"></define-input>
    <div class="table">
      <define-table :data="list" height="550.0032px" :pageInfo="paginator" 
        :highLightCurrent="true" @changeCurrent="changeCurrent" @changePage="changePage">
        <define-column label="图片" v-slot="{ data }">
          <img :src="imgsrc(data.row)" style="height:90px;width:125px" alt="暂无图片">
        </define-column>
        <define-column label="警号" field="policeSign" width="180"></define-column>
        <define-column label="姓名" field="name" width="100"></define-column>
        <define-column label="性别" field="gender" width="100"></define-column>
        <define-column label="机构单位" field="organUnitName" width="180"></define-column>
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
import { baseURL } from 'api/config'
import { jsqlPage } from 'api/basic'

export default {
  name: 'applicantSelect',
  data() {
    return {
      list: [],
      selected:{},
      params: {
        pageInfo: {
          direction: "ASC",
          page: 1
        },
        returnType: "ARRAY",
        jpql:
          "select u from User u where u.name like ?1 or u.policeSign like ?2 ",
        params: ["%%","%%"]
      },
      paginator: {size: 10, page: 1, totalPages: 0, totalElements: 0, search: ''},
    }
  },
  methods: {
    getUserList() {
      jsqlPage(this.params).then(res => {
        console.log(res);
        this.list = this._.flatten(res.content);
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
    imgsrc(data){
        return baseURL+'/images/'+data.faceInformation
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
      this.selected = data.current;
    }
  },
  watch: {
    'paginator.search': {
      handler(newval) {
        if(newval!=''){
           this.params.params[0]=`%${newval}%`
           this.params.params[1]=`%${newval}%`
        }else{
          this.params.params=["%%","%%"]
        }
       
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