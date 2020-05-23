<template>
    <div class="apply-process-container">
        <my-header :title="title" :haveBlack="false"></my-header>
        <div class="apply-process">
            <operation-bar :task-definition-key="taskDefinitionKey" @refused="refused" @agree="agree"></operation-bar>
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
                    <text-input label="申请原因" v-model="order.note" :tips="tips" :title="order.note"
                                :disabled="isInfo||isEdit"></text-input>
                </div>
                <equipItems :equip-items="equipItems" :is-info="isInfo" :is-edit="isEdit" @handleReadData="handleReadData"></equipItems>
                <div class="buttom" v-if="!isInfo&&!isEdit">
                    <base-button label="提交" align="right" size="large" @click="submit"></base-button>
                    <base-button label="清空" align="right" size="large" type="danger"></base-button>
                </div>
                <task-history :list="taskHistory" v-if="isInfo||isEdit"></task-history>
            </div>
        </div>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header';
    import bosTabs from '@/componentized/table/bosTabs.vue'
    import {processStart, getHistoryTasks,processDetail} from '../../api/process'
    import {findByRfids} from "../../api/storage";
    import {transEquips} from "../../common/js/transEquips";
    import {getHouseInfo} from "../../api/organUnit";
    import TaskHistory from "../../components/processNew/taskHistory";
    import equipItems from "../../components/processNew/equipItems";
    import {completeTask, taskDetail} from "../../api/workflow";
    import OperationBar from "../../components/processNew/operationBar";

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
                findIndex: 0,
                isInfo: false,
                isEdit: false,
                tips: [{value: '直接报废', key: '1'}, {value: '装备拿去维修，无法修补', key: '2'}],
                taskDefinitionKey:''

            }
        },
        methods: {
            async init() {
                let {houseId, houseName, organUnitId, organUnitName} = await getHouseInfo()
                this.order.warehouse.id = houseId
                this.order.warehouse.name = houseName
                this.order.organUnit.id = organUnitId
                this.order.organUnit.name = organUnitName
                this.order.applicant = JSON.parse(window.localStorage.getItem("user"))
            },
            selRow(current) { // 单选表格行
                if (!current) return; // 避免切换数据时报错
                this.detailTable.list = [];
                this.rowData = current;
                if (current.rfid === undefined) return;
                for (let rfid of current.rfid) {
                    this.detailTable.list.push({
                        rfid: rfid
                    })
                }
            },
            fetchData() {
                let {processInstanceId, taskId} = this.$route.query
                processDetail({processInstanceId}).then(
                    res => {
                        this.order = res.processVariables.applicant
                        this.equipItems = transEquips(res.processVariables.applicant.equips).equipItems
                    }
                )
                getHistoryTasks({processInstanceId}).then(
                    res => {
                        this.taskHistory = res
                    }
                )
                taskDetail({taskId}).then(res => {
                    this.taskDefinitionKey = res.taskDefinitionKey
                    if (this.order.applicant.name === JSON.parse(window.localStorage.getItem("user")).name){
                        this.taskDefinitionKey ='reApply'
                    }
                })
                debugger
            },
            handleReadData(data) { // 读取数据
                findByRfids(data).then(res => {
                    this.order.equips = transEquips(res, 'args', 'args').simplifyItems
                    this.equipItems = transEquips(res).equipItems
                })
            },
            sumFunc(param) { // 表格合并行计算方法
                let {columns, data} = param, sums = [];
                console.log(data)
                sums = new Array(columns.length).fill('')
                sums[0] = '合计'
                sums[columns.length - 1] = data.reduce((v, k) => v + k.count ? k.count : 0, 0)
                return sums;
            },
            submit() {
                processStart({
                    processDefinitionKey: this.$route.query.key,
                }, this.order).then(() => {
                    this.$router.push({name: 'myProcess'});
                })
            },
            refused() {
                completeTask(this.$route.query.taskId,
                    [{pass: false, note: '驳回测试'}]).then(() => {
                    this.back()
                })
            },
            agree(){
                completeTask(this.$route.query.taskId,
                    [{pass: true, note: '审核通过'}]).then(() => {
                    this.back()
                })
            },
        },
        created() {
            let {processInstanceId, name} = this.$route.query
            if (processInstanceId) {
                this.title = name.substring(0, 2) + '详情'
                this.isInfo = true
                this.fetchData()
            } else {
                this.title = name + '申请'
                this.init();
            }
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
                box-shadow: 0px 0px 12px rgba(235, 238, 245, 1);

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