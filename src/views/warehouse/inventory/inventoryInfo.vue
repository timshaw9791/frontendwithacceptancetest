<template>
    <div class="inventory-info-container">
        <my-header title="装备盘点列表"></my-header>
        <div class="body">
            <div class="inputs">
                <define-input label="单号" ></define-input>
                <define-input label="盘点时间"></define-input>
                <define-input label="盘点人员"></define-input>
                <define-input label="应盘点总数"></define-input>
                <define-input label="已盘点总数"></define-input>
                <define-input label="未知装备数"></define-input>
            </div>
            <bos-tabs >
                <template slot="total">
                    <define-table :data="equipItems" @changeCurrent="changeCurrent" :highLightCurrent="true">
                        <define-column label="装备名称" field="equipName"></define-column>
                        <define-column label="型号" field="equipModel"></define-column>
                        <define-column label="状态" field="equipState"></define-column>
                    </define-table>
                </template>
                <template slot="detail">
                    <define-table :data="detailItems">
                        <define-column label="RFID" field="rfid"></define-column>
                        <define-column label="序号" field="serial"></define-column>
                    </define-table>
                </template>
                <template slot="slotHeader">
                    <base-select v-model="hardwareSelect" label="硬件选择" :selectList="hardwareList"
                                 :disabled="true"></base-select>
                    <base-button label="读取数据" @click="getArgsInfo()"></base-button>
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
                equipItems: [],
                detailItems: [],
                hardwareList: [{
                    label: "手持机",
                    value: 'handheld'
                }, {
                    label: "读卡器",
                    value: "reader"
                }],
                hardwareSelect: "handheld",
                // 假列表
                noInventoryList: ['110000060000000000000000', '110000030000000000000000', '57786', '8578576666', '12345678', '857985']
            }
        },
        methods: {
            fetchData() {

            },
            fixData() {
                let tempEquipItems = _.groupBy(this.equipItems, item =>
                    `${item.equipArg.name}${item.equipArg.model}${item.state}${item.location.frameNumber}${item.location.surface}${item.location.section}${item.location.floor}`
                )
                this.equipItems = _.map(tempEquipItems,item => {
                        return {
                            equipName: item[0].equipArg.name,
                            equipModel: item[0].equipArg.model,
                            equipState: item[0].state,
                            location: item[0].equipArg.location,
                            item: item
                        }
                    })
                this.equipItems.forEach(item => {
                    item.equipState = item.equipState === 0 ? '可用':'充电中'
                })
                // 假数据处理
                inventory.createTime = (new Date()).valueOf();
                inventory.operatorInfo.operator = window.localStorage.getItem()
            },
            getArgsInfo() {
                findByRfids(this.noInventoryList).then(res => {
                    this.equipItems = res
                    this.fixData()
                })
            },
            changeCurrent(data) {
                this.detailItems = data.current.item
            }
        }
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