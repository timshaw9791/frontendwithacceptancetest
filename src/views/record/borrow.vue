<template>
    <div class="borrow">
        <my-header :title="'装备领还记录'" :searchFlag="false"></my-header>
        <r_search :placeholder="'装备名称'" @handleSearch="handleSearch"></r_search>
        <r_label :table="table" v-show="table.flag" @clickTable="clickTable" @sortCondition="sortGql"
                 ref="las"></r_label>
        <r_video ref="recordVideo" :src="address"></r_video>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header'
    import r_search from 'components/record/recordSearch'
    import r_video from 'components/record/recordDialog'
    import r_label from 'common/vue/label'
    import record from 'gql/record.gql'

    export default {
        name: "borrow",
        components: {
            myHeader,
            r_search,
            r_label,
            r_video
        },
        data() {
            return {
                table: {
                    flag: true,
                    labelList: [
                        {lable: 'RFID', field: 'equipInfo.equipRfid', sort: false},
                        {lable: '装备名称', field: 'equipArgInfo.equipName', sort: false},
                        {lable: '装备序号', field: 'equipInfo.equipSerial', filter: this.filterSerial, sort: false},
                        {lable: '操作人员', field: 'operator', sort: false},
                        {lable: '操作时间', field: 'startTime', filter: this.filterTime, sort: 'custom'},
                        {lable: '操作状态', field: 'action', filter: this.filterAction}
                    ],
                    tableAction:{
                        label:'监控视频',
                        button:['查看']
                    },
                    graphqlTable: {
                        graphqlApi: record.getEquipActionRecordList,
                        graphqlKey: {
                            qfilter: {
                                key: "action", value: 'RECEIVE_RETURN', operator: "EQUEAL", combinator: "OR", next: {
                                    key: "action", value: 'RECEIVE', operator: "EQUEAL"
                                }
                            }
                        }
                    },
                    equipId: '',
                    namelike:''
                },
                address:''
            }
        },
        methods: {
            handleSearch(data) {
                let qfilter;
                this.$set(this.table, 'namelike', data);
                if (data == '') {
                    qfilter = {
                        key: "action", value: 'RECEIVE_RETURN', operator: "EQUEAL", combinator: "OR", next: {
                            key: "action", value: 'RECEIVE', operator: "EQUEAL"
                        }
                    }
                } else {
                    let that = this;
                    let copyQ = {
                        key: "action", value: 'RECEIVE_RETURN', operator: "EQUEAL", combinator: "OR", next: {
                            key: "action", value: 'RECEIVE', operator: "EQUEAL"
                        }
                    };
                    qfilter = {
                        key: 'equipArgInfo.equipName',
                        value: '%' + data + '%',
                        operator: 'LIKE',
                        combinator: 'AND',
                        next: copyQ
                    };
                }
                this.$set(this.table.graphqlTable.graphqlKey, 'qfilter', qfilter);
            },
            clickTable(table) {
                let data = table.row;
                if (data) {
                    this.address='http://192.168.50.15:8080/warehouse/records/'+data.videoAddress;
                    this.$refs.recordVideo.show()
                }
            },
            sortGql(data) {
                if (data.order == 'descending') {
                    this.$set(this.table.graphqlTable, 'graphqlApi', record.getEquipActionRecordListDESC);
                } else {
                    this.$set(this.table.graphqlTable, 'graphqlApi', record.getEquipActionRecordListASC);
                }
            },
            filterTime(nS) {
                return new Date(parseInt(nS.startTime)).toLocaleString().replace(/:\d{1,2}$/, ' ');
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