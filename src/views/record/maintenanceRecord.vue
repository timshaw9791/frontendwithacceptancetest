<template>
    <div>
        <my-header :title="'维保记录'" :searchFlag="false"></my-header>
        <r_search :placeholder="'装备名称'" @handleSearch="handleSearch" :haveAction="true" @handleSelect="handleSelect"></r_search>
        <r_label :table="table" v-show="table.flag" @clickTable="clickTable" @sortCondition="sortGql" ref="las"></r_label>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header'
    import r_search from 'components/record/recordSearch'
    import r_label from 'common/vue/label'
    import record from 'gql/record.gql'
    export default {
        name: "maintenanceRecord",
        components:{
            myHeader,
            r_search,
            r_label
        },
        data(){
            return{
                table: {
                    flag: true,
                    labelList: [
                        {lable: 'RFID', field: 'rfid',sort:false},
                        {lable: '库房名称', field: 'houseName',sort:false},
                        {lable: '装备名称', field: 'equipName',sort:false},
                        {lable: '装备序号', field: 'equipSerial',filter:this.filterSerial,sort:false},
                        {lable: '开始时间', field: 'startTime', filter: this.filterTime},
                        {lable: '结束时间', field: 'duration', filter: this.filterEndTime,sort:false},
                        {lable: '充电时长', field: 'duration',filter: this.filterLong,sort:false},
                    ],
                    graphqlTable: {
                        graphqlApi: record.getEquipChargeRecordList,
                        graphqlKey: {qfilter:{key: "id",  operator: "ISNOTNULL"}},
                    },
                    equipId:'',
                    haveButton: false,
                    namelike:''
                },
                selectData:'充电',
                cKey:{key: "id",  operator: "ISNOTNULL"}
            }
        },
        methods:{
            handleSearch(data){
                let qfilter;
                this.$set(this.table, 'namelike', data);
                if (data == '') {
                    qfilter = this.cKey
                } else {
                    let that = this;
                    if(this.selectData=='充电'){
                        qfilter = {
                            key: 'equipName',
                            value: '%' + data + '%',
                            operator: 'LIKE',
                            combinator: 'AND',
                            next: this.cKey
                        };
                    }else {
                        qfilter = {
                            key: 'equipArgInfo.equipName',
                            value: '%' + data + '%',
                            operator: 'LIKE',
                            combinator: 'AND',
                            next: this.cKey
                        };
                    }
                }
                this.$set(this.table.graphqlTable.graphqlKey, 'qfilter', qfilter);
            },
            clickTable(table) {
                let data = table.row;
                if (data) {
                    this.table.equipId = data.id;
                    this.table.flag=!this.table.flag
                }
            },
            handleSelect(data){
                let list;
                this.selectData=data;
                if(data=='充电'){
                    list=[
                        {lable: 'RFID', field: 'rfid',sort:false},
                        {lable: '库房名称', field: 'houseName',sort:false},
                        {lable: '装备名称', field: 'equipName',sort:false},
                        {lable: '装备序号', field: 'equipSerial',filter:this.filterSerial,sort:false},
                        {lable: '开始时间', field: 'startTime', filter: this.filterTime},
                        {lable: '结束时间', field: 'duration', filter: this.filterEndTime,sort:false},
                        {lable: '充电时长', field: 'duration',filter: this.filterLong,sort:false},
                        ];
                    this.$set(this.table.graphqlTable,'graphqlApi',record.getEquipChargeRecordList);
                    this.$set(this.table.graphqlTable.graphqlKey,'qfilter',{key: "id",  operator: "ISNOTNULL"});
                }else if(data=='保养'){
                    list=[
                        {lable: 'RFID', field: 'equipInfo.equipRfid',sort:false},
                        {lable: '库房名称', field: 'equipInfo.houseName',sort:false},
                        {lable: '装备名称', field: 'equipArgInfo.equipName',sort:false},
                        {lable: '装备序号', field: 'equipInfo.equipSerial',filter:this.filterSerial,sort:false},
                        {lable: '操作人员', field: 'operator',sort:false},
                        {lable: '开始时间', field: 'startTime', filter: this.filterTime,},
                        {lable: '结束时间', field: 'endTime', filter: this.filterEndTime,sort:false},
                        {lable: '保养时长', field: 'duration',filter: this.filterLong,sort:false}
                    ];
                    this.$set(this.table.graphqlTable,'graphqlApi',record.getEquipActionRecordList);
                    this.$set(this.table.graphqlTable.graphqlKey,'qfilter',{key: "action", value: 'UPKEEP', operator: "EQUEAL"})
                }else {
                    list=[
                        {lable: 'RFID', field: 'equipInfo.equipRfid',sort:false},
                        {lable: '库房名称', field: 'equipInfo.houseName',sort:false},
                        {lable: '装备名称', field: 'equipArgInfo.equipName',sort:false},
                        {lable: '装备序号', field: 'equipInfo.equipSerial',filter:this.filterSerial,sort:false},
                        {lable: '操作人员', field: 'operator',sort:false},
                        {lable: '操作时间', field: 'startTime', filter: this.filterTime},
                        {lable: '操作状态', field: 'action', filter: this.filterAction}
                    ];
                    this.$set(this.table.graphqlTable,'graphqlApi',record.getEquipActionRecordList);
                    this.$set(this.table.graphqlTable.graphqlKey,'qfilter',{key: "action", value: 'MAINTAIN', operator: "EQUEAL"})
                }
                this.$set(this.table,'labelList',list);
                this.cKey=this.table.graphqlTable.graphqlKey.qfilter;
            },
            sortGql(data){
                if (data=='descending'){
                    this.table.graphqlTable.graphqlApi=equi.getEquipListDESC;
                }else {
                    this.table.graphqlTable.graphqlApi=equi.getEquipListASC;
                }
                this.$refs.las.refetch();
            },
            filterSerial(se) {
                return se.equipSerial == '' ? '无' : se.equipSerial
            },
            filterTime(nS) {
                return new Date(parseInt(nS.startTime)).toLocaleString().replace(/:\d{1,2}$/, ' ');
            },
            filterEndTime(nS){
                return new Date(parseInt(nS.startTime+nS.duration)).toLocaleString().replace(/:\d{1,2}$/, ' ');
            },
            filterLong(nS){
                return (nS.duration/1000/3600/24).toFixed(2)+'天'
            },
            filterAction(ob) {
                return ob.action == 'MAINTAIN' ? '维修' : '归还'
            },
        }
    }
</script>

<style scoped>

</style>