<template>
    <bos-tabs :option="isInfo?['tabs']:['tabs', 'contrast']" :layoutRatio="isInfo?[50,50]:[70,30]">
        <template slot="slotHeader" v-if="!isInfo">
            <hardware-select @readData="readData"></hardware-select>
        </template>
        <!--装备总清单-->
        <define-table :havePage="false" :data="aEquipItems" @changeCurrent="selRow"
                      :showSummary="true" :summaryFunc="isInfo?$sumFunc:sumCountAndPrice"
                      :highLightCurrent="true"
                      slot="total" ref="totalTable" :init-select="true">
            <define-column label="操作" width="100" v-slot="{ data }" v-if="!isInfo">
                <i class="iconfont iconyichu" @click="$delRow(aEquipItems,data.$index)"></i>&nbsp
                <i class="iconfont icontianjia" @click="addRow()"></i>
            </define-column>
            <define-column label="装备位置" v-slot="{ data }" v-if="this.type!=='out'">
                <entity-input v-model="data.row.locationInfo" :options="{search:'locationSelect'}"
                              :formatFunc="$formatFuncLoc" :disabled="isInfo"></entity-input>
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
                      :data="totalIndex===-1?aEquipItems[0].items:aEquipItems[totalIndex].items"
                      slot="detail" ref="detailTable">
            <define-column label="操作" width="100" v-slot="{ data }" v-if="!isInfo">
                <i class="iconfont iconyichu"
                   @click="$delRow(aEquipItems[totalIndex].items,data.$index,()=>{!aEquipItems[totalIndex].items.length && aEquipItems.splice(totalIndex,1)})"></i>
            </define-column>
            <define-column label="RFID" field="rfid"></define-column>
            <define-column label="序号" field="serial"></define-column>
        </define-table>
        <!--对照的装备-->
        <define-table :havePage="false" :data="aMatchEquips"
                      slot="contrast" v-if="!isInfo" ref="matchTable">
            <define-column label="装备参数" v-slot="{ data }">
                <entity-input v-model="data.row.equipArg" format="{name}({model})"
                              :table-edit="false"></entity-input>
            </define-column>
            <define-column label="装备数量" v-slot="{ data }">
                <define-input v-model="data.row.count" :disabled="true"></define-input>
            </define-column>
        </define-table>
    </bos-tabs>
</template>

<script>
    import bosTabs from "@/componentized/table/bosTabs"
    import hardwareSelect from "@/components/hardwareSelect"
    import {killProcess, start} from "@/common/js/rfidReader";
    import {findByRfids} from "@/api/storage";
    import {transEquips} from "@/common/js/transEquips";

    export default {
        name: "aEquipsTable", // allocateEquipsTable 调拨、直调的出入库都是这一个表
        components: {
            bosTabs,
            hardwareSelect
        },
        data() {
            return {
                totalIndex: -1,
                pid: '',
                highLightCurrent: false,
                readRfids: [],
                aEquipItems: [{items: [], locationInfo: {}}],
                aMatchEquips: [{items: [], locationInfo: {}}]
            }
        },
        props: {
            equipItems: {  //详情时装备需要外面传入
                type: Array,
                default: () => {
                    return []
                }
            },
            matchEquips: {
                type: Array,
                default: () => {
                    return []
                }
            },
            type: {
                type: String,
                default: 'out'
            },
            isInfo: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            readData(selected) {
                console.log(selected)
                // 1.判断是否选中当前行
                // 2.判断当前行是否有位置信息
                !!this.pid && killProcess(this.pid)
                let data = "20147963"
                // start("java -jar scan.jar", (data) => {
                switch (this.type) {
                    case 'out': {
                        _.findIndex(this.readRfids, data) === -1 && this.readRfids.push(data)
                        findByRfids(this.readRfids, true).then(res => {
                            this.aEquipItems = transEquips(res).equipItems
                            this.$emit('getFinishEquip', this.aEquipItems)
                        })
                        break
                    }
                    case 'in' : {
                        let temp = this.aEquipItems[this.totalIndex]
                        if (this.totalIndex === -1 || !temp.locationInfo.id) {
                            this.$message.error("请先选择位置信息")
                            break
                        }
                        // 匹配未分组前原来的数据
                        this.matchEquips.forEach(item => {
                            if (item.rfid !== data) {
                                this.$message.error("该装备不在出库装备列表内！")
                                return
                            }
                            item.price = 1
                            item.productTime = '1590721943'
                            item.locationInfo = item.location
                            if (temp.equipArg && item.equipName + "(" + item.equipModel + ")" !== temp.equipArg) {
                                return this.$message.error("该装备与当前选中的装备参数不匹配！")
                            }
                            temp.equipArg = item.equipName + "(" + item.equipModel + ")"
                            // 字符串查找不能使用_.findIndex
                            if (_.findIndex(temp.items, item) === -1 && this.readRfids.findIndex(item => item === data)) {
                                temp.items.push(item)
                                this.readRfids.push(data)
                                this.addRow()
                                console.log(this)
                            }
                        })
                        // 总的RFID列表
                        this.$emit('getFinishEquip', this.aEquipItems)
                        break
                    }
                }
                // }, (fail) => {
                //     this.index = 1;
                //     this.$message.error(fail);
                // }, (pid, err) => {
                //     pid ? this.pid = pid : this.$message.error(err)
                // })
            },
            selRow(data) {
                this.totalIndex = data.index
                killProcess(this.pid)
            },
            addRow() {
                this.aEquipItems.push({items: [], locationInfo: {}})
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
                data.forEach((item) => {
                    price += item.items.reduce((iniVal, curVal) => {
                        return !!curVal && iniVal + curVal.price
                    }, 0)
                })
                sums[columns.length - 1] = price
                return sums;
            }
        },
        watch: {
            equipItems(newVal) {
                if (newVal.length === 0) {
                    this.aEquipItems = [{items: [], locationInfo: {}}]
                }else {
                    const groupRules = this.type === "out" ? 'args' : 'locationInfo'
                    this.aEquipItems = transEquips(newVal, groupRules).equipItems
                }
            },
            matchEquips(newVal) {
                newVal.length === 0 ? this.aMatchEquips = {items: [], locationInfo: {}}
                    : this.aMatchEquips = transEquips(newVal).equipItems
            },
            'aEquipItems.length'(newVal) {
                !newVal && this.aEquipItems.push({items: [], locationInfo: {}})
            }
        },
        destroyed() {
            !!this.pid && killProcess(this.pid)
        },
    }
</script>

<style scoped>

</style>