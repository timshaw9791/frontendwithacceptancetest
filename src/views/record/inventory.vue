<template>
    <div class="opening-box">
        <my-header :title="'盘点记录'" :searchFlag="false"  :haveBlack="!show" @h_black="black"></my-header>
        <div v-if="show">
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
                            placeholder="操作人员"
                            suffix="el-icon-search"
                            v-model="table.search"
                            style="width:285px;">

                    </BosInput>
                </div>
            </div>
            <field-table :list="list" :labelList="table.labelList" :havePage="false"
                        :tableAction="table.tableAction"  @clickTableCloum="clickTableCloum" style="width: 100%">
            </field-table>
        </div>
        
        <!-- <r_video ref="recordVideo" :src="address"></r_video> -->
        <inventoryinfo :infolist="infolist" :show="show"></inventoryinfo>

    </div>
</template>

<script>
    import myHeader from 'components/base/header/header'
    import {findStartTimeAndEndTimeBetweenAndOperatorLike } from "api/equiprecord"
    import inventoryinfo from "views/record/inventoryinfo"

    export default {
        name: "inventory",
        components:{
            myHeader,
            inventoryinfo
        },
        data(){
            return{
                table: {
                    flag: false,
                    labelList: [
                        {lable: '开始盘点时间', field: 'createTime' ,filter: (ns) => this.$filterTime(parseInt(ns.createTime))},
                        {lable: '结束盘点时间', field: 'updateTime' ,filter: (ns) => this.$filterTime(parseInt(ns.createTime))},
                        {lable: '操作人员', field: 'operatorInfo.operator',sort:false},
                        {lable: '盘点总数', field: 'inventoryCount',sort:false},
                        {lable: '未盘点数', field: 'notCount',sort:false},
                        {lable: '出库数量', field: 'outHouseCount',sort:false},
                    ],
                    search:'',
                    tableAction:{
                        label:'详情',
                        button:[{name:'查看',type:'primary'}]
                    },
                    time:''
                },
                list:[],
                infolist:[],
                show:true
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
            
            getList(){
                findStartTimeAndEndTimeBetweenAndOperatorLike().then(res=>{
                    this.list=[];
                    console.log("111")
                    this.list=res;
                    console.log("res",res)
                })
            },
            black(){
                this.show = true
                console.log("show",this.show)
            }
        },
        created(){
            this.getList()
        },
        watch:{
            'table.search':{
                handler(data){
                    if(data){
                        let params = {operator:data}
                        findStartTimeAndEndTimeBetweenAndOperatorLike(params).then((res)=>{
                            this.list=res
                        })
                    }else{
                        this.getList()
                    }
                    
                }
            },
            'table.time':{
                handler(data){
                    data[0] = data[0].replace(new RegExp("-","gm"),"/");
                    let starttime = (new Date(data[0])).getTime();
                     data[1] = data[1].replace(new RegExp("-","gm"),"/");
                    let endtime = (new Date(data[1])).getTime();
                    let params = {endTime:endtime,startTime:starttime}
                    console.log("params",params)
                    findStartTimeAndEndTimeBetweenAndOperatorLike(params).then((res)=>{
                        this.list=JSON.parse(JSON.stringify(res.content))
                    })
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
