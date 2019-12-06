<template>
    <div>
        <div class="header">
            <div>{{ title }}申请单</div>
        </div>
        <div class="body">
            <div class="info">
                <div>申请单号: {{ form.applyOrderId }}</div>
                <div v-show="notScrap">接收机构: {{ form.receiveAgency }}</div>
                <div v-show="notScrap">出库机构: {{ form.outAgency }}</div>
                <div>申请时间: {{ form.applyTime }}</div>
                <div v-show="notScrap">接收库房: {{ form.receiveStore }}</div>
                <div v-show="notScrap">出库库房: {{ form.outStore }}</div>
                <div>申请人员: {{ form.applyPeople }}</div>
                <div v-show="notScrap">接收人员: {{ form.receivePeople }}</div>
                <div v-show="notScrap">出库人员: {{ form.outPeople }}</div>
                <div v-show="!notScrap">报废原因: {{ form.note }}</div>
            </div>
            <div>装备统计:</div>
            <el-table :data="list" height="350" style="border: 1px solid #ccc;margin-top: 6px">
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
    </div>
</template>

<script>
    import serviceDialog from "components/base/serviceDialog"
    import { doneDetail, historyTasks, scrapAudit } from "api/process"
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
                list: [],
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
            toReview() {
                this.$refs.review.show()
            },
            getListInfo() {
                let params = {includeVariables: true};
                doneDetail(this.listId, params).then(res => {
                    console.log(res);
                    let result = JSON.parse(JSON.stringify(res.processVariables)), mergeName = '', have = '';
                    this.form = {
                        applyOrderId: '',
                        applyTime: result.applyOrder.applyTime,
                        applyPeople: result.applyOrder.applicant.name,
                        note: result.applyOrder.note,
                        taskId: res.id,
                        processInstanceId: res.id
                    }
                    this.processReviewInfo()
                    this.mergeList(result.applyOrder.equips)
                })
            },
            mergeList(array) {
                let arr = JSON.parse(JSON.stringify(array)), mergeName = '', have = 0, tempList = [];
                arr.forEach(equip => {
                    mergeName = `${equip.name}${equip.model}`
                    have = arr.findIndex(item => item.mergeName == mergeName)
                    if(have != -1) {
                        tempList[have].count++
                    } else {
                        tempList.push(Object.assign({}, equip, {count: 1, mergeName}))
                    }
                })
                this.list = tempList
                arr = null
                mergeName = null
                have = null
                tempList = null
            },
            processReviewInfo() {
                let params = {processInstanceId: this.form.processInstanceId, includeProcessVariables: false, includeTaskVariables: true},
                    lable = "";
                historyTasks(params).then(res => {
                    let tempList = [];
                    res.forEach(item => {
                        switch (item.taskDefinitionKey) {
                            case 'apply':
                                lable = "申请"
                                break;
                            case 'audit':
                                lable = "审核"
                                break;
                            default:
                                lable = "审批"
                                break;
                        }
                        tempList.push({
                            lable,
                            name: item.taskVariables.name,
                            passVal: item.taskVariables.pass == undefined?0:item.taskVariables.pass?1:2,
                            note: item.taskVariables.note || '',
                            time: item.endTime?this.$filterTime(item.endTime):'-'
                        })
                    })
                    this.processList = tempList
                })
            },
            lookReson(reson) {
                this.reson = reson;
                this.$refs.reson.show()
            }
        },
        created() {
            this.getListInfo()
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
            }
        },
        components: {
            serviceDialog
        }
    }
</script>

<style lang="scss" scoped>
    .operate {
        color: #2E2E74;
    }
    .header {
        padding: 0 20px;
        height: 35px;
        line-height: 35px;
        border-bottom: 1px solid rgba(112,112,112, 0.13);
        font-size: 16px;
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