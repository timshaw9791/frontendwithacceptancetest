<template>
    <div class="opening-box">
        <my-header :title="'耗材记录'" :searchFlag="false"></my-header>
        <div class="action-bar">
            <div style="width:400px" data-test="time_search">
                <el-date-picker
                    v-model="table.time"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </div>
            <div class="_buttons" style="margin-right: 18px">
                <BosInput
                        placeholder="装备名称/操作状态/操作人员"
                        suffix="el-icon-search"
                        v-model="table.search"
                        style="width:285px;">

                </BosInput>
            </div>
        </div>
        <field-table :list="list" :labelList="table.labelList"
                    :tableAction="table.tableAction"  :pageInfo="paginator" @tableCurrentPageChanged="changePage" style="width: 100%">
        </field-table>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header'
    import {findConsumableByName,findByTimeBetween} from "api/equiprecord"

    export default {
        name: "consumablerecord",
        components:{
            myHeader,
        },
        data(){
            return{
                table: {
                    flag: false,
                    labelList: [
                        {lable: '装备名称', field: 'name',sort:false},
                        {lable: '装备数量', field: 'count',sort:false},
                        {lable: '备注', field: 'remark',sort:false},
                        {lable: '操作状态', field: 'category',sort:false},
                        {lable: '操作人员', field: 'operatorInfo.operator',sort:false},
                        {lable: '操作时间', field: 'creatTime' ,filter: (ns) => this.$filterTime(parseInt(ns.creatTime))},
                    ],
                    search:'',
                    time:''
                },
                list:[],
                paginator: {
                    page: 1,
                    totalPages: 10,
                    size: 9
                },
                address:''
            }
        },
        methods:{
            
            getList(data){
                let params = this.paginator
                findConsumableByName(params).then(res=>{
                    this.list=[];
                    this.list=JSON.parse(JSON.stringify(res.content));
                    this.paginator.totalPages=res.totalPages
                })
            },
            changePage(data){
                this.paginator.page = data
                this.getList()
            }
        },
        created(){
            this.getList()
        },
        watch:{
            'table.search':{
                handler(data){
                    this.paginator.name = data
                    this.getList()

                }
            },
            'table.time':{
                handler(data){
                    if(data){
                        data[0] = data[0].replace(new RegExp("-","gm"),"/");
                        let starttime = (new Date(data[0])).getTime();
                        data[1] = data[1].replace(new RegExp("-","gm"),"/");
                        let endtime = (new Date(data[1])).getTime();
                        let params = {endTime:endtime,startTime:starttime}
                        findByTimeBetween(params).then((res)=>{
                            this.list=JSON.parse(JSON.stringify(res.content))
                        })
                    }else{
                        this.getList()
                    }
                    
                }
            },
            'list':{
                handler(data){
                    for(let i in this.list){
                        if(this.list[i].category=="INCREASE"){
                            this.list[i].category="新增"
                        }else if(this.list[i].category=="UPDATE"){
                            this.list[i].category="补充"
                        }else if(this.list[i].category=="RECEIVE"){
                            this.list[i].category="领取"
                        }
                        console.log("++++")
                    }

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
