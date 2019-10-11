<template>
    <div class="entryAndExit">
        <my-header :title="'人员出入记录'" :searchFlag="false"></my-header>
        <r_search :placeholder="'人员姓名'" @handleSearch="handleSearch"></r_search>
        <r_label :table="table" v-show="table.flag" @clickTable="clickTable" @sortCondition="sortGql" ref="las"></r_label>
        <r_video ref="recordVideo" :src="address"></r_video>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header'
    import r_search from 'components/record/recordSearch'
    import r_video from 'components/record/recordDialog'
    import r_label from 'common/vue/label'
    import record from 'gql/record.gql'
    import {baseURL} from "../../api/config";

    export default {
        name: "entryAndExit",
        components:{
            myHeader,
            r_search,
            r_label,
            r_video
        },
        data(){
            return{
                table: {
                    flag: true,
                    labelList: [
                        {lable: '出入人员', field: 'name',sort:false},
                        {lable: '出入时间', field: 'time', filter: this.filterTime},
                        {lable: '出入状态', field: 'access', filter: this.filterStatus}
                    ],
                    graphqlTable: {
                        graphqlApi: record.getPersonAccessRecordListDESC,
                        graphqlKey: {qfilter: {key: "id",operator: "ISNOTNULL"}}
                    },
                    tableAction:{
                        label:'监控视频',
                        button:['查看']
                    },
                    equipId:'',
                    haveButton: true,
                    namelike:''
                },
                address:''
            }
        },
        methods:{
            handleSearch(data){
                let qfilter;
                this.$set(this.table, 'namelike', data);
                if (data == '') {
                    qfilter = {key: "id", operator: "ISNOTNULL"}
                } else {
                    let that = this;
                    qfilter = {
                        key: 'name',
                        value: '%' + data + '%',
                        operator: 'LIKE'
                    };
                }
                this.$set(this.table.graphqlTable.graphqlKey, 'qfilter', qfilter);
            },
            clickTable(table) {
                let data = table.row;
                if (data) {
                    this.address=baseURL+'/records/'+data.videoAddress
                    this.$refs.recordVideo.show()
                }
            },
            filterTime(nS) {
                return new Date(parseInt(nS.time)).toLocaleString().replace(/:\d{1,2}$/, ' ');
            },
            filterStatus(nS){
                let status='出';
                if(nS.access=='IN'){
                    status = '入'
                }
                return status
            },
            sortGql(data){
                if (data.order == 'descending') {
                    this.$set(this.table.graphqlTable, 'graphqlApi', record.getPersonAccessRecordListDESC);
                } else {
                    this.$set(this.table.graphqlTable, 'graphqlApi', record.getPersonAccessRecordListASC);
                }
            },
        }
    }
</script>

<style scoped>
    .entryAndExit{
        width: 100%;
        min-height: 965px;
    }
</style>
