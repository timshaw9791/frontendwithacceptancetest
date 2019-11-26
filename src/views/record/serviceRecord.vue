<template>
    <div class="opening-box">
        <my-header :title="'维修记录'" :searchFlag="false"  :haveBlack="!show" @h_black="black"></my-header>
        <div v-if="show">
            <div class="action-bar">
                <div style="width:400px" data-test="time_search">
                    <el-date-picker
                        v-model="time"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </div>
                <div class="_buttons" style="margin-right: 18px">
                    <BosInput
                            placeholder="操作人员"
                            suffix="el-icon-search"
                            v-model="params.operator"
                            style="width:285px;">

                    </BosInput>
                </div>
            </div>
            <field-table :list="list" :labelList="table.labelList" :show="false"
                        :tableAction="table.tableAction"  :pageInfo="paginator" @tableCurrentPageChanged="changePage" @clickTableCloum="clickTableCloum" style="width: 100%">
            </field-table>
        </div>
        
        <!-- <r_video ref="recordVideo" :src="address"></r_video> -->
        <service-recordinfo :infolist="infolist" :show="show"></service-recordinfo>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header'
    import {findRepairByStartTimeAndEndTimeBetweenAndOperatorLike } from "api/equiprecord"
    import serviceRecordinfo from "views/record/serviceRecordinfo"

    export default {
        name: "serviceRecord",
        components:{
            myHeader,
            serviceRecordinfo
        },
        data(){
            return{
                table: {
                    flag: false,
                    labelList: [
                        {lable: '开始维修时间', field: 'createTime' ,filter: (ns) => this.$filterTime(parseInt(ns.createTime))},
                        {lable: '维修件数', field: 'recordDetailSet.length',sort:false},
                        {lable: '操作人员', field: 'operatorInfo.operator',sort:false},
                    ],
                    tableAction:{
                        label:'详情',
                        button:[{name:'查看',type:'primary'}]
                    },
                },
                time:'',
                list:[],
                infolist:[],
                paginator: {
                    page: 1,
                    totalPages: 10,
                    size: 9
                },
                show:true,
                params:{
                    startTime:'',
                    endTime:'',
                    operator:''
                }
            }
        },
        methods:{
            clickTableCloum(table) {
                console.log("111")
                let data = table.row;
                console.log("data",data)
                this.infolist = data
                console.log("this.infolist",this.infolist)
                this.show = false
                console.log("typeof(this.infolist)",typeof(this.infolist))
            },
            
            getList(data){
                // let params = this.paginator
                findRepairByStartTimeAndEndTimeBetweenAndOperatorLike(data).then(res=>{
                    this.list=[];
                    console.log("111")
                    this.list=res;
                    // this.paginator.totalPages=res.totalPages
                    console.log("res",res)
                })
            },
            changePage(data){
                this.paginator.page = data
                this.getList()

            },
            black(){
                this.show = true
            }
        },
        created(){
            this.getList()
        },
        watch:{
            'params.operator':{
                handler(data){
                    console.log("this.params",this.params)
                    this.getList(this.params)
                }
            },
            'time':{
                handler(data){
                    console.log("data",data)
                    if(data){
                        data[0] = data[0].replace(new RegExp("-","gm"),"/");
                        this.params.startTime = (new Date(data[0])).getTime();
                        data[1] = data[1].replace(new RegExp("-","gm"),"/");
                        this.params.endTime = (new Date(data[1])).getTime()+24*60*60*1000-1;
                        console.log("this.params",this.params)
                    }
                    else{
                        this.params.startTime = '';
                        this.params.endTime = '';
                        console.log("this.params",this.params)
                    }
                    this.getList(this.params)
                }
            }
        }
    }
</script>

<style scoped>
.opening-box{
    font-size: 16px;
    width: 100%;
    min-height: 4.4323rem;
}
.action-bar {
    padding-right: 23px;
    margin-top: 8px;
    border-top: rgba(112, 112, 112, 0.13) solid 1px;
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
