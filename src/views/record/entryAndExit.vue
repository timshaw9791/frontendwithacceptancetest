<template>
    <div>
        <my-header :title="'开门记录'" :searchFlag="false"></my-header>
        <r_search :placeholder="'装备名称'" @handleSearch="handleSearch"></r_search>
        <r_label :table="table" v-show="table.flag" @clickTable="clickTable" @sortCondition="sortGql" ref="las"></r_label>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header'
    import r_search from 'components/record/recordSearch'
    import r_label from 'common/vue/label'
    import record from 'gql/record.gql'
    export default {
        name: "entryAndExit",
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
                        {lable: '出入人员', field: 'user',sort:false},
                        {lable: '出入时间', field: 'endTime', filter: this.filterTime,sort:'custom'},
                        {lable: '出入状态', field: 'status', filter: this.filterTime,sort:'custom'}
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
            }
        },
        methods:{
            handleSearch(data){
                console.log(data);
            },
            clickTable(table) {
                let data = table.row;
                if (data) {
                    this.table.equipId = data.id;
                    this.table.flag=!this.table.flag
                }
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

</style>