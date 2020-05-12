<template>
  <div class="chargingRecord-form-container">
    <div class="chargingRecord-header">
        <span style="font-size: 20px;">{{$route.meta.title}}</span>
    </div>
    <div class="chargingRecord-form-body" >
        <define-table  :pageInfo="paginator" @changePage="changePage" :data="order" height="3.6042rem" >
            <define-column label="RFID" field="rfid"></define-column>
            <define-column label="装备序号" field="serial"></define-column>
            <define-column label="装备参数" field="equipName(equipModel)" :filter="(row)=>equip(row)"></define-column>
            <define-column label="装备位置" field="location" :filter="(row)=>locations(row)"></define-column>
            <define-column label="充电周期" field="chargeCycle"  v-slot="{data}">
                <date-input :tableEdit="false" v-model="data.row.chargeCycle" filter="toDay"></date-input>
            </define-column>
            <define-column label="充电时长" field="serial" v-slot="{data}">
                <date-input :tableEdit="false" v-model="data.row.startTime" :validate="(row) => time(row, data.row.createTime)"></date-input>
            </define-column>
            <define-column label="充电开始时间" field="serial"  v-slot="{data}">
                <date-select v-model="data.row.startTime" :disabled="true"></date-select>
            </define-column>
        </define-table>
    </div>
  </div>
</template>

<script>
    import baseButton from "@/componentized/buttonBox/baseButton";
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
            time(data, data2){
                let timelone = parseInt(data2)-parseInt(data)
                timelone = Math.floor(timelone/1000/3600)
                if(timelone>=24){
                    timelone = Math.floor(timelone/24)+"天"
                }else{
                    timelone = timelone + "时"
                }
                return timelone
            },
        },
        created() {
            this.fetchData()
        },
        components: {
            baseButton,
            defineInput
        },
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
    .chargingRecord-header{
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
