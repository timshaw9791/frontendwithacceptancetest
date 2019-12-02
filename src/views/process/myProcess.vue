<template>
    <div class="my_process">
        <div class="my_process_header" data-test="title_box">
            {{$route.meta.title}}
        </div>
        <div class="my_process_action_box" data-test="action_box">
            <text-button :iconSize="20" :iconClass="'加号'" :buttonName="'申请流程'" @click="apply"></text-button>
            <div class="action_right_box">
                <div style="width: 1.6875rem">
                    <p_search @search="getSearch" :placeholder="'标题/工作流'"></p_search>
                </div>
            </div>
        </div>
        <div class="my_process_main_box" data-test="main_box">
            <div class="main_table_box" data-test="table_box">
                <p_table :table="table" :typeUrl="'process'" :otherParams="true" @clickTable="clickTable" ref="table"></p_table>
            </div>
        </div>
        <select_apply ref="selectApply"></select_apply>
    </div>
</template>

<script>
    import textButton from 'components/base/textButton'
    import p_search from 'components/base/search'
    import p_table from 'common/vue/ajaxTabel'
    import select_apply from 'components/process/processDialog/selectApplyProcess'
    export default {
        name: "myProcess",
        components:{
            textButton,p_search,p_table,select_apply
        },
        data(){
            return{
                table: {
                    labelList: [
                        {lable: '请求标题', field: 'action',filter: this.filterProcessName},
                        {lable: '工作流', field: 'operator', filter: this.filterProcessType},
                        {lable: '创建时间', field: 'startTime', filter: (ns) => this.$filterTime(ns.startTime)},
                        {lable: '当前节点', field: 'action'},
                        {lable: '未操作者', field: 'action'},
                    ],
                    url:'/history/process-instances/page',
                    tableAction:{
                        label:'操作',
                        button:[{name:'详情',type:'primary'}]
                    },
                    params:{startUserId:JSON.parse(localStorage.getItem('user')).id},
                    search:''
                }
            }
        },
        methods:{
            apply(){
                this.$refs.selectApply.show()
            },
            filterProcessType(ns){
                switch (ns.processDefinitionKey) {
                    case "SCRAP":
                        return '报废流程'
                }
            },
            filterProcessName(ns){
                let type,name=JSON.parse(localStorage.getItem('user')).name,time=(new Date(ns.startTime)).toLocaleDateString();
                switch (ns.processDefinitionKey) {
                    case "SCRAP":
                        type = '报废流程';
                       break;
                }
                return type+'-'+name+'-'+time.replace(/\//g,'-')
            },
            getSearch(data){
                this.table.search=data
            },
            clickTable(table) {

            }
        }
    }
</script>

<style lang="scss" scoped>
    .my_process{
        width: 100%;
        color:#707070FF;
        font-size: 16px;
    }
    .my_process .my_process_header{
        height: 0.3021rem;
        width: 100%;
        font-size: 20px;
        display: flex;
        align-items: center;
        padding-left: 0.09375rem;
        border-bottom:0.0052rem solid rgba(112,112,112,0.13);
    }
    .my_process .my_process_action_box{
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
    .my_process_action_box .action_right_box{

    }
</style>