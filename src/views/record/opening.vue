<template>
    <div class="opening-box">
        <my-header :title="'开门记录'" :searchFlag="false"></my-header>
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
                    flag: true,
                    labelList: [
                        {lable: '开门人员', field: 'policeName',sort:false},
                        {lable: '开门时间', field: 'time', filter: this.filterTime},
                    ],
                    graphqlTable: {
                        graphqlApi: record.getGateOpenRecordList,
                        graphqlKey: {qfilter: {key: "id", operator: "ISNOTNULL"}}
                    },
                    tableAction:{
                        label:'监控视频',
                        button:['查看']
                    },
                },
                address:''
            }
        },
        methods:{
            handleSearch(data) {
                let qfilter;
                if (data == '') {
                    qfilter = {key: "id", operator: "ISNOTNULL"};
                } else {
                    let that = this;
                    qfilter = {
                        key: 'policeName',
                        value: '%' + data + '%',
                        operator: 'LIKE',
                        combinator: 'AND',
                        next: this.table.graphqlTable.graphqlKey.qfilter
                    };
                }
                this.$set(this.table.graphqlTable.graphqlKey, 'qfilter', qfilter);
            },
            clickTable(table) {
                let data = table.row;
                if (data) {
                    console.log(data);
                    this.address='http://192.168.50.15:8080/warehouse/records/'+data.videoAddress;
                    this.$refs.recordVideo.show()
                }
            },
            filterTime(nS) {
                return new Date(parseInt(nS.time)).toLocaleString().replace(/:\d{1,2}$/, ' ');
            },
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
    min-height: 965px;
}
</style>