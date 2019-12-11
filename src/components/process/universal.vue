<template>
    <div>
        <div class="header">
            <div>{{ title }}申请单</div>
            <div class="header-button">
                <el-button v-if="isReject" class="universal-header-button" @click="cancel">作废</el-button>
                <el-button v-if="isReject" class="universal-header-button" @click="refill">重填</el-button>
                <el-button v-if="isOutHouse" class="universal-header-button" @click="outHouse">出库</el-button>
                <el-button v-if="isInHouse" class="universal-header-button" @click="inHouse">入库</el-button>
                <text-button style="margin-left: 0.125rem" :iconClass="'导出'" :buttonName="'导出'" @click="transfer"></text-button>
            </div>
        </div>
        <div class="body">
            <div class="info">
                <div>申请单号: {{ universalObj.processVariables.applyOrder.number}}</div>
                <div v-show="notScrap">接收机构: {{ universalObj.processVariables.applyOrder.inboundOrganUnit.name}}</div>
                <div v-show="notScrap">出库机构: {{ universalObj.processVariables.applyOrder.outboundOrganUnit.name }}</div>
                <div>申请时间: {{this.$filterTime(universalObj.processVariables.applyOrder.applyTime)}}</div>
                <div v-show="notScrap">接收库房: {{ universalObj.processVariables.applyOrder.inboundWarehouse.name}}</div>
                <div v-show="notScrap">出库库房: {{ universalObj.processVariables.applyOrder.outboundWarehouse?universalObj.processVariables.applyOrder.outboundWarehouse.name:'-'}}</div>
                <div>申请人员: {{ universalObj.processVariables.applyOrder.applicant.name }}</div>
                <div v-show="notScrap">接收人员: {{ universalObj.processVariables.applyOrder.inboundUser.name}}</div>
                <div v-show="notScrap">出库人员: {{universalObj.processVariables.applyOrder.outboundUser?universalObj.processVariables.applyOrder.outboundUser.name:'-'}}</div>
                <div v-show="!notScrap">报废原因: {{ form.note }}</div>
            </div>
            <div>装备统计:</div>
            <el-table :data="universalObj.processVariables.applyOrder.equips" height="350" style="border: 1px solid #ccc;margin-top: 6px">
                <bos-table-column lable="装备名称" field="name"></bos-table-column>
                <bos-table-column lable="装备型号" field="model"></bos-table-column>
                <bos-table-column lable="装备数量" field="count"></bos-table-column>
            </el-table>
            <div class="process">
                <div class="title">审批流程</div>
                <div class="process-info" v-for="(item, i) in processList" :key="i" v-show="item.name">
                    <div class="people">{{ item.lable }}人员</div>
                    <div>{{ item.name }}</div>
                    <div class="pass" v-if="item.passVal == 1">通过</div>
                    <div class="turn" v-else-if="item.passVal == 2">驳回 <a style="color: #2F2F76" @click="lookReson(item.note)">[查看原因]</a></div>
                    <div v-else></div>
                    <div>{{ item.lable }}时间:</div>
                    <div>{{ item.time }}</div>
                </div>
            </div>
        </div>
        <service-dialog title="查看原因" ref="reson" :button="false" :secondary="false" confirmInfo="提交">
            驳回原因: <el-input type="textarea" v-model="reson" :disabled="true" :autosize="true" resize="none" style="margin-top: 6px"></el-input>
        </service-dialog>
        <service-dialog title="提示" ref="cancel" :button="true" :secondary="false" confirmInfo="提交" @confirm="closeApply">
           <div class="cancel">您确定要作废此申请单吗？</div>
        </service-dialog>
        <select_apply ref="selectUniversalApply" :taskId="activeTask.id" @sucessApply="sucessRefill"></select_apply>
        <t_dialog ref="transferDialog" @outHouse="outHouseByProcess" :typeOperational="typeOperational" :directObj="directObj" @sucesssInOrOut="sucesssInOrOut"></t_dialog>
    </div>
