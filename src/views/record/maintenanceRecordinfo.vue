<template>
    <div class="opening-box" v-if="!show">
        <div class="action-bar">
            <div>
                {{this.$filterTime(parseInt(this.infolist.createTime))}}的保养装备详情
            </div>
        </div>
        <div class="maintenance_body">
            <div  class="maintenance_body_table_box">
                <el-table :data="tableList" class="maintenance_table">
                    <bos-table-column lable="装备名称" field="equipInfo.equipName" align="center"
                    ></bos-table-column>
                    <bos-table-column lable="装备型号" field="equipInfo.model" align="center"
                    ></bos-table-column>
                    <bos-table-column lable="供应商" field="supplierInfo.supplierName" align="center"
                    ></bos-table-column>
                    <bos-table-column lable="联系人" field="supplierInfo.person" align="center"
                    ></bos-table-column>
                    <bos-table-column lable="联系方式" field="supplierInfo.phone" align="center"
                    ></bos-table-column>
                    <bos-table-column lable="保养周期" field="equipInfo.duration"
                        :filter="(row)=>milliToDay(row.equipInfo.duration)"
                        align="center"
                    ></bos-table-column>
                    <bos-table-column lable="数量" field="count"  align="center"
                    ></bos-table-column>
                    <el-table-column type="expand" style="padding:5px">
                        <template slot-scope="props">
                            <div class="fold_box">
                                <div class="fold_title">
                                    <div class="fold_title_item">装备位置</div>
                                    <div class="fold_title_item">数量</div>
                                </div>
                                <div class="fold_body">
                                    <div class="fold_item"
                                            v-for="(item,index) in props.row.euqioList"
                                            :style="index==0?'padding-left: 0.038rem;':''">
                                        <div class="fold_body_item" v-text="surface(item)"></div>
                                        <div class="fold_body_item"> {{item.count}}</div>
                                    </div>
                                </div>
                                <div class="fold-line"></div>
                            </div>
                            
                        </template>
                    </el-table-column>
                </el-table>
            </div>

        </div>
        
    </div>
</template>
<script>
    import myHeader from 'components/base/header/header'
    import {findbyrfidandsupplierandequiplike} from "api/equiprecord"
    import {transformMixin} from "common/js/transformMixin";
    export default {
        name: "maintenanceRecordinfo",
        components:{
            myHeader,
        },
        props:{
            infolist:{
                type:Object,
            },
            show:{
                type:Boolean,
                default:false,
            },
        },
        mixins: [transformMixin],
        data(){
            return{
                table: {
                    search:'',
                },
                form:{},
                time:'',
                list:[],
                tableList:[]
            }
        },
        methods:{

        },
        watch:{
            'show':{
                handler(){
                    this.list =JSON.parse(JSON.stringify(this.infolist.recordDetailSet))
                    console.log("list",this.list)
                    let fir=[{
                        equipInfo:{
                            equipName:'',
                            model:'',
                            duration:''
                        },
                        supplierInfo:{
                            person:'',
                            supplierName:'',
                            phone:''
                        },
                        euqioList:[{
                            floor:'',
                            number:'',
                            section:'',
                            surface:'',
                            count:0
                        }],
                        count:0
                    }]
                    for(let i in this.list){
                        console.log("this.list[i]",this.list[i].equipInfo.floor)
                        if(i==0){
                            fir[i].equipInfo.equipName=this.list[i].equipInfo.equipName
                            fir[i].equipInfo.model=this.list[i].equipInfo.model
                            fir[i].equipInfo.duration=this.list[i].equipInfo.duration
                            fir[i].supplierInfo.person=this.list[i].supplierInfo.person
                            fir[i].supplierInfo.phone=this.list[i].supplierInfo.phone
                            fir[i].supplierInfo.supplierName=this.list[i].supplierInfo.supplierName
                            fir[i].euqioList[0].floor=this.list[i].equipInfo.floor
                            fir[i].euqioList[0].number=this.list[i].equipInfo.number
                            fir[i].euqioList[0].section=this.list[i].equipInfo.section
                            fir[i].euqioList[0].surface=this.list[i].equipInfo.surface
                            fir[i].euqioList[0].count=1
                            fir[i].count=1
                            console.log("fir[i]",fir[i])
                            continue
                        }
                        for(let j in fir){
                            console.log("进入循环")
                            if(this.list[i].equipInfo.equipName==fir[j].equipInfo.equipName
                                &&this.list[i].equipInfo.model==fir[j].equipInfo.model
                                &&this.list[i].equipInfo.duration==fir[j].equipInfo.duration){
                                console.log("进入if")
                                console.log("fir[j].euqioList",fir[j].euqioList)
                                for(let m in fir[j].euqioList){
                                    if(this.list[i].equipInfo.floor==fir[j].euqioList[m].floor
                                        &&this.list[i].equipInfo.number==fir[j].euqioList[m].number
                                        &&this.list[i].equipInfo.section==fir[j].euqioList[m].section
                                        &&this.list[i].equipInfo.surface==fir[j].euqioList[m].surface){
                                            console.log("进入第二层if")
                                            fir[j].count+=1
                                            console.log("fir[j].euqioList[m].count",fir[j].euqioList[m].count);
                                            if(m==0){
                                                fir[j].euqioList[m].count=0
                                            }
                                            fir[j].euqioList[m].count+=1
                                    }else{
                                        let a ={
                                            floor:this.list[i].equipInfo.floor,
                                            number:this.list[i].equipInfo.number,
                                            section:this.list[i].equipInfo.section,
                                            surface:this.list[i].equipInfo.surface,
                                        }
                                        fir[j].count+=1
                                        a.count = 1
                                        fir[j].euqioList.push(a)
                                    }
                                }
                                console.log("fir",fir)
                            }else{
                                console.log("进入else")
                                let a = {
                                    equipInfo:{
                                        equipName:this.list[i].equipInfo.equipName,
                                        model:this.list[i].equipInfo.model,
                                        duration:this.list[i].equipInfo.duration
                                    },
                                    supplierInfo:{
                                        person:this.list[i].supplierInfo.person,
                                        supplierName:this.list[i].supplierInfo.supplierName,
                                        phone:this.list[i].supplierInfo.phone
                                    },
                                    euqioList:[{
                                        floor:this.list[i].equipInfo.floor,
                                        number:this.list[i].equipInfo.number,
                                        section:this.list[i].equipInfo.section,
                                        surface:this.list[i].equipInfo.surface,
                                        count:1
                                    }],
                                    count:1
                                }
                                fir.push(a)
                            }
                        }
                    }
                    this.tableList = fir
                    console.log("this.tableList",this.tableList)
                }
            }
        }
        
    }
