<template>
    <div>
        <my-header :title="'盘点记录'" :searchFlag="false" :haveBlack="!viewStatus.flag" @h_black="black"></my-header>
        <r_search :placeholder="'人员姓名'" @handleSearch="handleSearch" v-show="viewStatus.flag"></r_search>
        <!--<r_inventory :tableData="inventoryObj.inventoryData.inventoryItems" :overview="inventoryObj.inventoryData.inventory" :size="size"></r_inventory>-->
        <r_label :table="table" v-show="viewStatus.flag" @clickTable="clickTable" @sortCondition="sortGql" ref="las"></r_label>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header'
    import r_search from 'components/record/recordSearch'
    import r_inventory from 'components/inventory/inventoryComponent'
    import r_label from 'common/vue/label'
    import record from 'gql/record.gql'
    export default {
        name: "inventory",
        components:{
            myHeader,
            r_search,
            r_label,
            r_inventory
        },
        data(){
            return{
                table: {
                    flag: true,
                    labelList: [
                        {lable: '操作人员', field: 'adminName',sort:false},
                        {lable: '盘点总数', field: 'rfidCount',sort:false},
                        {lable: '未盘点数', field: 'withoutRfidCount',sort:false},
                        {lable: '出库数量', field: 'outCount',sort:false},
                        {lable: '开始时间', field: 'startTime', filter: this.filterTime,sort:'custom'},
                        {lable: '结束时间', field: 'endTime', filter: this.filterTime,sort:'custom'},
                    ],
                    tableAction:{
                        label:'详情',
                        button:['查看']
                    },
                    graphqlTable: {
                        graphqlApi: record.getInventoryList,
                        graphqlKey: {qfilter: {key: "id", operator: "ISNOTNULL"}}
                    },
                    equipId:'',
                    haveButton: true
                },
                viewStatus:{
                    flag:true
                }
            }
        },
        methods:{
            handleSearch(data) {
                let qfilter;
                if (data == '') {
                    qfilter = {key: "id", operator: "ISNOTNULL"}
                } else {
                    let that = this;
                    qfilter = {
                        key: 'adminName',
                        value: '%' + data + '%',
                        operator: 'LIKE'
                    };
                }
                this.$set(this.table.graphqlTable.graphqlKey, 'qfilter', qfilter);
            },
            black(data){
                this.viewStatus.flag = !this.viewStatus.flag
            },
            clickTable(table) {
                let data = table.row;
                console.log(data);
                if (data) {
                    this.table.equipId = data.id;
                    this.viewStatus.flag = !this.viewStatus.flag
                }
            },
            filterTime(nS) {
                return new Date(parseInt(nS.startTime)).toLocaleString().replace(/:\d{1,2}$/, ' ');
            },
            sortGql(data) {
                let gqlName,api;
                if(data.name=='开始时间'){
                    gqlName='getInventoryListStartTime'
                }else {
                    gqlName='getInventoryListEndTime'
                }
                if (data.order == 'descending') {
                    api=gqlName+'DESC';
                } else {
                    api=gqlName+'ASC';
                }
                this.$set(this.table.graphqlTable, 'graphqlApi', record[api]);
            }
        }
    }
</script>

<style scoped>

</style>