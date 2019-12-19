<template>
    <div class="opening-box">
        <my-header :title="'开门记录'" :searchFlag="false" ></my-header>
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
                        placeholder="开门人员"
                        suffix="el-icon-search"
                        v-model="params.search"
                        style="width:285px;">

                </BosInput>
            </div>
        </div>
        <field-table :list="list" :labelList="table.labelList"  :pageInfo="params" @tableCurrentPageChanged="changePage" 
                    :tableAction="table.tableAction"   @clickTableCloum="clickTableCloum" style="width: 100%">
        </field-table>
        <r_video ref="recordVideo" :src="address"></r_video>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header'
    import r_search from 'components/record/recordSearch'
    import r_video from 'components/record/recordDialog'
    import {baseURL} from "../../api/config";
    import {findByOperatorName} from "api/openrecord"

    export default {
        name: "opening",
        components:{
            myHeader,
            r_search,
            r_video
        },
        data(){
            return{
                table: {
                    flag: false,
                    labelList: [
                        {lable: '开门人员', field: 'operatorInfo.operator',sort:false},
                        {lable: '开门时间', field: 'createTime' ,filter: (ns) => this.$filterTime(parseInt(ns.createTime))},
                    ],
                    search:'',
                    tableAction:{
                        label:'操作',
                        button:[{name:'视频',type:'primary'}]
                    },
                },
                time:'',
                list:[],
                address:'',
                params:{
                    startTime:'',
                    endTime:'',
                    search:'',
                    properties:'create_time',
                    direction:'DESC',
                    page:1,
                    size:10,
                    totalPages: 5,
                    totalElements: 5
                }
            }
        },
        methods:{
            clickTableCloum(table) {
                let data = table.row;
                if (data) {
                    console.log("data",data);
                    this.address=baseURL+'/records/'+data.video;
                    this.$refs.recordVideo.show()
                }
            },
            
            getList(){
                findByOperatorName(this.params).then(res=>{
                    this.list=[];
                    this.list=res.content;
                    this.params.totalPages = res.totalPages
                    this.params.totalElements = res.totalElements
                })
            },
            changePage(data){
                this.params.page=data
                this.getList()
            }
        },
        created(){
            this.getList()
        },
        watch:{
            'params.search':{
                handler(data){
                    this.params.page=1
                    this.getList()
                }
            },
            'time':{
                handler(data){
                    this.params.page=1
                    let time2 = JSON.parse(JSON.stringify(this.time)) 
                    if(time2){
                        time2[0] = time2[0].replace(new RegExp("-","gm"),"/");
                        this.params.startTime = (new Date(time2[0])).getTime();
                        time2[1] = time2[1].replace(new RegExp("-","gm"),"/");
                        this.params.endTime = (new Date(time2[1])).getTime()+24*60*60*1000-1;
                        console.log("this.params",this.params)
                    }else{
                        this.params.startTime = '';
                        this.params.endTime = '';
                        this.getList(this.params)
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
    /* border-top: rgba(112, 112, 112, 0.13) solid 1px; */
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
    /* border-radius:19px; */
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
