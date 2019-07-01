<template>
    <div class="entryAndExit">
        <my-header :title="'出入记录'" :searchFlag="false"></my-header>
        <r_search :placeholder="'装备名称'" @handleSearch="handleSearch"></r_search>
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
                        graphqlApi: record.getPersonAccessRecordList,
                        graphqlKey: {qfilter: {key: "id",operator: "ISNOTNULL"}}
                    },
                    tableAction:{
                        label:'监控视频',
                        button:['查看']
                    },
                    equipId:'',
                    haveButton: true
                },
                address:''
            }
        },
        methods:{
            handleSearch(data){
                console.log(data);
            },
            clickTable(table) {
                let data = table.row;
                if (data) {
                    this.address='http://10.128.4.152:8080/warehouse/records/2019-06-17-05-01-28_2019-06-17-05-01-38.mp4'
                    console.log(this.address);
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