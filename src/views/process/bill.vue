<template>
    <div class="card">
        <el-card shadow="never" :body-style="{ padding:'5px 20px'}">
            <div slot="header" class="card-header">
                <span class="_card-title">{{$route.meta.title}}</span>

                <el-button type="text" class="_textBt headerButton" @click="$router.push('/process/scrapped')">
                    <svg-icon icon-class="返回" class="svg"/>
                    返回
                </el-button>

            </div>
            <div class="card-body">
                <el-button type="text" class="_textBt" @click="$refs.dialog.show()">
                    <svg-icon icon-class="查看流程" class="svg"/>
                    查看进度
                </el-button>
                <!--<el-button type="text" class="_textBt">-->
                <!--<svg-icon icon-class="详情" class="svg"/>-->
                <!--详情-->
                <!--</el-button>-->
            </div>
        </el-card>
        <div class="bill">
            <!--<img src="@/common/images/未审批.png" class="icon"/>-->
            <!--<img src="@/common/images/驳回.png" class="icon"/>-->
            <img src="@/common/images/通过.png" class="icon"/>
            <div class="content">
                <div class="tr">
                    <div class="title">申请编号: {{items.id}}</div>
                </div>
                <div class="tr">
                    <div class="title">申请类型: {{applicationType(items.scrapType)}}</div>
                    <div class="title">申请人: {{items.operator}}</div>
                    <div class="title">申请时间: {{formatTime(items.time)}}</div>
                </div>
                <div class="tr">
                    <div>申请理由: {{items.reason}}</div>
                </div>
                <div>
                    <div>装备统计:</div>
                    <el-table :data="items.equipScrapItems" class="list" fit height="420">
                        <el-table-column label="序号" align="center">
                            <template slot-scope="scope">
                                {{scope.$index+1}}
                            </template>
                        </el-table-column>
                        <bos-table-column lable="装备名称" field="name"></bos-table-column>
                        <bos-table-column lable="装备型号" field="model"></bos-table-column>
                        <bos-table-column lable="装备序号" field="serial"></bos-table-column>
                    </el-table>
                </div>

                <!--<div class="trBottom">审核人：审核</div>-->
                <!--<div class="trBottom">审核时间:2019年5月7日 14:53:58</div>-->


                <!--<div class="_box-bottom">-->
                <!--<el-button type="danger" size="medium">驳 回</el-button>-->
                <!--<el-button type="primary" size="medium">批 准</el-button>-->
                <!--</div>-->
            </div>
        </div>

        <serviceDialog title="进度" ref="dialog" :button="false" :secondary="false" width="40%">
            <el-timeline class="timeLine">
                <el-timeline-item
                        v-for="(activity, index) in activities"
                        :key="index"
                        :timestamp="activity.timestamp">
                    {{activity.content}}
                </el-timeline-item>
            </el-timeline>
        </serviceDialog>

    </div>
</template>

<script>
    import serviceDialog from 'components/base/serviceDialog'
    import {formRulesMixin} from 'field/common/mixinComponent';
    import {transformMixin} from "common/js/transformMixin";
    import api from 'gql/process.gql'

    export default {
        components: {
            serviceDialog
        },
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
                items: '',
            }
        },
        methods: {
            getList() {
                this.gqlQuery(api.getEquipScrapedRecord, {
                    id: this.$route.query.id
                }, (res) => {
                    this.items = JSON.parse(JSON.stringify(res.data.EquipScrapedRecord));
                })
            },
            serial(data) {
                console.log(data);
            },

        },


        mixins: [formRulesMixin, transformMixin],
        mounted() {
            this.getList();
        }
    }
</script>

<style lang="scss" scoped>

    .card {
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
                    margin-bottom: 18px;

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

        .card-body {
            text-align: right;

        }

        .timeLine {

        }
    }


</style>


