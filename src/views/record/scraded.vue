<template>
    <div class="borrow">
        <my-header :title="'报废记录'" :searchFlag="false"></my-header>
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
                        v-model="params.search"
                        style="width:285px;">

                </BosInput>
            </div>
        </div>
        <field-table :list="list" :labelList="table.labelList"  :pageInfo="params" @tableCurrentPageChanged="changePage" 
                      :tableAction="table.tableAction"  @clickTableCloum="clickTableCloum" style="width: 100%">
        </field-table>
        <service-dialog title="维修报废记录" ref="dialogLinghuan" width="766px" :button="false">
            <field-table :list="infolist" :labelList="infotable.labelList" :havePage="false"
                          style="width: 100%">
            </field-table>
        </service-dialog>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header'
    import r_video from 'components/record/recordDialog'
    import serviceDialog from 'components/base/gailiangban'
    import {baseURL} from "../../api/config";
    import {findScrapRecordByNameLike} from "api/equiprecord";

    export default {
        name: "scraded",
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
                        {lable: '操作人员', field: 'operatorInfo.operator', sort: false},
                        {lable: '报废时间', field: 'createTime', filter: (ns) => this.$filterTime(ns.createTime), sort: false},
                        {lable: '装备数量', field: 'count', sort: false},
                        {lable: '备注', field: 'category', sort: false},
                    ],
                    tableAction:{
                        label:'详情',
                        button:[{name:'查看',type:'primary'}]
                    },
                    flag:false
                },
                infotable: {
                    labelList: [
                        {lable: 'RFID', field: 'rfid', sort: false},
                        {lable: '装备序号', field: 'serial', sort: false},
                        {lable: '装备名称', field: 'equipName', sort: false},
                        {lable: '装备型号', field: 'model', sort: false},
                        {lable: '供应商', field: 'supplierInfo.supplierName', sort: false},
                        {lable: '联系人', field: 'supplierInfo.person', sort: false},
                        {lable: '联系电话', field: 'supplierInfo.phone', sort: false},
                    ],
                    flag:false
                },
                list:[],
                address:'',
                infolist:[],
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
            
            getList(){
                findScrapRecordByNameLike(this.params).then(res=>{
                    this.list=[];
                    this.list=JSON.parse(JSON.stringify(res.content));
                    this.params.totalPages = res.totalPages
                    this.params.totalElements = res.totalElements
                })
                console.log("this.list",this.list)
            },
            clickTableCloum(data){
                console.log("data",data)
                this.infolist = data.row.scrapDetailSet
                console.log("this.infolist",this.infolist)
                this.$refs.dialogLinghuan.show()
                
            },
            changePage(data){
                this.params.page=data;
                this.getList()
            }
        },
        created(){
            this.getList()
        },
        watch: {
            'params.search':{
                handler(data){
                    this.params.page=1
                    console.log("this.params",this.params)
                    this.getList()
                }
                
            },
            'time':{
                handler(data){
                    console.log("data",data)
                    this.params.page=1
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
                    this.getList()
                }
                
            },
            'list':{
                handler(){
                    for(let i in this.list){
                        if(this.list[i].state == "RECEIVE"){
                            this.list[i].state = "领取"
                        }else if(this.list[i].state == "RETURN"){
                            this.list[i].state = "归还"
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