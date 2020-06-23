<template>
  <view-container>
      <div class="editPlan-body" >
          <define-input label="预案名称" v-model="order.name" margin="15px"></define-input>
          <define-input label="预案描述" v-model="order.remark" margin="15px"></define-input>
          <define-table :havePage="false" :data="order.equipArgItems" height="3.6042rem" >
              <define-column label="操作" width="100" v-slot="{ data }">
                  <i class="iconfont icontianjia" @click="changeRow(true,data)"></i>
                  <i class="iconfont iconyichu" @click="changeRow(false,data)"></i>
              </define-column>
              <define-column label="装备参数" field="equipArg" v-slot="{data}">
                  <entity-input v-model="data.row.equipArg" format="{name}({model})" :options="{search:'equipArgsSelect'}"></entity-input>
              </define-column>
          </define-table>
          <div class="buttom">
              <base-button label="提交" align="right" @click="submit"></base-button>
              <base-button label="取消" align="right" type="danger" @click="cansle"></base-button>
          </div>
      </div>
  </view-container>
</template>

<script>
    import baseButton from "@/componentized/buttonBox/baseButton";
    import entityInput from "@/componentized/entity/entityInput";
    import defineInput from '@/componentized/textBox/defineInput'
    import bosTabs from "@/componentized/table/bosTabs";
    import serviceDialog from "components/base/serviceDialog"
    import { getBosEntity } from "api/basic";
    import { getPlan ,addPlan ,updatePlan ,delectPlan } from "api/plan";
    var _ = require("lodash");
    export default {
        name: "editPlan",
        data() {
            return {
                title:"",
                paginator: {size: 10, page: 1, totalPages: 5, totalElements: 5},
                order: {
                    equipArgItems:[]
                },
                equipArg:[],
                planName:"",
                planRemark:"",
            };
        },
        methods: {
            changeCurrent(current){
                this.equipArgItems = current.equipArgItems
            },
            cansle(){
                this.$router.go(-1)
            },
            submit(){
                this.order.equipArgItems=_.flatten(this.order.equipArgItems)
                let temp = JSON.parse(JSON.stringify(this.order))
                temp.equipArgItems = []
                _.map(this.order.equipArgItems,item=>{
                    if(item.equipArg){
                        temp.equipArgItems.push({equipArg:item.equipArg})
                    }
                })
                if(this.$route.query.info.edit){
                    updatePlan(temp.id,temp).then(res=>{
                        this.$message.success("编辑成功")
                        this.$router.go(-1)
                    })
                }else{
                    addPlan(temp).then(res=>{
                        this.$message.success("新增成功")
                        this.$router.go(-1)
                    })
                }
            },
            fetchData(){
                getBosEntity(this.$route.query.info.data).then(res=>{
                    this.order = res
                    if(this.order.equipArgItems.length==0){
                        this.order.equipArgItems.push(
                            {name:"",id:"",model:""},
                            {name:"",id:"",model:""},
                            {name:"",id:"",model:""},
                            {name:"",id:"",model:""},
                            {name:"",id:"",model:""},
                            {name:"",id:"",model:""},
                            {name:"",id:"",model:""},
                            {name:"",id:"",model:""},
                            {name:"",id:"",model:""},
                            {name:"",id:"",model:""},
                            {name:"",id:"",model:""},
                        )
                    }
                })
            },
            changeRow(state, data) { // 总清单删除
                let temp = JSON.parse(JSON.stringify(this.order.equipArgItems));
				if(state) {
					temp.splice(data.$index+1, 0, {name:"",id:"",model:""});
				} else if(this.order.equipArgItems.length>1) {
					temp.splice(data.$index, 1); 
				} else {
                    temp = [{name:"",id:"",model:""}]
                }
				this.order.equipArgItems = temp;
            },
        },
        created() {
            if(this.$route.query.info.edit){
                this.fetchData()
            }else{
                this.order.equipArgItems=[]
                this.order.equipArgItems.push(
                    {name:"",id:"",model:""},{name:"",id:"",model:""},
                    {name:"",id:"",model:""},{name:"",id:"",model:""},
                    {name:"",id:"",model:""},{name:"",id:"",model:""},
                    {name:"",id:"",model:""},{name:"",id:"",model:""},
                    {name:"",id:"",model:""},{name:"",id:"",model:""},
                    {name:"",id:"",model:""},{name:"",id:"",model:""}
                )
            }
        },
        components: {
            baseButton,
            entityInput,
            bosTabs,
            defineInput,
            serviceDialog,
        },
    };
</script>

<style lang="scss" scoped>
    .editPlan-container {
        font-size: 16px;
    }
    .editPlan-top {
        padding: 18px 7px;
        border-bottom: 1px solid #ebeef5;
        overflow: hidden;
    }
    .editPlan-body {
        padding: 0 7px;
        widows: 100%;
    }
    .buttom {
        height: 72px;
        width:100%;
        margin-top: 25px;
    }
    .editPlan-header{
        width: 100%;
        padding-left: 18px;
        padding-right: 35px;
        height: 57px;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: justify;
        -ms-flex-pack: justify;
        justify-content: space-between;
        color: rgba(112,112,112,1);
        border-bottom: 1px solid rgba(112,112,112, 0.13);
    }
</style>
