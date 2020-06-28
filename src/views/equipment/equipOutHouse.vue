<template>
    <view-container>
        <div class="action_box">
            <define-input label="单号" v-model="listData.number" placeholder="--" :disabled="true"
                          margin="0 0"></define-input>
            <date-select label="出库时间" v-model="listData.createTime" placeholder="--" :disabled="true"></date-select>
            <entity-input label="出库人员" v-model="listData.operator.operator" placeholder="--"
                          :options="{search:'locationSelect'}" format="{name}" :disabled="true"></entity-input>
        </div>
        <bos-tabs @changeTab="changeTab">
            <template slot="slotHeader" v-if="!this.$route.query.id">
                <base-button label="读取数据" align="right" :disabled="!select.selected" :width="96"
                             @click="readData"></base-button>
                <base-select label="硬件选择" v-model="select.selected" align="right"
                             :selectList="select.handWareList"></base-select>
            </template>
            <define-table :data="newData" height="828px" @changeCurrent="selRow" :havePage="false"
                          :highLightCurrent="true" slot="total" :showSummary="true" :summaryFunc="sumFunc">
                <define-column label="操作" width="100" v-slot="{ data }" v-if="!this.$route.query.id">
                    <!-- <i class="iconfont icontianjia" @click="changeRow(true,data)"></i> -->
                    <i class=" iconfont iconyichu" @click="changeRow(false,data)" style="margin:8px"></i>
                </define-column>
                <define-column label="装备参数" v-slot="{ data }" v-if="!this.$route.query.id">
                    <entity-input v-model="data.row.equipArg" :detailParam="data.row.equipArg" :options="{detail:'equipArgsDetail'}"
                                  format="{name}({model})" :tableEdit="false"></entity-input>
                </define-column>
                <define-column label="装备参数" v-slot="{ data }" v-if="this.$route.query.id">
                    <entity-input v-model="data.row.equipArg" :detailParam="data.row.equipArg" :options="{detail:'equipArgsDetail'}"
                                  format="{equipName}({equipModel})" :tableEdit="false"></entity-input>
                </define-column>
                <define-column label="装备数量" v-slot="{ data }">
                    <define-input v-model="data.row.count" type="Number" :tableEdit="false"></define-input>
                </define-column>
            </define-table>
            <define-table :data="newData[findIndex].copyList" v-if="newData[findIndex]!=undefined" height="828px" :havePage="false" slot="detail">
                <define-column label="操作" width="100" v-slot="{ data }">
                    <i class="iconfont icontianjia" @click="changeDetailRow(true,data)"></i>
                    <i class="iconfont iconyichu" @click="changeDetailRow(false,data)"></i>
                </define-column>
                <define-column label="RFID" field="rfid" :tableEdit="false"/>
                <define-column label="装备序号" field="equipSerial" :tableEdit="false"/>
            </define-table>
        </bos-tabs>
        <tool-bar>
            <base-button label="返回" slot="button" type="text" @click="cancel"></base-button>
            <base-button label="提交" slot="button" type="text" @click="confirm"
                         v-if="!this.$route.query.id"></base-button>
        </tool-bar>

    </view-container>
</template>

