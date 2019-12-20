<template>
    <div class="agency-matters">
        <my-header :title="'已办事宜'" :searchFlag="false" :haveBlack="!status.tableOrUniversalFlag" @h_black="black"></my-header>
        <div class="agency-matters_action_box" data-test="action_box" v-if="status.tableOrUniversalFlag">
            <div style="width: 10px;height: 10px"></div>
            <div class="action_right_box">
                <div style="width: 1.6875rem">
                    <p_search @search="getSearch" :placeholder="'标题/工作流'"></p_search>
                </div>
            </div>
        </div>
        <div class="agency-matters_main_box" data-test="main_box">
            <div class="main_table_box" data-test="table_box">
                <div style="padding: 0px 0.09375rem"><p_table ref="processTable" :table="table" :typeUrl="'process'" :otherParams="true" @clickTable="clickTable" v-if="status.tableOrUniversalFlag"></p_table></div>
                <p_universal @back="black" :url="universal.url" :title="universal.title" :universalObj="universal.universalObj" v-if="!status.tableOrUniversalFlag"></p_universal>
            </div>
        </div>
        <select_apply ref="selectApply" @sucessApply="sucessApply"></select_apply>
    </div>
</template>

<script>
    import textButton from 'components/base/textButton'
    import p_search from 'components/base/search'
    import p_table from 'common/vue/ajaxTabel'
    import select_apply from 'components/process/processDialog/selectApplyProcess'
    import p_universal from 'components/process/universal'
    import myHeader from 'components/base/header/header'
    import {historyProcessInstancesById} from 'api/process'
    export default {
        name: "myProcess",
        components:{
            textButton,p_search,p_table,select_apply,p_universal,myHeader
        },
        data(){
            return{
                table: {
                    labelList: [
                        {lable: '请求标题', field: 'processInstanceName'},
                        {lable: '任务名称', field: 'name'},
                        {lable: '办理时间', field: 'endTime', filter: (ns) => this.$filterTime(ns.endTime)},
                        {lable: '处理用时', field: 'endTime', filter: (ns) => this.minuteFormate(ns.endTime-ns.createTime)}
                    ],
                    align:'left',
                    height:'618px',
                    url:'/workflow/done-task',
                    tableAction:{
                        label:'操作',
                        button:[{name:'详情',type:'primary'}]
                    },
                    params:{assignee:JSON.parse(localStorage.getItem('user')).id},
                    search:''
                },
                universal:{},
                status:{
                    tableOrUniversalFlag:true,
                }
            }
        },
        methods:{
            minuteFormate(my_time){
                let days    = my_time / 1000 / 60 / 60 / 24;
                let daysRound = Math.floor(days);
                let hours = my_time / 1000 / 60 / 60 - (24 * daysRound);
                let hoursRound = Math.floor(hours);
                let minutes = my_time / 1000 / 60 - (24 * 60 * daysRound) - (60 * hoursRound);
                let minutesRound = Math.floor(minutes);
                let seconds = my_time / 1000 - (24 * 60 * 60 * daysRound) - (60 * 60 * hoursRound) - (60 * minutesRound);
                console.log('转换时间:', daysRound + '天', hoursRound + '时', minutesRound + '分', seconds + '秒');
                let time = '';
                let h,m,s;
                if(hoursRound===0){
                    h=''
                }else {
                    h=hoursRound+'小时'
                }
                if(minutesRound===0){
                    m=''
                }else {
                    m=minutesRound+'分钟'
                }
                if(seconds===0){
                    s=''
                }else {
                    s=seconds.toFixed(2)+'秒'
                }
                time=h+m+s;
                return time
            },
            filterTime(ns){
                return ns.endTime-ns.startTime
            },
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
                switch (ns.processDefinitionKey) {
                    case "SCRAP":
                        return '报废流程';
                    case "TRANSFER":
                        return '调拨流程';
                    case "DIRECT_ALLOT":
                        return '直调流程'
                }
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
                historyProcessInstancesById(table.row.processInstanceId).then(res=>{
                    this.universal={title:this.getTitle(res.processDefinitionKey),universalObj:res};
                    let url;
                    switch (this.universal.title) {
                        case "报废":
                            url={outHouse:''} ;
                            break;
                        case "调拨":
                            url={transfer:'/workflow/transfer/to-excel?processInstanceId='};
                            break;
                        case "直调":
                            url={transfer:'/workflow/direct-allot/to-excel?processInstanceId='};
                            break;
                    }
                    this.universal.url=url;
                    this.status.tableOrUniversalFlag=!this.status.tableOrUniversalFlag;
                }).catch(err=>{
                    this.$message.error(err.response.data.message);
                })

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