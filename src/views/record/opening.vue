<template>
    <div>
        <my-header :title="'开门记录'" :searchFlag="false"></my-header>
        <r_search :placeholder="'人员姓名'" @handleSearch="handleSearch"></r_search>
        <r_label :table="table" v-show="table.flag" @clickTable="clickTable" @sortCondition="sortGql" ref="las"></r_label>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header'
    import r_search from 'components/record/recordSearch'
    import r_label from 'common/vue/label'
    import record from 'gql/record.gql'
    export default {
        name: "opening",
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
                        {lable: '开门人员', field: 'name',sort:false},
                        {lable: '开门时间', field: 'time', filter: this.filterTime,sort:'custom'},
                    ],
                    graphqlTable: {
                        graphqlApi: record.getGateOpenRecordList,
                        graphqlKey: {qfilter: {key: "id", operator: "ISNOTNULL"}}
                    },
                    tableAction:{
                        label:'监控视频',
                        button:['查看']
                    }
                },
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
                    this.table.equipId = data.id;
                    this.table.flag=!this.table.flag
                }
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

</style>