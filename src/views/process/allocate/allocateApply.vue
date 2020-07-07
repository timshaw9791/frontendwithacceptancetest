<template>
    <view-container>
        <operation-bar v-if="!isInfo||type==='todo'" :task-definition-key="taskDefinitionKey"
                       :is-show-out="isShowOut" :is-show-in="isShowIn" :order-id="applyOrder.id"
                       @refused="showRfDialog" @agree="agree"
                       @invalid="invalid" @edit="edit"
                       @outbound="outbound" @inbound="inbound"
                       @submit="submit" @cancel="clean"
        ></operation-bar>
        <div class="apply-process-body">
            <define-input label="单号" v-model="applyOrder.number" :disabled="true"
            ></define-input>
            <date-select label="申请时间" v-model="applyOrder.createTime" :disabled="true"></date-select>
            <entity-input label="申请人员" v-model="applyOrder.applicant"
                          :options="{detail:'applicant'}" :disabled="true"
                          format="{name}({policeSign})">
            </entity-input>
            <entity-input label="入库机构" v-model="applyOrder.inboundOrganUnit" format="{name}"
                          :options="{search:'organUnits'}" placeholder="请选择"
                          :disabled="allocateCategory==='TRANSFER'||isInfo">
            </entity-input>
            <define-input label="入库库房" v-model="inboundEquipsOrder.house.name" :disabled="true"
            ></define-input>
            <entity-input label="入库人员" v-model="inboundEquipsOrder.operator" :disabled="true"
                          format="{name}({policeSign})"></entity-input>
            <entity-input label="出库机构" v-model="applyOrder.outboundOrganUnit" format="{name}"
                          :options="{search:'organUnits'}" placeholder="请选择"
                          :disabled="!(allocateCategory==='TRANSFER')||isInfo">
            </entity-input>
            <define-input label="出库库房" v-model="outboundEquipsOrder.house.name" :disabled="true"></define-input>
            <entity-input label="出库人员" v-model="outboundEquipsOrder.operator" :disabled="true"
                          format="{name}({policeSign})">
            </entity-input>
            <text-input label="申请原因" v-model="applyOrder.remark" :column="12" :tips="tips"
                        :disabled="isInfo">
            </text-input>
            <div class="table" style="margin-top: 3px; height: 100%">
                <define-table :havePage="false" :data="applyOrder.equipItems" height="733px"
                              :showSummary="true" :summaryFunc="$sumFunc">
                    <define-column label="操作" width="100" v-slot="{ data }" v-if="!isInfo">
                        <i class="iconfont icontianjia" @click="addRow()"></i>
                        <i class="iconfont iconyichu" @click="$delRow(applyOrder.equipItems,data.$index)"></i>
                    </define-column>
                    <define-column label="装备参数" v-slot="{ data }">
                        <entity-input v-model="data.row.equipArg" :options="equipArgOption"
                                      format="{name}({model})" :disabled="isInfo" placeholder="请选择">
                        </entity-input>
                    </define-column>
                    <define-column label="装备数量" v-slot="{ data }">
                        <define-input v-model="data.row.count" type="number" :tableEdit="!isInfo"></define-input>
                    </define-column>
                </define-table>
            </div>
        </div>
        <task-history :list="taskHistory" v-if="isInfo"></task-history>
        <serviceDialog title="提示" ref="RfDialog" @confirm="refused">
            <define-input label="驳回原因" v-model="remark"></define-input>
        </serviceDialog>
    </view-container>
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
                applyOrder: {equipItems: [{equipArg: {}}], applicant: {}},
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
                remark: '',//驳回时备注
                type: ''// 默认为空
            }
        },
        methods: {
            async init() {
                this.applyOrder.applicant = this.userInfo
                let tempOrganUnit = this.allocateCategory === 'TRANSFER' ? 'inboundOrganUnit' : 'outboundOrganUnit'
                this.applyOrder[tempOrganUnit] = this.organUnit
            },
            fetchData() {
                allocateOrders(this.processInstanceId, this.allocateCategory).then(
                    res => {
                        console.log(res)
                        this.applyOrder = this.allocateCategory === 'TRANSFER' ? res.transferApplyOrder : res.directAllotOrder
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
                    console.log(res.taskDefinitionKey)
                })
            },
            addRow() {
                this.applyOrder.equipItems.push({equipArg: {}})
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
            *    type 是待办值为todo
            */
            Object.assign(this, this.$route.query)
            this.allocateCategory = this.name.includes('调拨') ? 'TRANSFER' : 'DIRECT'
            if (this.processInstanceId) {
                this.isInfo = true
                this.$route.meta.crumb = this.name + '详情'
                this.fetchData()
            } else {
                this.$route.meta.crumb = this.name + '申请'
                this.init()
            }
        },
        computed: {
            ...mapGetters([
                'userInfo',
                'organUnit',
                'enums'
            ]),
            equipArgOption() {
                if (this.isInfo) {
                    return {detail: 'equipArgsDetail'}
                } else {
                    return {search: 'equipArgsSelect'}
                }
            }
        },
        watch: {
            'applyOrder.equipItems.length'(newVal) {
                !newVal && this.applyOrder.equipItems.push({equipArg: {}})
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>