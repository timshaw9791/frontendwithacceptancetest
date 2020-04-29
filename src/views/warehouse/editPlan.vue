<template>
  <div class="consumable-form-container">
    <my-header :title="title" :haveBlack="false"></my-header>
    <div class="consumable-form-body" >
        <define-input label="预案名称" v-model="order.name" margin="15px"></define-input>
        <define-input label="预案描述" v-model="order.remark" margin="15px"></define-input>
        <define-table :havePage="false" :data="order.equipArgItems" height="2.6042rem" >
            <define-column label="操作" width="100" v-slot="{ data }">
                <i class="iconfont icontianjialiang" @click="changeRow(true,data)"></i>
                <i class="iconfont iconyichuliang" @click="changeRow(false,data)"></i>
            </define-column>
            <define-column label="装备参数" field="equipArg" v-slot="{data}">
                <entity-input v-model="data.row.equipArg" format="{name}({model})" :options="{detail:'equipArgsSelect'}"></entity-input>
            </define-column>
        </define-table>
        <div class="buttom">
            <base-button label="提交" align="right" size="large" @click="submit"></base-button>
            <base-button label="取消" align="right" size="large" type="danger" @click="cansle"></base-button>
        </div>
    </div>
  </div>
</template>

<script>
    import myHeader from "components/base/header/header";
    import baseButton from "@/componentized/buttonBox/baseButton";
    import entityInput from "@/componentized/entity/entityInput";
    import defineInput from '@/componentized/textBox/defineInput'
    import bosTabs from "@/componentized/table/bosTabs";
    import serviceDialog from "components/base/serviceDialog"
    import { getPlan ,addPlan ,updatePlan ,delectPlan } from "api/plan";
    var _ = require("lodash");
    export default {
        name: "consumable",
        data() {
            return {
                title:"",
                paginator: {size: 10, page: 1, totalPages: 5, totalElements: 5},
                order: {},
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
                if(this.$route.params.info.edit){
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
            if(this.$route.params.info == undefined) {
                this.$message.info("数据丢失，返回应急预案");
                this.$router.push({name: 'warehouse/plan'});
                return
            }
            if(this.$route.params.info.edit){
                this.title = "预案编辑"
            }else{
                this.title = "新增预案"
            }
            this.order = this.$route.params.info.data
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
        },
        components: {
            myHeader,
            baseButton,
            entityInput,
            bosTabs,
            defineInput,
            serviceDialog,
        },
    };
</script>

<style lang="scss" scoped>
    .consumable-form-container {
        font-size: 16px;
    }
    .consumable-form-top {
        padding: 18px 7px;
        border-bottom: 1px solid #ebeef5;
        overflow: hidden;
    }
    .consumable-form-body {
        padding: 0 7px;
        widows: 100%;
    }
    .buttom {
        height: 72px;
        width:100%;
        margin-top: 25px;
    }
</style>