</template>

<script>
    import serviceDialog from "components/base/serviceDialog"
    import { historyTasks,activeTasks,workflow,equipsOutbound } from "api/process"
    import textButton from 'components/base/textButton'
    import select_apply from 'components/process/processDialog/selectApplyProcess'
    import t_dialog from 'components/process/transfer/transferDialog'
    export default {
        name: 'doneuniversal',
        data() {
            return {
                form: {
                    applyOrderId: '',
                    receiveAgency: '',
                    outAgency: '',
                    applyTime: '',
                    receiveStore: '',
                    outStore: '',
                    applyPeople: '',
                    receivePeople: '',
                    outPeple: '',
                    note: '',
                    taskId: '', // 申请单id
                    processInstanceId: '', // 申请单流程id
                },
                directObj:{},
                activeTask:{},
                list: [],
                typeOperational:'',
                processList: [],
                nextForm: {
                    value: '', // 所选的
                    nextList: [], // 下一级人员
                },
                reson: '', // 某流程驳回原因
                resonAble: true, // 驳回原因是否可以填写
                highest: false, // 是否是最高等级
                notScrap: true,
            }
        },
        methods: {
            transfer(){

            },
            sucesssInOrOut() {
                this.$refs.transferDialog.close();
                this.$emit('closeBill', true);
            },
            inHouse(){
                this.$set(this,'directObj',this.universalObj);
                this.typeOperational='入库';
                console.log(this.directObj)
                this.$refs.transferDialog.showDialog();
            },
            outHouse(){
                this.$set(this,'directObj',this.universalObj);
                console.log(this.directObj)
                this.typeOperational='出库';
                this.$refs.transferDialog.showDialog();
            },
            outHouseByProcess(data){
                let url=`${this.url.outHouse}?note=${data.note}&taskId=${this.activeTask.id}`;
                equipsOutbound(url,data.equips).then(res=>{
                   this.$message.success('操作成功');

                })
            },
            sucessRefill(){
                this.$emit('back',true)
            },
            toReview() {
                this.$refs.review.show()
            },
            refill(){
                let ref;
                switch (this.universalObj.processDefinitionKey) {
                    case "TRANSFER":
                        ref='allocation';
                }
                this.$refs.selectUniversalApply.apply(ref)
            },
            cancel(){
                this.$refs.cancel.show();
            },
            closeApply(){
                workflow(this.universalObj.id,JSON.parse(localStorage.getItem("user")).id).then(res=>{
                    this.$message.success('操作成功');
                    this.$emit('back',true)
                })
            },
            // getListInfo() {
            //     let params = {includeprocessVariables: true};
            //     doneDetail(this.listId, params).then(res => {
            //         console.log(res);
            //         let result = JSON.parse(JSON.stringify(res.processVariables)), mergeName = '', have = '';
            //         this.form = {
            //             applyOrderId: '',
            //             applyTime: result.applyOrder.applyTime,
            //             applyPeople: result.applyOrder.applicant.name,
            //             note: result.applyOrder.note,
            //             taskId: res.id,
            //             processInstanceId: res.id
            //         };
            //         this.processReviewInfo();
            //         this.mergeList(result.applyOrder.equips)
            //     })
            // },
            // mergeList(array) {
            //     let arr = JSON.parse(JSON.stringify(array)), mergeName = '', have = 0, tempList = [];
            //     arr.forEach(equip => {
            //         mergeName = `${equip.name}${equip.model}`
            //         have = arr.findIndex(item => item.mergeName == mergeName)
            //         if(have != -1) {
            //             tempList[have].count++
            //         } else {
            //             tempList.push(Object.assign({}, equip, {count: 1, mergeName}))
            //         }
            //     });
            //     this.list = tempList
            //     arr = null
            //     mergeName = null
            //     have = null
            //     tempList = null
            // },
            processReviewInfo() {
                let params = {processInstanceId: this.universalObj.id, includeprocessVariables: false, includeTaskprocessVariables: true},
                    lable = "";
                historyTasks(params).then(res => {
                    let tempList = [];
                    res.forEach(item => {
                        switch (item.taskDefinitionKey) {
                            case 'apply':
                                lable = "申请";
                                break;
                            case 'audit':
                                lable = "审核";
                                break;
                            default:
                                lable = "审批";
                                break;
                        }
                        tempList.push({
                            lable,
                            name: item.taskprocessVariables.name,
                            passVal: item.taskprocessVariables.pass == undefined?0:item.taskprocessVariables.pass?1:2,
                            note: item.taskprocessVariables.note || '',
                            time: item.endTime?this.$filterTime(item.endTime):'-'
                        })
                    });
                    this.processList = tempList
                })
            },
            lookReson(reson) {
                this.reson = reson;
                this.$refs.reson.show()
            },
            activeTasks(){
                if(this.$route.meta.title==='我的流程'){
                    activeTasks({includeprocessVariables:true,includeTaskprocessVariables:true,processInstanceId:this.universalObj.id}).then(res=>{
                        this.activeTask=res;
                    })
                }else if(this.$route.meta.title==='代办事宜'){
                    this.activeTask.id=this.universalObj.id
                }

            }
        },
        computed:{
            isReject(){
                let flag;
                this.activeTask.taskDefinitionKey==='apply'?flag=true:flag=false;
                return flag
            },
            isInHouse(){
                let flag;
                this.universalObj.taskDefinitionKey==='equips_inbound_house'?flag=true:flag=false;
                return flag
            },
            isOutHouse(){
                let flag;
                this.universalObj.taskDefinitionKey==='equips_outbound_house'?flag=true:flag=false;
                return flag
            }
        },
        created() {
            this.activeTasks();
            this.processReviewInfo();
            if(this.title == '报废') {
                this.notScrap = false
            }
        },
        props: {
            title: {
                type: String,
                default: ""
            },
            listId: {
                type: [String, Number],
                default: ''
            },
            universalObj:{
                type: Object
            },
            url:{
                type: Object
            }
        },
        components: {
            serviceDialog,
            textButton,
            select_apply,
            t_dialog
        }
    }
