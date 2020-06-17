<template>
    <div class="transfer-apply-container">
        <my-header :title="title" :haveBlack="false"></my-header>
        <div class="apply-process">
            <operation-bar :task-definition-key="taskDefinitionKey"
                           :is-show-out="isShowOut" :is-show-in="isShowIn"
                           @refused="refused" @agree="agree"
                           @invalid="invalid" @edit="edit"
                           @outbound="outbound" @inbound="inbound"
            ></operation-bar>
            <div class="apply-process-body">
                <div class="process-info">
                    <define-input label="单号" v-model="applyOrder.number" :disabled="true"
                                  placeholder="-"></define-input>
                    <date-select label="申请时间" v-model="applyOrder.createTime" :disabled="true"></date-select>
                    <entity-input label="申请人员" v-model="applyOrder.applicant"
                                  :options="{detail:'applicant'}" :disabled="true"
                                  format="{name}({policeSign})">
                    </entity-input>
                    <entity-input label="入库机构" v-model="applyOrder.inboundOrganUnit" format="{name}"
                                  :options="{search:'organUnits'}" placeholder="请选择"
                                  :disabled="allocateCategory==='TRANSFER'||isInfo">
                    </entity-input>
                </div>
                <div class="process-info">
                    <define-input label="入库库房" v-model="inboundEquipsOrder.house.name" :disabled="true"
                                  placeholder="-"></define-input>
                    <entity-input label="入库人员" v-model="inboundEquipsOrder.operator" :disabled="true"
                                  placeholder="-" format="{name}({policeSign})"></entity-input>
                    <entity-input label="出库机构" v-model="applyOrder.outboundOrganUnit" format="{name}"
                                  :options="{search:'organUnits'}" placeholder="请选择"
                                  :disabled="!(allocateCategory==='TRANSFER')||isInfo">
                    </entity-input>
                    <define-input label="出库库房" v-model="outboundEquipsOrder.house.name" :disabled="true"
                                  placeholder="-"></define-input>
                </div>
                <div class="process-info">
                    <entity-input label="出库人员" v-model="outboundEquipsOrder.operator" :disabled="true"
                                  placeholder="-" format="{name}({policeSign})"></entity-input>
                    <text-input label="申请原因" v-model="applyOrder.remark" :column="12" :tips="tips"
                                :disabled="isInfo">
                    </text-input>
                </div>
                <define-table :havePage="false" :data="applyOrder.equips" height="2.8646rem"
                              :showSummary="true" :summaryFunc="$sumFunc" slot="total">
                    <define-column label="操作" width="100" v-slot="{ data }" v-if="!isInfo">
                        <i class="iconfont icontianjialiang" @click="addRow()"></i>
                        <i class="iconfont iconyichuliang" @click="$delRow(applyOrder.equips,data.$index)"></i>
                    </define-column>
                    <define-column label="装备参数" v-slot="{ data }">
                        <entity-input v-model="data.row.equipArg" :options="{search:'equipArgsSelect'}"
                                      format="{name}({model})" :tableEdit="!isInfo">
                        </entity-input>
                    </define-column>
                    <define-column label="装备数量" v-slot="{ data }">
                        <define-input v-model="data.row.count" type="number" :tableEdit="!isInfo"></define-input>
                    </define-column>
                </define-table>
            </div>
            <task-history :list="taskHistory" v-if="isInfo"></task-history>
            <div v-if="!isInfo">
                <base-button label="提交" align="right" size="large" @click="submit()"></base-button>
                <base-button label="清空" align="right" size="large" type="danger" @click="clean()"></base-button>
            </div>
        </div>
        <serviceDialog title="提示" ref="RfDialog" @confirm="refused">
            <define-input label="驳回原因" v-model="remark"></define-input>
        </serviceDialog>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header'
    import bosTabs from '@/componentized/table/bosTabs'
    import {activeTask, allocateStart, allocateReapply, allocateOrders} from '@/api/process'
    import OperationBar from "@/components/process/operationBar";
    import EquipItems from "@/components/process/equipItems";
    import {processAudit, processesDelete} from "@/api/process";
    import {getHistoryTasks} from "@/api/process";
    import TaskHistory from "@/components/process/taskHistory";
    import serviceDialog from "@/components/base/serviceDialog"
    import {mapGetters} from "vuex";

    export default {
        name: "allocateApply", // 调拨、直调通用
        components: {
            EquipItems,
            OperationBar,
            myHeader,
            bosTabs,
            TaskHistory,
            serviceDialog
        },
        data() {
            return {
                title: "",
                allocateCategory: '', //TRANSFER or DIRECT
                applyOrder: {equips: [{equipArg: {}}], applicant: {}},
                outboundEquipsOrder: {operator: {}, house: {}}, // 用来获取出库库房和出库人员
                inboundEquipsOrder: {operator: {}, house: {}},  // 用来获取入库库房和入库人员
                tips: ['直接报废', '装备拿去维修，无法修补'],
                taskDefinitionKey: '',
                processDefinitionKey: '',
                processInstanceId: '',
                taskHistory: [],
                taskId: '',
                isInfo: false,
                isLeaderEdit: false,
                isShowIn: false,
                isShowOut: false,
                remark: '',
            }
        },
        methods: {
            async init() {
                this.applyOrder.applicant = this.userInfo
                if (this.allocateCategory === 'TRANSFER') {
                    // 不经过深拷贝会出现为空现象
                    this.applyOrder.inboundOrganUnit = JSON.parse(JSON.stringify(this.organUnit))
                    return
                }
                this.applyOrder.outboundOrganUnit = JSON.parse(JSON.stringify(this.organUnit))
            },
            fetchData() {
                allocateOrders(this.processInstanceId, this.allocateCategory).then(
                    res => {
                        console.log(res)
                        this.applyOrder = this.allocateCategory === 'TRANSFER' ? res.transferApplyOrder : res.directApplyOrder
                        !!res.inboundEquipsOrder && (this.inboundEquipsOrder = res.inboundEquipsOrder) && (this.isShowIn = true)
                        !!res.outboundEquipsOrder && (this.outboundEquipsOrder = res.outboundEquipsOrder) && (this.isShowOut = true)
                    }
                )
                getHistoryTasks(this.processInstanceId).then(
                    res => {
                        this.taskHistory = res
                    }
                )
                this.type === "todo" && activeTask(this.processInstanceId).then(res => {
                    this.taskId = res.taskId
                    // 如果是任务处理人是我，且为申请任务，那么就显示是否重填
                    this.taskDefinitionKey = res.assignee === this.userInfo.id && res.taskDefinitionKey.includes('apply')
                        ? 'reapply' : res.taskDefinitionKey
                })
            },
            addRow() {
                this.applyOrder.equips.push({equipArg: {}})
            },
            showRfDialog() {
                this.$refs.RfDialog.show()
            },
            refused() { // 驳回
                processAudit(this.taskId, {pass: false, note: this.remark}).then(() => {
                    this.$router.back()
                })
            },
            agree() {  // 审批
                processAudit(this.taskId,
                    {pass: true, note: '审核通过'}).then(() => {
                    this.$router.back()
                })
            },
            invalid() { //作废
                processesDelete(this.processInstanceId).then(() => {
                    this.$router.back()
                })
            },
            edit() { // 重填与编辑
                this.isInfo = true
            },
            outbound() { //出库、查看出库单
                this.$router.push({
                    path: 'allocateOut',
                    query: {
                        type: this.isShowOut.toString(),
                        processInstanceId: this.processInstanceId,
                        allocateCategory: this.allocateCategory
                    }
                })
            },
            inbound() { //入库、查看入库单
                this.$router.push({
                    path: 'allocateIn',
                    query: {
                        type: this.isShowIn.toString(),
                        processInstanceId: this.processInstanceId,
                        allocateCategory: this.allocateCategory
                    }
                })
            },
            submit() {
                console.log(this.taskDefinitionKey)
                if (this.taskDefinitionKey === "reapply") {
                    allocateReapply(this.taskId, this.applyOrder, this.allocateCategory).then(() => {
                        this.$router.push({name: 'myProcess'});
                    })
                } else {
                    allocateStart(this.key, this.applyOrder, this.allocateCategory).then(() => {
                        this.$router.push({name: 'myProcess'});
                    })
                }
            },
            clean() {
                this.init()
            }
        },
        created() {
            /*
            *    name  流程的名称
            *    key 该值为 processDefinitionKey
            */
            Object.assign(this, this.$route.query)
            this.allocateCategory = this.name.includes('调拨') ? 'TRANSFER' : 'DIRECT'
            if (this.processInstanceId) {
                this.fetchData()
                this.isInfo = true
                this.title = this.name + '详情'
            } else {
                this.init()
                this.title = '申请流程'
            }
        },
        computed: {
            ...mapGetters([
                'userInfo',
                'warehouse',
                'organUnit'
            ]),
        },
        watch: {
            'allocateApplyOrder.equips.length'(newVal) {
                !newVal && this.applyOrder.equips.push({equipArg: {}})
            }
        }
    }
</script>

<style lang="scss" scoped>

    .transfer-apply-container {
        width: 100%;
        color: #707070FF;
        font-size: 16px;
    }

</style>