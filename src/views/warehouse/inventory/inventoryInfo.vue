<template>
    <div class="inventory-info-container">
        <my-header title="盘点装备"></my-header>
        <div class="body">
            <div class="inputs">
                <define-input label="单号" v-model="inventory.number" :disabled="true"></define-input>
                <define-input label="盘点时间" v-model="inventory.startTime" :disabled="true"></define-input>
                <define-input label="盘点人员" v-model="inventory.operatorInfo.operator" :disabled="true"></define-input>
                <define-input label="应盘点总数" v-model="inventory.inventoryCount" :disabled="true"></define-input>
                <define-input label="已盘点总数" v-model="inventory.count" :disabled="true"></define-input>
                <define-input label="未知装备数" v-model="inventory.notCount" :disabled="true"></define-input>
            </div>
            <bos-tabs>
                <template slot="total">
                    <define-table :data="equipItems" @changeCurrent="changeCurrent" :highLightCurrent="true">
                        <define-column label="装备名称" field="equipName"></define-column>
                        <define-column label="型号" field="equipModel"></define-column>
                        <define-column label="位置" field="location"></define-column>
                        <define-column label="数量" field="count"></define-column>
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
            <div class="box-bottom">
                <base-button label="取消" @click="back"></base-button>
                <base-button label="提交" @click="submit"></base-button>
            </div>
        </div>
    </div>
</template>

<script>
    import BosTabs from "../../../componentized/table/bosTabs";
    import myHeader from "../../../components/base/header/header"
    import {findByRfids} from "../../../api/storage"
    import {inventoryOrder} from "../../../api/inventory"
    import {getBosEntity} from "../../../api/basic"

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
                inventory: {
                    operatorInfo: {},
                    remark: ''
                },
                rfids: [],
                equipItems: [],
                detailItems: [],
                hardwareList: [{
                    label: "手持机",
                    value: 'handheld'
                }, {
                    label: "读卡器",
                    value: "reader"
                }],
                isInfo: false,
                hardwareSelect: "handheld",
                // 假列表
                noInventoryList: ['110000060000000000000000', '110000030000000000000000', '57786', '8578576666', '12345678', '857985']
            }
        },
        methods: {
            fetchData() {
                if (this.isInfo) {
                    getBosEntity(this.$route.query.id).then(res => {
                        this.inventory = res
                        this.equipItems = res.inventoryItems
                        this.fixData()
                    })
                }
            },
            getArgsInfo() {
                findByRfids(this.noInventoryList).then(res => {
                    this.equipItems = res
                    this.fixData()
                })
            },
            fixData() {
                // info 和 新增数据有出入，强制 添加equipName、equipModel、locationInfo 以便统一
                this.equipItems.forEach(item => {
                    this.rfids.push(item.rfid)
                    if (item.equipArg) {
                        item.equipName = item.equipArg.name
                        item.equipModel = item.equipArg.model
                        item.locationInfo = item.location
                    }
                })
                console.log(this.equipItems)
                // 对数据进行分组 按照位置、名称、型号 通过lodash
                let tempEquipItems = _.groupBy(this.equipItems, item =>
                    `${item.equipName}${item.equipModel}${item.state}${item.locationInfo.frameNumber}${item.locationInfo.surface}${item.locationInfo.section}${item.locationInfo.floor}`
                )
                let length = 0
                // 对分组好的数据在处理
                this.equipItems = _.map(tempEquipItems, item => {
                    length += item.length
                    let tempLocation = () => {
                        if (item[0].locationInfo.id) {
                            this.$formatFuncLoc(item[0].locationInfo)
                        } else {
                            this.$formatFuncOrderLoc(item[0].locationInfo)
                        }
                    }
                    return {
                        equipName: item[0].equipName,
                        equipModel: item[0].equipName,
                        equipState: item[0].state,
                        locationInfo: tempLocation,
                        item: item,
                        count: item.length,
                    }
                })
                this.equipItems.forEach(item => {
                    item.equipState = item.equipState === 0 ? '可用' : '充电中'
                })
                // 假数据处理
                if (!this.isInfo) {
                    this.inventory.startTime = (new Date()).valueOf();
                    this.inventory.operatorInfo.operator = JSON.parse(window.localStorage.getItem("user")).name
                    this.inventory.operatorInfo.operatorId = JSON.parse(window.localStorage.getItem("user")).id
                    this.inventory.inventoryCount = 10
                    this.inventory.notCount = length
                    this.inventory.count = this.inventory.inventoryCount - this.inventory.notCount
                }
            },
            changeCurrent(data) {
                this.detailItems = data.current.item
            },
            submit() {
                let data = {
                    inventoryOrder: this.inventory,
                    rfids: this.rfids
                }
                inventoryOrder("post", data)
                this.back()
            },
            back() {
                this.$router.back()
            }
        },
        created() {
            this.isInfo = !!this.$route.query.id
            this.fetchData()
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

    .box-bottom {
        padding-top: 10px;
        padding-right: 20px;
        float: right;
    }
</style>