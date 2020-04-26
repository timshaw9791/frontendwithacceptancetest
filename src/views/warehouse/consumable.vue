<template>
  <div class="consumable-form-container">
    <my-header :title="$route.meta.title" :haveBlack="false"></my-header>
    <div class="consumable-form-top">
        <base-button size="default" align="right" label="新增耗材" @click="operating('add')"></base-button>
    </div>
    <div class="consumable-form-body" >
        <define-table :pageInfo="paginator" @changePage="changePage" :data="order" height="2.6042rem" >
            <define-column label="操作" field="rfid"  v-slot="{ data }">
                <base-button label="领取" size="mini" @click="operating('receive',data)" type="primary"></base-button>
                <base-button label="编辑" size="mini" @click="operating('edit',data)" type="primary"></base-button>
                <base-button label="补充" size="mini" @click="operating('supplement',data)" type="primary"></base-button>
            </define-column>
            <define-column label="耗材名称" field="name"></define-column>
            <define-column label="耗材数量" field="describes"></define-column>
            <define-column label="耗材用途" field="count"></define-column>
        </define-table>
        <service-dialog :title="title+'耗材'" ref="operating" :button="true" :secondary="false" @confirm="confirm">
            <define-input label="耗材名称" v-if="name" margin="15px 0 0 0" v-model="consumableName" :column="12"></define-input>
            <define-input label="耗材数量" :disabled="disable" margin="15px 0 0 0" v-model="consumableCount" :column="12"></define-input>
            <define-input label="耗材用途" v-if="describes" margin="15px 0 0 0" v-model="consumableDescribes" :column="12"></define-input>
            <define-input label="备注" v-if="remark" margin="15px 0 0 0" v-model="consumableMark" :column="12"></define-input>
        </service-dialog>
    </div>
  </div>
</template>

<script>
    import myHeader from "components/base/header/header";
    import baseButton from "@/componentized/buttonBox/baseButton";
    import entityInput from "@/componentized/entity/entityInput";
    import defineInput from '@/componentized/textBox/defineInput'
    import dateSelect from '@/componentized/textBox/dateSelect.vue'
    import bosTabs from "@/componentized/table/bosTabs";
    import request from "common/js/request";
    import serviceDialog from "components/base/serviceDialog"
    import { getConsumableList ,addConsumable ,receiveConsumable ,supplementConsumable ,editConsumable} from "api/consumable";
    var _ = require("lodash");
    export default {
        name: "consumable",
        data() {
            return {
                paginator: {size: 10, page: 1, totalPages: 5, totalElements: 5},
                order: [],
                title:"",
                consumableName:"",
                consumableCount:"",
                consumableDescribes:"",
                consumableMark:"",
                consumableId:"",
                remark:false,//备注显示
                name:true,//耗材名称显示
                describes:true,//耗材描述显示
                disable:true//耗材数量是否可编辑
            };
        },
        methods: {
            getData(){
                getConsumableList(this.paginator).then(res=>{
                    this.order = res.content
                    this.paginator.totalElements = res.totalElements;
                    this.paginator.totalPages = res.totalPages;
                }).catch(err=>{
                    this.$message.error(err.message)
                })
            },
            changePage(page) {
                this.paginator.page = page
                this.getData()
            },
            operating(data,count){
                this.consumableName=""
                this.consumableCount=""
                this.consumableDescribes=""
                this.consumableMark=""
                this.consumableId=""
                if(data == 'add'){
                    this.title = "新增"
                    this.remark=false
                    this.name=true
                    this.describes=true
                    this.disable=false
                } else if(data == 'receive'){
                    this.title = "领取"
                    this.remark=true
                    this.name=false
                    this.describes=false
                    this.consumableId=count.row.id
                    this.disable=false
                } else if(data == 'edit'){
                    this.remark=false
                    this.name=true
                    this.describes=true
                    this.disable=true
                    this.title = "编辑"
                    this.consumableId=count.row.id
                    this.consumableName=count.row.name
                    this.consumableCount=count.row.count
                    this.consumableDescribes=count.row.describes
                } else if(data == 'supplement'){
                    this.title = "补充"
                    this.consumableId=count.row.id
                    this.remark=false
                    this.name=false
                    this.describes=false
                    this.disable=false
                }
                this.$refs.operating.show()
            },
            confirm(){
                if(this.title == "新增"){
                    console.log("新增");
                    let param={
                        name:this.consumableName,
                        describes:this.consumableDescribes,
                        count:this.consumableCount
                    }
                    addConsumable(param).then(res=>{
                        this.$message.success("新增成功")
                        this.getData()
                    }).catch(err=>{
                        this.$message.error(err.message)
                    })
                }else if(this.title == "编辑"){
                    console.log("编辑");
                }else if(this.title == "补充"){
                    console.log("补充");
                }else if(this.title == "领取"){
                    console.log("领取");
                    let param={
                        mark:this.consumableMark,
                        count:this.consumableCount
                    }
                    receiveConsumable(this.consumableId,param).then(res=>{
                        this.$message.success("领取成功")
                        this.getData()
                    }).catch(err=>{
                        this.$message.error(err.message)
                    })
                }
                this.$refs.operating.hide()
            }
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
            dateSelect,
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
