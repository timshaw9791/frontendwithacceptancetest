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
                <text-button style="margin-left: 0.125rem"  :iconClass="'导出'" :buttonName="'导出'" @click="transfer"></text-button>
            </div>
        </div>
        <div class="body">
            <div class="info">
                <div>申请单号: {{universalObj.processVariables.applyOrder.number}}</div>
                <div v-if="notScrap">接收机构: {{ universalObj.processVariables.applyOrder.inboundOrganUnit?universalObj.processVariables.applyOrder.inboundOrganUnit.name:''}}</div>
                <div v-if="notScrap">出库机构: {{ universalObj.processVariables.applyOrder.outboundOrganUnit?universalObj.processVariables.applyOrder.outboundOrganUnit.name:''}}</div>
                <div>申请时间: {{this.$filterTime(universalObj.processVariables.applyOrder.applyTime)}}</div>
                <div v-if="notScrap">接收库房: {{ universalObj.processVariables.applyOrder.inboundWarehouse?universalObj.processVariables.applyOrder.inboundWarehouse.name:''}}</div>
                <div v-if="notScrap">出库库房: {{ universalObj.processVariables.applyOrder.outboundWarehouse?universalObj.processVariables.applyOrder.outboundWarehouse.name:'-'}}</div>
                <div>申请人员: {{universalObj.processVariables.applyOrder.applicant.name }}</div>
                <div v-if="notScrap">接收人员: {{universalObj.processVariables.applyOrder.inboundUser?universalObj.processVariables.applyOrder.inboundUser.name:''}}</div>
                <div v-if="notScrap">出库人员: {{universalObj.processVariables.applyOrder.outboundUser?universalObj.processVariables.applyOrder.outboundUser.name:'-'}}</div>
                <div v-if="!notScrap">报废原因: {{universalObj.processVariables.applyOrder.note }}</div>
            </div>
            <div>装备统计:</div>
            <el-table :data="universalObj.processVariables.applyOrder.equips" height="350" style="border: 1px solid #ccc;margin-top: 6px">
                <bos-table-column lable="RFID" field="rfid" v-if="!notScrap"></bos-table-column>
                <!--<bos-table-column lable="装备序号" field="name" v-if="!notScrap"></bos-table-column>-->
                <bos-table-column lable="装备名称" field="name" ></bos-table-column>
                <bos-table-column lable="装备型号" field="model"></bos-table-column>
                <bos-table-column lable="装备数量" field="count" v-if="notScrap"></bos-table-column>
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
            <process-info :preData="processList" v-if="startShow"></process-info>
        </div>
        <service-dialog title="查看原因" ref="reson" :button="false" :secondary="false" confirmInfo="提交" width="600px">
            驳回原因: <el-input type="textarea" v-model="reson" :disabled="true" :autosize="true" resize="none" style="margin-top: 6px"></el-input>
        </service-dialog>
        <service-dialog title="提示" ref="cancel" :button="true" :secondary="false" confirmInfo="提交" @confirm="closeApply">
           <div class="cancel">您确定要作废此申请单吗？</div>
        </service-dialog>
        <select_apply ref="selectUniversalApply" :taskId="activeTask.id" @sucessApply="sucessRefill"></select_apply>
        <t_dialog  ref="transferDialog" :leftList="leftList" @inHouse="inHouseByProcess" @outHouse="outHouseByProcess" :typeOperational="typeOperational" :directObj="universalObj" @sucesssInOrOut="sucesssInOrOut"></t_dialog>
        <look-up :lookUp="lookUp" ref="lookUp"></look-up>
        <a :href="downloadSrc" style="z-index: -10"  ref="aDownload" download> </a>
    </div>
</template>

