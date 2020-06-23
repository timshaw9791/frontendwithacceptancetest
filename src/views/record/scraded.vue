<template>
    <view-container>
        <field-table :list="list" :labelList="table.labelList"  :pageInfo="params" @tableCurrentPageChanged="changePage"
                     :tableAction="table.tableAction"  @clickTableCloum="clickTableCloum" style="width: 100%">
        </field-table>
        <service-dialog title="装备报废记录" ref="dialogLinghuan" width="766px" :button="false">
            <field-table :list="infolist" :labelList="infotable.labelList" :havePage="false"
                         style="width: 100%">
            </field-table>
        </service-dialog>
    </view-container>
</template>

<script>
    import myHeader from 'components/base/header/header'
    import r_video from 'components/record/recordDialog'
    import serviceDialog from 'components/base/gailiangban'
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
                        {lable: '备注', field: 'categoryCn', sort: false},
                    ],
                    tableAction:{
                        label:'操作',
                        button:[{name:'详情',type:'primary'}]
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
                time:'',
                title:''
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
                this.title=data.category
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

</style>