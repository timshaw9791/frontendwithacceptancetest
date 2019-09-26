<template>
    <div class="borrow">
        <my-header :title="'装备领还记录'" :searchFlag="false"></my-header>
        <r_search :placeholder="'装备名称'" @handleSearch="handleSearch" :defaultSearch="defaultSearch"></r_search>
        <r_label :table="table" @clickTable="clickTable"
                 ref="las"></r_label>
        <r_video ref="recordVideo" :src="address"></r_video>
        <serviceDialog title="装备详情" ref="dialogEquipTable" width="1040px" :button="false">
            <field-table :list="equipList.list" :labelList="equipList.labelList"
                          :havePage="false"  style="width: 100%">
            </field-table>
        </serviceDialog>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header'
    import r_search from 'components/record/recordSearch'
    import r_video from 'components/record/recordDialog'
    import r_label from 'common/vue/ajaxLabel'
    import serviceDialog from 'components/record/recordServiceDialog'
    import {baseURL} from "../../api/config";

    export default {
        name: "borrow",
        components: {
            myHeader,
            r_search,
            r_label,
            r_video,
            serviceDialog
        },
        created(){
            if(this.$route.query.name!=null){
                this.defaultSearch=this.$route.query.name
            }
        },
        data() {
            return {
                defaultSearch:'',
                table: {
                    labelList: [
                        {lable: '装备名称', field: 'action',filter: this.filterName, sort: false},
                        {lable: '操作人员', field: 'operator', sort: false},
                        {lable: '操作时间', field: 'startTime', filter: this.filterTime, sort: false},
                        {lable: '操作状态', field: 'action', filter: this.filterAction}
                    ],
                    tableAction:{
                        label:'监控视频',
                        button:['详情','查看']
                    },
                    search:''
                },
                equipList:{
                    list:[],
                    labelList: [
                        {lable: '序号', field: 'serialNumber',filter: this.filterSerialNumber, sort: false},
                        {lable: '装备名称', field: 'equipInfo.equipName', sort: false},
                        {lable: 'RFID', field: 'equipInfo.equipRfid',sort: false},
                        {lable: '装备序号', field: 'equipInfo.equipSerial',sort: false}
                    ]
                },
                address:''
            }
        },

        methods: {
            handleSearch(data) {
                this.$set(this.table, 'search', data);
            },
            clickTable(table) {
                let data = table.row;
                if(table.name=='详情'){
                    let dataCopy=JSON.parse(JSON.stringify(data));
                    this.equipList.list=dataCopy.equipActionRecords;
                    this.equipList.list.forEach((item,index)=>{
                         let number=index+1;
                         let serialNumber='';
                         if(number<10){
                             serialNumber='0'+'0'+number
                         }else if(10<number<100){
                             serialNumber='0'+number
                         }else {
                             serialNumber=number
                         }
                         item.serialNumber=serialNumber
                    });
                    this.$refs.dialogEquipTable.show();
                }else {
                    if (data) {
                        this.address=baseURL+'/records/'+data.videoAddress;
                        this.$refs.recordVideo.show()
                    }
                }

            },
            filterTime(nS) {
                return new Date(parseInt(nS.time)).toLocaleString().replace(/:\d{1,2}$/, ' ');
            },

            filterName(ns){
                let equipArges=ns.equipActionRecords;
                let name='';
                equipArges.forEach(item=>{
                    if(name==''){
                        name=item.equipInfo.equipName
                    }else if(name.length<=10){
                        name=name+','+item.equipInfo.equipName
                    }else if(name.length>10){
                        name=name+'...'
                    }
                });
                return name
            },
            filterAction(ob) {
                return ob.action == 'RECEIVE' ? '领取' : '归还'
            },
            filterSerial(se) {
                return se.equipInfo.equipSerial == '' ? '无' : se.equipInfo.equipSerial
            }
        }
    }
</script>

<style scoped>
    .borrow{
        width: 100%;
        min-height: 965px;
    }
</style>