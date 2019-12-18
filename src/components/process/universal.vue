<template>
    <div>
        <div class="header">
            <div>{{ title }}申请单</div>
            <div class="header-button">
                <el-button v-if="isReject" class="universal-header-button" @click="cancel">作废</el-button>
                <el-button v-if="isReject" class="universal-header-button" @click="refill">重填</el-button>
                <el-button v-if="isOutHouse" class="universal-header-button" @click="outHouse">出库</el-button>
                <el-button v-if="isInHouse" class="universal-header-button" @click="inHouse">入库</el-button>
                <text-button v-if="haveInHouse" style="margin-left: 0.125rem" :iconClass="'查看出库单'" :buttonName="'查看入库单'" @click="lookInHouse"></text-button>
                <text-button v-if="haveOutHouse" style="margin-left: 0.125rem" :iconClass="'查看出库单'" :buttonName="'查看出库单'" @click="lookOutHouse"></text-button>
                <text-button style="margin-left: 0.125rem" v-if="title!=='报废'" :iconClass="'导出'" :buttonName="'导出'" @click="transfer"></text-button>
            </div>
        </div>
        <div class="body">
            <div class="info">
                <div>申请单号: {{universalObj.processVariables.applyOrder.number}}</div>
                <div v-if="notScrap">接收机构: {{ universalObj.processVariables.applyOrder.inboundOrganUnit.name}}</div>
                <div v-if="notScrap">出库机构: {{ universalObj.processVariables.applyOrder.outboundOrganUnit.name }}</div>
                <div>申请时间: {{this.$filterTime(universalObj.processVariables.applyOrder.applyTime)}}</div>
                <div v-if="notScrap">接收库房: {{ universalObj.processVariables.applyOrder.inboundWarehouse.name}}</div>
                <div v-if="notScrap">出库库房: {{ universalObj.processVariables.applyOrder.outboundWarehouse?universalObj.processVariables.applyOrder.outboundWarehouse.name:'-'}}</div>
                <div>申请人员: {{universalObj.processVariables.applyOrder.applicant.name }}</div>
                <div v-if="notScrap">接收人员: {{ universalObj.processVariables.applyOrder.inboundUser.name}}</div>
                <div v-if="notScrap">出库人员: {{universalObj.processVariables.applyOrder.outboundUser?universalObj.processVariables.applyOrder.outboundUser.name:'-'}}</div>
                <div v-if="!notScrap">报废原因: {{universalObj.processVariables.applyOrder.note }}</div>
            </div>
            <div>装备统计:</div>
            <el-table :data="universalObj.processVariables.applyOrder.equips" height="350" style="border: 1px solid #ccc;margin-top: 6px">
                <bos-table-column lable="装备名称" field="name"></bos-table-column>
                <bos-table-column lable="装备型号" field="model"></bos-table-column>
                <bos-table-column lable="装备数量" field="count"></bos-table-column>
            </el-table>
            <div class="process-inOut-box" v-if="notScrap">
                <div class="process-inOut-item" v-if="universalObj.processVariables.applyOrder.inboundInfo!=null">
                    <div class="process-inOut-item-box"><div style="width: 70px;text-align: right"><span v-text="'入库情况:'"></span></div><span v-text="`【单号】${universalObj.processVariables.applyOrder.inboundInfo.orderNumber}【总价合计】¥${universalObj.processVariables.applyOrder.inboundInfo.price/100}`"></span></div>
                    <div class="process-inOut-item-box" v-if="inHouseHaveMissequip" style="margin-top: 8px"><div style="width: 70px;text-align: right"><span v-text="'备注:'"></span></div><span v-text="`\xa0\xa0${universalObj.processVariables.applyOrder.inboundInfo.note}`"></span></div>
                    <div class="process-inOut-item-box" v-if="inHouseHaveMissequip" style="margin-top: 8px"><div style="width: 70px;text-align: right"><span v-text="'异常装备:'"></span></div><span v-text="getErrorEquip(universalObj.processVariables.applyOrder.inboundInfo.missEquips)"></span></div>
                </div>
                <div class="process-inOut-item"v-if="universalObj.processVariables.applyOrder.outboundInfo!=null">
                    <div class="process-inOut-item-box"><div style="width: 70px;text-align: right"><span v-text="'出库情况:'"></span></div><span v-text="`【单号】${universalObj.processVariables.applyOrder.outboundInfo.orderNumber}【总价合计】¥${universalObj.processVariables.applyOrder.outboundInfo.price/100}`"></span></div>
                    <div class="process-inOut-item-box" v-if="outHouseHaveMissequip" style="margin-top: 8px"><div style="width: 70px;text-align: right"><span v-text="'备注:'"></span></div><span v-text="`\xa0\xa0${universalObj.processVariables.applyOrder.outboundInfo.note}`"></span></div>
                    <div class="process-inOut-item-box" v-if="outHouseHaveMissequip" style="margin-top: 8px"><div style="width: 70px;text-align: right"><span v-text="'异常装备:'"></span></div><span v-text="getErrorEquip(universalObj.processVariables.applyOrder.outboundInfo.missEquips)"></span></div>
                </div>
            </div>
            <div class="process-info-box">
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
        <service-dialog title="查看原因" ref="reson" :button="false" :secondary="false" confirmInfo="提交" width="600px">
            驳回原因: <el-input type="textarea" v-model="reson" :disabled="true" :autosize="true" resize="none" style="margin-top: 6px"></el-input>
        </service-dialog>
        <service-dialog title="提示" ref="cancel" :button="true" :secondary="false" confirmInfo="提交" @confirm="closeApply">
           <div class="cancel">您确定要作废此申请单吗？</div>
        </service-dialog>
        <select_apply ref="selectUniversalApply" :taskId="activeTask.id" @sucessApply="sucessRefill"></select_apply>
        <t_dialog ref="transferDialog" @inHouse="inHouseByProcess" @outHouse="outHouseByProcess" :typeOperational="typeOperational" :directObj="directObj" @sucesssInOrOut="sucesssInOrOut"></t_dialog>
        <look-up :lookUp="lookUp" ref="lookUp"></look-up>
    </div>
