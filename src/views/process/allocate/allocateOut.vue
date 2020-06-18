<template>
    <div class="transfer-out-or-in-container">
        <my-header :title="title" :haveBlack="false"></my-header>
        <div class="process-form-body">
            <div class="process-info">
                <define-input label="单号" v-model="order.number" :disabled="true"></define-input>
                <entity-input label="出库机构" v-model="order.house.organUnit" :disabled="true"
                              format="{name}"
                              :options="{search:'organUnits'}"></entity-input>
                <define-input label="出库库房" v-model="order.house.name"
                              :disabled="true"></define-input>
                <entity-input label="出库人员" v-model="order.operator" format="{name}({policeSign})" :disabled="true"></entity-input>
            </div>
            <div class="table-box">
                <!--统一处理装备表组件-->
                <a-equips-table :is-info="isInfo" :equip-items="equipItems"
                                :match-equips="matchEquips" @getFinishEquip="getFinishEquip" type="out">
                </a-equips-table>
            </div>
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
    import HardwareSelect from "@/components/hardwareSelect";
    import {transEquips} from "@/common/js/transEquips";
    import {mapGetters} from "vuex";
    import {activeTask, processOutbound, transferOrders} from "@/api/process";
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
                    equips:[]
                },
                isOutbound:'',
                equipItems: [{items: [], locationInfo: {}}],
                matchEquips: [],
            }
        },
        methods: {
            fetchData() {
                transferOrders(this.processInstanceId).then(
                    res => this.fixData(res)
                )
                // 查询当前任务ID
                activeTask(this.processInstanceId).then(res => {
                    this.taskId = res.taskId
                })
            },
            fixData(res) {
                let tempTitle = this.allocateCategory === 'TRANSFER' ? '调拨' : '直调'
                switch (this.type) {
                    case "false": {
                        this.title = tempTitle + '出库'
                        this.matchEquips = transEquips(res.transferApplyOrder.equips).equipItems
                        this.order.organUnit = res.transferApplyOrder.outboundOrganUnit
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
                        this.equipItems = transEquips(this.order.equips).equipItems
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
                this.equipItems =[{items: [], locationInfo: {}}]
            },
            submit() {
                let outOrder = JSON.parse(JSON.stringify(this.order))
                _.map(this.equipItems, (item) => {
                    outOrder.equips = this.order.equips.concat(item.items)
                    outOrder.equips.equipId = this.order.equips.id
                })
                outOrder.processCategory = this.allocateCategory  // 1为调拨流程 0为直调
                outOrder.processInstanceId = this.processInstanceId
                processOutbound(this.taskId, this.order).then(
                    this.$router.push({path:'agencyMatters'})
                )
            },
        },
        created() {
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
</style>