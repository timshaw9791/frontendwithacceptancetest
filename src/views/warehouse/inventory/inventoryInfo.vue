<template>
    <div class="inventory-info-container">
        <my-header title="盘点装备" :haveBlack="true" @h_black="cancel"></my-header>
        <div class="body">
            <div class="inputs">
                <define-input label="单号" v-model="inventoryOrder.number" :disabled="true"></define-input>
                <define-input label="盘点时间" v-model="inventoryOrder.startTime" :disabled="true"></define-input>
                <define-input label="盘点人员" v-model="inventoryOrder.operatorInfo.operator"
                              :disabled="true"></define-input>
                <define-input label="应盘点总数" v-model="inventoryOrder.inventoryCount" :disabled="true"></define-input>
                <define-input label="已盘点总数" v-model="inventoryOrder.count" :disabled="true"></define-input>
                <define-input label="未知装备数" v-model="inventoryOrder.notCount" :disabled="true"></define-input>
            </div>
            <bos-tabs :label="[{label: '未知装备数清单', key: 'total'}, {label: '明细', key: 'detail'}]">
                <template slot="total">
                    <define-table :data="equipItems" @changeCurrent="changeCurrent" :highLightCurrent="true">
                        <define-column label="装备参数" field="equipArg"></define-column>
                        <define-column label="位置" field="locationInfo"></define-column>
                        <define-column label="数量" field="count"></define-column>
                        <define-column label="状态" field="equipState"></define-column>
                    </define-table>
                </template>
                <template slot="detail">
                    <define-table :data="detailItems">
                        <define-column label="操作" v-slot="{data}">
                            <span  @click="copyRfid(data.row.rfid)">复制</span>
                        </define-column>
                        <define-column label="RFID" field="rfid"></define-column>
                        <define-column label="序号" field="serial"></define-column>
                    </define-table>
                </template>
                <template slot="slotHeader" v-if="!isInfo">
                    <base-select v-model="hardwareSelect.select" label="硬件选择" :selectList="hardwareSelect.list"
                                 :disabled="true"></base-select>
                    <base-button label="读取数据" @click="getArgsInfo()"></base-button>
                </template>
            </bos-tabs>
            <div class="box-bottom" v-if="!isInfo">
                <base-button label="取消" @click="cancel"></base-button>
                <base-button label="提交" @click="submit"></base-button>
            </div>
            <service-dialog title="提示" ref="scrapDialog" width="3.3021rem" @confirm="dialogSub" :secondary="false">
                <div>是否需要盘点报废</div>
            </service-dialog>
            <copy-rfid :rfid="rfid" :isShow="isShowDialog" @cancel="copyCancel"></copy-rfid>
        </div>
    </div>
</template>

<script>
    import BosTabs from "../../../componentized/table/bosTabs";
    import myHeader from "../../../components/base/header/header"
    import {findByRfids} from "../../../api/storage"
    import {inventoryOrder} from "../../../api/inventory"
    import {getBosEntity} from "../../../api/basic"
    import {transEquipFormat} from "../../../common/js";
    import serviceDialog from "../../../components/base/serviceDialog"
    import copyRfid from "../../../components/copyRfid";

    export default {
        name: "inventoryInfo",
        components: {
            BosTabs,
            myHeader,
            serviceDialog,
            copyRfid
        },
        data() {
            return {
                isInfo: false,
                hardwareSelect: {
                    list: [{label: "手持机", value: 'handheld'}, {label: "读卡器", value: "reader"}],
                    select: "handheld"
                },
                inventoryOrder: {operatorInfo: {}, remark: ''},
                rfids: [],
                // 盘点装备总列表
                equipItems: [],
                // 盘点装备明细列表
                detailItems: [],
                isShowDialog: false,
                // 假列表
                noInventoryList: ['110000060000000000000000', '110000030000000000000000', '57786', '8578576666', '12345678', '857985'],
            }
        },
        methods: {
            fetchData() {
                if (this.isInfo) {
                    getBosEntity(this.$route.query.id).then(res => {
                        this.inventoryOrder = res
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
                this.inventoryOrder.startTime = this.$filterTime(this.inventoryOrder.startTime)
                // 盘点单与手持机的装备列表数据字段不同，强制 添加equipName、equipModel、locationInfo 以便统一
                this.equipItems.forEach(item => {
                    this.rfids.push(item.rfid)
                    if (item.equipArg) {
                        transEquipFormat(item)
                    }
                })
                // 对数据进行分组 按照位置、名称、型号 通过lodash
                let tempEquipItems = _.groupBy(this.equipItems, item =>
                    `${item.equipName}${item.equipModel}${item.state}${item.locationInfo.frameNumber}${item.locationInfo.surface}${item.locationInfo.section}${item.locationInfo.floor}`
                )
                let length = 0
                // 对分组好的数据在处理
                this.equipItems = _.map(tempEquipItems, item => {
                        length += item.length
                        let tempLocation = this.$formatFuncLoc(item[0].locationInfo)
                        return {
                            equipArg: item[0].equipName + "(" + item[0].equipModel + ")",
                            equipState: item[0].state,
                            locationInfo: tempLocation,
                            item: item,
                            count: item.length,
                        }
                    }
                )
                // 若未知装备的装备改变，那么需要修改
                this.equipItems.forEach(item => {
                    item.equipState = item.equipState === 0 ? '可用' : '充电中'
                })
                // 假数据处理
                if (!this.isInfo) {
                    let count = 10 - length
                    this.inventoryOrder = {
                        startTime: (new Date()).valueOf(),
                        operatorInfo: {
                            operator: JSON.parse(window.localStorage.getItem("user")).name,
                            operatorId: JSON.parse(window.localStorage.getItem("user")).id
                        },
                        inventoryCount: 10,
                        notCount: length,
                        count: count
                    }
                }
            },
            changeCurrent(data) {
                this.detailItems = data.current.item
            },
            submit() {
                let data = {
                    inventoryOrder: this.inventoryOrder,
                    rfids: this.rfids
                }
                inventoryOrder("post", data)
                this.$refs.scrapDialog.show()
            },
            dialogSub() {
                this.$router.push({path: 'scrapInfo', query: {category: '2', rfids: this.rfids}})
            },
            cancel() {
                this.$router.back()
            },
            copyRfid(data) {
                this.rfid = data
                this.isShowDialog = true
            },
            copyCancel() {
                this.isShowDialog = false
            }
        },
        created() {
            this.isInfo = !!this.$route.query.id
            this.fetchData()
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

    .box-bottom {
        padding-top: 10px;
        padding-right: 20px;
        float: right;
    }
</style>