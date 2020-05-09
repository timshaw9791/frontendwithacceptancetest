<template>
  <div class="consumable-form-container">
    <my-header :title="$route.meta.title" :haveBlack="false"></my-header>
    <div class="consumable-form-top">
        <base-button size="default" align="right" label="领补耗材" @click="receiceShow('edit')"></base-button>
        <base-button size="default" align="right" label="新增耗材" @click="receiceShow('add')"></base-button>
    </div>
    <div class="consumable-form-body" >
        <define-table :pageInfo="paginator" @changePage="changePage" :data="order" height="2.6042rem" >
            <define-column label="操作" v-slot="{ data }">
                <base-button label="编辑" size="mini" @click="operating(data)" type="primary"></base-button>
            </define-column>
            <define-column label="耗材名称" field="name"></define-column>
            <define-column label="耗材数量" field="count"></define-column>
            <define-column label="耗材用途" field="describes"></define-column>
        </define-table>
        <service-dialog :title="'编辑耗材'" ref="operating" :button="true" :secondary="false" @confirm="confirm">
            <define-input label="耗材名称" margin="15px 0 0 0" v-model="consumableName" :column="12"></define-input>
            <define-input label="耗材数量" :disabled="true" margin="15px 0 0 0" v-model="consumableCount" :column="12"></define-input>
            <define-input label="耗材用途" margin="15px 0 0 0" v-model="consumableDescribes" :column="12"></define-input>
            <define-input label="备注" margin="15px 0 0 0" v-model="consumableMark" :column="12"></define-input>
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
                consumableName:"",
                consumableCount:"",
                consumableDescribes:"",
                consumableMark:"",
                consumableId:"",
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
            receiceShow(data){
                if(data=="add"){
                    this.$router.push({
                        name: "warehouse/consumableReceive",
                        params: {info: {title: "耗材新增"}}
                    })
                }else if(data == "edit"){
                    this.$router.push({
                        name: "warehouse/consumableReceive",
                        params: {info: {title: "耗材领补"}}
                    })}
            },
            changePage(page) {
                this.paginator.page = page
                this.getData()
            },
            operating(count){
                this.consumableId=count.row.id
                this.consumableName=count.row.name
                this.consumableCount=count.row.count
                this.consumableDescribes=count.row.describes
                this.$refs.operating.show()
            },
            confirm(){
                console.log("编辑");
                let param={
                    name:this.consumableName,
                    describes:this.consumableDescribes,
                    id:this.consumableId
                }
                editConsumable(this.consumableId,param).then(res=>{
                    this.$message.success("编辑成功")
                    this.getData()
                }).catch(err=>{
                    this.$message.error(err.message)
                })
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
