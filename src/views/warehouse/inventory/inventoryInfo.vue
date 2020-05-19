<template>
    <div class="inventory-info-container">
        <my-header title="盘点装备" :haveBlack="true" @h_black="cancel"></my-header>
        <div class="body">
            <div class="inputs">
                <define-input label="单号" v-model="order.number" :disabled="true" :havePage="false"></define-input>
                <date-select label="盘点时间" v-model="order.startTime" :disabled="true"></date-select>
                <define-input label="盘点人员" v-model="order.operatorInfo.operator"
                              :disabled="true"></define-input>
                <define-input label="应盘点总数" v-model="order.inventoryCount" :disabled="true"></define-input>
                <define-input label="已盘点总数" v-model="order.count" :disabled="true"></define-input>
                <define-input label="未知装备数" v-model="order.notCount" :disabled="true"></define-input>
            </div>
            <bos-tabs :label="[{label: '未知装备数清单', key: 'total'}, {label: '明细', key: 'detail'}]">
                <template slot="total">
                    <define-table :data="equipItems" @changeCurrent="changeRow"
                                  :highLightCurrent="true"
                                  :havePage="false">
                        <define-column label="装备参数" field="equipArg"></define-column>
                        <define-column label="位置" field="locationInfo"></define-column>
                        <define-column label="数量" field="count"></define-column>
                        <define-column label="状态" field="state"></define-column>
                    </define-table>
                </template>
                <template slot="detail">
                    <define-table :data="equipItems[totalIndex].items">
                        <define-column label="操作" v-slot="{data}">
                            <span @click="copyRfid(data.row.rfid)">复制</span>
                        </define-column>
                        <define-column label="RFID" field="rfid"></define-column>
                        <define-column label="序号" field="equipSerial"></define-column>
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
            <copy-rfid :rfid="copyRFID" :isShow="isShowDialog" @cancel="copyCancel"></copy-rfid>
        </div>
    </div>
</template>

<script>
    import BosTabs from "../../../componentized/table/bosTabs";
    import myHeader from "../../../components/base/header/header"
    import {findByRfids} from "../../../api/storage"
    import {inventoryOrder} from "../../../api/inventory"
    import {getBosEntity} from "../../../api/basic"
    import {transEquips} from "../../../common/js/transEquips";
    import copyRfid from "../../../components/copyRfid";

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
                // 假列表
                noInventoryList: ['555566666777'],
            }
        },
        methods: {
            fetchData() {
                if (this.isInfo) {
                    getBosEntity(this.$route.query.id).then(res => {
                        this.order = res
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
                let temp = transEquips(this.equipItems, 'state-locationInfo')
                //改变equipItems
                if (temp.rfids.length > 0) {
                    this.rfids = temp.rfids
                    this.equipItems = temp.equipItems
                }
                // 若未知装备的装备改变，那么需要修改
                this.equipItems.forEach(item => {
                    item.state = item.state === 0 ? '可用' : '充电中'
                })
                // 假数据处理
                if (!this.isInfo) {
                    let count = 10 - this.rfids.length
                    this.order = {
                        startTime: (new Date()).valueOf(),
                        operatorInfo: {
                            operator: JSON.parse(window.localStorage.getItem("user")).name,
                            operatorId: JSON.parse(window.localStorage.getItem("user")).id
                        },
                        inventoryCount: 10,
                        notCount: this.rfids.length,
                        count: count
                    }
                }
            },
            changeRow(current) {
                this.totalIndex = current.index
            },
            submit() {
                let data = {
                    inventoryOrder: this.order,
                    rfids: this.rfids
                }
                inventoryOrder("post", data)
                this.$router.push({
                    name:'inventoryList',
                    params:{
                        rfids:this.rfids
                    }
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