<template>
    <div class="table-box">
        <bos-tabs>
            <define-table :data="equipItems" @changeCurrent="selRow" :havePage="false"
                          :highLightCurrent="true" :showSummary="true" :summaryFunc="$sumFunc" slot="total">
                <define-column label="操作" width="100" v-slot="{ data }" v-if="!isInfo&&!isEdit">
                    <i class="iconfont icontianjialiang" @click="changeRow(true,data)"></i>
                    <i class="iconfont iconyichuliang"
                       @click="$delRow(equipItems,data.$index)"></i>
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
                       @click="$delRow(equipItems[totalIndex].items,data.$index,()=>{!equipItems[totalIndex].items.length && equipItems.splice(totalIndex,1)})"></i>
                </define-column>
                <define-column label="RFID" field="rfid"></define-column>
            </define-table>
        </bos-tabs>
    </div>
</template>

<script>
    import bosTabs from "../../componentized/table/bosTabs";

    export default {
        name: "transferEquipItems",
        components: {
            bosTabs,
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
                tips: ['直接报废', '装备拿去维修，无法修补'],
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
