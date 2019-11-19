<template>
  <div class="p-s-list-box">
    <!-- <div v-for="item in list">
      <div @click="clickPersonnel(item)">
        <p_template :item="item"></p_template>
      </div>
    </div>
    <div class="paginator-box">
      <bos-paginator :pageInfo="paginator" @bosCurrentPageChanged="changePage"></bos-paginator>
    </div> -->
    <field-table :list="list" :labelList="labelList" @clickTableCloum="clickPersonnel" :showEnter="showEnter"
                  :tableAction="tableAction"  :pageInfo="paginator" @tableCurrentPageChanged="changePage"  style="width: 100%">
    </field-table>
    <servicedialog title="提示" ref="dialog1" @confirm="delectPersonnel">
        <div class="_dialogDiv">
            您确定要删除此条人员信息吗？
        </div>
    </servicedialog>
  </div>
</template>

<script>
import p_template from "./personnelTemplate";
import { getUserList, delectUser } from "api/personnel";
import servicedialog from 'components/base/serviceDialog'
import { formRulesMixin } from "field/common/mixinTableRest";
export default {
  name: "personnelLsit",
  components: {
    p_template,
    servicedialog
  },
  mixins: [formRulesMixin],
  data() {
    return {
      param: this.personnel.table,
      partialPiginator: { totalPages: 10, totalElements: 10 }, //默认值
      nameLike: "",
      list: [],
      tableAction:{
        label:'操作',
        button:[{name:'查看',type:'primary'},{name:'删除',type:'primary'}]
      },
      labelList: [
        {lable: '姓名', field: 'name', sort: false},
        {lable: '性别', field: 'gender', sort: false},
        {lable: '角色', field: 'role', sort: false},
        {lable: '职位', field: 'position', sort: false},
        {lable: '警号', field: 'policeSign', sort: false},
      ],
      result:{},
      delectId:'',
    };
  },
  props: {
    personnel: {
      type: Object
    },
    showEnter:{
      type:Boolean,
      default:false
    }
  },
  watch: {
    personnel: {
      handler(newVal) {
        this.getUsersList();
      },
      deep: true
    },
    showEnter(newValue, oldValue) {
        console.log(newValue)
        this.list=[]
        this.result.forEach(item => {
          if (item.role.roleDescribe != "超级管理员") {
            if(this.showEnter){
              if(item.enterHouse == true){
                this.list.push(item);
              }
            }else{
              this.list.push(item);
            }
          }
        });
    }
  },
  computed: {
    paginator() {
      //获取分页信息
      return Object.assign({}, this.partialPiginator, this.param.paginator);
    }
  },
  methods: {
    clickPersonnel(data) {
      console.log("data")
      console.log(data)
      if(data.name == "查看"){
        this.$emit("clickPersonnel", data);
      }else if(data.name == "删除"){
        // this.$emit("clickPersonnel", data);
        console.log("shanchu")
        this.delectId = data.row.id
        this.$refs.dialog1.show();
        console.log(this.delectId)
      }
    },
    getUsersList() {
      let data = Object.assign(
        {},
        this.personnel.table.paginator,
        this.personnel.table.query
      );
      getUserList(data).then(res => {
        this.result = JSON.parse(JSON.stringify(res.data.content));
        let arr = [];
        this.result.forEach(item => {
          if(item.role=="ADMIN"){
            item.role="管理员"
          }else if(item.role=="POLICE"){
            item.role="警员"
          }else if(item.role=="LEADER"){
            item.role="领导"
          }
          if (item.role != "超级管理员") {
            if(this.showEnter){
              if(item.enterHouse == true){
                arr.push(item);
              }
            }else{
              arr.push(item);
            }
          }
        });
        this.partialPiginator.totalElements = res.data.totalElements
            this.partialPiginator.totalPages = res.data.totalPages
        this.list = arr;
      });
      console.log("this.list")
      console.log(this.list)
    },
    delectPersonnel(){
      delectUser(this.delectId).then(res => {
        console.log(111)
        this.$refs.dialog1.hide();
        this.$message.success('删除成功');
        this.getUsersList();
      }).catch(err => {
        this.$message.error(err.message);
      })
      
    }
  },
  created() {
    this.getUsersList();
  }
};
</script>

<style scoped>
.p-s-list-box {
  width: 100%;
  font-size: 16px;
  color: #707070;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding-top: 16px;
  padding-bottom: 16px;
  padding-left: 10px;
}
.p-s-list-box .paginator-box {
  width: 100%;
}
</style>