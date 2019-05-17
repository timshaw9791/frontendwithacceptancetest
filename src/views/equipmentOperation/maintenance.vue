<template>
    <div>
        <el-card shadow="never">
            <div slot="header">
                <span class="_card-title">{{$route.meta.title}}</span>
            </div>
            <div>
                <tabs :list="tabsList" :indexDefault="0" @selected="selected">
                    <el-button type="text" class="_textBt" @click="batch=!batch" v-if="tabsShow">
                        <svg-icon icon-class="批量"/>
                        批量管理
                    </el-button>
                    <div class="_buttons">
                        <BosInput
                                placeholder="装备/序号/编号/AB面"
                                suffix="el-icon-search"
                                v-model="param.namelike"
                                :wrapforlike="true"
                                style=" width:285px;">
                        </BosInput>
                    </div>
                </tabs>
                <el-table :data="list" v-loading.body="$apollo.queries.list.loading" element-loading-text="Loading"
                          fit highlight-current-row
                          @selection-change="handleSelectionChange"
                >
                    <el-table-column
                            type="selection"
                            v-if="batch"
                            width="55">
                    </el-table-column>
                    <bos-table-column lable="装备名称" field="equip.name"></bos-table-column>
                    <bos-table-column lable="装备序号" field="equip.id"></bos-table-column>
                    <bos-table-column lable="架体编号" field="equip.location.number"></bos-table-column>
                    <bos-table-column lable="架体AB面"
                                      :filter="(row)=>surface(row.equip.location.surface)"></bos-table-column>

                    <bos-table-column lable="保养周期" field="upkeepCycle"></bos-table-column>
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
                    <el-button type="primary" @click="batch=false">取 消</el-button>
                    <el-button type="primary" @click="submit">提 交</el-button>
                </div>
                <bos-paginator :pageInfo="paginator" @bosCurrentPageChanged="changePage"/>
            </div>
        </el-card>
        <serviceDialog title="请确认维修装备清单" ref="dialog">
            <el-table :data="list">
                <bos-table-column lable="序号" field="id"></bos-table-column>
                <bos-table-column lable="装备名称" field="name"></bos-table-column>
                <bos-table-column lable="装备序号" field="name"></bos-table-column>
                <bos-table-column lable="架体编号" field="name"></bos-table-column>
                <bos-table-column lable="架体AB面" field="name"></bos-table-column>
            </el-table>
        </serviceDialog>

        <serviceDialog title="提示" ref="dialogButton" @confirm="submit">
            <div class="_dialogDiv">
                您确定要保养此装备吗!?
            </div>
        </serviceDialog>


    </div>
</template>

<script>
    import equip from 'components/equipment/addEquipment'
    import tabs from 'components/base/tabs/index'
    import {formRulesMixin} from 'field/common/mixinComponent';
    import serviceDialog from 'components/base/serviceDialog'
    import api from 'gql/operation.gql'
    import {transformMixin} from 'common/js/transformMixin'


    export default {

        data() {
            return {
                tabsList: ['全部', '需要保养', '正在保养'],
                param: {
                    qfilter: {
                        "key": "upkeepCycle",
                        "operator": "GREATTHAN",
                        "value": "0"
                    },
                },
                batch: false,
                tabsShow: false,
                equipList: [],
            }
        },
        apollo: {
            list() {
                return this.getEntityListWithPagintor(api.getEquipRemindStrategyList);
            },
        },
        methods: {
            selected(data) {
                console.log(data);
                if (data === '需要保养') {
                    this.tabsShow = true;
                    this.param.qfilter = {
                        "key": "upkeepCycle",
                        "operator": "GREATTHAN",
                        "value": "0",
                        "combinator": "AND",
                        "next": {
                            "key": "upkeepState",
                            "operator": "EQUEAL",
                            "value": "NEED_UPKEEP"
                        }
                    }

                } else {
                    this.tabsShow = false;
                    this.batch = false;
                }

                if (data === '全部') {
                    this.param.qfilter = {
                        "key": "upkeepCycle",
                        "operator": "GREATTHAN",
                        "value": "0"
                    };
                } else if (data === '正在保养') {
                    this.param.qfilter = {
                        "key": "upkeepCycle",
                        "operator": "GREATTHAN",
                        "value": "0",
                        combinator: "AND",
                        next: {
                            "key": "equip.state",
                            "operator": "EQUEAL",
                            "value": "UPKEEP"
                        }
                    };
                }
            },
            service() {
                this.$refs.dialog.show();
            },
            submit() {
                if (0 in this.equipList) {
                    this.gqlMutate(api.admin_upkeepEquips, {
                        equipIdList: this.equipList,
                    }, (res) => {
                        console.log(res);
                        this.$refs.dialogButton.hide();
                        this.callback('保养已申请!');
                        this.equipList = [];
                    })
                } else {
                    this.$message.error('未选择装备!')
                }
            },


            single(row) {
                this.$refs.dialogButton.show();
                this.equipList.push(row.id);
            },
            handleSelectionChange(val) {
                this.equipList = val.map((res) => {
                    return res.id
                });
            }
        },

        mixins: [formRulesMixin, transformMixin],

        components: {
            equip,
            tabs,
            serviceDialog
        }
    }
</script>

<style lang="scss" scoped>
    .el-card {
        border: none !important;
    }

</style>