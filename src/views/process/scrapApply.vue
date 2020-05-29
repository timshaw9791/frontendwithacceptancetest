<template>
    <div class="apply-process-container">
        <my-header :title="title" :haveBlack="false"></my-header>
        <div class="apply-process">
            <operation-bar :task-definition-key="taskDefinitionKey"
                           @refused="refused" @agree="agree"
                           @invalid="invalid" @edit="edit"
            ></operation-bar>
            <div class="apply-process-body">
                <div>
                    <define-input label="单号" v-model="order.number" :disabled="true" class="odd-number"></define-input>
                    <define-input label="所在库房" v-model="order.warehouse.name" :disabled="true"></define-input>
                    <date-select label="申请日期" v-model="order.createTime" :disabled="true"></date-select>
                    <entity-input label="申请人员" v-model="order.applicant"
                                  :options="{detail:'applicant'}" :disabled="true"
                                  format="{name}({policeSign})">
                    </entity-input>
                </div>
                <div>
                    <text-input label="申请原因" v-model="order.note" :tips="tips"
                                :title="order.note"
                                :disabled="isInfo"></text-input>
                </div>
                <equipItems :equip-items="equipItems" :is-info="isInfo"
                            @handleReadData="handleReadData"></equipItems>
                <div class="buttom" v-if="!isInfo">
                    <base-button label="提交" align="right" size="large" @click="submit"></base-button>
                    <base-button label="清空" align="right" size="large" type="danger"></base-button>
                </div>
                <task-history :list="taskHistory" v-if="isInfo"></task-history>
            </div>
        </div>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header';
    import bosTabs from '@/componentized/table/bosTabs.vue'
    import {processStart, getHistoryTasks, scrapOrders, activeTask, scrapReapply} from '@/api/process'
    import {findByRfids} from "@/api/storage";
    import {transEquips} from "@/common/js/transEquips";
    import TaskHistory from "@/components/process/taskHistory";
    import equipItems from "@/components/process/equipItems";
    import {completeTask, processesDelete, taskDetail} from "@/api/workflow";
    import OperationBar from "@/components/process/operationBar";
    import {mapGetters} from "vuex";

    export default {
        name: "scrapApply",
        components: {
            OperationBar,
            equipItems,
            TaskHistory,
            myHeader,
            bosTabs
        },
        data() {
            return {
                title: "",
                //申请单
                order: {
                    warehouse: {},
                    organUnit: {},
                    applicant: {}
                },
                //任务
                taskHistory: [],
                equipItems: [{items: []}],
                //需要申请的装备列表
                scrapEquips: [],
                isInfo: false,
                tips: ['直接报废', '装备拿去维修，无法修补'],
                taskDefinitionKey: '', // 当前任务KEY
                processInstanceId: '', // 当前流程ID
                taskId: ''
            }
        },
        methods: {
            async init() {
                Object.assign(this.order, {
                    organUnit: this.organUnit,
                    warehouse: this.warehouse,
                    applicant: JSON.parse(window.localStorage.getItem("user"))
                })
            },

            fetchData() {
                scrapOrders(this.processInstanceId).then(
                    res => {
                        this.order = res
                        console.log(res)
                        this.equipItems = transEquips(res.equips).equipItems
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
                        ? 'reApply' : res.taskDefinitionKey
                })
            },
            handleReadData(data) { // 读取数据
                findByRfids(data).then(res => {
                    this.order.equips = transEquips(res, 'args', 'args').simplifyItems
                    console.log(this.order.equips)
                    this.equipItems = transEquips(res).equipItems
                })
            },
            submit() {
                if (this.taskDefinitionKey !== "reApple"){
                    processStart({
                        processDefinitionKey: this.key,
                    }, this.order).then(() => {
                        this.$router.push({name: 'myProcess'});
                    })
                }else {
                    scrapReapply(this.taskId,this.order).then(
                        this.$router.push({name: 'agencyMatters'})
                    )
                }
            },
            refused() {  // 驳回
                completeTask(this.taskId,
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
            edit() { // 重填
                this.isInfo = false
            }
        },
        created() {
            Object.assign(this, this.$route.query)
            if (this.processInstanceId) {
                this.title = '报废详情'
                this.isInfo = true
                this.fetchData()
            } else {
                this.title = '报废详情'
                this.init();
            }
        },
        computed: {
            ...mapGetters([
                'userInfo',
                'warehouse',
                'organUnit'
            ])
        }
    }
</script>

<style lang="scss" scoped>
    .apply-process-container {
        width: 100%;
        color: #707070FF;
        font-size: 16px;
    }

    .apply-process {
        width: 100%;

        .apply-process-top {
            padding: 18px 7px;
            border-bottom: 1px solid #EBEEF5;
            overflow: hidden;
        }

        .apply-process-body {
            padding: 0 7px;
            overflow: auto;

            .process-info {
                padding: 18px 0;
                display: flex;
                justify-content: space-between;
                overflow: hidden;
            }

            .remark {
                margin-top: 18px;
            }

            .buttom {
                height: 72px;
                margin-top: 25px;
                box-shadow: 0 0 12px rgba(235, 238, 245, 1);

                .sum-equip {
                    float: right;
                    font-size: 20px;
                    color: #3F5FE0;
                    line-height: 72px;
                    margin-right: 72px;
                }
            }
        }
    }
</style>