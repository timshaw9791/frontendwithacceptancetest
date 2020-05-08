<template>
    <div class="inventory-info-container">
        <my-header title="装备盘点列表"></my-header>
        <div class="body">
            <div class="inputs">
                <define-input label="单号"></define-input>
                <define-input label="盘点时间"></define-input>
                <define-input label="盘点人员"></define-input>
                <define-input label="应盘点总数"></define-input>
                <define-input label="已盘点总数"></define-input>
                <define-input label="未知装备数"></define-input>
            </div>
            <bos-tabs :label="tableName">
                <template slot="total" label="未盘点清单">
                    <define-table>
                        <define-column label="1"></define-column>
                    </define-table>
                </template>
                <template slot="detail">
                    <define-table>
                        <define-column label="2"></define-column>
                    </define-table>
                </template>
                <template slot="slotHeader">
                    <base-select v-model="hardwareSelect" label="硬件选择" :selectList="hardwareList"
                                 disabled="true"></base-select>
                    <base-button label="读取数据" @click="getData"></base-button>
                </template>
            </bos-tabs>
        </div>
    </div>
</template>

<script>
    import BosTabs from "../../../componentized/table/bosTabs";
    import myHeader from "../../../components/base/header/header"
    import {findByRfids} from "../../../api/storage"

    export default {
        name: "inventoryInfo",
        components: {
            BosTabs,
            myHeader
        },
        data() {
            return {
                tableName: [{
                    label: "未盘点清单",
                    key: 'total'
                }, {
                    label: "明细",
                    key: 'detail'
                }],
                inventory: {},
                hardwareList: [{
                    label: "手持机",
                    value: 'handheld'
                }, {
                    label: "读卡器",
                    value: "reader"
                }],
                hardwareSelect: "handheld",
                // 假列表
                noInventoryList:[



                ]
            }
        },
        methods: {
            getData(){
                this.hardwareSelect === "handheld" ?  this.fetchData() : ''
            },
            fetchData() {

            }
        },

    }
</script>

<style scoped>
    .inventory-info-container {
        font-size: 16px;
    }

    .inputs {
        margin: 16px 8px;
    }

</style>