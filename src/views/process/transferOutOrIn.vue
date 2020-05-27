<template>
    <div class="transfer-out-or-in-container">
        <my-header title="调拨流程装备出库" :haveBlack="false"></my-header>
        <div class="process-form-body">
            <div class="process-info">
                <define-input label="单号" v-model="order.number" :disabled="true"></define-input>
                <entity-input :label="isInbound?'入库机构':'出库机构'" v-model="order.house.organUnit" :disabled="true" format="{name}"
                              :options="{search:'organUnits'}"></entity-input>
                <define-input :label="isInbound?'入库库房':'出库库房'" v-model="order.house.name" :disabled="true"></define-input>
                <entity-input :label="isInbound?'入库人员':'出库人员'" v-model="order.operator" :disabled="true"></entity-input>
            </div>
            <div class="table-box">
                <bos-tabs :option="['tabs', 'contrast']" :layoutRatio="[2,1]">
                    <template slot="slotHeader">
                        <hardware-select @readDate="readData"></hardware-select>
                    </template>
                    <!--装备总清单-->
                    <define-table :havePage="false" :data="equipItems" height="2.6042rem" @changeCurrent="selRow"
                                  :showSummary="true" :summaryFunc="$sumFunc" :highLightCurrent="true" slot="total">
                        <define-column label="操作" width="100" v-slot="{ data }">
                            <i class="iconfont icontianjialiang" @click="addRow()"></i>
                            <i class="iconfont iconyichuliang" @click="$delRow(equipItems,data.$index)"></i>
                        </define-column>
                        <define-column label="装备位置" v-slot="{ data }" v-if="isInbound">
                            <entity-input v-model="data.row.location" format=""
                                          :disabled="isShowIn"></entity-input>
                        </define-column>
                        <define-column label="装备参数" v-slot="{ data }">
                            <entity-input v-model="data.row.equipArg" format="{name}({model})"
                                          :disabled="true"></entity-input>
                        </define-column>
                        <define-column label="装备数量" field="count"></define-column>
                        <define-column label="金额" field="price"></define-column>
                    </define-table>
                    <!--装备明细-->
                    <define-table :havePage="false" :data="equipItems[totalIndex].items" height="2.6042rem"
                                  slot="detail">
                        <define-column label="操作" width="100" v-slot="{ data }">
                            <i class="iconfont icontianjialiang" @click="addRow()"></i>
                            <i class="iconfont iconyichuliang"
                               @click="$delRow(equipItems[totalIndex].items,data.$index,()=>{!equipItems[totalIndex].items.length && equipItems.splice(totalIndex,1)})"></i>
                        </define-column>
                        <define-column label="RFID" field="rfid"></define-column>
                        <define-column label="序号" field="serial"></define-column>
                    </define-table>
                    <!--申请的装备-->
                    <define-table :havePage="false" :data="applyEquips" height="2.6042rem" slot="contrast">
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
            <div class="button">
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
    import {findByRfids, outHouse} from '@/api/storage'
    import myHeader from '@/components/base/header/header'
    import HardwareSelect from "@/components/hardwareSelect";
    import {transEquips} from "@/common/js/transEquips";
    import {mapGetters} from "vuex";
    import {transferOrders} from "@/api/process";

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
                    application: {},
                    outboundOrganUnit: {},
                    house: {
                        name: '',
                        organUnit: {}
                    }
                },
                equipItems: [{items: []}],
                totalIndex: 0,
                isInfo: false,
                isInbound: false,
                processInstanceId: '',
                rfids: [], //读到的RFID
                applyEquips: []
            }
        },
        methods: {
            fetchData() {
                transferOrders(this.processInstanceId).then(
                    res => {
                        switch (this.type) {
                            case "out": {
                                this.isInbound = false
                                this.applyEquips = res.transferApplyOrder.equips
                                break
                            }
                            case "in": {
                                this.isInbound = true
                                this.applyEquips = res.transferApplyOrder.equips
                                break
                            }
                            case "showIn": {
                                this.isInbound = true
                                this.isInfo = true
                                this.order = res.inboundEquipsOrder
                                break
                            }
                            case "showOut": {
                                this.isInbound = false
                                this.isInfo = true
                                this.order = res.outboundEquipsOrder
                                break
                            }
                        }
                        this.fixData()
                    }
                )
            },
            fixData(){
               if (!this.isInfo){
                   Object.assign(this.order, {operator: this.userInfo},{
                       house: {
                           name: this.warehouse.name,
                           id: this.warehouse.id,
                           organUnit: this.organUnit
                       }
                   })
               }
            },
            readData() {
                this.rfids = ['9996664784848']
                findByRfids(this.rfids, true).then(
                    res => {
                        this.fixEquipItems(res)
                    }
                )
            },
            fixEquipItems(data) {
                this.equipItems = transEquips(data).equipItems
                //缺少价格信息
                //(row)=>{return _.reduce(row.items,(initVal,item)=>{initVal+200},0)}
                _.forEach(this.equipItems, (equipItem) => {
                    equipItem.price = _.reduce(equipItem.items, (initVal, item) =>
                        !!item.price && initVal + item.price
                        , 0)
                })
            },
            selRow(data) {
                console.log(data)
                this.totalIndex = data.index
            },
            addRow() {
                this.equipItems.push({items: []})
            },
            clean() {

            },
            // submit() {
            //     outHouse(){
            //
            //     }
            // },
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
                !newVal && this.equipItems.push({items: []})
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