<script>
    import serviceDialog from "components/base/serviceDialog"
    import { historyTasks,workflow,equipsOutInbound,findInHouseNumberLike,findOutHouseNumberLike,transferProcess} from "api/process"
    import textButton from 'components/base/textButton'
    import select_apply from 'components/process/processDialog/selectApplyProcess'
    import t_dialog from 'components/process/transfer/transferDialog'
    import lookUp from './lookUp'
    import processInfo from "components/process/processInfo"
    import {baseBURL} from "../../api/config";

    var _ = require("lodash");
    export default {
        name: 'doneuniversal',
        data() {
            return {
                downloadSrc:'',
                startShow:false,
                startShowDIalog:false,
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
                leftList:[]
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
                        title:'入库',
                        number:res.content[0].orderNumber,
                        user:res.content[0].operatorInfo.operator,
                        table:equips,
                        time:res.content[0].createTime
                    };
                    this.$refs.lookUp.show();
                }).catch(err=>{
                    this.$message.error(err.response.data.message);
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
                        title:'出库',
                        number:res.content[0].orderNumber,
                        user:res.content[0].operatorInfo.operator,
                        table:equips,
                        time:res.content[0].createTime
                    };
                    this.$refs.lookUp.show();
                }).catch(err=>{
                    this.$message.error(err.response.data.message);
                });
            },
            transfer(){
                if(this.$route.meta.title==='待办事宜'){
                    this.downloadSrc=baseBURL+this.url.transfer+this.universalObj.processInstanceId;
                }else {
                    this.downloadSrc=baseBURL+this.url.transfer+this.universalObj.id;
                }

                setTimeout(()=>{
                    this.$refs.aDownload.click();
                },100)
            },
            sucesssInOrOut() {
                this.$refs.transferDialog.close();
                this.$emit('closeBill', true);
            },
            inHouse(){
                this.typeOperational='入库';
                this.leftList=this.initLeftList('入库');
                this.$refs.transferDialog.showDialog();
            },
            inHouseByProcess(data){
                let url=`${this.url.inHouse}?taskId=${this.activeTask.id}`;
                equipsOutInbound(url,data).then(res=>{
                    this.$message.success('操作成功');
                    this.$emit('back','refetch')
                }).catch(err=>{
                    this.$message.error(err.response.data.message);
                })
            },
            outHouse(){
                this.typeOperational='出库';
                this.leftList=this.initLeftList('出库');
                this.$refs.transferDialog.showDialog();
            },
            outHouseByProcess(data){
                let url=`${this.url.outHouse}?taskId=${this.activeTask.id}`;
                equipsOutInbound(url,data).then(res=>{
                   this.$message.success('操作成功');
                   this.$emit('back','refetch')
                }).catch(err=>{
                    this.$message.error(err.response.data.message);
                })
            },
            initLeftList(typeOperational){
                if(this.$route.meta.title!=='申请单列表'){
                    let list=[],group;
                    if(typeOperational==='出库'){
                        this.universalObj.processVariables?list=this.universalObj.processVariables.applyOrder.equips:list=[];
                    }else {
                        group=_.groupBy(JSON.parse(JSON.stringify(this.universalObj.processVariables.outboundEquipsOrder.equips)), 'model');
                        _.forIn(group,(value,key)=>{
                            list.push({name:value[0].name,model:value[0].model,count:group[key].length})
                        })
                    }
                    return list;
                }
            },
            sucessRefill(){
                this.$emit('back','refetch')
            },
            toReview() {
                this.$refs.review.show();
            },
            refill(){
                let ref;
                if(this.$route.meta.title==='待办事宜'){
                    switch (this.universalObj.name) {
                        case "申请调拨":
                            ref='allocation';
                            break;
                        case "申请直调":
                            ref='direct';
                            break;
                        case "申请报废":
                            ref='scrap';
                            break;
                    }
                }else {
                    switch (this.universalObj.processDefinitionKey) {
                        case "TRANSFER":
                            ref='allocation';
                            break;
                        case "DIRECT_ALLOT":
                            ref='direct';
                            break;
                        case "SCRAP":
                            ref='scrap';
                            break;
                    }
                }
                console.log(ref);
                this.$refs.selectUniversalApply.apply(ref)
            },
            cancel(){
                this.$refs.cancel.show();
            },
            closeApply(){
                workflow(this.activeTask.processInstanceId,JSON.parse(localStorage.getItem("user")).id).then(res=>{
                    this.$message.success('操作成功');
                    this.$emit('back','refetch')
                }).catch(err=>{
                    this.$message.error(err.response.data.message);
                })
            },
            processReviewInfo() {
                if(this.$route.meta.title!=='申请单列表'){
                    let id='';
                    if(this.$route.meta.title==='待办事宜'){
                        id=this.universalObj.processInstanceId;
                    }else {
                        id=this.universalObj.id;
                    }

                    let params = {processInstanceId: id, includeProcessVariables: false, includeTaskVariables: true};
                    historyTasks(params).then(res => {
                        this.processList = JSON.parse(JSON.stringify(res));
                        this.startShow = true
                    }).catch(err=>{
                        this.$message.error(err.response.data.message);
                    })
                }

            },
            lookReson(reson) {
                this.reson = reson;
                this.$refs.reson.show()
            },
            activeTasks(){
                if(this.$route.meta.title==='我的流程'){
                    activeTasks({includeprocessVariables:true,includeTaskprocessVariables:true,processInstanceId:this.universalObj.id}).then(res=>{
                        this.activeTask=res;
                    }).catch(err=>{
                        this.$message.error(err.response.data.message);
                    })
                }else if(this.$route.meta.title==='待办事宜'){
                    this.activeTask=this.universalObj;
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
                if (this.$route.meta.title!=='申请单列表'){
                    if(this.universalObj.processVariables.applyOrder.inboundUser!=null){
                        inUser=this.universalObj.processVariables.applyOrder.inboundUser.id
                    }
                    if (inUser===JSON.parse(localStorage.getItem("user")).id&&this.title!=='报废'){
                        if(this.universalObj.processVariables.applyOrder.inboundInfo!==null&&this.universalObj.processVariables.applyOrder.inboundInfo!==undefined){
                            flag=true
                        }
                    }
                }
                return flag
            },
            haveOutHouse(){
                let outUser='';
                let flag=false;
                if (this.$route.meta.title!=='申请单列表'){
                    if(this.universalObj.processVariables.applyOrder.outboundUser!=null&&this.title!=='报废'){
                        outUser=this.universalObj.processVariables.applyOrder.outboundUser.id
                    }
                    if (outUser===JSON.parse(localStorage.getItem("user")).id){
                        if(this.universalObj.processVariables.applyOrder.outboundInfo!==null){
                            flag=true
                        }
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
                let currentTask='';
                if(this.$route.meta.title==='我的流程'){
                    currentTask=this.universalObj.currentTask.name;
                }else if(this.$route.meta.title==='待办事宜'){
                    currentTask=this.universalObj.name
                }
                if(this.title!=='报废'&&this.$route.meta.title!=='申请单列表'){
                    if(this.universalObj.processVariables.applyOrder.inboundUser!=null){
                        if(this.universalObj.processVariables.applyOrder.inboundUser.name===JSON.parse(localStorage.getItem("user")).name){
                            if(currentTask.indexOf('入库')!==-1){
                                flag=true;
                            }
                        }
                    }
                }
                return flag
            },
            isOutHouse(){
                let flag=false;
                let currentTask='';
                if(this.$route.meta.title==='我的流程'){
                    currentTask=this.universalObj.currentTask.name;
                }else if(this.$route.meta.title==='待办事宜'){
                    currentTask=this.universalObj.name
                }
                if(this.title!=='报废'&&this.$route.meta.title!=='申请单列表'){
                    if(this.universalObj.processVariables.applyOrder.outboundUser!=null){
                        if(this.universalObj.processVariables.applyOrder.outboundUser.name===JSON.parse(localStorage.getItem("user")).name){
                            if(currentTask.indexOf('出库')!==-1){
                                flag=true;
                            }
                        }
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
            lookUp,
            processInfo
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
        .title {
            padding-bottom: 16px;
            border-bottom: 1px solid rgba(112,112,112,0.13);
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