<script>
    import myHeader from 'components/base/header/header'
    import textInput from '@/componentized/textBox/textInput.vue'
    import defineInput from '@/componentized/textBox/defineInput.vue'
    import bosTabs from '@/componentized/table/bosTabs.vue'
    import baseButton from "@/componentized/buttonBox/baseButton.vue"
    import baseSelect from '@/componentized/textBox/baseSelect.vue'
    import dateSelect from '@/componentized/textBox/dateSelect.vue'
    import entityInput from '@/componentized/entity/entityInput'
    import serviceDialog from 'components/base/serviceDialog/index'
    import {start, startOne, killProcess} from 'common/js/rfidReader'
    import divTmp from '@/componentized/divTmp'
    import {getBosEntity} from "api/basic"
    import {getInhouseNumber, inHouse, findByRfids, outHouse} from "api/storage"

    export default {
        components: {
            myHeader,
            textInput,
            defineInput,
            baseButton,
            baseSelect,
            dateSelect,
            entityInput,
            divTmp,
            bosTabs,
            serviceDialog
        },
        data() {
            return {
                time: "",
                people: '',
                requestBody: '',
                orderNumber: '——',
                paginator: {size: 10, page: 1, totalElements: 0, totalPages: 0},
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
                pid: '',
                findIndex: 0,
                newData: [],
                list: [],
                listData: {
                    operator: {
                        operator: ''
                    }
                },
            }
        },
        methods: {
            selRow(data) {
                this.findIndex = data.index
            },
            changeTab(data) {
                data.key == "total" ? killProcess(this.pid) : ''
            },
            sumFunc(param) { // 表格合并行计算方法
                let {columns, data} = param, sums = [];
                sums = new Array(columns.length).fill('')
                sums[0] = '合计'
                sums[columns.length - 1] = param.data.reduce((v, k) => v + k.copyList.length, 0)
                return sums;
            },
            cancel() {
                this.$router.back()
            },
            fetchData(id) {
                getBosEntity(id).then(res => {
                    this.listData = res
                    this.classDataify(res.inOutHouseItems)
                })
            },
            confirm() {
                this.requestBody = JSON.parse(JSON.stringify(this.newData))
                let rfidList = []
                this.requestBody.forEach(item => {
                    item.copyList.forEach(rf => {
                        if (rf.rfid != '') {
                            rfidList.push(rf.rfid)
                        }
                    })
                })
                if (rfidList.length == 0) {
                    this.$message.error('未扫入装备')
                    return
                }
                outHouse(rfidList).then(res => {
                    this.$message.success('装备出库成功')
                    this.cancel()
                })
            },
            changePage(page) {
                this.paginator.page = page;
            },
            changelocation() {
                this.$refs.historyDialog.show()
            },
            classDataify(data) {
                if (this._.findIndex(this.list, data[0]) == -1)//避免重复
                {
                    data.forEach(item => {
                        this.list.push(item)
                    })
                    let cList = this.$route.query.id ? this._.groupBy(this.list, item => `${item.equipName}${item.equipModel}`) : this._.groupBy(this.list, item => `${item.equipArg.model}${item.equipArg.name}`)
                    this.newData = this.$route.query.id ? this._.map(cList, (v, k) => {
                        return {equipArg: v[0], copyList: v, count: v.length}
                    }) : this._.map(cList, (v, k) => {
                        return {equipArg: v[0].equipArg, copyList: v, count: v.length}
                    })
                }
            },
            readData() {
                if (this.select.selected == 'reader') {
                    killProcess(this.pid)
                    start("java -jar scan.jar", (data) => {
                        findByRfids(data).then(res => {
                            this.classDataify(res)
                        })
                    }, (fail) => {
                        this.index = 1;
                        this.$message.error(fail);
                    }, (pid, err) => {
                        pid ? this.pid = pid : this.$message.error(err)
                    })
                }
            },
            changeDetailRow(state, data) {
                if (state) {
                    this.newData[this.findIndex].copyList.push({rfid: '', serial: ''})
                } else {
                    if (this.newData[this.findIndex].copyList.length > 1) {
                        this.newData[this.findIndex].copyList.splice(data.$index, 1)
                    } else {
                        this.newData[this.findIndex].copyList = [{rfid: '', serial: ''}]
                    }
                }
            },
            changeRow(state, data) {
                if (state) {
                    this.newData.push({
                        name: '',
                        locationId: '',
                        price: 0,
                        productTime: 0,
                        rfids: [],
                        serial: [],
                        copyList: [{rfid: '', serial: ''}],
                    })
                } else {
                    if (this.newData.length > 1) {
                        this.newData.splice(data.$index, 1)
                    } else {
                        this.newData = [{
                            name: '',
                            locationId: '',
                            price: 0,
                            productTime: 0,
                            rfids: [],
                            serial: [],
                            copyList: [{rfid: '', serial: ''}],
                        }]
                    }

                }
            },
            init() {
                this.newData = [{
                    name: '',
                    location: '',
                    price: 0,
                    productTime: 0,
                    rfids: [],
                    serial: [],
                    copyList: []
                }]
            }
        },
        beforeDestroy() {
            killProcess(this.pid)
        },
        created() {
            this.$route.query.id ? this.fetchData(this.$route.query.id) : this.people = JSON.parse(localStorage.getItem('user')).name
            if (!this.$route.query.id) {
                this.listData.operator.operator = JSON.parse(localStorage.getItem('user')).name

            }
        }
    }
</script>
<style lang="scss" scoped>
    .action_box {
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

</style>