<template>
    <div class="opening-box">
        <my-header :title="'开门记录'" :searchFlag="false"></my-header>
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
    import r_label from 'common/vue/ajaxLabel'
    import {baseURL} from "../../api/config";

    export default {
        name: "opening",
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
                        {lable: '开门人员', field: 'policeName',sort:false},
                        {lable: '开门时间', field: 'time', filter: (ns) => this.$filterTime(parseInt(ns.time))},
                    ],
                    url:'/gate-open-records',
                    search:'',
                    params:{direction:'DESC',property:'time'},
                    tableAction:{
                        label:'操作',
                        button:[{name:'监控',type:'primary'}]
                    },
                },
                address:''
            }
        },
        methods:{
            handleSearch(data) {
                this.$set(this.table, 'search', data);
            },
            clickTable(table) {
                let data = table.row;
                if (data) {
                    console.log(data);
                    this.address=baseURL+'/records/'+data.videoAddress;
                    this.$refs.recordVideo.show()
                }
            },
            // filterTime(nS) {
            //     return new Date(parseInt(nS.time)).toLocaleString().replace(/:\d{1,2}$/, ' ');
            // },
            sortGql(data){
                if (data.order=='descending'){
                    this.$set(this.table.graphqlTable,'graphqlApi', record.getGateOpenRecordListDESC);
                }else {
                    this.$set(this.table.graphqlTable,'graphqlApi', record.getGateOpenRecordListASC);
                }
                this.$refs.las.refetch();
            },
        }
    }
</script>

<style scoped>
.opening-box{
    width: 100%;
    min-height: 851px;
}
</style>
