<template>
    <div class="transfer-apply-container">
        <my-header :title="title" :haveBlack="false"></my-header>
        <div class="apply-process">
            <operation-bar :task-definition-key="taskDefinitionKey"
                           @refused="refused" @agree="agree"
                           @invalid="invalid" @edit="edit"
            ></operation-bar>
            <div class="apply-process-body">
                <div class="process-info">
                    <define-input label="单号" v-model="transferApplyOrder.number" :disabled="true"
                                  placeholder="-"></define-input>
                    <date-select label="申请时间" v-model="transferApplyOrder.createTime" :disabled="true"></date-select>
                    <entity-input label="申请人员" v-model="transferApplyOrder.applicant"
                                  :options="{detail:'applicant'}" :disabled="true"
                                  format="{name}({policeSign})">
                    </entity-input>
                    <entity-input label="入库机构" v-model="transferApplyOrder.inboundOrganUnit" format="{name}"
                                  :options="{search:'organUnits'}" :disabled="true" placeholder="请选择"></entity-input>
                </div>
                <div class="process-info">
                    <entity-input label="入库库房" :disabled="true" placeholder="-"></entity-input>
                    <entity-input label="入库人员" :disabled="true" placeholder="-"></entity-input>
                    <entity-input label="出库机构" v-model="transferApplyOrder.outboundOrganUnit" format="{name}"
                                  :options="{search:'organUnits'}" placeholder="请选择" :disabled="isInfo"></entity-input>
                    <entity-input label="出库库房" :disabled="true" placeholder="-"></entity-input>
                </div>
                <div class="process-info">
                    <entity-input label="出库人员" :disabled="true" placeholder="-"></entity-input>
                    <text-input label="申请原因" v-model="transferApplyOrder.note" :column="12" :tips="tips" :disabled="isInfo"></text-input>
                </div>
                <define-table :havePage="false" :data="transferApplyOrder.equips" height="2.8646rem"
                              :showSummary="true" :summaryFunc="$sumFunc" slot="total">
                    <define-column label="操作" width="100" v-slot="{ data }">
                        <i class="iconfont icontianjialiang" @click="changeRow(true,data)"></i>
                        <i class="iconfont iconyichuliang" @click="$delRow(transferApplyOrder.equips,data.index)"></i>
                    </define-column>
                    <define-column label="装备参数" v-slot="{ data }" >
                        <entity-input v-model="data.row.equipArg" :options="{search:'equipArgsSelect'}"
                                      format="{name}({model})" :tableEdit="!isInfo"></entity-input>
                    </define-column>
                    <define-column label="装备数量" v-slot="{ data }">
                        <define-input v-model="data.row.count" type="number" :tableEdit="!isInfo"></define-input>
                    </define-column>
                </define-table>
            </div>
            <div class="buttom">
                <base-button label="提交" align="right" size="large" @click="submit"></base-button>
                <base-button label="清空" align="right" size="large" type="danger" @click=""></base-button>
            </div>
        </div>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header';
    import bosTabs from '@/componentized/table/bosTabs'
    import {transferStart, transferOrders} from '@/api/process'
    import OperationBar from "@/components/process/operationBar";
    import EquipItems from "@/components/process/equipItems";
    import {completeTask, processesDelete, taskDetail} from "@/api/workflow";
    import {getHistoryTasks} from "@/api/process";
    import {mapGetters} from "vuex";

    export default {
        name: "scrapApply",
        components: {
            EquipItems,
            OperationBar,
            myHeader,
            bosTabs
        },
        data() {
            return {
                title: "",
                show: false,
                transferApplyOrder: {
                    equips: [{equipArg: {}}],
                    applicant: {}
                },
                outboundEquipsOrder: {},
                inboundEquipsOrder: {},
                tips: ['直接报废', '装备拿去维修，无法修补'],
                taskDefinitionKey: '',
                processDefinitionKey: '',
                processInstanceId: '',
                isInfo: false,
                isEdit: false
            }
        },
        methods: {
            async init() {
                Object.assign(this.transferApplyOrder, {
                    inboundOrganUnit: this.organUnit,
                    applicant: JSON.parse(window.localStorage.getItem("user"))
                })
            },
            fetchData() {
                transferOrders({processInstanceId: this.processInstanceId}).then(
                    res => {
                        this.transferApplyOrder = res.transferApplyOrder
                        this.outboundEquipsOrder = res.outboundEquipsOrder
                        this.inboundEquipsOrder = res.inboundEquipsOrder
                    }
                )
                getHistoryTasks({processInstanceId: this.processInstanceId}).then(
                    res => {
                        this.taskHistory = res
                    }
                )
                taskDetail({taskId: this.taskId}).then(res => {
                    this.taskDefinitionKey = res.taskDefinitionKey
                    console.log(this.transferApplyOrder.applicant.name === JSON.parse(window.localStorage.getItem("user")).name)
                    if (this.transferApplyOrder.applicant.name === JSON.parse(window.localStorage.getItem("user")).name) {
                        this.taskDefinitionKey = 'reApply'
                    }
                })
            },
            submit() {
                console.log(this)
                transferStart({processDefinitionKey: this.key}, this.transferApplyOrder).then(() => {
                    this.$router.push({name: 'myProcess'});
                })
            },
            refused() {  // 驳回
                completeTask(this.$route.query.taskId,
                    [{pass: false, note: '驳回测试'}]).then(() => {
                    this.back()
                })
            },
            agree() {  // 审批
                completeTask(this.$route.query.taskId,
                    [{pass: true, note: '审核通过'}]).then(() => {
                    this.back()
                })
            },
            invalid() { //作废
                processesDelete({
                    processInstanceId: this.$route.query.processInstanceId
                }, true).then(() => {
                    this.$router.back()
                })
            },
            edit() { // 重填与编辑
                this.isEdit = true
                this.isInfo = false
            }
        },
        created() {
            Object.assign(this, this.$route.query)
            if (this.processInstanceId) {
                this.fetchData()
                this.isInfo = true
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
            ])
        },
        watch: {
            'transferApplyOrder.equips.length'(newVal) {
                !newVal && this.transferApplyOrder.equips.push({equipArg: {}})
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