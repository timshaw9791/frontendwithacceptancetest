<template>
    <div class="transfer-out-or-in-container">
        <my-header :title="title" :haveBlack="false"></my-header>
        <div class="process-form-body">
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
            <a-equips-table :is-info="isInfo" :equip-items="equipItems"
                            :match-equips="matchEquips" @getFinishEquip="getFinishEquip"
                            type="in"
            >
            </a-equips-table>
            <div class="button" v-if="!isInfo">
                <base-button label="提交" align="right" :width="128" :height="72" :fontSize="20"
                             @click="submit()"></base-button>
                <base-button label="清空" align="right" :width="128" :height="72" :fontSize="20" type="danger"
                             @click="clean()"></base-button>
            </div>
        </div>
    </div>
</template>

<script>
    import bosTabs from "@/componentized/table/bosTabs"
    import myHeader from '@/components/base/header/header'
    import hardwareSelect from "@/components/hardwareSelect"
    import {transEquips} from "@/common/js/transEquips"
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
                isInbound: false,
                order: {operator: {}, house: {name: '', organUnit: {}}},
                equipItems: [{items: [], locationInfo: {}}],
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
                let tempTitle = this.allocateCategory === 'TRANSFER' ? '调拨' : '直调'  //TRANSFER or DIRECT
                switch (this.type) {
                    case "in": {
                        this.title = tempTitle + '入库'
                        this.isInbound = true
                        this.highLightCurrent = false
                        this.matchEquips = transEquips(res.outboundEquipsOrder.equips).equipItems
                        this.order.organUnit = res.transferApplyOrder.inboundOrganUnit
                        Object.assign(this.order, {operator: this.userInfo}, {
                            house: {
                                name: this.warehouse.name,
                                id: this.warehouse.id,
                                organUnit: this.order.organUnit
                            }
                        })
                        break
                    }
                    case "showIn": {
                        this.title = tempTitle + '入库单详情'
                        this.isInbound = true
                        this.isInfo = true
                        this.order = res.inboundEquipsOrder
                        this.fixEquipItems()
                        break
                    }
                }
            },
            getFinishEquip(equipItems){
                _.map(equipItems, (item) => {
                    this.order.equips = this.order.equips.concat(item.items)
                    this.order.equips.equipId = this.order.equips.id
                })
            },
            clean() {
                this.fetchData()
                this.equipItems = [{items: [], locationInfo: {}}]
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
            this.fetchData()
        },
        computed: {
            ...mapGetters([
                'organUnit',
                'userInfo',
                'warehouse'
            ])
        },
        watch: {
            'equipItems.length'(newVal) {
                !newVal && this.equipItems.push({items: [], locationInfo: {}})
            }
        },
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