<template>
    <div class="agency-matters">
        <my-header :title="'代办事宜'" :searchFlag="false" :haveBlack="!status.tableOrUniversalFlag" @h_black="black"></my-header>
        <!--<div class="agency-matters_action_box" data-test="action_box" v-if="status.tableOrUniversalFlag">-->
            <!--<div class="action_right_box">-->
                <!--<div style="width: 1.6875rem">-->
                    <!--<p_search @search="getSearch" :placeholder="'标题/工作流'"></p_search>-->
                <!--</div>-->
            <!--</div>-->
        <!--</div>-->
        <div class="agency-matters_main_box" data-test="main_box">
            <div class="main_table_box" data-test="table_box">
                <p_table ref="processTable" :table="table" :typeUrl="'process'" :otherParams="true" @clickTable="clickTable" v-if="status.tableOrUniversalFlag"></p_table>
                <p_universal @back="black" :title="universal.title" :universalObj="universal.universalObj" v-if="!status.tableOrUniversalFlag"></p_universal>
            </div>
        </div>
    </div>
</template>

<script>
    import p_search from 'components/base/search'
    import p_table from 'common/vue/ajaxTabel'
    import select_apply from 'components/process/processDialog/selectApplyProcess'
    import p_universal from 'components/process/universal'
    import myHeader from 'components/base/header/header'
    export default {
        name: "myProcess",
        components:{
            p_search,p_table,select_apply,p_universal,myHeader
        },
        data(){
            return{
                table: {
                    labelList: [
                        {lable: '请求标题', field: 'action',filter: this.filterProcessName},
                        {lable: '工作流', field: 'operator', filter: this.filterProcessType},
                        {lable: '创建时间', field: 'startTime', filter: (ns) => this.$filterTime(ns.createTime)},
                    ],
                    height:'618px',
                    url:'/tasks/page',
                    tableAction:{
                        label:'操作',
                        button:[{name:'详情',type:'primary'}]
                    },
                    params:{assignee:JSON.parse(localStorage.getItem('user')).id,includeTaskVariables:true,includeProcessVariables:true},
                    search:''
                },
                universal:{

                },
                status:{
                    tableOrUniversalFlag:true,

                }
            }
        },
        methods:{
            black(){
                this.status.tableOrUniversalFlag=!this.status.tableOrUniversalFlag;
            },
            apply(){
                this.$refs.selectApply.show()
            },
            sucessApply(){
                this.$refs.processTable.refetch()
            },
            filterProcessType(ns){
                switch (ns.processVariables.processConfig.type) {
                    case "SCRAP":
                        return '报废流程';
                    case "TRANSFER":
                        return '调拨流程';
                    case "DIRECT_ALLOT":
                        return '直调流程'
                }
            },
            filterProcessName(ns){
                let type,name=JSON.parse(localStorage.getItem('user')).name,time=(new Date(ns.startTime)).toLocaleDateString();
                switch (ns.processVariables.processConfig.type) {
                    case "SCRAP":
                        type = '报废流程';
                        break;
                    case "TRANSFER":
                        type = '调拨流程';
                        break;
                    case "DIRECT_ALLOT":
                        type = '直调流程';
                        break;
                }
                return type+'-'+name+'-'+time.replace(/\//g,'-')
            },
            getSearch(data){
                this.table.search=data
            },
            getTitle(type){
                switch (type) {
                    case "SCRAP":
                        return '报废';
                    case "TRANSFER":
                        return '调拨';
                    case "DIRECT_ALLOT":
                        return '直调'
                }
            },
            clickTable(table) {
                this.universal={title:this.getTitle(table.row.processVariables.processConfig.type),universalObj:table.row};
                console.log(this.universal);
                this.status.tableOrUniversalFlag=!this.status.tableOrUniversalFlag;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .agency-matters{
        width: 100%;
        color:#707070FF;
        font-size: 16px;
    }
    .agency-matters .agency-matters_header{
        height: 0.3021rem;
        width: 100%;
        font-size: 20px;
        display: flex;
        align-items: center;
        padding-left: 0.09375rem;
        border-bottom:1px solid rgba(112,112,112,0.13);
    }
    .agency-matters .agency-matters_action_box{
        height: 0.2917rem;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-left: 0.09375rem;
        padding-right: 0.1198rem;
        color: #2F2F76FF!important;
        border-bottom:0.0052rem solid rgba(112,112,112,0.13);
    }
    .agency-matters_action_box .action_right_box{

    }
</style>