</script>

<style lang="scss" scoped>
    .operate {
        color: #2E2E74;
    }
    .cancel{
        width: 100%;
        height: 1.0417rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
    }
    .header {
        padding: 0 35px 0 18px;
        height: 56px;
        line-height: 35px;
        border-bottom: 1px solid rgba(112,112,112, 0.13);
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .header .header-button{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .header-button .universal-header-button{
        width:70px;
        height:32px;
        border:1px solid rgba(47,47,118,1);
        opacity:1;
        line-height: 0px;
        border-radius:4px;
    }
    .body {
        width: 800px;
        height: 600px;
        margin: 20px auto;
        font-size: 16px;
        font-family:PingFang SC;

        .info {
            display: grid;
            grid-template-columns: auto auto auto;
            grid-template-rows: 23px 23px 23px;
            grid-row-gap: 3px;
            width: 100%;
            color: #707070;
        }
        .process {
            width: 100%;
            height: 100px;
            margin-top: 10px;
            color: #707070;
            .title {
                padding-bottom: 3px;
                border-bottom: 1px solid #ccc;
            }
            .process-info {
                display: grid;
                grid-template-columns: 15% 30% 25% 10% 20%;
                padding: 6px 0;
                border-bottom: 1px solid #ccc;
                align-items: center;
                .people {
                    color: #2F2F76;
                }
                .pass {
                    color: #009B4C;
                }
                .turn {
                    color: #EF4545;
                }
            }
        }
    }
    /deep/.el-table__body-wrapper::-webkit-scrollbar {
        width: 6px;
    }
    /deep/.el-table__body-wrapper::-webkit-scrollbar-thumb {
        background: rgba(47,47,118,0.37);
        border-radius: 20px;
    }
</style>