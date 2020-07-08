<template>
    <bos-tabs :margin="margin" :height="height">
        <template slot="slotHeader" v-if="!isInfo">
            <base-button label="读取数据" align="right" :disabled="!selected" :width="96"
                         @click="readData()"></base-button>
            <base-select label="硬件选择" v-model="selected" align="right"
                         :list="$store.getters.enums.device"></base-select>
        </template>
        <define-table ref="totalTable" :data="equipItems" @changeCurrent="selRow" :havePage="false"
                      :highLightCurrent="true" :showSummary="true" :summaryFunc="$sumFunc" slot="total" margin="0"
                      height="778px">
            <define-column label="操作" width="100" v-slot="{ data }" v-if="!isInfo">
                <i class="iconfont icontianjia" v-if="needAdd"
                   @click="equipItems.push({items:[]})"></i>
                <i class="iconfont iconyichu"
                   @click="$delRow(equipItems,data.$index)"></i>
            </define-column>
            <define-column label="装备参数" v-slot="{ data }">
                <entity-input v-model="data.row.equipArg" :options="{detail:'equipArgsSelect'}"
                              format="{name}({model})" :disabled="true"></entity-input>
            </define-column>
            <define-column label="装备数量" v-slot="{ data }">
                <define-input v-model="data.row.items.length" type="Number" :tableEdit="false"></define-input>
            </define-column>
        </define-table>
        <define-table ref="detailTable" :data="equipItems[totalIndex].items" :havePage="false" slot="detail" margin="0"
                      height="778px">
            <define-column label="操作" width="100" v-slot="{ data }" v-if="!isInfo">
                <i class="iconfont iconyichu"
                   @click="$delRow(equipItems[totalIndex].items,data.$index,()=>{!equipItems[totalIndex].items.length && equipItems.splice(totalIndex,1)})"></i>
            </define-column>
            <define-column label="RFID" field="rfid"></define-column>
            <define-column label="序号" field="serial"></define-column>
        </define-table>
    </bos-tabs>

</template>

<script>
    import bosTabs from "../../componentized/table/bosTabs";

    // todo 表格不规整
    export default {
        name: "equipItems",
        components: {
            bosTabs,
        },
        data() {
            return {
                selected: "",
                tips: ['直接报废', '装备拿去维修，无法修补'],
                // todo 假数据
                rfids: ['555566666777', '19090917', '7777778888', "2011115555"],
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
            needAdd: {
                type: Boolean,
                default: true
            },
            margin: {
                type: String,
                default: '0 10px'
            },
            height: {
                type: [String, Number],
                default: '874px'
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
        updated() {
            this.$refs.totalTable.refreshLayout();
            this.$refs.detailTable.refreshLayout();
        }
    }
</script>

<style scoped>

</style>