</template>

<script>
    import serviceDialog from "components/base/serviceDialog"
    import { historyTasks,activeTasks,workflow,equipsOutInbound,findInHouseNumberLike,findOutHouseNumberLike,transferProcess} from "api/process"
    import textButton from 'components/base/textButton'
    import select_apply from 'components/process/processDialog/selectApplyProcess'
    import t_dialog from 'components/process/transfer/transferDialog'
    import lookUp from './lookUp'
    var _ = require("lodash");
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
                lookUp:{},
                reson: '', // 某流程驳回原因
                resonAble: true, // 驳回原因是否可以填写
                highest: false, // 是否是最高等级
                notScrap: true,
            }
        },
        methods: {
            getErrorEquip(equips){
                let names='';
                equips.forEach(item=>{
                    let count,tip,name=`[${item.name+item.model}]`;
                    item.count<0?tip='【缺】':tip='【增】';
                    count= Math.abs(JSON.parse(JSON.stringify(item)).count);
                    if(names===''){
                        names=`${tip}${name}${count}'件'`
                    }else {
                        names=names+','+`${tip}${name}${count}'件'`
                    }
                });
                return names
            },
            lookInHouse(){
                let equips=[],equip;
                findInHouseNumberLike({search:this.universalObj.processVariables.applyOrder.inboundInfo.orderNumber}).then(res=>{
                    equip=_.groupBy(JSON.parse(JSON.stringify(res.content[0].equipInOutHouseDetails)), 'model');
                    for (let key in equip) {
                        equips.push({name:equip[key][0].name,model:key,count:equip[key].length})
                    }
                    this.lookUp={
                        title:'出库单',
                        number:res.content[0].orderNumber,
                        user:res.content[0].operatorInfo.operator,
                        table:equips,
                        time:res.content[0].createTime
                    };
                    this.$refs.lookUp.show();
                });
            },
            lookOutHouse(){
                let equips=[],equip;
                findOutHouseNumberLike({search:this.universalObj.processVariables.applyOrder.outboundInfo.orderNumber}).then(res=>{
                    equip=_.groupBy(JSON.parse(JSON.stringify(res.content[0].equipInOutHouseDetails)), 'model');
                    for (let key in equip) {
                        equips.push({name:equip[key][0].name,model:key,count:equip[key].length})
                    }
                    this.lookUp={
                        title:'入库单',
                        number:res.content[0].orderNumber,
                        user:res.content[0].operatorInfo.operator,
                        table:equips,
                        time:res.content[0].createTime
                    };
                    this.$refs.lookUp.show();
                });
            },
            transfer(){
                transferProcess(this.url.transfer,this.universalObj.id).then(res=>{

                })
            },
            sucesssInOrOut() {
                this.$refs.transferDialog.close();
                this.$emit('closeBill', true);
            },
            inHouse(){
                this.$set(this,'directObj',this.universalObj);
                this.typeOperational='入库';
                this.$refs.transferDialog.showDialog();
            },
            inHouseByProcess(data){
                let url=`${this.url.inHouse}?taskId=${this.activeTask.id}`;
                equipsOutInbound(url,data).then(res=>{
                    this.$message.success('操作成功');
                    this.$emit('back',true)
                })
            },
            outHouse(){
                this.$set(this,'directObj',this.universalObj);
                this.typeOperational='出库';
                this.$refs.transferDialog.showDialog();
            },
            outHouseByProcess(data){
                let url=`${this.url.outHouse}?taskId=${this.activeTask.id}`;
                equipsOutInbound(url,data).then(res=>{
                   this.$message.success('操作成功');
                   this.$emit('back',true)
                })
            },
            sucessRefill(){
                this.$emit('back',true)
            },
            toReview() {
                this.$refs.review.show();
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
            processReviewInfo() {
                let id='';
                id=this.universalObj.id;
                let params = {processInstanceId: id, includeProcessVariables: false, includeTaskVariables: true},
                    lable = "";
                console.log(params);
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
                            name: item.taskVariables.name,
                            passVal: item.taskVariables.pass === undefined?0:item.taskVariables.pass?1:2,
                            note: item.taskVariables.note || '',
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
                }else if(this.$route.meta.title==='待办事宜'){
                    this.activeTask.id=this.universalObj.id;
                }
            }
        },
        computed:{
            isReject(){
                let flag=false;
                if(this.$route.meta.title==='我的流程'){
                    this.activeTask.taskDefinitionKey==='apply'?flag=true:flag=false;
                }else if(this.$route.meta.title==='待办事宜'){
                    if(this.universalObj.name.indexOf('申请')!==-1){
                        if(this.universalObj.processVariables.applyOrder.applicant.id===JSON.parse(localStorage.getItem("user")).id){
                            flag=true
                        }
                    }
                }
                return flag
            },
            haveInHouse(){
                let inUser='';
                let flag=false;
                if(this.universalObj.processVariables.applyOrder.inboundUser!=null){
                    inUser=this.universalObj.processVariables.applyOrder.inboundUser.id
                }
                if (inUser===JSON.parse(localStorage.getItem("user")).id&&this.title!=='报废'){
                    if(this.universalObj.processVariables.applyOrder.inboundInfo!==null&&this.universalObj.processVariables.applyOrder.inboundInfo!==undefined){
                        flag=true
                    }
                }
                return flag
            },
            haveOutHouse(){
                let outUser='';
                let flag=false;
                if(this.universalObj.processVariables.applyOrder.outboundUser!=null&&this.title!=='报废'){
                    outUser=this.universalObj.processVariables.applyOrder.outboundUser.id
                }
                if (outUser===JSON.parse(localStorage.getItem("user")).id){
                    if(this.universalObj.processVariables.applyOrder.outboundInfo!==null){
                        flag=true
                    }
                }
                return flag
            },
            inHouseHaveMissequip(){
                let flag=false,inHouseBound={};
                if(this.title!=='报废'){
                    inHouseBound=this.universalObj.processVariables.applyOrder.inboundInfo;
                    if (inHouseBound.missEquips!=null){
                        inHouseBound.missEquips.length===0?flag=false:flag=true
                    }
                }
                return flag
            },
            outHouseHaveMissequip(){
                let flag=false,outHouseBound={};
                if(this.title!=='报废'){
                    outHouseBound=this.universalObj.processVariables.applyOrder.outboundInfo;
                    if (outHouseBound.missEquips!=null){
                        outHouseBound.missEquips.length===0?flag=false:flag=true
                    }
                }
                return flag
            },
            isInHouse(){
                let flag=false;
                if(this.title!=='报废'){
                    if(this.universalObj.currentTask.assigneeName===JSON.parse(localStorage.getItem("user")).name){
                        if(this.universalObj.currentTask.name.indexOf('入库')!==-1){
                            flag=true;
                        }else {
                            flag=false;
                        }
                    }
                }
                return flag
            },
            isOutHouse(){
                let flag=false;
                if(this.title!=='报废'){
                    if(this.$route.meta.title==='我的流程'){
                        if(this.universalObj.currentTask.assigneeName===JSON.parse(localStorage.getItem("user")).name){
                            if(this.universalObj.currentTask.name.indexOf('出库')!==-1){
                                flag=true;
                            }else {
                                flag=false;
                            }
                        }
                    }else if(this.$route.meta.title==='待办事宜'){
                        this.universalObj.taskDefinitionKey==='equips_outbound_house'?flag=true:flag=false;
                    }
                }
                return flag
            }
        },
        created() {
            this.activeTasks();
            this.processReviewInfo();
            if(this.title === '报废') {
                this.notScrap = false;
                console.log(this.notScrap)
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
            t_dialog,
            lookUp
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
        .process-inOut-box{
            margin-top: 0.0833rem;
            .process-inOut-item{
                padding: 16px 0px;
                display: flex;
                flex-direction: column;
                border-bottom:1px solid rgba(112,112,112,0.13);
                border-top:1px solid rgba(112,112,112,0.13);
                .process-inOut-item-box{
                    display: flex;
                    flex-direction: row;
                }
            }
        }
        .info {
            display: grid;
            grid-template-columns: auto auto auto;
            grid-template-rows: 23px 23px 23px;
            grid-row-gap: 3px;
            width: 100%;
            color: #707070;
        }
        .process-info-box {
            color: #707070;
            margin-top: 16px;
        }
        .title {
            padding-bottom: 16px;
            border-bottom: 1px solid rgba(112,112,112,0.13);
        }
        .process-info {
            display: grid;
            grid-template-columns: 15% 30% 25% 10% 20%;
            padding: 6px 0;
            border-bottom: 1px solid rgba(112,112,112,0.13);
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
    /deep/.el-table__body-wrapper::-webkit-scrollbar {
        width: 6px;
    }
    /deep/.el-table__body-wrapper::-webkit-scrollbar-thumb {
        background: rgba(47,47,118,0.37);
        border-radius: 20px;
    }
</style>