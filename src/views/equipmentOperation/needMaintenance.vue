<template>
    <div>
        <el-table :data="list" v-loading.body="$apollo.queries.list.loading" element-loading-text="Loading"
                  fit highlight-current-row
                  @selection-change="handleSelectionChange">
            <el-table-column
                    type="selection"
                    v-if="batch"
                    width="55">
            </el-table-column>
            <bos-table-column lable="装备名称" field="equip.name"></bos-table-column>
            <bos-table-column lable="装备序号" field="equip.serial"></bos-table-column>
            <bos-table-column lable="架体编号" field="equip.location.number"></bos-table-column>
            <bos-table-column lable="架体AB面"
                              :filter="(row)=>surface(row.equip.location?row.equip.location.surface:'暂无')"></bos-table-column>
            <bos-table-column lable="保养周期/天" field="upkeepCycle"></bos-table-column>
            <bos-table-column lable="上次保养时间" :filter="(row)=>formatTime(row.lastUpkeepTime)"></bos-table-column>
            <bos-table-column lable="保养倒计时"
                              :filter="(row)=>countdown(row.lastUpkeepTime,row.upkeepCycle)"></bos-table-column>

            <el-table-column label="操作" align="center" width="200">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="single(scope.row)"
                               v-if="scope.row.equip.state==='IN_HOUSE'">保 养
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="_contentBt" v-if="batch">
            <el-button @click="$emit('cancel',false)">取 消</el-button>
            <el-button type="primary" @click="submit">提 交</el-button>
        </div>
        <bos-paginator :pageInfo="paginator" @bosCurrentPageChanged="changePage"/>


        <serviceDialog title="提示" ref="dialogButton" @confirm="submit">
            <div class="_dialogDiv">
                您确定要保养此装备吗!?
            </div>
        </serviceDialog>

    </div>
</template>

<script>
    import {formRulesMixin} from 'field/common/mixinComponent';
    import serviceDialog from 'components/base/serviceDialog'
    import api from 'gql/operation.gql'
    import {transformMixin} from 'common/js/transformMixin'

    export default {
        data() {
            return {
                equipList: [],
                param: {
                    qfilter: {
                        "key": "upkeepCycle",
                        "operator": "GREATTHAN",
                        "value": "0",
                        "combinator": "AND",
                        "next": {
                            "key": "upkeepState",
                            "operator": "EQUEAL",
                            "value": "NEED_UPKEEP"
                        }
                    },
                },
            }
        },
        mixins: [formRulesMixin, transformMixin],

        props: {
            batch: {
                type: [Boolean, String],
                default: false
            }
        },

        components: {
            serviceDialog
        },
        apollo: {
            list() {
                return this.getEntityListWithPagintor(api.getEquipRemindStrategyList);
            },
        },
        methods: {
            submit() {
                if (0 in this.equipList) {
                    this.gqlMutate(api.admin_upkeepEquips, {
                        equipIdList: this.equipList,
                    }, (res) => {
                        console.log(res);
                        this.$refs.dialogButton.hide();
                        this.callback('正在保养了!');
                        this.equipList = [];
                    })
                } else {
                    this.$message.error('未选择装备!')
                }
            },
            handleSelectionChange(val) {
                this.equipList = val.map((res) => {
                    return res.equip.id
                });
            },
            single(row) {
                this.$refs.dialogButton.show();
                this.equipList.push(row.equip.id);
            },
        }
    }
</script>

<style scoped>

</style>