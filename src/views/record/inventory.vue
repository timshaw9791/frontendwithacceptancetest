<template>
    <div class="inventory">
        <my-header :title="'盘点记录'" :searchFlag="false" :haveBlack="!viewStatus.flag" @h_black="black"></my-header>
        <r_search :placeholder="'人员姓名'" @handleSearch="handleSearch" v-show="viewStatus.flag"></r_search>
        <div v-show="!viewStatus.flag">
            <div class="line"></div>
            <r_inventory :tableData="inventory.equipList" :overview="inventory.overview" :size="String(inventory.overview.rfidCount)" :componentType="'see'"
             ref="recordInventory"></r_inventory>
        </div>

        
        <r_label :table="table" v-show="viewStatus.flag" @clickTable="clickTable" @sortCondition="sortGql"
                 ref="las"></r_label>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header'
    import r_search from 'components/record/recordSearch'
    import r_inventory from 'components/inventory/inventoryComponent'
    import r_label from 'common/vue/label'
    import record from 'gql/record.gql'
    import {fetchMixin} from 'field/common/mixinFetch'

    export default {
        name: "inventory",
        mixins: [fetchMixin],
        components: {
            myHeader,
            r_search,
            r_label,
            r_inventory
        },
        data() {
            return {
                table: {
                    flag: true,
                    labelList: [
                        {lable: '操作人员', field: 'adminName', sort: false},
                        {lable: '盘点总数', field: 'rfidCount', sort: false},
                        {lable: '未盘点数', field: 'withoutRfidCount', sort: false},
                        {lable: '出库数量', field: 'outCount', sort: false},
                        {lable: '开始时间', field: 'startTime', filter: (ns) => this.$filterTime(parseInt(ns.startTime))},
                        {lable: '结束时间', field: 'endTime', filter: (ns) => this.$filterTime(parseInt(ns.endTime))},
                    ],
                    tableAction: {
                        label: '操作',
                        button: ['详情']
                    },
                    graphqlTable: {
                        graphqlApi: record.getInventoryList,
                        graphqlKey: {qfilter: {key: "id", operator: "ISNOTNULL"}}
                    },
                    equipId: '',
                    haveButton: true,
                    namelike:'',
                },
                inventory: {
                    equipList: [],
                    overview: {}
                },
                viewStatus: {
                    flag: true
                }
            }
        },
        methods: {
            handleSearch(data) {
                let qfilter;
                this.$set(this.table, 'namelike', data);
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
            black(data) {
                this.viewStatus.flag = !this.viewStatus.flag
            },
            clickTable(table) {
                let data = table.row;
                if (data) {
                    this.getDetails(data);
                    this.$refs.recordInventory.remark=data.note;
                    this.inventory.overview=data;
                    this.viewStatus.flag = !this.viewStatus.flag
                }
            },
            getDetails(data) {
                console.log(data);
                this.gqlQuery(record.getInventoryItemList, {qfilter: {key: 'inventory.id', value: data.id, operator: 'EQUEAL'}
                }, (res) => {
                    this.inventory.equipList=res;
                }, true)
            },
            // filterStartTime(nS) {
            //     return new Date(parseInt(nS.startTime)).toLocaleString().replace(/:\d{1,2}$/, ' ');
            // },
            // filterEndTime(nS) {
            //     return new Date(parseInt(nS.endTime)).toLocaleString().replace(/:\d{1,2}$/, ' ');
            // },
            // filterTime(date){
            //     let time='';
            //     if(date!=''){
            //         let dateNow =  new Date(date);
            //         let year = dateNow.getFullYear();
            //         let moth = dateNow.getMonth()+1;
            //         let day = dateNow.getDay();
            //         let hour = dateNow.getHours();
            //         let min = dateNow.getMinutes();
            //         let seconds = dateNow.getSeconds();
            //         time = year+'-'+addZero(moth)+'-'+addZero(day)+'\xa0\xa0\xa0'+addZero(hour)+':'+addZero(min)+':'+addZero(seconds);
            //     }
            //     function addZero(some) {
            //         if (some<10){
            //             return '0'+some
            //         }else {
            //             return some
            //         }
            //     };
            //     return time
            // },
            sortGql(data) {
                let gqlName, api;
                if (data.name == '开始时间') {
                    gqlName = 'getInventoryListStartTime'
                } else {
                    gqlName = 'getInventoryListEndTime'
                }
                if (data.order == 'descending') {
                    api = gqlName + 'DESC';
                } else {
                    api = gqlName + 'ASC';
                }
                this.$set(this.table.graphqlTable, 'graphqlApi', record[api]);
            }
        }
    }
</script>

<style scoped>
    .inventory {
        font-size: 16px;
    }
    .line {
        border-top: rgba(112, 112, 112, 0.13) solid 1px;
    }
</style>