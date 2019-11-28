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
                        v-model="search"
                        style="width:285px;">

                </BosInput>
            </div>
        </div>
        <field-table :list="list" :labelList="table.labelList" 
                    :tableAction="table.tableAction" :pageInfo="params" @tableCurrentPageChanged="changePage" style="width: 100%">
        </field-table>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header'
    import {findConsumableByName} from "api/equiprecord"
    import {transformMixin} from "common/js/transformMixin"

    export default {
        name: "consumablerecord",
        components:{
            myHeader,
            
        },
        mixins: [ transformMixin],
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
                        {lable: '操作时间', field: 'createTime' ,filter: (ns) => this.$filterTime(parseInt(ns.createTime))},
                    ],
                },
                time:'',
                search:'',
                list:[],
                address:'',
                params:{
                    startTime:0,
                    endTime:'',
                    search:'',
                    properties:'create_time',
                    direction:'DESC',
                    page:1,
                    size:10,
                    totalPages: 5,
                    totalElements: 5
                },

            }
        },
        methods:{
            getList(){
                findConsumableByName(this.params).then(res=>{
                    this.list=[];
                    this.list=JSON.parse(JSON.stringify(res.content));
                    this.params.totalPages = res.totalPages
                    this.params.totalElements = res.totalElements
                    console.log("this.list",this.list)
                })
            },
            changePage(data){
                console.log("进入changePage")
                this.params.page=data;
                this.getList()
            }
            
        },
        created(){
            this.getList(),
            this.params.endTime=this.getDatamillseconds(this.getCurrentDate())
        },
        watch:{
            'search':{
                handler(data){
                    this.params.page=1;
                    this.params.search=data
                    if(data=="新增"||data=="增"||data=="新"){
                        this.params.search="INCREASE"
                    }else if(data=="补充"||data=="充"||data=="补"){
                        this.params.search="UPDATE"
                    }else if(data=="领取"||data=="取"||data=="领"){
                        this.params.search= "RECEIVE"
                    }
                    this.getList(this.params)

                }
            },
            'table.time':{
                handler(data){
                    this.params.page=1;
                    console.log("data",data)
                    if(data){
                        this.params.startTime = this.getDatamillseconds(data[0])
                        this.params.endTime = this.getDatamillseconds(data[1])+24*60*60*1000-1
                        this.getList(this.params)
                    }else{
                        this.params.startTime=''
                        this.params.endTime=''
                        this.getList(this.params)
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
