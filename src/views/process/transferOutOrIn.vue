<template>
    <div class="transfer-out-or-in-container">
        <my-header :title="title" :haveBlack="false"></my-header>
        <div class="process-form-body">
            <div class="process-info">
                <define-input label="单号" v-model="order.number" :disabled="true"></define-input>
                <entity-input :label="isInbound?'入库机构':'出库机构'" v-model="order.house.organUnit" :disabled="true"
                              format="{name}"
                              :options="{search:'organUnits'}"></entity-input>
                <define-input :label="isInbound?'入库库房':'出库库房'" v-model="order.house.name"
                              :disabled="true"></define-input>
                <entity-input :label="isInbound?'入库人员':'出库人员'" v-model="order.operator" :disabled="true"></entity-input>
            </div>
            <div class="table-box">
                <bos-tabs :option="isInfo?['tabs']:['tabs', 'contrast']" :layoutRatio="isInfo?[1,1]:[2,1]">
                    <template slot="slotHeader" v-if="!isInfo">
                        <hardware-select @readDate="readData"></hardware-select>
                    </template>
                    <!--装备总清单-->
                    <define-table :havePage="false" :data="equipItems" @changeCurrent="selRow"
                                  :showSummary="true" :summaryFunc="sumCountAndPrice" :highLightCurrent="true"
                                  slot="total" ref="totalTable" :init-select="true">
                        <define-column label="操作" width="100" v-slot="{ data }" v-if="!isInfo">
                            <i class="iconfont icontianjia" @click="addRow()" v-if="!isInbound"></i>
                            <i class="iconfont iconyichu" @click="$delRow(equipItems,data.$index)"></i>
                        </define-column>
                        <define-column label="装备位置" v-slot="{ data }" v-if="isInbound">
                            <entity-input v-model="data.row.locationInfo" :options="{search:'locationSelect'}"
                                          :formatFunc="$formatFuncLoc" :tableEdit="true"></entity-input>
                        </define-column>
                        <define-column label="装备参数" v-slot="{ data }">
                            <entity-input v-model="data.row.equipArg" format="{name}({model})"
                                          :disabled="true"></entity-input>
                        </define-column>
                        <define-column label="装备数量" field="count"></define-column>
                        <define-column label="金额" field="price" v-if="!isInfo"></define-column>
                    </define-table>
                    <!--装备明细-->
                    <define-table :havePage="false" :data="equipItems[totalIndex===-1?0:totalIndex].items"
                                  slot="detail" ref="detailTable">
                        <define-column label="操作" width="100" v-slot="{ data }" v-if="!isInfo">
                            <i class="iconfont iconyichu"
                               @click="$delRow(equipItems[totalIndex===-1?0:totalIndex].items,data.$index,()=>{!equipItems[totalIndex===-1?0:totalIndex].items.length && equipItems.splice(totalIndex===-1?0:totalIndex,1)})"></i>
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
    import {findByRfids} from '@/api/storage'
    import myHeader from '@/components/base/header/header'
    import HardwareSelect from "@/components/hardwareSelect";
    import {transEquips} from "@/common/js/transEquips";
    import {mapGetters} from "vuex";
    import {activeTask, processInbound, processOutbound, transferOrders} from "@/api/process";
    import {killProcess,start} from "@/common/js/rfidReader";

    export default {
        name: "transferOutOrIn",   // 调拨出入库
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
                pid:''
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
                    case "out": {
                        this.isInbound = false
                        this.matchEquips = transEquips(res.transferApplyOrder.equips).equipItems
                        this.order.organUnit = res.transferApplyOrder.outboundOrganUnit
                        console.log(this.transferApplyOrder)
                        this.title = "调拨出库"
                        break
                    }
                    case "in": {
                        this.isInbound = true
                        this.highLightCurrent = false
                        this.outboundEquips = res.outboundEquipsOrder.equips
                        this.matchEquips = transEquips(this.outboundEquips).equipItems
                        this.order.organUnit = res.transferApplyOrder.inboundOrganUnit
                        this.title = "调拨入库"
                        break
                    }
                    case "showIn": {
                        this.isInbound = true
                        this.order = res.inboundEquipsOrder
                        this.title = "调拨入库单详情"
                        break
                    }
                    case "showOut": {
                        this.isInbound = false
                        this.order = res.outboundEquipsOrder
                        this.title = "调拨出库单详情"
                        break
                    }
                }
                if (!this.isInfo) {
                    Object.assign(this.order, {operator: this.userInfo}, {
                        house: {
                            name: this.warehouse.name,
                            id: this.warehouse.id,
                            organUnit: this.order.organUnit
                        }
                    })
                    return
                }
                if (!this.isInbound) {
                    this.fixEquipItems(this.order.equips)
                }
            },
            readData() {
                if (!this.isInbound) {
                    killProcess(this.pid)
                    start("java -jar scan.jar", (data) => {
                        findByRfids(data, true).then(
                            res => {
                                this.readEquips = this.readEquips.concat(res)
                                this.fixEquipItems(this.readEquips)
                            }
                        )
                    }, (fail) => {
                        this.index = 1;
                        this.$message.error(fail);
                    }, (pid, err) => {
                        pid ? this.pid = pid : this.$message.error(err)
                    })
                } else {
                    // 1.判断是否选中当前行
                    // 2.判断当前行是否有位置信息
                    if (this.totalIndex === -1) {
                        this.$message.error("先选择需要扫描的位置")
                        return
                    }
                    killProcess(this.pid)
                    start("java -jar scan.jar", (data) => {
                        let tempLocation = this.equipItems[this.totalIndex].locationInfo
                        this.outboundEquips.forEach(item => {
                            let temp = this.equipItems[this.totalIndex]
                            if (item.rfid !== data) {
                                this.$message.error("该装备不在出库装备列表内！")
                                return
                            }
                            item.locationInfo = tempLocation
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
                }
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
                    !!currentValue.count ? accumulator + parseInt(currentValue.count) : accumulator, 0)
                sums[columns.length - 1] = data.reduce((accumulator, currentValue) =>
                    !!currentValue.price ? accumulator + parseInt(currentValue.price) : accumulator, 0)
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
                this.equipItems.pop()
                _.map(this.equipItems, (item) => {
                    this.order.equips = this.order.equips.concat(item.items)
                    this.order.equips.equipId = this.order.equips.id
                })
                this.order.processCategory = 1 // 1为调拨流程
                this.order.processInstanceId = this.processInstanceId
                if (!this.isInbound) {
                    processOutbound(this.taskId, this.order)
                } else {
                    this.order.inOutHouseItems = this.order.equips
                    this.order.inboundOrganUnitId = this.order.organUnit.id
                    this.order.inboundOrganUnitName = this.order.organUnit.name
                    this.order.operator = {
                        operatorId : this.order.operator.id,
                        operator : this.order.operator.name
                    }
                    processInbound(this.taskId, this.order)
                }
            }
        },
        created() {
            Object.assign(this, this.$route.query)
            this.isInfo = this.type === "showIn" || this.type === "showOut"
            console.log(this.isInfo)
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