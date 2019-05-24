<template>
    <div>
        <el-card shadow="never">
            <div slot="header">
                <span class="_card-title">{{$route.meta.title}}</span>
            </div>
            <div>
                <tabs :list="tabsList" :indexDefault="0" @selected="selected">
                    <div class="_buttons">
                        <BosInput
                                placeholder="装备/序号/编号/AB面"
                                suffix="el-icon-search"
                                v-model="inquire"
                                :wrapforlike="true"
                                style=" width:285px;">
                        </BosInput>
                    </div>
                </tabs>

                <el-table :data="list" v-loading.body="$apollo.queries.list.loading" element-loading-text="Loading"
                          fit highlight-current-row>
                    <bos-table-column lable="装备名" field="equip.name"></bos-table-column>
                    <bos-table-column lable="装备ID" field="equip.id"></bos-table-column>
                    <bos-table-column lable="架体编号" field="equip.location.number"></bos-table-column>
                    <bos-table-column lable="架体AB面"
                                      :filter="(row)=>surface(row.equip.location.surface)"></bos-table-column>
                    <bos-table-column lable="充电周期" field="chargeCycle"></bos-table-column>
                    <bos-table-column lable="上次充电时间" :filter="(row)=>formatTime(row.lastChargeTime)"></bos-table-column>
                    <bos-table-column lable="电量倒计时"
                                      v-if="type!=='正在充电'"
                                      :filter="(row)=>countdown(row.lastChargeTime,row.chargeCycle)"></bos-table-column>
                </el-table>
                <bos-paginator :pageInfo="paginator" @bosCurrentPageChanged="changePage"/>
            </div>
        </el-card>

    </div>
</template>

<script>
    import equip from 'components/equipment/addEquipment'
    import tabs from 'components/base/tabs/index'
    import {formRulesMixin} from 'field/common/mixinComponent';
    import api from 'gql/operation.gql'
    import {transformMixin} from 'common/js/transformMixin'

    export default {
        data() {
            return {
                tabsList: ['全部', '需要充电', '正在充电'],
                param: {
                    qfilter: {
                        operator: "GREATTHAN",
                        key: "chargeCycle",
                        value: "0",
                    },
                },
                inquire: '',
                type: '',
            }
        },
        methods: {
            selected(data) {
                console.log(data);
                this.type = data;

                if (data === '全部') {
                    this.param.qfilter = {
                        operator: "GREATTHAN",
                        key: "chargeCycle",
                        value: "0",
                    };
                } else if (data === '需要充电') {
                    this.param.qfilter = {
                        "operator": "GREATTHAN",
                        "key": "chargeCycle",
                        "value": "0",
                        "combinator": "AND",
                        "next": {
                            "key": "chargeState",
                            "operator": "EQUEAL",
                            "value": "NEED_CHARGE"
                        }
                    }
                } else if (data === '正在充电') {
                    this.param.qfilter = {
                        operator: "GREATTHAN",
                        key: "chargeCycle",
                        value: "0",
                        combinator: "AND",
                        next: {
                            "key": "equip.state",
                            "operator": "EQUEAL",
                            "value": "CHARGE"
                        }
                    };
                }

            },

        },
        mixins: [formRulesMixin, transformMixin],

        apollo: {
            list() {
                return this.getEntityListWithPagintor(api.getEquipRemindStrategyList);
            },
        },

        components: {
            equip,
            tabs
        }
    }
</script>

<style lang="scss" scoped>
    .el-card {
        border: none !important;
    }

</style>