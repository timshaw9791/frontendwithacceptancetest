<template>
    <div class="card">
        <!--<el-card shadow="never" :body-style="{ padding:'5px 18px'}">-->
        <!--<div class="card-body">-->
        <!--&lt;!&ndash;<el-button type="text" class="_textBt" @click="$refs.dialog.show()">&ndash;&gt;-->
        <!--&lt;!&ndash;<svg-icon icon-class="查看流程" class="svg"/>&ndash;&gt;-->
        <!--&lt;!&ndash;查看进度&ndash;&gt;-->
        <!--&lt;!&ndash;</el-button>&ndash;&gt;-->
        <!--&lt;!&ndash;<el-button type="text" class="_textBt">&ndash;&gt;-->
        <!--&lt;!&ndash;<svg-icon icon-class="详情" class="svg"/>&ndash;&gt;-->
        <!--&lt;!&ndash;详情&ndash;&gt;-->
        <!--&lt;!&ndash;</el-button>&ndash;&gt;-->
        <!--<span  class="smallTitle">{{this.title}}</span>-->
        <!--<el-button size="medium" class="bt" @click="operational('reject')">-->
        <!--驳回-->
        <!--</el-button>-->
        <!--<el-button size="medium" class="bt" @click="operational('review')">-->
        <!--审核-->
        <!--</el-button>-->
        <!--</div>-->
        <!--</el-card>-->
        <div class="bill-action-box">
            <span>{{typeSingleFlag?'调拨单':'调拨申请单'}}</span>
            <div class="bill-action-box-button-box" v-if="false">
                <el-button size="medium" class="bt" @click="operational('reject')">
                    驳回
                </el-button>
                <el-button size="medium" class="bt" @click="operational('review')">
                    {{getOperate(billData.currentLevel)}}
                </el-button>
            </div>
            <div v-if="typeSingleFlag" class="bill-action-box-button-box" >
                <el-button size="mini" class="bt" style="margin-right: 32px" @click="outOfStock" v-if="typeOperational!=''">
                    {{typeOperational}}
                </el-button>
                <a :href="downloadSrc" style="display: none" ref="aDownload">a标签</a>
                <div class="bill-action-box-button-box-svg" @click="download">
                    <svg-icon icon-class="导出" style="margin-right: 3px"/>导出
                </div>
            </div>
        </div>
        <div class="bill">
            <!--<img src="@/common/images/未审批.png" class="icon"/>-->
            <!--<img src="@/common/images/驳回.png" class="icon"/>require('@/common/images/通过.png')-->
            <img :src="typeSingleFlag?getStatesTransferImg(billData.state):getStatesImg(billData.transferApplyOrder.state)" class="icon"/>
            <div class="content">
                <div class="tr">
                    <div class="title">{{typeSingleFlag?'调拨单号: ':'申请编号: '}}<span v-text="billData.transferApplyOrder.number"></span></div>
                    <div class="title" v-if="typeSingleFlag">调拨时间: <span v-text="filterTime(billData.outTime)"></span></div>
                    <div class="title" v-if="typeSingleFlag">接收时间: <span v-text="filterTime(billData.inTime)"></span></div>
                </div>
                <div class="tr">
                    <div class="title">申请类型: <span v-text="applicationType(billData.transferApplyOrder.type)"></span></div>
                    <div class="title" v-if="typeSingleFlag">调拨机构: <span v-text="getOutUnit()"></span></div>
                    <div class="title">接收机构: <span v-text="billData.transferApplyOrder.inHouse.organUnit.name"></span></div>
                    <div class="title" v-if="!typeSingleFlag">调拨机构: <span v-text="getOutUnit()"></span></div>
                </div>
                <div class="tr">
                    <div class="title">申请时间: <span v-text="filterTime(billData.transferApplyOrder.applyTime)"></span></div>
                    <div class="title"  v-if="typeSingleFlag">调拨库房: <span v-text="getOutHouse()"></span></div>
                    <div class="title">接收库房: <span v-text="billData.transferApplyOrder.inHouse.name"></span></div>
                </div>
                <div class="tr">
                    <div class="title">申请人: <span v-text="billData.transferApplyOrder.applicant.name"></span></div>
                    <div class="title" v-if="typeSingleFlag">调拨人员: <span v-text="billData.outUser.name"></span></div>
                    <div class="title" v-if="typeSingleFlag">接收人员:<span v-text="billData.transferApplyOrder.applicant.name"></span></div>
                </div>
                <div>
                    <div>装备统计:</div>
                    <el-table :data="typeSingleFlag?billData.state!='WITHOUT_OUT_HOUSE'?transferEquipData:billData.transferApplyOrder.transferNeedEquip:billData.transferApplyOrder.transferNeedEquip" class="list" fit height="420">
                        <el-table-column label="序号" align="center">
                            <template slot-scope="scope">
                                {{scope.$index+1}}
                            </template>
                        </el-table-column>
                        <bos-table-column lable="装备名称" field="name"></bos-table-column>
                        <bos-table-column lable="装备型号" field="model"></bos-table-column>
                        <bos-table-column lable="装备数量" field="count"></bos-table-column>
                        <bos-table-column lable="总价" field="price" v-if="typeSingleFlag?billData.state!='WITHOUT_OUT_HOUSE'?true:false:false"></bos-table-column>
                    </el-table>
                </div>
                <div class="bottom" v-if="bottomFlag">
                    <div style="margin-bottom: 12px;"><span
                            v-text="getBillTitle(billData.transferApplyOrder.type)"></span></div>
                    <div class="row" v-for="item in billData.approvalResults">
                        <div style="color:rgb(47,47,118)"><span v-text="getOperateLevel(item.level)"></span></div>
                        <div><span v-text="item.leader.name"></span></div>
                        <div><span :style="item.approval?'color:#009B4C':'color:#EF4545'"
                                   v-text="item.approval?'通过':'驳回'"></span><span v-if="!item.approval"
                                                                                 style="color:#2F2F76;cursor: pointer;margin-left: 12px"
                                                                                 v-text="'[查看原因]'"
                                                                                 @click="checkReason(item)"></span>
                        </div>
                        <div><span v-text="getOperate(item.level)+'时间:'"></span><span
                                v-text="filterTime(item.time)"></span></div>
                    </div>
                </div>
                <div class="bottom" v-if="bottomCheckFlag">
                    <div style="margin-bottom: 12px;"><span
                            v-text="getBillTitle(billData.transferApplyOrder.type)"></span></div>
                    <div class="row" v-for="item in checkApproval">
                        <div style="color:rgb(47,47,118)"><span v-text="getApprovalType(item.approvalType)"></span></div>
                        <div><span v-text="item.leader.name"></span></div>
                        <div><span :style="item.approval?'color:#009B4C':'color:#EF4545'"
                                   v-text="item.approval?'通过':'驳回'"></span><span v-if="!item.approval"
                                                                                 style="color:#2F2F76;cursor: pointer;margin-left: 12px"
                                                                                 v-text="'[查看原因]'"
                                                                                 @click="checkReason(item)"></span>
                        </div>
                        <div><span v-text="getOperate(item.level)+'时间:'"></span><span
                                v-text="filterTime(item.time)"></span></div>
                    </div>
                </div>
                <!--<div class="trBottom">审核人：审核</div>-->
                <!--<div class="trBottom">审核时间:2019年5月7日 14:53:58</div>-->

                <!--<div class="_box-bottom">-->
                <!--<el-button type="danger" size="medium">驳 回</el-button>-->
                <!--<el-button type="primary" size="medium">批 准</el-button>-->
                <!--</div>-->
            </div>
        </div>

        <!--<serviceDialog title="进度" ref="dialog" :button="false" :secondary="false" width="40%">-->
        <!--<el-timeline class="timeLine">-->
        <!--<el-timeline-item-->
        <!--v-for="(activity, index) in activities"-->
        <!--:key="index"-->
        <!--:timestamp="activity.timestamp">-->
        <!--{{activity.content}}-->
        <!--</el-timeline-item>-->
        <!--</el-timeline>-->
        <!--</serviceDialog>-->

        <serviceDialog :title="getOperate(billData.currentLevel)+'指定'" ref="dialog1" width="634px"
                       @confirm="confirmPass">
            <div class="bill-item-box">
                <div class="bill-item">
                    <div class="bill-item-span"><span v-text="'调拨操作人员：'"></span></div>
                    <el-select style="width: 248px" v-model="selectObj.selectPersonel.select" placeholder="请选择">
                        <el-option
                                v-for="item in selectObj.selectPersonel.selectList"
                                :key="item.value"
                                :label="item.label"
                                :value="item">
                        </el-option>
                    </el-select>
                </div>
                <div class="bill-item" style="margin-top: 20px">
                    <div class="bill-item-span" style="margin-left: 34.5px"><span v-text="'指定仓库：'"></span></div>
                    <el-select style="width: 248px" v-model="selectObj.selectHouse.select" placeholder="请选择">
                        <el-option
                                v-for="item in selectObj.selectHouse.selectList"
                                :key="item.value"
                                :label="item.label"
                                :value="item">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <!--<form-container ref="inlineForm" :model="inlineForm" style="margin-left: 23%;">-->
            <!--<field-select label="选择领导" :list="leadList" v-model="inlineForm.list"-->
            <!--prop="list" width="7">-->
            <!--</field-select>-->
            <!--</form-container>-->
        </serviceDialog>

        <serviceDialog :title="getOperate(billData.currentLevel)+'指定'" ref="dialogShenghe" width="634px"
                       @confirm="confirmAudit">
            <div class="bill-item-box">
                <div class="bill-item">
                    <div class="bill-item-span"><span v-text="'选择领导：'"></span></div>
                    <el-select style="width: 248px" v-model="selectObj.selectLeder.select" placeholder="请选择">
                        <el-option
                                v-for="item in selectObj.selectLeder.selectList"
                                :key="item.value"
                                :label="item.label"
                                :value="item">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <!--<form-container ref="inlineForm" :model="inlineForm" style="margin-left: 23%;">-->
            <!--<field-select label="选择领导" :list="leadList" v-model="inlineForm.list"-->
            <!--prop="list" width="7">-->
            <!--</field-select>-->
            <!--</form-container>-->
        </serviceDialog>

        <serviceDialog title="驳回" ref="dialog2" width="634px" @confirm="confirmReject">
            <div class="bill-item-box">
                <div style="width: 80%;">
                    <el-input
                            type="textarea"
                            :autosize="{ minRows: 8, maxRows: 10}"
                            placeholder="请输入内容"
                            v-model="reason"
                            maxlength="150"
                            show-word-limit>
                    </el-input>
                </div>
            </div>
        </serviceDialog>
        <serviceDialog title="驳回原因" ref="checkReasonDialog" width="634px" @confirm="confirmCheckReason" :button="false">
            <div style="width: 100%;text-align: center;font-size: 18px">
                <span v-text="'驳回原因：'"></span><span v-text="checkReasonData"></span>
            </div>

        </serviceDialog>
        <t_dialog ref="transferDialog" :directObj="direct"></t_dialog>
        <!--<serviceDialog title="批准" ref="dialog2" width="40%">-->
        <!--<div style="text-align: center;font-size: 20px">您确定要批准吗</div>-->
        <!--</serviceDialog>-->

    </div>
