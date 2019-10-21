<template>
    <div>
        <my-header :title="'维保记录'" :searchFlag="false"></my-header>
        <r_search :placeholder="'装备名称'" @handleSearch="handleSearch" :haveAction="true" @handleSelect="handleSelect"></r_search>
        <r_label :table="table" @clickTable="clickTable" ref="las"></r_label>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header'
    import r_search from 'components/record/recordSearch'
    import r_label from 'common/vue/ajaxLabel'
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
                    flag: false,
                    labelList: [
                        {lable: 'RFID', field: 'rfid',sort:false},
                        {lable: '装备名称', field: 'equipName',sort:false},
                        {lable: '装备序号', field: 'equipSerial',filter:this.filterSerial,sort:false},
                        {lable: '开始时间', field: 'startTime', filter: (ns) => this.$filterTime(parseInt(ns.startTime))},
                        {lable: '结束时间', field: 'duration', filter: (ns) => this.$filterTime(parseInt(ns.startTime+ns.duration)),sort:false},
                        {lable: '充电时长', field: 'duration',filter: this.filterLong,sort:false},
                    ],
                    url:'/equip-charge-records',
                    params:{direction:'DESC',property:'time'},
                    search:'',
                },
                selectData:'充电'
            }
        },
        methods:{
            handleSearch(data){
                this.$set(this.table, 'search', data);
            },
            clickTable(table) {
                let data = table.row;
                if (data) {
                    this.table.equipId = data.id;
                    this.table.flag=!this.table.flag
                }
            },
            handleSelect(data){
                let list,url,params;
                this.selectData=data;
                if(data=='充电'){
                    list=[
                        {lable: 'RFID', field: 'rfid',sort:false},
                        {lable: '装备名称', field: 'equipName',sort:false},
                        {lable: '装备序号', field: 'equipSerial',filter:this.filterSerial,sort:false},
                        {lable: '开始时间', field: 'startTime', filter: (ns) => this.$filterTime(parseInt(ns.startTime))},
                        {lable: '结束时间', field: 'duration', filter: (ns) => this.$filterTime(parseInt(ns.startTime+ns.duration)),sort:false},
                        {lable: '充电时长', field: 'duration',filter: this.filterLong,sort:false},
                        ];
                       url='/equip-charge-records';
                       params={direction:'DESC',property:'startTime'}
                }else if(data=='保养'){
                    list=[
                        {lable: 'RFID', field: 'equipInfo.equipRfid',sort:false},
                        {lable: '装备名称', field: 'equipInfo.equipName',sort:false},
                        {lable: '装备序号', field: 'equipInfo.equipSerial',filter:this.filterSerial,sort:false},
                        {lable: '操作人员', field: 'operator',sort:false},
                        {lable: '开始时间', field: 'startTime', filter: (ns) => this.$filterTime(parseInt(ns.startTime)),},
                        {lable: '结束时间', field: 'endTime', filter: (ns) => this.$filterTime(parseInt(ns.startTime+ns.duration)),sort:false},
                        {lable: '保养时长', field: 'duration',filter: this.filterLong,sort:false}
                    ];
                    url='/equip-action-records';
                    params={direction:'DESC',property:'startTime',action:'UPKEEP'}
                }else {
                    list=[
                        {lable: 'RFID', field: 'equipInfo.equipRfid',sort:false},
                        {lable: '装备名称', field: 'equipInfo.equipName',sort:false},
                        {lable: '装备序号', field: 'equipInfo.equipSerial',filter:this.filterSerial,sort:false},
                        {lable: '操作人员', field: 'operator',sort:false},
                        {lable: '开始时间', field: 'startTime', filter: (ns) => this.$filterTime(parseInt(ns.startTime)),},
                        {lable: '结束时间', field: 'endTime', filter: (ns) => this.$filterTime(parseInt(ns.startTime+ns.duration)),sort:false},
                        {lable: '操作状态', field: 'action', filter: this.filterAction}
                    ];
                    url='/equip-action-records';
                    params={direction:'DESC',property:'startTime',action:'MAINTAIN'}
                }
                this.$set(this.table,'labelList',list);
                this.$set(this.table,'url',url);
                this.$set(this.table,'params',params);
                this.$refs.las.getList();
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
            // filterTime(nS) {
            //     return new Date(parseInt(nS.startTime)).toLocaleString().replace(/:\d{1,2}$/, ' ');
            // },
            // filterEndTime(nS){
            //     return new Date(parseInt(nS.startTime+nS.duration)).toLocaleString().replace(/:\d{1,2}$/, ' ');
            // },
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