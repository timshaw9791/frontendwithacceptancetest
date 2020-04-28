<template>
  <div class="consumable-form-container">
    <my-header :title="$route.meta.title" :haveBlack="false"></my-header>
    <div class="consumable-form-top">
        <base-button size="default" align="right" label="新增预案" @click="dialogShow('add')"></base-button>
    </div>
    <div class="consumable-form-body" >
         <bos-tabs  :option="['contrast']" :layoutRatio="[3,1]" :contrastKey="['slot1', 'slot2']" >
             <define-table  slot="slot1" :pageInfo="paginator" @changePage="changePage" :data="order" height="2.6042rem" 
                            @changeCurrent="changeCurrent">
                <define-column  label="操作"  v-slot="{ data }">
                    <base-button label="编辑" size="mini" @click="dialogShow('edit',data.row)" type="primary"></base-button>
                    <base-button label="删除" size="mini" @click="deleteplan(data.row)" type="primary"></base-button>
                </define-column>
                <define-column label="预案名称" field="name"></define-column>
                <define-column label="预案描述" field="remark"></define-column>
             </define-table>
             <define-table :haveIndex="false"  slot="slot2" :havePage="false" :data="equipArg" height="2.6042rem" >
                <define-column label="装备参数" field="describes" v-slot="{data}">
                    <entity-input v-model="data.row.equipArg" format="{name}({model})" :tableEdit="false" :options="{}"></entity-input>
                </define-column>
             </define-table>
         </bos-tabs>
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
                paginator: {size: 10, page: 1, totalPages: 5, totalElements: 5},
                order: [],
                equipArg:[],
                plan:{
                    name:"",
                    remark:"",
                    equipArgItems:[],
                },
                editflag:false,
            };
        },
        methods: {
            getData(){
                getPlan(this.paginator).then(res=>{
                    this.order = res.content
                    this.paginator.totalPages = res.totalPages;
                    this.paginator.totalElements = res.totalElements;
                })
            },
            deleteplan(data){
                delectPlan(data.id).then(res=>{
                    this.$message.success("删除成功")
                    this.getData()
                }).catch(err=>{
                    this.$message.errow(err.message)
                })
            },
            changePage(page) {
                this.paginator.page = page
                this.getData()
            },
            changeCurrent(current){
                console.log("current",current);
                this.equipArg = current.equipArgItems
            },
            dialogShow(data,item){
                if(data=="add"){
                    this.plan.name="",
                    this.plan.remark="",
                    this.plan.equipArgItems=[]
                    this.editflag=false
                }else if(data == "edit"){
                    console.log("item",item);
                    this.editflag=true
                    this.plan = item
                }
                console.log("this.plan",this.plan);
                this.$router.push({
                    name: 'editplan',
                    params: {type: 'editplan', info: {data:this.plan,edit:this.editflag}}
                })
            },
        },
        created() {
            this.getData()
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
</style>