</script>
<style scoped lang="scss">
    /deep/ .el-table__body tr{
        background: #FAEEDA !important;
    }

    /deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
        background-color: rgba(255, 255, 255, 0) !important;
    }

    /deep/ .el-table__expanded-cell[class*=cell] {
        padding: 0px 0px;
    }

    .opening-box{
        font-size: 16px;
        width: 100%;
        min-height: 4.4323rem;
    }.maintenance_body {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        margin-top: 34px
    }

    .maintenance_body .maintenance_body_table_box {
        width: 7.8698rem;
    }

    .maintenance_body_table_box .maintenance_table {
        width: 7.8698rem;
        border: 1px solid rgba(112, 112, 112, 0.13)
    }

    .maintenance_table .fold_box {
        width: 7.8698rem;
        height: 0.4323rem;
        display: flex;
        flex-direction: row;
        color: black;
        position: relative;
        background: #F5F5F5;
    }

    .fold_box .fold-line {
        height: 1px;
        width: 100%;
        background: rgba(112, 112, 112, 0.15);
        position: absolute;
        margin-top: calc(0.4323rem / 2);
    }

    .fold_box .fold {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
    }

    .fold_box .fold_title {
        min-width: calc(7.6198rem / 8);
        height: 100%;
        margin-left: 0.023rem;
    }

    .fold_title .fold_title_item {
        height: 50%;
        display: flex;
        align-items: center;
        justify-content: left;
        padding-left: 0.032rem;
    }

    .fold_box .fold_body {
        max-width: calc(7.8698rem / 8 * 7);
        min-width: calc(7.8698rem / 8 * 7);
        height: 100%;
        display: flex;
        overflow: auto;
        flex-direction: row;
        flex-wrap: nowrap;
    }

    .fold_body::-webkit-scrollbar {
        width: 2px;
        height: 5px;

    }

    .fold_body::-webkit-scrollbar-thumb {
        background-color: rgba(144, 147, 153, 0.1);
    }

    .fold_body::-webkit-scrollbar-track { /*滚动条里面轨道*/
        -webkit-box-shadow: #F5F5F5;
        border-radius: 10px;
        background: #F5F5F5;
    }

    .fold_body::-webkit-scrollbar-thumb:hover {
        background: rgba(144, 147, 153, 0.3);
    }

    .fold_item .fold_body_item {
        height: 50%;
        display: flex;
        align-items: center;
        justify-content: left;
    }

    .fold_body .fold_item {
        display: flex;
        min-width: calc(7.6198rem / 8 * 2);
        flex-direction: column;
        height: 100%;
    }

    .action-bar {
        padding-right: 23px;
        margin-top: 8px;
        // border-top: rgba(112, 112, 112, 0.13) solid 1px;
        border-bottom: rgba(112, 112, 112, 0.13) solid 1px;
        font-size: 16px;
        font-family: "PingFang SC";
        height: 57px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: row;
        padding-left: 18px;
        width: 100%;
        color: #707070;
    }
    .action-bar .input-box{
        width:285.0048px;
        position: relative;
    }
    .input-box .input{
        width: 100%;
        height:38px;
        background:rgba(255,255,255,1);
        border:1px solid rgba(112,112,112,1);
        opacity:1;
        border-radius:19px;
        padding-left: 15px;
        outline:medium;
        color: #707070;
    }
    ::-webkit-input-placeholder { /* Chrome/Opera/Safari */
        color: #BBBBBB;
    }
    .input-box .icon-search{
        position: absolute;
        right: 10px;
        z-index: 1;
        top: 50%; /*偏移*/
        width: 25px;
        height: 25px;
        transform: translateY(-50%);
    }
</style>