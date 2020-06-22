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
                <entity-input label="出库人员" v-model="order.operator" :disabled="true"></entity-input>
            </div>
            <div class="table-box">
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
                        <define-column label="装备参数" v-slot="{ data }">
                            <entity-input v-model="data.row.equipArg" format="{name}({model})"
                                          :disabled="true"></entity-input>
                        </define-column>
                        <define-column label="装备数量" v-slot="{ data }">
                            <define-input v-model="data.row.items.length" type="Number"
                                          :tableEdit="false"></define-input>
                        </define-column>
                        <!--比较特殊的计算方法-->
                        <define-column label="金额" v-if="!isInfo" :filter="(row)=>row.items.reduce((iniVal,cutVal)=>{return !!cutVal.price && iniVal+cutVal.price},0)">
                        </define-column>
                    </define-table>
                    <!--装备明细-->
                    <define-table :havePage="false" :data="equipItems[totalIndex].items"
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
    import {findByRfids} from '@/api/storage'
    import myHeader from '@/components/base/header/header'
    import HardwareSelect from "@/components/hardwareSelect";
    import {transEquips} from "@/common/js/transEquips";
    import {mapGetters} from "vuex";
    import {activeTask, processInbound, processOutbound, transferOrders} from "@/api/process";
    import {killProcess, start} from "@/common/js/rfidReader";

    export default {
        name: "directOut",   // 调拨出入库
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
                totalIndex: 0,
                isInfo: false,
                processInstanceId: '',
                readRfids: [], //读到的RFID
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
                    res => this.fixData(res)
                )
                activeTask(this.processInstanceId).then(res => {
                    this.taskId = res.taskId
                })
            },
            fixData(res) {
                switch (this.type) {
                    case "out": {
                        this.matchEquips = transEquips(res.transferApplyOrder.equips).equipItems
                        this.order.organUnit = res.transferApplyOrder.outboundOrganUnit
                        console.log(this.transferApplyOrder)
                        this.title = "调拨出库"
                        break
                    }
                    case "showOut": {
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
                this.fixEquipItems(this.order.equips)
            },
            readData() {
                !!this.pid && killProcess(this.pid)
                start("java -jar scan.jar", (data) => {
                _.findIndex(this.readRfids,data) === -1 && this.readRfids.push(data)
                findByRfids(this.readRfids, true).then(
                    res => {
                        this.fixEquipItems(res)
                    }
                )
                }, (fail) => {
                    this.index = 1;
                    this.$message.error(fail);
                }, (pid, err) => {
                    pid ? this.pid = pid : this.$message.error(err)
                })
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
                this.equipItems = [{items: [], locationInfo: {}}]
            },
            submit() {
                _.map(this.equipItems, (item) => {
                    this.order.equips = this.order.equips.concat(item.items)
                    this.order.equips.equipId = this.order.equips.id
                })
                this.order.processCategory = 1 // 1为调拨流程
                this.order.processInstanceId = this.processInstanceId
                processOutbound(this.taskId, this.order).then(
                    this.$router.push({path:'agencyMatters'})
                )
            },
        },
        created() {
            Object.assign(this, this.$route.query)
            this.isInfo = this.type === "showOut"
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
        destroyed() {
            !!this.pid && killProcess(this.pid)
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