<template>
    <view-container>
        <field-table :list="list" :labelList="table.labelList" :pageInfo="params" @tableCurrentPageChanged="changePage"
                     :tableAction="table.tableAction"  @clickTableCloum="clickTableCloum" style="width: 100%">
        </field-table>
        <r_video ref="recordVideo" :src="address"></r_video>
        <service-dialog title="携带装备" ref="dialogLinghuan" width="766px" :button="false">
            <field-table :list="infolist" :labelList="infotable.labelList" @rowclick="clickTableCloum2" :havePage="false"
                         style="width: 100%">
            </field-table>
            <service-dialog
                    :title="moretitle"
                    ref="more"
                    width="388px"
                    top="14vh"
                    :button="false"
                    :modal="false">
                <div style="height:480px">
                    <el-table
                            :data="rfidlist"
                            border
                            style="width: 90%;margin:20px auto"
                            align="center"
                            height="450px"
                    >
                        <el-table-column
                                label="序号"
                                type="index"
                                :index="indexMethod" width="90" align="center">
                        </el-table-column>
                        <el-table-column
                                prop="equipInfo.rfid"
                                label="rfid"
                                align="center"
                        >
                        </el-table-column>
                    </el-table>
                </div>
            </service-dialog>
        </service-dialog>
    </view-container>
</template>

<script>
    import myHeader from 'components/base/header/header'
    import r_video from 'components/record/recordDialog'
    import serviceDialog from 'components/base/gailiangban'
    import {baseURL} from "../../api/config";
    import {receiveReturnRecords , recorddetail } from "api/equiprecord";
    import {startProcessCamVideo} from '@/externalProcess'

    export default {
        name: "borrow",
        components: {
            r_video,
            myHeader,
            serviceDialog
        },
        created(){
            if(this.$route.query.name!=null){
                this.defaultSearch=this.$route.query.name;
                this.table.flag=true
            }
        },
        data() {
            return {
                defaultSearch:'',
                table: {
                    labelList: [
                        {lable: '出入人员', field: 'operatorInfo.operator', sort: false},
                        {lable: '出入状态', field: 'state', sort: false},
                        {lable: '出入时间', field: 'createTime', filter: (ns) => this.$filterTime(ns.createTime), sort: false}
                    ],
                    tableAction:{
                        label:'操作',
                        button:[{name:'详情',type:'primary'},{name:'监控',type:'primary'}]
                    },
                    flag:false
                },
                infotable: {
                    labelList: [
                        {lable: '装备名称', field: 'name', sort: false},
                        {lable: '装备型号', field: 'model', sort: false},
                        {lable: '数量', field: 'count', sort: false},
                    ],
                    flag:false
                },
                list:[],
                address:'',
                infolist:[],
                rfidlist:[],
                moretitle:'',
                params:{
                    endTime:'',
                    startTime:'',
                    search:'',
                    properties:'create_time',
                    direction:'DESC',
                    page:1,
                    size:10,
                    totalPages: 5,
                    totalElements: 5
                },
                time:''
            }
        },

        methods: {
            
            indexMethod(index) {
                console.log(index);
                return index +1;
            },
            getList(){
                receiveReturnRecords(this.params).then(res=>{
                    this.list=[];
                    this.list=JSON.parse(JSON.stringify(res.content));
                    this.params.totalPages = res.totalPages
                    this.params.totalElements = res.totalElements
                })
            },
            changePage(data){
                this.params.page=data;
                this.getList()
            },
            clickTableCloum(data){
                if(data.name=="详情"){
                    recorddetail(data.row.id).then(response=>{
                        this.infolist  = response.detailDtoList
                    })
                    this.$refs.dialogLinghuan.show()
                }else if(data.name=="监控"){
                    startProcessCamVideo(data.row.createTime);
                }
            },
            clickTableCloum2(data){
                this.rfidlist=data.row.recordDetails
                this.moretitle = data.row.name+data.row.model
                console.log("data",data);
                this.$refs.more.show()
            }
        },
        created(){
            this.getList()
        },
        watch: {
            'params.search':{
                handler(data){
                    this.params.page=1;
                    console.log("this.params",this.params)
                    this.getList()
                }
                
            },
            'time':{
                handler(data){
                    this.params.page=1;
                    console.log("data",data)
                    let time2 = JSON.parse(JSON.stringify(this.time)) 
                    if(time2){
                        time2[0] = time2[0].replace(new RegExp("-","gm"),"/");
                        this.params.startTime = (new Date(time2[0])).getTime();
                        time2[1] = time2[1].replace(new RegExp("-","gm"),"/");
                        this.params.endTime = (new Date(time2[1])).getTime()+24*60*60*1000-1;
                        console.log("this.params",this.params)
                    }
                    else{
                        this.params.startTime = '';
                        this.params.endTime = '';
                        console.log("this.params",this.params)
                    }
                    this.getList()
                }
                
            },
            'list':{
                handler(){
                    for(let i in this.list){
                        if(this.list[i].state == "RECEIVE"){
                            this.list[i].state = "出"
                        }else if(this.list[i].state == "RETURN"){
                            this.list[i].state = "入"
                        }
                    }
                }
            }
        },
    }
</script>

<style scoped>
    .borrow{
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