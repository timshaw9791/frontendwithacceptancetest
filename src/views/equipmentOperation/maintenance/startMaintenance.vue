<template>
    <view-container>
        <div class="apply-process-top" data-test="action_box">
            <define-input label="单号" placeholder="--" :disabled="true"></define-input>
            <define-input label="保养时间" placeholder="--" :disabled="true"></define-input>
            <define-input label="操作人员" v-model="people" :disabled="true"></define-input>
        </div>
        <div class="data-list">
            <bos-tabs @changeTab="changeTab">
                <template slot="slotHeader">
                    <base-button label="读取数据" align="right" :disabled="!select.selected" @click="readData()"
                                 :width="96"></base-button>
                    <base-select label="硬件选择" v-model="select.selected" align="right"
                                 :selectList="select.handWareList"></base-select>
                </template>
                <define-table ref="total" :data="listData"  @changeCurrent="selRow" :havePage="false"
                              :highLightCurrent="true" slot="total" :showSummary="true" :summaryFunc="sumFunc">
                    <define-column label="操作" width="100" v-slot="{ data }">
                        <i class="iconfont icontianjia"></i>
                        <i class="iconfont iconyichu" @click="changeRow(data)"></i>
                    </define-column>
                    <define-column label="装备参数" v-slot="{ data }">
                        <entity-input v-model="data.row.equipArg" :options="{detail:'equipArgDetail'}"
                                      format="{name}({model})" :tableEdit="false"></entity-input>
                    </define-column>
                    <define-column label="装备位置" v-slot="{ data }">
                        <entity-input v-model="data.row.location" :formatFunc="$formatFuncLoc"
                                      :tableEdit="false"></entity-input>
                    </define-column>
                    <define-column label="可保养数量" v-slot="{ data }">
                        <define-input v-model="data.row.count" type="Number" :tableEdit="false"></define-input>
                    </define-column>
                    <define-column label="本次保养数量" v-slot="{ data }">
                        <define-input v-model="data.row.keepcount" type="Number" :tableEdit="false"></define-input>
                    </define-column>
                </define-table>
                <define-table  :data="listData[findIndex].clist"  :havePage="false" slot="detail">
                    <define-column label="操作" width="100" v-slot="{ data }">
                        <i class="iconfont icontianjia" @click="changeDetailRow(true,data)"></i>
                        <i class="iconfont iconyichu" @click="changeDetailRow(false,data)"></i>
                    </define-column>
                    <define-column label="RFID" v-slot="{ data }">
                        <define-input v-model="data.row.rfid" type="String" :tableEdit="false"></define-input>
                    </define-column>
                    <define-column label="装备序号" v-slot="{ data }">
                        <define-input v-model="data.row.serial" type="Number" :tableEdit="false"></define-input>
                    </define-column>
                </define-table>
            </bos-tabs>
        </div>
        <base-button slot="button" label="取消" type="text" @click="cancel" ></base-button>
        <base-button slot="button" label="提交" type="text" @click="confirm" ></base-button>
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
    import {start, killProcess} from 'common/js/rfidReader'
    import divTmp from '@/componentized/divTmp'
    import {needKeepEquips, endKeepEquips} from "api/operation"
    import {findByRfids} from "api/storage"

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
        props: {
            equipData: {
                type: Object,
                default() {
                    return {}
                }
            }
        },
        data() {
            return {
                people: '',
                requestBody: '',
                show: true,
                rowData: "", // 选中的单选行数据
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
                findIndex: 0,
                rfidsList: [],
                checkList: [],
                listData: [{
                    equipArg: '',
                    location: '',
                    count: 0,
                    rfids: [],
                    serial: [],
                    copyList: [{rfid: '', serial: ''}],
                    clist: [{rfid: '', serial: ''}]
                }],
                list: [],
            }
        },
        methods: {
            selRow(data) { // 单选表格行
                this.findIndex = data.index
            },
            changeRow(data) {
                this.listData[data.$index].clist = [{rfid: '', serial: ''}]
                this.listData[data.$index].keepcount = 0
            },
            changeTab(data) {
                data.key == "total" ? killProcess(this.pid) : ''
            },
            changeDetailRow(state, data) {
                state ? this.listData[this.findIndex].clist.push({
                    rfid: '',
                    serial: ''
                }) : this.listData[this.findIndex].clist.splice(data.$index, 1)
                state ? '' : this.listData[this.findIndex].keepcount--
                if (this.listData[this.findIndex].clist.length === 0) {
                    this.listData[this.findIndex].clist = [{rfid: '', serial: ''}]
                }
            },
            confirm() {
                this.requestBody = JSON.parse(JSON.stringify(this.listData))
                let rfidList = []
                this.requestBody.forEach(item => {
                    item.clist.forEach(rf => {
                        rfidList.push(rf.rfid)
                    })
                })
                endKeepEquips(true, rfidList).then(res => {
                    this.$message.success('装备开始保养成功')
                    this.cancel()
                })
            },
            classDataify(data)
            {
                if (this._.findIndex(this.list, ['rfid', data[0].rfid]) == -1)//避免重复
                {
                    data.forEach(item => {
                        this.list.push(item)
                    })
                    let cList = this._.groupBy(this.list, item => `${item.equipArg.model}${item.equipArg.name}${item.location.id}`)
                    this.listData = this._.map(cList, (v, k) => {
                        return {
                            equipArg: v[0].equipArg,
                            copyList: v,
                            count: v.length,
                            location: v[0].location,
                            keepcount: 0,
                            clist: [{rfid: '', serial: ''}]
                        }
                    })
                }
            },
            classDataifyRfid(data) {
                let flag = true
                console.log(this.rfidsList);
                console.log(this._.findIndex(this.rfidsList, data[0].rfid));
                this.listData.forEach(item => {
                    if (item.equipArg.name == data[0].equipArg.name && item.location.id == data[0].location.id && item.equipArg.model == data[0].equipArg.model) {
                        if (item.clist.length == 1 && item.clist[0].rfid == '') {
                            flag = false
                            item.clist[0].rfid = data[0].rfid
                            item.clist[0].serial = data[0].serial
                        } else if (item.clist[item.clist.length - 1].rfid == '') {
                            flag = false
                            item.clist[item.clist.length - 1].rfid = data[item.clist.length - 1].rfid
                            item.clist[item.clist.length - 1].serial = data[item.clist.length - 1].serial
                        } else {
                            flag = false;
                            item.clist.push({rfid: data[0].rfid, serial: data[0].serial})
                        }

                    }
                    item.keepcount = 0
                    item.clist.forEach(i => {
                        if (i.rfid != '') {
                            item.keepcount++
                        }
                    })

                })
                if (flag) {
                    this.$message.error('该装备不在需要保养列表')
                }
            },
            cancel() {
                this.$router.back()
            },
            sumFunc(param) { // 表格合并行计算方法
                this.$nextTick(()=>{
                    this.$refs.total.refreshLayout()
                })
                let {columns, data} = param, sums = [];
                sums = new Array(columns.length).fill('')
                sums[0] = '合计'
                sums[columns.length - 1] = param.data.reduce((v, k) => v + k.keepcount, 0)
                return sums;
            },
            getList() {
                needKeepEquips().then(res => {
                    this.classDataify(res.content)
                    res.content.forEach(item => {
                        this.rfidsList.push(item.rfid)
                    })
                })
            },
            readData() {
                killProcess(this.pid)
                start("java -jar scan.jar", (data) => {
                    this.checkList = []
                    this.listData.map((v, k) => {
                        v.clist.filter(it => {
                            it.rfid == data ? this.checkList.push(it.rfid) : ''
                        })
                    })//
                    if (this.checkList.length == 0) {
                        findByRfids(data).then(res => {
                            this.classDataifyRfid(res)
                        })
                    }
                }, (fail) => {
                    this.index = 1;
                    this.$message.error(fail);
                }, (pid, err) => {
                    pid ? this.pid = pid : this.$message.error(err)
                })
            },
        },
        created() {
            this.getList()
            this.people = JSON.parse(localStorage.getItem('user')).name
        },
        beforeDestroy() {
            killProcess(this.pid)
        }
    }
</script>
<style lang="scss" scoped>
    .opening-box {
        font-size: 16px;
        width: 100%;
        min-height: 4.4323rem;

        .apply-process-top {
            margin-top: 15px;
        }

        .data-list {
            padding: 0 10px;
            margin-top: 15px;
            height: "2.8648rem";
            // border:1px solid rgba(112, 112, 112, 0.13)
        }
    }

    .btn-box {
        width: 4rem;
        height: 50px;
        margin-left: 20px;
        margin-top: 15px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
</style>