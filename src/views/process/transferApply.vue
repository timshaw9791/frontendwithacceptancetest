<template>
    <div class="apply-process-container">
        <my-header :title="title" :haveBlack="false"></my-header>
        <div class="apply-process" v-if="show">
            <operation-bar :task-definition-key="taskDefinitionKey"
                           @refused="refused" @agree="agree"
                           @invalid="invalid" @edit="edit"
            ></operation-bar>
            <div class="apply-process-body">
                <div class="process-info">
                    <define-input label="单号" v-model="order.number" :disabled="true" placeholder="-"></define-input>
                    <date-select label="申请时间" v-model="order.createTime" :disabled="true"></date-select>
                    <entity-input label="申请人员" v-model="order.applicant" :required="true"
                                  placeholder="请选择"></entity-input>
                    <entity-input label="入库机构" v-model="order.inboundOrganUnit" format="{name}"
                                  :options="{search:'organUnits'}" placeholder="请选择"></entity-input>
                    <entity-input label="入库库房" :disabled="true" placeholder="-"></entity-input>
                </div>
                <div class="process-info">
                    <entity-input label="入库人员" :disabled="true" placeholder="-"></entity-input>
                    <entity-input label="出库机构" v-model="order.outboundOrganUnit" format="{name}"
                                  :options="{search:'organUnits'}" placeholder="请选择"></entity-input>
                    <entity-input label="出库库房" :disabled="true" placeholder="-"></entity-input>
                    <entity-input label="出库人员" :disabled="true" placeholder="-"></entity-input>
                </div>
                <div class="process-info">
                    <text-input label="申请原因" v-model="order.note" :column="12" :tips="tips"></text-input>
                </div>
                <div class="table-box">
                    <bos-tabs :label="[{label: '总清单',key: 'total'}]">
                        <define-table :havePage="false" :data="order.equips" height="2.8646rem"
                                      :showSummary="true" :summaryFunc="$sumFunc" slot="total">
                            <define-column label="操作" width="100" v-slot="{ data }">
                                <i class="iconfont icontianjialiang" @click="changeRow(true,data)"></i>
                                <i class="iconfont iconyichuliang" @click="$delRow(order.equips,data.index)"></i>
                            </define-column>
                            <define-column label="装备参数" v-slot="{ data }">
                                <entity-input v-model="data.row.equipArg" :options="{detail:'equipArgsSelect'}" format="{name}({model})"></entity-input>
                            </define-column>
                            <define-column label="装备数量" v-slot="{ data }">
                                <define-input v-model="data.row.count" type="number"></define-input>
                            </define-column>
                        </define-table>
                    </bos-tabs>
                </div>
            <div class="buttom">
                <base-button label="提交" align="right" size="large" @click="submit"></base-button>
                <base-button label="清空" align="right" size="large" type="danger" @click="clean"></base-button>
            </div>
        </div>
    </div>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header';
    import bosTabs from '@/componentized/table/bosTabs'
    import {complete, getOrder, processStart, processDetail} from 'api/process'
    import OperationBar from "@/components/processNew/operationBar";
    import EquipItems from "@/components/processNew/equipItems";
    import {completeTask, processesDelete, taskDetail} from "@/api/workflow";
    import transferItems from "@/components/processNew/transferItems";
    import {getHistoryTasks} from "@/api/process";

    export default {
        name: "scrapApply",
        components: {
            transferItems,
            EquipItems,
            OperationBar,
            myHeader,
            bosTabs
        },
        data() {
            return {
                title: "",
                show: false,
                order: {},
                tips: ['直接报废', '装备拿去维修，无法修补'],
                taskDefinitionKey: '',
                processDefinitionKey:'',
                processInstanceId:'',
                equipItems:[{items:[]}],
                isInfo:false,
                isEdit:false
            }
        },
        methods: {
            async init() {
                Object.assign(this.order,{
                    organUnit:this.organUnit,
                    warehouse:this.warehouse,
                    applicant:this.userInfo
                })
            },
            fetchData() {
                processDetail({processInstanceId: this.processInstanceId}).then(
                    res => {
                        this.order = res.processVariables.applicant

                    }
                )
                getHistoryTasks({processInstanceId: this.processInstanceId}).then(
                    res => {
                        this.taskHistory = res
                    }
                )
                taskDetail({taskId: this.taskId}).then(res => {
                    this.taskDefinitionKey = res.taskDefinitionKey
                    if (this.order.applicant.name === JSON.parse(window.localStorage.getItem("user")).name) {
                        this.taskDefinitionKey = 'reApply'
                    }
                })
            },
            submit() {
                processStart({processDefinitionKey: this.processDefinitionKey}, order).then(() => {
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
                }, true).then(()=>{
                    this.$router.back()
                })
            },
            edit() { // 重填与编辑
                this.isEdit = true
                this.isInfo = false
            }
        },
        created() {
            Object.assign(this,this.$route.query)
            if (!!this.processInstanceId ){
                this.fetchData()
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
        border: 1px slid orange;

        .apply-process-top {
            padding: 18px 7px;
            border-bottom: 1px solid #EBEEF5;
            overflow: hidden;
        }

        .apply-process-body {
            padding: 0 7px;

            .process-info {
                padding: 18px 0;
                display: flex;
                justify-content: space-between;
                overflow: hidden;
            }

            .table-box {
                padding: 0 10px;

                .iconfont {
                    margin: 0 5px;
                }
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