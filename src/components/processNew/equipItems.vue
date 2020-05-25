<template>
    <div class="table-box">
        <bos-tabs>
            <template slot="slotHeader" v-if="!isInfo&&!isEdit">
                <base-button label="读取数据" align="right" :disabled="!select.selected" :width="96"
                             @click="readData()"></base-button>
                <base-select label="硬件选择" v-model="select.selected" align="right"
                             :selectList="select.handWareList"></base-select>
            </template>
            <define-table :data="equipItems" @changeCurrent="selRow" :havePage="false"
                          :highLightCurrent="true" :showSummary="true" :summaryFunc="sumFunc" slot="total">
                <define-column label="操作" width="100" v-slot="{ data }" v-if="!isInfo&&!isEdit">
                    <i class="iconfont icontianjialiang" @click="changeRow(true,data)"></i>
                    <i class="iconfont iconyichuliang"
                       @click=""></i>
                </define-column>
                <define-column label="装备参数" v-slot="{ data }">
                    <entity-input v-model="data.row.equipArg" :options="{detail:'equipArgsSelect'}"
                                  :tableEdit="false" format="{name}({model})"></entity-input>
                </define-column>
                <define-column label="装备数量" v-slot="{ data }">
                    <define-input v-model="data.row.count" type="Number" :tableEdit="false"></define-input>
                </define-column>
            </define-table>
            <define-table :data="equipItems[totalIndex].items" :havePage="false" slot="detail">
                <define-column label="操作" width="100" v-slot="{ data }" v-if="!isInfo&&!isEdit">
                    <i class="iconfont iconyichuliang"
                       @click="delRow(equipItems[totalIndex].items,data.$index,()=>{!equipItems[totalIndex].items.length && equipItems.splice(totalIndex,1)})"></i>
                </define-column>
                <define-column label="RFID" field="rfid"></define-column>
            </define-table>
        </bos-tabs>
    </div>
</template>

<script>
    import bosTabs from "../../componentized/table/bosTabs";

    export default {
        name: "equipItems",
        components: {
            bosTabs
        },
        data() {
            return {
                select: {
                    handWareList: [{
                        label: "手持机",
                        value: 'handheld'
                    }, {
                        label: "读写器",
                        value: "reader"
                    }],
                    selected: ""
                },
                tips: [{value: '直接报废', key: '1'}, {value: '装备拿去维修，无法修补', key: '2'}],
                // todo 假数据
                rfids: ['555566666777', '19090917', '7777778888'],
                totalIndex: 0,
            }
        },
        props: {
            equipItems: {
                type: Array,
                required: true
            },
            isInfo: {
                type: Boolean,
                required: true
            },
            isEdit: {
                type: Boolean,
                default:false
            }
        },
        methods: {
            readData() {
                this.$emit('handleReadData', this.rfids)
            },
            sumFunc(param) { // 表格合并行计算方法
                let {columns, data} = param, sums = [];
                sums = new Array(columns.length).fill('')
                sums[0] = '合计'
                sums[columns.length - 1] = data.reduce((accumulator, currentValue) => accumulator + parseInt(currentValue.length), 0)
                return sums;
            },
            delRow(data, index, callback) {
                data.splice(index, 1);
                callback && callback();
            },
            selRow(data) {
                this.totalIndex = data.index
            },
        },
        watch: {
            'equipItems.length'(newVal) {
                !newVal && this.equipItems.push({items: []})
            }
        },
    }
</script>

<style scoped>

</style>