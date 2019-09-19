<template>
    <div>
        <el-card shadow="never">
            <div slot="header">
                <span class="_card-title">{{$route.meta.title}}</span>
            </div>
            <div>
                <tabs :list="tabsList" :indexDefault="0" @selected="selected">
                    <el-button type="text" class="_textBt" @click="batch=!batch">
                        <svg-icon icon-class="批量"/>
                        {{title}}
                    </el-button>
                    <div class="_buttons">
                        <BosInput
                                v-if="type==='需要保养'"
                                placeholder="rfid"
                                suffix="el-icon-search"
                                v-model="inquire"
                                :wrapforlike="true"
                                style=" width:285px;">
                        </BosInput>
                    </div>
                </tabs>
                <div v-if="show">
                    <el-table :data="list" fit highlight-current-row
                              @selection-change="handleSelectionChange">
                        <el-table-column
                                type="selection"
                                v-if="batch"
                                width="55">
                        </el-table-column>
                        <bos-table-column lable="rfid" field="equip.rfid"></bos-table-column>
                        <bos-table-column lable="装备名称" field="equip.name"></bos-table-column>
                        <bos-table-column lable="装备序号" field="equip.serial"></bos-table-column>
                        <bos-table-column lable="架体编号" field="equip.location.number"></bos-table-column>
                        <bos-table-column lable="架体AB面"
                                          :filter="(row)=>surface(row.equip.location?row.equip.location.surface:'暂无')"></bos-table-column>

                        <bos-table-column lable="保养周期/天"
                                          :filter="(row)=>milliToDay(row.upkeepCycle)"></bos-table-column>

                        <bos-table-column lable="上次保养时间"
                                          :filter="(row)=>formatTime(row.lastUpkeepTime)"></bos-table-column>

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
                        <el-button @click="cancel(false)">取 消</el-button>
                        <el-button type="primary" @click="submit">提 交</el-button>
                    </div>

                    <bos-paginator :pageInfo="paginator" @bosCurrentPageChanged="changePage"/>


                    <serviceDialog title="提示" ref="dialogButton" @confirm="submit">
                        <div class="_dialogDiv">
                            您确定要保养此装备吗!?
                        </div>
                    </serviceDialog>

                </div>

                <right :batch="batch" @cancel="cancel" v-if="!show"></right>
            </div>
        </el-card>

    </div>
</template>

<script>

    import tabs from 'components/base/tabs/index'

    import right from './rightMaintenance'

    import {formRulesMixin} from 'field/common/mixinAxios';
    import serviceDialog from 'components/base/serviceDialog'
    import api from 'gql/operation.gql'
    import {transformMixin} from 'common/js/transformMixin'
    import {getNeedUpkeep} from "api/needs";


    export default {

        data() {
            return {
                tabsList: ['需要保养', '正在保养'],
                type: '',
                inquire: '',
                batch: false,
                show: true,
                title: '',
                equipList: [],
                param: {
                    property: 'lastUpkeepTime',
                    direction: 'ASC'
                },
                list: [],

            }
        },
        mixins: [formRulesMixin, transformMixin],


        methods: {
            selected(data) {
                console.log(data);
                this.type = data;
                if (data === '需要保养') {
                    this.title = '批量保养';
                    this.show = true;
                    this.getList();
                } else if (data === '正在保养') {
                    this.title = '批量入库';
                    this.show = false;
                }
                this.batch = false;
            },

            cancel(data) {
                this.batch = data;
            },


            async getList() {
                this.list = await this.getAxiosList(getNeedUpkeep);
                console.log(this.list);
            },

            submit() {
                if (0 in this.equipList) {
                    this.gqlMutate(api.admin_upkeepEquips, {
                        equipIdList: this.equipList,
                    }, (res) => {
                        this.$refs.dialogButton.hide();
                        this.$message.success('正在保养了!');
                        this.cancel(true);
                        this.getList();
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


        },

        mounted() {
            this.getList();
        },

        components: {
            tabs,
            right,
            serviceDialog
        },

    }
</script>

<style lang="scss" scoped>
    .el-card {
        border: none !important;
    }

</style>