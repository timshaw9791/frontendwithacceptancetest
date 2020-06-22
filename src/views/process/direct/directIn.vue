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
                <entity-input label="入库人员" v-model="order.operator" :disabled="true"></entity-input>
            </div>
            <div class="table-box">
                <!--详情没有对照表用isInfo判断-->
                <bos-tabs :option="isInfo?['tabs']:['tabs', 'contrast']" :layoutRatio="isInfo?[1,1]:[2,1]">
                    <template slot="slotHeader" v-if="!isInfo">
                        <hardware-select @readDate="readData"></hardware-select>
                    </template>
                    <!--装备总清单-->
                    <define-table :havePage="false" :data="equipItems" @changeCurrent="selRow"
                                  :showSummary="true" :summaryFunc="isInfo?$sumFunc:sumCountAndPrice"
                                  :highLightCurrent="true"
                                  slot="total" ref="totalTable" :init-select="true">
                        <define-column label="操作" width="100" v-slot="{ data }" v-if="!isInfo">
                            <i class="iconfont iconyichu" @click="$delRow(equipItems,data.$index)"></i>
                        </define-column>
                        <define-column label="装备位置" v-slot="{ data }">
                            <entity-input v-model="data.row.locationInfo" :options="{search:'locationSelect'}"
                                          :formatFunc="$formatFuncLoc" :tableEdit="true"></entity-input>
                        </define-column>
                        <define-column label="装备参数" v-slot="{ data }">
                            <entity-input v-model="data.row.equipArg" format="{name}({model})"
                                          :disabled="true"></entity-input>
                        </define-column>
                        <define-column label="装备数量" v-slot="{ data }">
                            <define-input v-model="data.row.items.length" type="Number"
                                          :tableEdit="false"></define-input>
                        </define-column>
                        <!--比较特殊的计算方法-->
                        <define-column label="金额" v-if="!isInfo"
                                       :filter="(row)=>row.items.reduce((iniVal,cutVal)=>{return !!cutVal.price && iniVal+cutVal.price},0)">
                        </define-column>
                    </define-table>
                    <!--装备明细-->
                    <define-table :havePage="false"
                                  :data="totalIndex===-1?equipItems[0].items:equipItems[totalIndex].items"
                                  slot="detail" ref="detailTable">
                        <define-column label="操作" width="100" v-slot="{ data }" v-if="!isInfo">
                            <i class="iconfont iconyichu"
                               @click="$delRow(equipItems[totalIndex].items,data.$index,()=>{!equipItems[totalIndex].items.length && equipItems.splice(totalIndex,1)})"></i>
                        </define-column>
                        <define-column label="RFID" field="rfid"></define-column>
                        <define-column label="序号" field="serial"></define-column>
                    </define-table>
                    <!--对照的装备-->
                    <define-table :havePage="false" :data="matchEquips"
                                  slot="contrast" v-if="!isInfo" ref="matchTable">
                        <define-column label="装备参数" v-slot="{ data }">
                            <entity-input v-model="data.row.equipArg" format="{name}({model})"
                                          :disabled="true"></entity-input>
                        </define-column>
                        <define-column label="装备数量" v-slot="{ data }">
                            <define-input v-model="data.row.count" :disabled="true"></define-input>
                        </define-column>
                    </define-table>
                </bos-tabs>
            </div>
            <div class="button" v-if="!isInfo">
                <base-button label="提交" align="right" :width="128" :height="72" :fontSize="20"
                             @click="submit"></base-button>
                <base-button label="清空" align="right" :width="128" :height="72" :fontSize="20" type="danger"
                             @click="clean"></base-button>
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
    import {activeTask, processInbound, processOutbound, transferOrders} from "@/api/process";
    import {killProcess, start} from "@/common/js/rfidReader";

    export default {
        name: "directIn",   // 调拨出入库
        components: {
            HardwareSelect,
            bosTabs,
            myHeader
        },
        data() {
            return {
                order: {
                    operator: {},
                    house: {
                        name: '',
                        organUnit: {}
                    },
                    equips: []
                },
                equipItems: [{items: [], locationInfo: {}}],
                totalIndex: -1,
                isInfo: false,
                isInbound: false,
                processInstanceId: '',
                readEquips: [], //读到的RFID
                matchEquips: [],
                taskId: '',
                title: '',
                highLightCurrent: false,
                outboundEquips: [],
                pid: ''
            }
        },
        methods: {
            fetchData() {
                transferOrders(this.processInstanceId).then(
                    res => {
                        this.fixData(res)
                    },
                    activeTask(this.processInstanceId).then(res => {
                        this.taskId = res.taskId
                    })
                )
            },
            fixData(res) {
                switch (this.type) {
                    case "in": {
                        this.isInbound = true
                        this.highLightCurrent = false
                        this.outboundEquips = res.outboundEquipsOrder.equips
                        // 对照列表的数据为出库单的装备
                        this.matchEquips = transEquips(this.outboundEquips).equipItems
                        this.order.organUnit = res.transferApplyOrder.inboundOrganUnit
                        Object.assign(this.order, {operator: this.userInfo}, {
                            house: {
                                name: this.warehouse.name,
                                id: this.warehouse.id,
                                organUnit: this.order.organUnit
                            }
                        })
                        this.title = "调拨入库"
                        break
                    }
                    case "showIn": {
                        this.isInbound = true
                        this.isInfo = true
                        this.order = res.inboundEquipsOrder
                        this.title = "调拨入库单详情"
                        break
                    }
                }
            },
            readData() {
                // 1.判断是否选中当前行
                // 2.判断当前行是否有位置信息
                if (this.totalIndex === -1) {
                    this.$message.error("先选择需要扫描的位置")
                    return
                }
                killProcess(this.pid)
                start("java -jar scan.jar", (data) => {

                    this.outboundEquips.forEach(item => {
                        let temp = this.equipItems[this.totalIndex]
                        if (item.rfid !== data) {
                            this.$message.error("该装备不在出库装备列表内！")
                            return
                        }
                        // 要删价格
                        item.price = '1'
                        item.productTime = '1590721943'
                        if (temp.hasOwnProperty("equipArg")) {
                            if (item.equipName + "(" + item.equipModel + ")" !== temp.equipArg) {
                                this.$message.error("该装备与当前选中的装备参数不匹配！")
                                return
                            }
                            temp.items.push(item)
                            temp.count = temp.items.length
                            this.$forceUpdate()
                        } else {
                            temp.equipArg = item.equipName + "(" + item.equipModel + ")"
                            temp.items.push(item)
                            temp.count = temp.items.length
                            this.equipItems[this.totalIndex] = temp
                        }
                    })
                }, (fail) => {
                    this.index = 1;
                    this.$message.error(fail);
                }, (pid, err) => {
                    pid ? this.pid = pid : this.$message.error(err)
                })
                this.addRow()
            },
            fixEquipItems(data) {
                this.equipItems = transEquips(data).equipItems
                //缺少价格信息
                _.forEach(this.equipItems, (equipItem) => {
                    equipItem.price = _.reduce(equipItem.items,
                        (initVal, item) => item.price ? initVal + item.price : initVal + 0, 0)
                })
            },
            sumCountAndPrice(param) { // 表格合并行计算方法
                this.$nextTick(() => {
                    this.$refs.totalTable.refreshLayout();
                    this.$refs.detailTable.refreshLayout();
                    this.$refs.matchTable.refreshLayout();
                });
                let {columns, data} = param, sums;
                sums = new Array(columns.length).fill('')
                sums[0] = '合计'
                sums[columns.length - 2] = data.reduce((accumulator, currentValue) =>
                    !!currentValue.count ? accumulator + parseInt(currentValue.items.length) : accumulator, 0)
                let price = 0
                data.forEach((item)=>{
                    price += item.items.reduce((iniVal,curVal)=>{return !!curVal &&iniVal+curVal.price},0)
                })
                sums[columns.length - 1] = price
                return sums;
            },
            selRow(data) {
                this.totalIndex = data.index
            },
            addRow() {
                this.equipItems.push({items: [], locationInfo: {}})
            },
            clean() {

            },
            submit() {
                let subOrder,tempLocation
                subOrder=JSON.parse(JSON.stringify(this.order))
                _.map(this.equipItems, (item) => {
                    tempLocation = item.locationInfo
                    // 给装备的加上位置信息
                    item.items.forEach(equip=>{
                        equip.locationInfo = tempLocation
                    })
                    item.items.length !== 0 && (subOrder.equips = subOrder.equips.concat(item.items))
                    subOrder.equips.equipId = subOrder.equips.id
                })
                subOrder.processCategory = 1 // 1为调拨流程
                subOrder.processInstanceId = this.processInstanceId
                subOrder.inOutHouseItems = this.order.equips
                subOrder.inboundOrganUnitId = this.order.organUnit.id
                subOrder.inboundOrganUnitName = this.order.organUnit.name
                subOrder.operator = {
                    operatorId: this.order.operator.id,
                    operator: this.order.operator.name
                }
                processInbound(this.taskId, subOrder).then(
                    this.$router.push("agencyMatters")
                )
            }
        },
        created() {
            Object.assign(this, this.$route.query)
            this.isInfo = this.type === "showIn" // type => showIn,In
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