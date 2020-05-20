<template>
    <div>
        <div class="table-box">
            <bos-tabs>
                <template slot="slotHeader">
                    <base-button label="读取数据" align="right" :disabled="!select.selected" :width="96"
                                 @click="readData"></base-button>
                    <base-select label="硬件选择" v-model="select.selected" align="right"
                                 :selectList="select.handWareList"></base-select>
                </template>
                <template>
                    <define-table :data="equipItems" @changeCurrent="selRow" :havePage="false"
                                  :highLightCurrent="true" :showSummary="true" :summaryFunc="sumFunc"
                                  slot="total">
                        <define-column label="操作" width="100" v-slot="{ data }">
                            <i class="iconfont icontianjialiang" @click="changeRow(true,data)"></i>
                            <i class="iconfont iconyichuliang" @click="changeRow(false,data)"></i>
                        </define-column>
                        <define-column label="装备参数" v-slot="{ data }">
                            <entity-input v-model="data.row.equipArg" :options="{detail:'equipArgsSelect'}"
                                          :tableEdit="false" format="{name}({model})"></entity-input>
                        </define-column>
                        <define-column label="装备数量" v-slot="{ data }">
                            <define-input v-model="data.row.count" type="Number"
                                          :tableEdit="false"></define-input>
                        </define-column>
                    </define-table>
                </template>
                <template>
                    <define-table :data="equipItems[findIndex].items" :havePage="false" slot="detail">
                        <define-column label="操作" width="100" v-slot="{ data }">
                            <i class="iconfont iconyichuliang"></i>
                        </define-column>
                        <define-column label="RFID" field="rfid"></define-column>
                    </define-table>
                </template>
            </bos-tabs>
        </div>
    </div>
</template>

<script>
    import bosTabs from "../../componentized/table/bosTabs";

    export default {
        name: "scrapEquips",
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
                equipItems: [],
                // todo 假数据
                readData: ['555566666777'],
                findIndex: 0,
            }
        },
        props: {
            equipItems: {
                type: Object,
                required: true
            },
            isInfo: {
                type: Boolean,
                required: true
            },
            isEdit: {
                type: Boolean,
                required: true
            }
        },
        methods: {
            readData() {
                this.$emit('handleReadData', this.readData)
            },
            sumFunc(param) { // 表格合并行计算方法
                let {columns, data} = param, sums = [];
                columns.forEach((colum, index) => {
                    if (index === 0) {
                        sums[index] = '合计';
                    } else if (index === columns.length - 1) {
                        const values = data.map(item => item.count ? Number(item.count) : 0);
                        if (!values.every(value => isNaN(value))) {
                            sums[index] = values.reduce((pre, cur) => !isNaN(cur) ? pre + cur : pre);
                        }
                    } else {
                        sums[index] = '';
                    }
                })
                return sums;
            },
            selRow(current) { // 单选表格行
                if (!current) return; // 避免切换数据时报错
                this.detailTable.list = [];
                this.rowData = current;
                if (current.rfid === undefined) return;
                for (let rfid of current.rfid) {
                    this.detailTable.list.push({
                        rfid: rfid
                    })
                }
            },
        }
    }
</script>

<style scoped>

</style>