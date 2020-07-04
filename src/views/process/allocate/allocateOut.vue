<template>
    <view-container>
        <define-input label="单号" v-model="order.number" :disabled="true"></define-input>
        <entity-input label="出库机构" v-model="order.house.organUnit" :disabled="true"
                      format="{name}" :options="{search:'organUnits'}"></entity-input>
        <define-input label="出库库房" v-model="order.house.name"
                      :disabled="true"></define-input>
        <entity-input label="出库人员" v-model="order.operator" format="{name}({policeSign})"
                      :disabled="true"></entity-input>
        <!--统一处理装备表组件-->
        <a-equips-table :is-info="isInfo" :equip-items="equipItems"
                        :match-equips="matchEquips" @getFinishEquip="getFinishEquip" type="out">
        </a-equips-table>
        <tool-bar v-if="!isInfo">
            <base-button label="提交" type="text" slot="button" @click="submit()"></base-button>
            <base-button label="清空" type="text" slot="button" @click="clean()"></base-button>
        </tool-bar>
    </view-container>
</template>

<script>
    import bosTabs from "@/componentized/table/bosTabs"
    import myHeader from '@/components/base/header/header'
    import HardwareSelect from "@/components/hardwareSelect";
    import {transEquips} from "@/common/js/transEquips";
    import {mapGetters} from "vuex";
    import {activeTask, allocateOrders, processOutbound} from "@/api/process";
    import aEquipsTable from "@/components/process/aEquipsTable";

    export default {
        name: "allocateOut",   // 流程出库
        components: {
            aEquipsTable,
            HardwareSelect,
            bosTabs,
            myHeader
        },
        data() {
            return {
                title: '',
                isInfo: true,
                processInstanceId: '',
                taskId: '',
                order: {
                    operator: {},
                    house: {
                        name: '',
                        organUnit: {}
                    },
                    equipItems: []
                },
                isOutbound: '',
                matchEquips: [], // 对照的装备列表
                equipItems:[]// 详情传入装备列表
            }
        },
        methods: {
            fetchData() {
                allocateOrders(this.processInstanceId, this.allocateCategory).then(res => {
                    this.fixData(res)
                })
                activeTask(this.processInstanceId).then(res => {
                    this.taskId = res.taskId
                })
            },
            fixData(res) {
                let tempTitle, tempOrder
                if (this.allocateCategory === 'TRANSFER') {
                    tempTitle = "调拨"
                    tempOrder = res.transferApplyOrder
                } else {
                    tempTitle = "直调"
                    tempOrder = res.directAllotOrder
                }
                switch (this.type) {
                    case "false": {
                        this.title = tempTitle + '出库'
                        this.matchEquips = tempOrder.equipItems
                        this.order.organUnit = tempOrder.outboundOrganUnit
                        Object.assign(this.order, {operator: this.userInfo}, {
                            house: {
                                name: this.warehouse.name,
                                id: this.warehouse.id,
                                organUnit: this.order.organUnit
                            }
                        })
                        break
                    }
                    case "true": {
                        this.title = tempTitle + '出库单详情'
                        this.isOutbound = true
                        this.order = res.outboundEquipsOrder
                        this.equipItems = this.order.equipItems
                        break
                    }
                }
            },
            // 获取装备列表的装备
            getFinishEquip(equipItems) {
                _.map(equipItems, (item) => {
                    this.order.equipItems = this.order.equipItems.concat(item.items)
                    this.order.equipItems.equipId = this.order.equipItems.id
                })
             },
            clean() {
                this.fetchData()
            },
            submit() {
                let outOrder = JSON.parse(JSON.stringify(this.order))
                outOrder.processInstanceId = this.processInstanceId
                outOrder.processCategory = this.allocateCategory  // 1为调拨流程 0为直调
                // todo 后端修改后可以删除operator的转换
                outOrder.category = "OUT_HOUSE"  // 1为调拨流程 0为直调
                outOrder.operator.operatorId = outOrder.operator.id
                outOrder.operator.operator = outOrder.operator.name
                processOutbound(this.taskId, outOrder).then(
                    this.$router.push({path: 'agencyMatters'})
                )
            },
        },
        created() {
            /*
            * type 字符串 true false
            * */
            Object.assign(this, this.$route.query)
            console.log(this.$route.query)
            this.isInfo = this.type === "true"
            this.fetchData()
        },
        computed: {
            ...mapGetters([
                'organUnit',
                'userInfo',
                'warehouse'
            ])
        },

    }
</script>

<style scoped>
</style>