</template>

<script>
    import serviceDialog from 'components/base/gailiangban'
    import {formRulesMixin} from 'field/common/mixinComponent';
    import {transformMixin} from "common/js/transformMixin";
    import transfer from 'gql/transfer.gql'
    import {fetchMixin} from 'field/common/mixinFetch'
    import api from 'gql/process.gql'
    import request from 'common/js/request'
    import t_dialog from 'components/process/transfer/transferDialog'
    // import {baseBURL} from "../../../api/config";
    import {baseBURL} from "../../api/config"

    export default {
        components: {
            serviceDialog,
            t_dialog
        },
        props: {
            billData: {
                type: Object
            },
            typeSingle: {
                type: String,
                default: 'apply'
            },
            singleStatus: {
                type: String,
                default: '进行中'
            },
        },
        mixins: [fetchMixin],
        data() {
            return {
                list: [{id: 1, name: '恢复上市的风格化'}, {id: 2, name: 'wdnm'}],
                activities: [{
                    content: '提交声请',
                    timestamp: '2018-04-15'
                }, {
                    content: '审核中',
                    timestamp: '2018-04-13'
                }, {
                    content: '审核通过',
                    timestamp: '2018-04-11'
                }],
                selectObj: {
                    selectPersonel: {
                        selectList: [],
                        select: ''
                    },
                    selectHouse: {
                        selectList: [],
                        select: ''
                    },
                    selectLeder: {
                        selectList: [],
                        select: ''
                    },
                    thisUnit: {}
                },
                checkApproval:[],
                myOrganUnit: {},
                items: '',
                reason: '',
                checkReasonData: '',
                transferEquipData:[],
                downloadSrc:'',
                typeOperational:'',
                direct:{},
                leadList: [{key: '主席', val: '主席'}, {key: '大领导', val: '大领导'}]
            }
        },
        created() {
            this.gqlQuery(transfer.getOrganUnit, {
                key: 'id',
                value: JSON.parse(localStorage.getItem('user')).unitId
            }, (data) => {
                this.myOrganUnit = data[0];
            }, true);
            if (this.singleStatus != '进行中') {
                this.getHistroyApproval(this.billData.transferApplyOrder.historyLeaderApprovalId)
            }
            if(this.typeSingle!='apply'){
                console.log(this.billData);
                let myName=JSON.parse(localStorage.getItem('user')).name;
                if(this.billData.outUser.name==myName&&this.billData.state=="WITHOUT_OUT_HOUSE"){
                    this.typeOperational='出库'
                }
                this.downloadSrc=baseBURL+'/transfer-order/export-excel'+'?transferOrderId='+this.billData.id;
                if(this.billData.state=='IN_HOUSE'){
                    let url = baseBURL+'/transfer-equips/equips-in-house/group';
                    this.getTransferEquipData(url)
                }else if(this.billData.state=='OUT_HOUSE'){
                    let url = baseBURL+'/transfer-equips/equips-out-house/group';
                    this.getTransferEquipData(url)
                }
            }

        },
        computed: {
            bottomFlag() {
                if (this.billData.approvalResults != null) {
                    if (this.billData.approvalResults.length > 0 && this.singleStatus == '进行中') {
                        return true
                    }
                } else {
                    return false
                }
            },
            bottomCheckFlag() {
                if (this.singleStatus != '进行中') {
                    return true
                } else {
                    return false
                }
            },
            typeSingleFlag(){
                if(this.typeSingle=='apply'){
                    return false
                }else {
                    return true
                }
            }
        },
        methods: {
            outOfStock(){
                this.direct={orderItems:this.billData.transferApplyOrder.transferNeedEquip,number:this.billData.transferApplyOrder.number,id:this.billData.id};
                this.$refs.transferDialog.showDialog();
            },
            getApprovalType(approvalType){
                switch (approvalType) {
                    case 'APPROVAL':
                        return '审批';
                    case 'VERIFY':
                        return '审核';
                }
            },
            getOutUnit(){
                // if(this.typeSingleFlag){
                //     this.billData.transferApplyOrder.inHouse.organUnit.name
                // }else {
                //     this.billData.transferApplyOrder.outOrganUnit.name
                // }
                return this.billData.transferApplyOrder.outOrganUnit.name

            },
            // derive(id){
            //     let url = baseBURL + '/transfer-order/export-excel';
            //     let params={transferOrderId:id};
            //     request({
            //         method: 'get',
            //         url: url,
            //         params:params
            //     }).then(res => {
            //         console.log(res);
            //     })
            // },
            confirmPass() {
                let finalApproval = {
                    "leaderApproval": {
                        "leader": {
                            "userId": JSON.parse(localStorage.getItem('user')).id,
                            "name": JSON.parse(localStorage.getItem('user')).username,
                        },
                        "approval": true
                    },
                    "outHouse": {
                        "id": this.selectObj.selectHouse.select.value,
                        "name": this.selectObj.selectHouse.select.label,
                        "organUnit": {
                            "id": this.selectObj.thisUnit.id,
                            "name": this.selectObj.thisUnit.name
                        }
                    },
                    "outHouseUser": {
                        "name": this.selectObj.selectPersonel.select.label,
                        "userId": this.selectObj.selectPersonel.select.value
                    }
                };
                let url = baseBURL + '/transfer/final-approval' + '?taskId=' + this.billData.taskId;
                this.toApproval(finalApproval, url, (data) => {
                    this.$message.success('审批成功');
                    this.$emit('toBack', '进行中')
                });
            },
            confirmAudit() {
                let leaderApproval = {
                    "leader": {
                        "userId": JSON.parse(localStorage.getItem('user')).id,
                        "name": JSON.parse(localStorage.getItem('user')).username,
                        "organUnit": {
                            "id": this.myOrganUnit.id,
                            "name": this.myOrganUnit.name
                        }
                    },
                    "approval": true
                };
                let nextApproveId = this.selectObj.selectLeder.select.value;
                let taskId = this.billData.taskId;
                let url = baseBURL + '/transfer/approval' + '?taskId=' + this.billData.taskId + '&nextApproveId=' + nextApproveId;
                this.toApproval(leaderApproval, url, (data) => {
                    this.$message.success('审核成功');
                    this.$emit('toBack', '进行中')
                });
            },
            toApproval(param, url, sCallback) {
                this.$ajax.put(url, param).then(resolve => {
                    sCallback.call(this, resolve)
                })
            },
            confirmReject() {
                if (this.reason != '') {
                    let operate = this.getOperate(this.billData.currentLevel);
                    let leaderApproval = {
                        "leader": {
                            "userId": JSON.parse(localStorage.getItem('user')).id,
                            "name": JSON.parse(localStorage.getItem('user')).username,
                            "organUnit": {
                                "id": this.myOrganUnit.id,
                                "name": this.myOrganUnit.name
                            }
                        },
                        "reason": this.reason,
                        "approval": false
                    };
                    let taskId = this.billData.taskId;
                    let url = baseBURL;
                    if (operate == '审核') {
                        url = url + '/transfer/approval' + '?taskId=' + taskId;
                    } else {
                        url = url + '/transfer/final-approval' + '?taskId=' + taskId;
                        leaderApproval = {leaderApproval: leaderApproval};
                    }
                    this.toApproval(leaderApproval, url, (data) => {
                        this.$message.success('驳回成功');
                        this.$emit('toBack', '进行中')
                    });
                } else {
                    this.$message.warning('请先填写原因！')
                }
            },
            checkReason(item) {
                this.checkReasonData = item.reason;
                this.$refs.checkReasonDialog.show();
            },
            confirmCheckReason() {
                this.$refs.checkReasonDialog.cancelDb();
            },
            getStatesTransferImg(state){
                switch (state) {
                    case 'WITHOUT_OUT_HOUSE':
                        return require('@/common/images/未出库修.png');
                    case 'IN_HOUSE':
                        return require('@/common/images/已入库修.png');
                    case 'OUT_HOUSE':
                        return require('@/common/images/已出库修.png');
                }
            },
            getStatesImg(state) {
                switch (state) {
                    case 'UNDER_REVIEW':
                        return require('@/common/images/审核中.png');
                    case 'REJECTED':
                        return require('@/common/images/驳回.png');
                    case 'PASS':
                        return require('@/common/images/通过.png');
                    case  'INVALID':
                        return require('@/common/images/已作废.png')
                }
                // if(state=='UNDER_REVIEW'){
                //     return '审核中'
                // }else if(state=='REJECTED'){
                //     return '已驳回'
                // } else if(state=='PASS'){
                //     return '已通过'
                // }else {
                //     return '作废'
                // }
            },
            filterTime(date) {
                if(date!=0){
                    let dates = new Date(date);
                    let year = dates.getFullYear();
                    let month = dates.getMonth() + 1;
                    let day = dates.getDate();
                    let hour = dates.getHours();
                    let min = dates.getMinutes();
                    let s = dates.getSeconds();
                    return year + '-' + month + '-' + day + '\xa0' + hour + ':' + min + ':' + s
                }else {
                    return ''
                }

            },
            getOutHouse(){
                if(!this.typeSingleFlag){
                    return ''
                }else {
                    return this.billData.outHouse.name
                }
            },
            applicationType(data) {
                switch (data) {
                    case 'DOWN_TO_UP':
                        return '调拨';
                    // case 'REJECTED':
                    //     return '审核中';
                    // case 'PASS':
                    //     return '已通过';
                }
            },
            getBillTitle(data) {
                switch (data) {
                    case 'DOWN_TO_UP':
                        return '调拨流程';
                    // case 'REJECTED':
                    //     return '审核中';
                    // case 'PASS':
                    //     return '已通过';
                }
            },
            // getList() {
            //     this.gqlQuery(api.getEquipScrapedRecord, {
            //         id: this.$route.query.id
            //     }, (res) => {
            //         this.items = JSON.parse(JSON.stringify(res.data.EquipScrapedRecord));
            //     })
            // },
            serial(data) {
                console.log(data);
            },
            operational(data) {
                if (data == 'reject') {
                    this.$refs.dialog2.show();
                } else if (data == 'review') {
                    let operate = this.getOperate(this.billData.currentLevel);
                    if (operate == '审批') {
                        this.getSelectUnit();
                        this.getSelectPersonel();
                        this.$refs.dialog1.show();
                    } else {
                        this.getLeder();
                        this.$refs.dialogShenghe.show()
                    }
                }
            },
            getLeder() {
                this.selectObj.selectLeder.selectList = [];
                this.selectObj.selectLeder.select = '';
                if (this.billData.currentLevel > this.billData.maxLevel) {
                    this.billData.processLevel.applyLeaders.forEach(item => {
                        this.selectObj.selectLeder.selectList.push({
                            label: item.name,
                            value: item.userId
                        })
                    })
                } else {
                    for (let key in this.billData.processLevel.levelLeaderMap) {
                        if (key == this.billData.currentLevel + 1) {
                            this.billData.processLevel.levelLeaderMap[key].forEach(item => {
                                this.selectObj.selectLeder.selectList.push({
                                    label: item.name,
                                    value: item.userId
                                })
                            })
                        }
                    }
                }
            },
            getSelectUnit() {
                this.gqlQuery(transfer.getOrganUnit, {
                    key: 'id',
                    value: JSON.parse(localStorage.getItem('user')).unitId
                }, (data) => {
                    this.selectObj.thisUnit = data[0];
                    data[0].houseSet.forEach(item => {
                        this.selectObj.selectHouse.selectList = [];
                        this.selectObj.selectHouse.selectList.push({label: item.name, value: item.id})
                    })
                }, true);
            },
            getSelectPersonel() {
                this.gqlQuery(transfer.getUserList, {
                    qfilter: {
                        key: 'role.id',
                        value: 2,
                        operator: 'EQUEAL',
                        combinator: 'AND',
                        next: {
                            key: 'unitId',
                            value: JSON.parse(localStorage.getItem('user')).unitId,
                            operator: 'EQUEAL'
                        }
                    }
                }, (data) => {
                    data.forEach(item => {
                        this.selectObj.selectPersonel.selectList = [];
                        data.forEach(item => {
                            this.selectObj.selectPersonel.selectList.push({label: item.name, value: item.id})
                        });
                    })
                }, true);
            },
            getOperateLevel(currentLevel) {
                let maxLeve = this.billData.maxLevel;
                let operateLevel = '';
                if (currentLevel > maxLeve) {
                    operateLevel = this.transformToChinese(currentLevel) + '级' + '审批'
                } else {
                    operateLevel = this.transformToChinese(currentLevel) + '级' + '审核'
                }
                return operateLevel
            },
            getOperate(currentLevel) {
                let maxLeve = this.billData.maxLevel;
                let operate = '';
                if (currentLevel > maxLeve) {
                    operate = '审批'
                } else {
                    operate = '审核'
                }
                return operate
            },
            getHistroyApproval(id) {
                let url = baseBURL + '/history-leader-approval/' + id;
                request({
                    method: 'get',
                    url: url
                }).then(res => {
                    this.checkApproval=res.leaderApprovalList;
                })
            },
            getTransferEquipData(url){
                let params = {transferOrderId:this.billData.id};
                request({
                    method: 'get',
                    url: url,
                    params:params
                }).then(res => {
                    this.transferEquipData=[];
                    this.transferEquipData=res;
                })
            },
            download(){
                this.$refs.aDownload.click();
            },
            transformToChinese(num) {
                let chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
                let chnUnitSection = api["", "万", "亿", "万亿", "亿亿"];
                let chnUnitChar = ["", "十", "百", "千"];

                // let numToChn = function (num) {
                //     let index = num.toString().indexOf(".");
                //     if (index != -1) {
                //         let str = num.toString().slice(index);
                //         let a = "点";
                //         for (let i = 1; i < str.length; i++) {
                //             a += chnNumChar[parseInt(str[i])];
                //         }
                //         return a;
                //     } else {
                //         return;
                //     }
                // };

                //定义在每个小节的内部进行转化的方法，其他部分则与小节内部转化方法相同
                function sectionToChinese(section) {
                    let str = '', chnstr = '', zero = false, count = 0;   //zero为是否进行补零， 第一次进行取余由于为个位数，默认不补零
                    while (section > 0) {
                        let v = section % 10;  //对数字取余10，得到的数即为个位数
                        if (v == 0) {                    //如果数字为零，则对字符串进行补零
                            if (zero) {
                                zero = false;        //如果遇到连续多次取余都是0，那么只需补一个零即可
                                chnstr = chnNumChar[v] + chnstr;
                            }
                        } else {
                            zero = true;           //第一次取余之后，如果再次取余为零，则需要补零
                            str = chnNumChar[v];
                            str += chnUnitChar[count];
                            chnstr = str + chnstr;
                        }
                        count++;
                        section = Math.floor(section / 10);
                    }
                    return chnstr;
                }

                num = Math.floor(num);
                let unitPos = 0;
                let strIns = '', chnStr = '';
                let needZero = false;

                if (num === 0) {
                    return chnNumChar[0];
                }
                while (num > 0) {
                    let section = num % 10000;
                    if (needZero) {
                        chnStr = chnNumChar[0] + chnStr;
                    }
                    strIns = sectionToChinese(section);
                    strIns += (section !== 0) ? chnUnitSection[unitPos] : chnUnitSection[0];
                    chnStr = strIns + chnStr;
                    needZero = (section < 1000) && (section > 0);
                    num = Math.floor(num / 10000);
                    unitPos++;
                }

                return chnStr;
            }
        }

    }
