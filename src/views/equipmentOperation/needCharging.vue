<template>
    <div>
        <el-table :data="list" fit highlight-current-row>
            <bos-table-column lable="装备名" field="equip.name"></bos-table-column>
            <bos-table-column lable="装备序号" field="equip.serial"></bos-table-column>
            <bos-table-column lable="架体编号" field="equip.location.number"></bos-table-column>

            <bos-table-column lable="架体AB面"
                              :filter="(row)=>surface(row.equip.location?row.equip.location.surface:'暂无')"></bos-table-column>

            <!--<bos-table-column lable="充电周期" :filter="(row)=>milliToDay(row.chargeCycle)"></bos-table-column>-->

            <bos-table-column lable="充电周期" field="chargeCycle"></bos-table-column>



            <bos-table-column lable="上次充电时间" :filter="(row)=>formatTime(row.lastChargeTime)"></bos-table-column>
            <bos-table-column lable="电量倒计时"
                              v-if="type!=='正在充电'"
                              :filter="(row)=>countdown(row.lastChargeTime,row.chargeCycle)"></bos-table-column>
        </el-table>

        <bos-paginator :pageInfo="paginator" @bosCurrentPageChanged="changePage"/>

    </div>

</template>

<script>

    import {formRulesMixin} from 'field/common/mixinAxios';
    import api from 'gql/operation.gql'
    import {transformMixin} from 'common/js/transformMixin'
    import {getNeedCharge} from "api/needs";

    export default {
        data() {
            return {
                param: {
                    property:'lastUpkeepTime',
                    direction:'ASC'
                },
                list: [],
            }
        },
        mixins: [formRulesMixin, transformMixin],

        // apollo: {
        //     list() {
        //         return this.getEntityListWithPagintor(api.getEquipRemindStrategyList);
        //     },
        // },
        methods: {
            async getList() {
                this.list = await this.getAxiosList(getNeedCharge);
                console.log(this.list);
            }
        },
        mounted() {
            this.getList();
        }
    }

</script>

<style scoped>

</style>