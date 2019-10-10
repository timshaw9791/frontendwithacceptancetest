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
                                v-if="type==='需要充电'"
                                placeholder="rfid"
                                suffix="el-icon-search"
                                v-model="inquire"
                                :wrapforlike="false"
                                style=" width:285px;">
                        </BosInput>
                    </div>
                </tabs>

                <div v-if="show">
                    <el-table :data="list" fit highlight-current-row>
                        <bos-table-column lable="rfid" field="equip.rfid"></bos-table-column>
                        <bos-table-column lable="装备名称" field="equip.name"></bos-table-column>
                        <bos-table-column lable="装备序号" field="equip.serial"></bos-table-column>
                        <bos-table-column lable="架体编号" field="equip.location.number"></bos-table-column>

                        <bos-table-column lable="架体AB面"
                                          :filter="(row)=>surface(row.equip.location?row.equip.location.surface:'暂无')"></bos-table-column>

                        <bos-table-column lable="充电周期" :filter="(row)=>milliToDay(row.chargeCycle)"></bos-table-column>

                        <!--<bos-table-column lable="充电周期" field="chargeCycle"></bos-table-column>-->

                        <bos-table-column lable="上次充电时间"
                                          :filter="(row)=>$filterTime(row.lastChargeTime)"></bos-table-column>
                        <bos-table-column lable="电量倒计时"
                                          v-if="type!=='正在充电'"
                                          :filter="(row)=>countdown(row.lastChargeTime,row.chargeCycle)"></bos-table-column>
                    </el-table>

                    <bos-paginator :pageInfo="paginator" @bosCurrentPageChanged="changePage"/>

                </div>


                <right v-if="!show"></right>
            </div>
        </el-card>

    </div>
</template>

<script>
    import tabs from 'components/base/tabs/index'
    import right from './rightCharging'
    import {formRulesMixin} from 'field/common/mixinAxios';
    import {transformMixin} from 'common/js/transformMixin'
    import {getNeedCharge} from "api/needs";


    export default {
        data() {
            return {
                tabsList: ['需要充电', '正在充电'],
                inquire: '',
                type: '',
                show: true,
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
                this.type = data;
                if (data === '需要充电') {
                    this.show = true;

                    if (this.$route.query['name']) {
                        this.inquire = this.$route.query.name;
                    } else {
                        this.getList();
                    }

                } else if (data === '正在充电') {
                    this.show = false;
                }
            },
            async getList() {
                this.list = await this.getAxiosList1(getNeedCharge);
            }
        },


        watch: {
            inquire(newVal) {
                if (newVal) {
                    this.$set(this.param, 'rfid', newVal);
                } else {
                    this.$set(this.param, 'rfid', null);
                }
            }
        },

        components: {
            tabs,
            right
        }
    }
</script>

<style lang="scss" scoped>
    .el-card {
        border: none !important;
    }

</style>