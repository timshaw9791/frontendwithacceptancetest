<template>
    <view-container>
        <define-input label="单号" v-model="order.number" :disabled="true"></define-input>
        <define-input label="盘点时间" v-model="order.fstartTime"  :disabled="true"></define-input>
        <define-input label="盘点人员" v-model="order.operatorInfo.operator" :disabled="true"></define-input>
        <define-input label="应盘点总数" v-model="order.count" :disabled="true"></define-input>
        <define-input label="已盘点总数" v-model="order.inventoryCount" :disabled="true"></define-input>
        <define-input label="未知装备数" v-model="order.notCount" :disabled="true"></define-input>
        <bos-tabs :label="[{label: '未知装备数清单', key: 'total'}, {label: '明细', key: 'detail'}]">
            <template slot="slotHeader" v-if="!isInfo">
                <base-select v-model="hardwareSelect.select" label="硬件选择" :selectList="hardwareSelect.list"
                             :disabled="true"></base-select>
                <base-button label="读取数据" @click="readData()"></base-button>
            </template>
            <template slot="total">
                <define-table :data="equipItems" @changeCurrent="changeRow" height="774px"
                              :highLightCurrent="true" :havePage="false">
                    <define-column label="装备参数" field="equipArg"></define-column>
                    <define-column label="位置" field="locationInfo"></define-column>
                    <define-column label="数量" field="count"></define-column>
                    <define-column label="状态" field="state"
                                   :filter=" row => $store.getters.enumsObj.EquipState[row.state]"></define-column>
                </define-table>
            </template>
            <template slot="detail">
                <define-table :data="equipItems[totalIndex].items" height="774px" :havePage="false">
                    <define-column label="操作" v-slot="{data}">
                        <i @click="copyRfid(data.row.rfid)" class="iconfont iconfuzhiRFID"></i>
                    </define-column>
                    <define-column label="RFID" field="rfid"></define-column>
                    <define-column label="序号" field="equipSerial"></define-column>
                </define-table>
            </template>
        </bos-tabs>
        <copy-rfid :rfid="copyRFID" :isShow="isShowDialog" @cancel="copyCancel"></copy-rfid>
        <tool-bar v-if="!isInfo">
            <base-button slot="button" type="text" label="取消" @click="cancel"></base-button>
            <base-button slot="button" type="text" label="提交" @click="submit"></base-button>
        </tool-bar>
    </view-container>
</template>

<script>
    import BosTabs from "@/componentized/table/bosTabs";
    import myHeader from "@/components/base/header/header"
    import {addInventoryOrder, currentInventory} from "@/api/inventory"
    import {getBosEntity} from "@/api/basic"
    import {transEquips} from "@/common/js/transEquips";
    import copyRfid from "@/components/copyRfid";
    import {handheld} from "@/common/js/rfidReader";

    export default {
        name: "inventoryInfo",
        components: {
            BosTabs,
            myHeader,
            copyRfid
        },
        data() {
            return {
                isInfo: false,
                hardwareSelect: {
                    list: [{label: "手持机", value: 'handheld'}, {label: "读卡器", value: "reader"}],
                    select: "handheld"
                },
                order: {operatorInfo: {}, remark: ''},
                copyRFID: '',
                rfids: [],
                // 盘点装备总列表
                equipItems: [{items: []}],
                // 明细表渲染的数据
                totalIndex: 0,
                isShowDialog: false,
            }
        },
        methods: {
            fetchData() {
                if (this.isInfo) {
                    getBosEntity(this.$route.query.id).then(res => {
                        this.fixData(res)
                    })
                }
            },
            readData() {
                // handheld(this.$message.error, 'inventory.json').then((res) => {
                currentInventory('1909090A', '1937937497').then(res => {
                    this.fixData(res)
                })
                // })
            },
            fixData(res) {
                this.order = res
                //时间转换
                this.order.fstartTime = this.$filterTime(this.order.startTime)
                this.equipItems = transEquips(res.equipItems, 'state-locationInfo').equipItems
            },
            changeRow(current) {
                this.totalIndex = current.index
            },
            submit() {
                let rfids = []
                this.order.equipItems.forEach(item => {
                    rfids.push(item.rfid)
                })
                addInventoryOrder(this.order).then((res) => {
                    !!res && this.$router.push({
                        name: 'inventoryList',
                        params: {
                            rfids: rfids
                        }
                    })
                })

            },
            cancel() {
                this.$router.back()
            },
            copyRfid(data) {
                this.copyRFID = data
                this.isShowDialog = true
            },
            copyCancel() {
                this.isShowDialog = false
            }
        },
        created() {
            this.isInfo = !!this.$route.query.id
            this.fetchData()
        }
    }
</script>

<style scoped>

</style>