<template>
    <div class="entryAndExit">
        <my-header :title="'人员出入记录'" :searchFlag="false"></my-header>
        <r_search :placeholder="'人员姓名'" @handleSearch="handleSearch"></r_search>
        <r_label :table="table" @clickTable="clickTable"
                 ref="las"></r_label>
        <r_video ref="recordVideo" :src="address"></r_video>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header'
    import r_search from 'components/record/recordSearch'
    import r_video from 'components/record/recordDialog'
    import r_label from 'common/vue/ajaxTabel'
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
                    flag: false,
                    labelList: [
                        {lable: '出入人员', field: 'name',sort:false},
                        {lable: '出入时间', field: 'time', filter: (ns) => this.$filterTime(parseInt(ns.time))},
                        {lable: '出入状态', field: 'access', filter: this.filterStatus}
                    ],
                    tableAction:{
                        label:'操作',
                        button:[{name:'监控',type:'primary'}]
                    },
                    url:'/person-access-records',
                    search:'',
                    params:{direction:'DESC',property:'time'},
                },
                address:''
            }
        },
        methods:{
            handleSearch(data){
                this.$set(this.table, 'search', data);
                // if (data == '') {
                //     qfilter = {key: "id", operator: "ISNOTNULL"}
                // } else {
                //     let that = this;
                //     qfilter = {
                //         key: 'name',
                //         value: '%' + data + '%',
                //         operator: 'LIKE'
                //     };
                // }
                // this.$set(this.table.graphqlTable.graphqlKey, 'qfilter', qfilter);
            },
            clickTable(table) {
                let data = table.row;
                if (data) {
                    this.address=baseURL+'/records/'+data.videoAddress
                    this.$refs.recordVideo.show()
                }
            },
            // filterTime(nS) {
            //     return new Date(parseInt(nS.time)).toLocaleString().replace(/:\d{1,2}$/, ' ');
            // },
            filterStatus(nS){
                let status='出';
                if(nS.access=='IN'){
                    status = '入'
                }
                return status
            }
        }
    }
</script>

<style scoped>
    .entryAndExit{
        width: 100%;
        min-height: 4.4323rem;
    }
</style>