</script>

<style lang="scss" scoped>

    .card {
        .bill-item-box {
            width: 100%;
            height: 180px;
            padding: 0px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            font-size: 18px;
        }
        .bill-item-box .bill-item {
            width: 100%;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            color: #707070;
        }
        .bill-item .bill-item-span {
            text-align: right;
        }
        .bill {
            position: relative;
            .icon {
                width: 96px;
                height: 94px;
                position: absolute;
                right: 0;
                top: 0;
            }

            .content {
                width: 50vw;
                margin: 0 auto;
                padding-top: 30px;

                .tr {
                    font-weight: 400;
                    display: flex;
                    margin-bottom: 9px;
                    span {
                        margin-left: 5px;
                    }
                    .title {
                        min-width: 33%;
                        max-width: 33%;
                        overflow: hidden; /*超出部分隐藏*/
                        white-space: nowrap; /*不换行*/
                        text-overflow: ellipsis; /*超出部分文字以...显示*/
                    }
                }

                .trBottom {
                    margin-top: 10px;
                    text-align: right;
                }

                .list {
                    margin-top: 10px;
                    border: 1px solid #EBEEF5;
                    border-bottom: none !important;
                }

                .bottom {
                    margin-top: 32px;
                    width: 100%;
                    .row {
                        padding: 0 10px;
                        height: 60px;
                        color: #707070;
                        width: 100%;
                        border-bottom: 1px solid #EBEEF5;
                        display: flex;
                        justify-items: center;
                        justify-content: space-between;
                        align-items: center;
                    }

                    .row:nth-child(2) {
                        border-top: 1px solid #EBEEF5;
                    }

                    .row:last-child {
                        border-top: none;
                    }
                }

            }
        }

        .card-header {
            position: relative;

            .headerButton {
                position: absolute;
                right: 0;
                top: -10px;
            }
        }

        .timeLine {

        }

    }

    .card .bill-action-box {
        display: flex;
        height: 57px;
        width: 100%;
        align-items: center;
        justify-content: space-between;
        padding: 0px 18px;
        border-top: 1px solid rgba(112, 112, 112, 0.13);
        border-bottom: 1px solid rgba(112, 112, 112, 0.13);
    }

    .bill-action-box .bill-action-box-button-box {
        display: flex;
        align-items: center;

        .bill-action-box-button-box-svg{
            display: flex;
            align-items: center;
            cursor: pointer;
        }
        .bt {
            color: #2E2E74;
            border: 1px solid rgba(47, 47, 118, 1);
        }
    }

</style>


