<template>
    <div class="charging">
        <el-card shadow="never">
            <div slot="header">
                <span class="_card-title">{{$route.meta.title}}</span>
            </div>
            <div>
                <tabs :list="tabsList" :indexDefault="0" @selected="selected">
                    <!--<div class="_buttons">-->
                        <!--<BosInput-->
                                <!--v-if="type==='需要充电'"-->
                                <!--placeholder="rfid/装备/序号/编号"-->
                                <!--suffix="el-icon-search"-->
                                <!--v-model="inquire"-->
                                <!--:wrapforlike="false"-->
                                <!--style=" width:285px;">-->
                        <!--</BosInput>-->
                    <!--</div>-->
                </tabs>

                <div v-if="show">
                    <el-table :data="list" fit highlight-current-row height="3.55rem">
                        <bos-table-column lable="RFID" field="rfid"></bos-table-column>
                        <bos-table-column lable="装备序号" field="serial"></bos-table-column>
                        <bos-table-column lable="装备名称" field="equipArg.name"></bos-table-column>
                        <bos-table-column lable="装备型号" field="equipArg.model"></bos-table-column>
                        <bos-table-column lable="装备位置"
                                          :filter="(row)=>surface(row.location)"></bos-table-column>

                        <bos-table-column lable="充电周期" :filter="(row)=>milliToDay(row.equipArg.chargeCycle)"></bos-table-column>

                        <!--<bos-table-column lable="充电周期" field="chargeCycle"></bos-table-column>-->

                        <bos-table-column lable="电量倒计时"
                                          v-if="type!=='正在充电'"
                                          :filter="(row)=>chargeCountdown(row.chargeCountdown)"></bos-table-column>
                    </el-table>

                    <!--<bos-paginator v-if="this.list!=''" :pageInfo="paginator" @bosCurrentPageChanged="changePage"/>-->

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
                 getNeedCharge().then(res=>{
                     this.list = res
                });
            }
        },


        watch: {
            inquire(newVal) {
                if (newVal) {
                    this.$set(this.param, 'search', newVal);
                } else {
                    this.$set(this.param, 'search', null);
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
    .charging {
        font-size: 16px;
    }
    .el-card {
        border: none !important;
    }

</style>