<template>
  <div class="chargingRecord-form-container">
    <my-header :title="$route.meta.title" :haveBlack="false"></my-header>
    <div class="chargingRecord-form-body" >
        <define-table  :pageInfo="paginator" @changePage="changePage" :data="order" height="2.6042rem" >
            <define-column label="RFID" field="rfid"></define-column>
            <define-column label="装备序号" field="serial"></define-column>
            <define-column label="装备参数" field="describes" v-slot="{data}">
                <entity-input v-model="data.row" format="{equipName}({equipModel})" :tableEdit="false" :options="{detail:'equipArgsDetail'}"></entity-input>
            </define-column>
            <define-column label="装备位置" field="location" :filter="(row)=>locations(row)"></define-column>
            <define-column label="充电周期" field="chargeCycle"  v-slot="{data}">
                <date-input :tableEdit="false" v-model="data.row.chargeCycle" filter="toDay" placeholder="-"></date-input>
            </define-column>
            <define-column label="充电时长" field="serial" v-slot="{row}">
                <date-input :tableEdit="false" v-model="row.createdTime" filter="toDay" placeholder="-"></date-input>
            </define-column>
            <define-column label="充电开始时间" field="serial"  v-slot="{data}">
                <date-select v-model="data.row.startTime" :disabled="true"  placeholder="-"></date-select>
            </define-column>
        </define-table>
    </div>
  </div>
</template>

<script>
    import myHeader from "components/base/header/header";
    import report_tree from 'components/report/report_tree'
    import baseButton from "@/componentized/buttonBox/baseButton";
    import entityInput from "@/componentized/entity/entityInput";
    import defineInput from '@/componentized/textBox/defineInput'
    import { getchargeRecordList } from "api/charge";
    var _ = require("lodash");
    export default {
        name: "chargingRecord",
        data() {
            return {
                paginator: {size: 10, page: 1, totalPages: 5, totalElements: 5},
                order: [],
            };
        },
        methods: {
            fetchData(){
                getchargeRecordList(this.paginator).then(res=>{
                    this.order = res.content
                    this.paginator.totalPages = res.totalPages;
                    this.paginator.totalElements = res.totalElements;
                })
            },
            changePage(page) {
                this.paginator.page = page
                this.fetchData()
            },
            locations(data){
                return data.frameNumber+'架/'+data.surface+'面/'+data.floor+'层/'+data.section+'节'
            },
            equip(data){
                return data.equipName+'('+data.equipModel+')'
            },
        },
        created() {
            this.fetchData()
        },
        components: {
            myHeader,
            baseButton,
            entityInput,
            defineInput,
            report_tree
        },
        computed:{
            // equipArg(data){
            //     console.log("data",data);
            //     console.log("data.row",data.row);
            //     // return data.row.equipName+'('+data.row.equipModel+')'
            // },
            // time(data){
            //     console.log("data",data);
            //     return data.createdTime
            // },
        }
    };
</script>

<style lang="scss" scoped>
  .chargingRecord-form-container {
    font-size: 16px;
  }
  .chargingRecord-form-top {
    padding: 18px 7px;
    border-bottom: 1px solid #ebeef5;
    overflow: hidden;
  }
  .chargingRecord-form-body {
    padding: 0 7px;
    widows: 100%;
  }
</style>
