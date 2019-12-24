<template>
    <div class="agency-matters">
        <my-header :title="'申请单列表'" :searchFlag="false" :haveBlack="!status.tableOrUniversalFlag" @h_black="black"></my-header>
        <div class="agency-matters_action_box" data-test="action_box" v-if="status.tableOrUniversalFlag">
            <div class="click-box">
                <div v-for="item in clickButton" class="click-item" @click="clickApplication(item)">
                    <span v-text="item.name"></span>
                    <div class="click-line" v-if="item.click"></div>
                </div>
                <div class="click-item" style="color: #2F2F76FF">
                    <el-checkbox v-model="checkStatus">异常</el-checkbox>
                </div>
            </div>
            <div class="action_right_box">
                <div style="width: 1.6875rem">
                    <p_search @search="getSearch" :placeholder="'标题'"></p_search>
                </div>
            </div>
        </div>
        <div class="agency-matters_main_box" data-test="main_box">
            <div class="main_table_box"  data-test="table_box">
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
    import {transferApply} from 'api/process'
    export default {
        name: "myProcess",
        components:{
            textButton,p_search,p_table,select_apply,p_universal,myHeader
        },
        data(){
            return{
                table: {
                    type:'调拨',
                    labelList: [
                        {lable: '请求标题', field: 'title'},
                        {lable: '出库机构', field: 'outboundOrganUnit.name'},
                        {lable: '出库人员', field: 'outboundUser.name'},
                        {lable: '接收机构', field: 'inboundOrganUnit.name'},
                        {lable: '接收人员', field: 'inboundUser.name'},
                        {lable: '申请时间', field: 'applyTime', filter: (ns) => this.$filterTime(ns.applyTime)},
                    ],
                    align:'left',
                    height:'618px',
                    url:'/workflow/transfer/apply-orders',
                    tableAction:{
                        label:'操作',
                        button:[{name:'详情',type:'primary'}]
                    },
                    params:{assignee:JSON.parse(localStorage.getItem('user')).id},
                    search:'',
                    clickUrl:'/workflow/transfer/order-details?transferApplyOrderId='
                },
                checkStatus:'',
                clickButton:[{name:'调拨申请单',click:true},{name:'直调申请单',click:false},{name:'报废申请单',click:false}],
                universal:{},
                status:{
                    tableOrUniversalFlag:true,

                }
            }
        },
        watch:{
            'checkStatus':{
                handler(newVal) {
                    if(newVal){
                        this.table.params={...this.table.params,state:'ABNORMAL'}
                    }else{
                        this.table.params={assignee:JSON.parse(localStorage.getItem('user')).id}
                    }
                }
            }
        },
        methods:{
            clickApplication(item){
                this.clickButton.forEach(clickItem=>{
                    if(clickItem===item){
                        item.click=true;
                    }else {
                        clickItem.click=false;
                    }
                });
                let table={};
                if(item.name==='调拨申请单'){
                    table={
                        type:'调拨',
                        labelList: [
                            {lable: '请求标题', field: 'title'},
                            {lable: '出库机构', field: 'outboundOrganUnit.name'},
                            {lable: '出库人员', field: 'outboundUser.name'},
                            {lable: '接收机构', field: 'inboundOrganUnit.name'},
                            {lable: '接收人员', field: 'inboundUser.name'},
                            {lable: '申请时间', field: 'applyTime', filter: (ns) => this.$filterTime(ns.applyTime)},
                        ],
                        url:'/workflow/transfer/apply-orders',
                        clickUrl:'/workflow/transfer/order-details?transferApplyOrderId='
                    }
                }else if (item.name==='直调申请单') {
                    table={
                        type:'直调',
                        labelList: [
                            {lable: '请求标题', field: 'title'},
                            {lable: '出库机构', field: 'outboundOrganUnit.name'},
                            {lable: '出库人员', field: 'outboundUser.name'},
                            {lable: '接收机构', field: 'inboundOrganUnit.name'},
                            {lable: '接收人员', field: 'inboundUser.name'},
                            {lable: '申请时间', field: 'applyTime', filter: (ns) => this.$filterTime(ns.applyTime)},
                        ],
                        url:'/workflow/direct-allot/apply-orders',
                        clickUrl:'/workflow/direct-allot/order-details?directApplyOrderId='
                    }
                }else {
                    table={
                        type:'报废',
                        labelList: [
                            {lable: '请求标题', field: 'title'},
                            {lable: '操作人员', field: 'applicant.name'},
                            {lable: '申请时间', field: 'applyTime', filter: (ns) => this.$filterTime(ns.applyTime)},
                        ],
                        url:'/workflow/scrap/scrap-orders',
                        clickUrl:'/workflow/scrap/order-details?scrapApplyOrderId='
                    }
                }
                _.update(this.table, 'type', ()=>{ return table.type});
                _.update(this.table, 'labelList', ()=>{ return table.labelList});
                _.update(this.table, 'url', ()=>{ return table.url});
                _.update(this.table, 'clickUrl', ()=>{ return table.clickUrl});
                this.$refs.processTable.refetch();
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
            clickTable(table) {
                console.log(table.row)
                let url =this.table.clickUrl+table.row.id;
                transferApply(url).then(res=>{
                    console.log(res);
                    this.universal={title:this.table.type,universalObj:{id:res.id,processVariables:{applyOrder:res}}};
                    this.status.tableOrUniversalFlag=!this.status.tableOrUniversalFlag;
                    let url;
                    switch (this.universal.title) {
                        case "报废":
                            url={transfer:'/workflow/scrap/order-to-excel?applyOrderId='};
                            break;
                        case "调拨":
                            url={transfer:'/workflow/transfer/order-to-excel?applyOrderId='};
                            break;
                        case "直调":
                            url={transfer:'/workflow/direct-allot/order-to-excel?applyOrderId='};
                            break;
                    }
                    this.universal.url=url;
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
    .click-box{
        display: flex;
        flex-direction: row;
        height: 100%;
       .click-item{
           position: relative;
           height: 100%;
           display: flex;
           align-items: center;
           margin-right: 0.1771rem;cursor: pointer;
           .click-line{
               position: absolute;
               width:100%;
               margin-top: 0.0573rem;
               height:0.026rem;
               bottom: 0px;
               background:rgba(112,112,112,0.53);
               border-radius:0.0833rem;
           }
       }


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