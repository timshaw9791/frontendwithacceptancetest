<template>
    <view-container>
        <div class="process-info">
            <define-input label="单号" v-model="order.number" :disabled="true"></define-input>
            <entity-input label="入库机构" v-model="order.house.organUnit" :disabled="true"
                          format="{name}"
                          :options="{search:'organUnits'}"></entity-input>
            <define-input label="入库库房" v-model="order.house.name"
                          :disabled="true"></define-input>
            <entity-input label="入库人员" v-model="order.operator" format="{name}({policeSign})"
                          :disabled="true"></entity-input>
        </div>
        <a-equips-table :is-info="isInfo" :equip-items="order.equips"
                        :match-equips="matchEquips" @getFinishEquip="getFinishEquip"
                        type="in">
        </a-equips-table>
        <tool-bar v-if="!isInfo">
            <base-button label="提交" slot="button" type="text" @click="submit()"></base-button>
            <base-button label="清空" slot="button" type="text" @click="clean()"></base-button>
        </tool-bar>
    </view-container>
</template>

<script>
    import bosTabs from "@/componentized/table/bosTabs"
    import myHeader from '@/components/base/header/header'
    import hardwareSelect from "@/components/hardwareSelect"
    import {mapGetters} from "vuex"
    import {activeTask, allocateOrders, processInbound} from "@/api/process"
    import aEquipsTable from "@/components/process/aEquipsTable";

    export default {
        name: "allocateIn",   // 流程入库
        components: {
            hardwareSelect,
            bosTabs,
            myHeader,
            aEquipsTable
        },
        data() {
            return {
                title: '',
                processInstanceId: '',
                taskId: '',
                isInfo: false,
                order: {operator: {}, house: {name: '', organUnit: {}},equips:[]},
                matchEquips: [], //出库是为申请装备  入库时为出库装备
                outboundEquips: [],
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
                console.log(res)
                let tempTitle ,  order
                if (this.allocateCategory === 'TRANSFER'){
                    tempTitle = "调拨"
                    order = res.transferApplyOrder
                }else {
                    tempTitle = "直调"
                    order = res.directAllotOrder
                }
                switch (this.type) {
                    case "false": {
                        this.title = tempTitle + '入库'
                        this.highLightCurrent = false
                        this.matchEquips = res.outboundEquipsOrder.equips
                        console.log(this.matchEquips)
                        this.order.organUnit = order.inboundOrganUnit
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
                        this.title = tempTitle + '入库单详情'
                        this.order = res.inboundEquipsOrder
                        break
                    }
                }
            },
            getFinishEquip(equipItems) {
                this.order.equips = [];
                console.log(equipItems)
                _.map(equipItems, (item) => {
                    this.order.equips = this.order.equips.concat(item.items)
                    this.order.equips.equipId = this.order.equips.id
                })
            },
            clean() {
                this.fetchData()
            },
            submit() {
                this.order.processCategory = this.allocateCategory // 1为调拨流程 0为直调
                this.order.processInstanceId = this.processInstanceId
                this.order.inboundOrganUnitId = this.order.organUnit.id
                this.order.inboundOrganUnitName = this.order.organUnit.name
                this.order.operator = {
                    operatorId: this.order.operator.id,
                    operator: this.order.operator.name
                }
                processInbound(this.taskId, this.order).then(
                    this.$router.push("agencyMatters")
                )
            },
        },
        created() {
            Object.assign(this, this.$route.query)
            this.isInfo = this.type === "true"
            this.fetchData()
        },
        computed: {
            ...mapGetters([
                'organUnit',
                'userInfo',
                'warehouse'
            ])
        }
    }
</script>

<style scoped>
    .transfer-out-or-in-container {
        width: 100%;
        color: #707070FF;
        font-size: 16px;
    }

    .process-info {
        padding: 18px 0;
        display: flex;
        justify-content: space-between;
        overflow: hidden;
    }

    .buttom {
        height: 72px;
        margin-top: 25px;
        box-shadow: 0 0 12px rgba(235, 238, 245, 1);

    }
</style>