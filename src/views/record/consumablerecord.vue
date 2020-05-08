<template>
  <div class="consumablerecord-form-container">
    <my-header :title="$route.meta.title" :haveBlack="false"></my-header>
    <div class="consumablerecord-form-body" >
        <define-table  :pageInfo="paginator" @changePage="changePage" :data="order" height="2.6042rem" >
            <define-column label="操作" v-slot="{data}">
                <base-button label="详情" @click="click(data.row)"></base-button>
            </define-column>
            <define-column label="单号" field="rfid"></define-column>
            <define-column label="耗材名称" field="name"></define-column>
            <define-column label="耗材数量" field="count"></define-column>
            <define-column label="类型" field="category"></define-column>
            <define-column label="操作人员" field="operatorInfo.operator"></define-column>
            <define-column label="操作时间" v-slot="{data}">
                <date-select v-model="data.row.createTime"></date-select>
            </define-column>
        </define-table>
    </div>
  </div>
</template>

<script>
    import myHeader from "components/base/header/header";
    import baseButton from "@/componentized/buttonBox/baseButton";
    import { consumableRecordList } from "api/consumable";
    import dateSelect from '@/componentized/textBox/dateSelect.vue'
    var _ = require("lodash");
    export default {
        name: "consumablerecord",
        data() {
            return {
                paginator: {size: 10, page: 1, totalPages: 5, totalElements: 5},
                order: [],
            };
        },
        methods: {
            fetchData(){
                consumableRecordList(this.paginator).then(res=>{
                    this.order = res.content
                    this.paginator.totalPages = res.totalPages;
                    this.paginator.totalElements = res.totalElements;
                    this.order.forEach(item=>{
                        if(item.category==1){
                            item.category="领取单"
                        }else if(item.category==2){
                            item.category="补充单"
                        }
                    })
                })
            },
            changePage(page) {
                this.paginator.page = page
                this.fetchData()
            },
            click(data){
                console.log("data",data);
            }
        },
        created() {
            this.fetchData()
        },
        components: {
            myHeader,
            baseButton,
            dateSelect,
        },
    };
</script>

<style lang="scss" scoped>
  .consumablerecord-form-container {
    font-size: 16px;
  }
  .consumablerecord-form-top {
    padding: 18px 7px;
    border-bottom: 1px solid #ebeef5;
    overflow: hidden;
  }
  .consumablerecord-form-body {
    padding: 0 7px;
    widows: 100%;
  }
</style>
