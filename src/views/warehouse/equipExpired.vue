<template>
    <div class="maintenance-form-container">
        <my-header title="装备报废"></my-header>
        <div class="action_box" data-test="action_box">
            <define-input label="单号" v-model="expiredOrder.number" placeholder="--" :disabled="true"></define-input>
            <define-input label="报废类型" v-model="expiredOrder.expiredCategory" :disabled="true"></define-input>
            <define-input label="报废时间" v-model="expiredOrder.createTime" :disabled="true"></define-input>
            <entity-input label="操作人员" v-model="expiredOrder.operatorInfo.operator" :disabled="true"></entity-input>
        </div>
        <define-input label="备注" v-model="expiredOrder.remark" margin="15px  0.0521rem"
                      :disabled="isInfo"></define-input>
        <div class="maintenance-form-body">
            <bos-tabs @changeTab="changeTab">
                <template slot="slotHeader" v-if="!isInfo||isHardwareSelect">
                    <base-button label="读取数据" :disabled="!hardwareSelect.select" :width="96"
                                 @click="readData"></base-button>
                    <base-select label="硬件选择" v-model="hardwareSelect.select"
                                 :selectList="hardwareSelect.list"></base-select>
                </template>
                <define-table :data="equipItems" height="2.8646rem" @changeCurrent="totalSelRow" :havePage="false"
                              :highLightCurrent="true" slot="total" :showSummary="true" :summaryFunc="sumFunc">
                    <define-column label="操作" width="100" v-slot="{ data }">
                        <i class="iconfont iconyichuliang" @click="delRow('equipItems',data)"></i>
                    </define-column>
                    <define-column label="装备参数" v-slot="{ data }">
                        <entity-input v-model="data.row.equipArg" :options="{detail:'equipArgsSelect'}"
                                      format="{name}({model})" :tableEdit="false"></entity-input>
                    </define-column>
                    <define-column label="装备数量" v-slot="{ data }">
                        <define-input v-model="data.row.count" type="Number" :tableEdit="false"></define-input>
                    </define-column>
                </define-table>
                <define-table :data="detailItems" height="2.8646rem" :havePage="false" slot="detail">
                    <define-column label="操作" width="100" v-slot="{ data }">
                        <i class="iconfont iconyichuliang" @click="delRow('detailItems',data)"></i>
                    </define-column>
                    <define-column label="RFID" v-slot="{ data }">
                        <define-input v-model="data.row.rfid" type="String" :tableEdit="false"></define-input>
                    </define-column>
                    <define-column label="装备序号" v-slot="{ data }">
                        <define-input v-model="data.row.serial" type="Number" :tableEdit="false"></define-input>
                    </define-column>
                </define-table>
            </bos-tabs>
            <div class="btn-box">
                <base-button label="取消" @click="cancel"></base-button>
                <base-button label="提交" @click="confirm"></base-button>
            </div>
        </div>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header'
    import defineInput from '@/componentized/textBox/defineInput.vue'
    import bosTabs from '@/componentized/table/bosTabs.vue'
    import entityInput from '@/componentized/entity/entityInput'
    import {start, killProcess} from 'common/js/rfidReader'
    import {findByRfids} from 'api/storage'
    import divTmp from '@/componentized/divTmp'
    import {equipScrap} from 'api/operation'
    import {getBosEntity} from 'src/api/basic'

    export default {
        name: "maintenance",
        data() {
            return {
                expiredOrder: {
                    operatorInfo: {
                        operator: ''
                    },
                    equipItems: [{
                        equipArg: '',
                        count: '',
                    }],
                },
                paginator: {size: 10, page: 1, totalElements: 0, totalPages: 0},
                hardwareSelect: {
                    list: [{
                        label: '手持机',
                        value: 'handheld'
                    }, {
                        label: '读卡器',
                        value: 'reader'
                    }],
                    select: '',
                },
                pid: '',
                // 装备表渲染的数据
                equipItems: [],
                // 明细表渲染的数据
                detailItems: [],
                // 扫描到的装备rfid
                rfids: [],
                isInfo: [],
                isHardwareSelect:true,
                //用于处理报废类型Enum
                expiredCategory:''
            }
        },
        methods: {
            totalSelRow(current) {
                this.detailItems = current.current.items
            },
            changeTab(data) {
                data.key === 'total' ? killProcess(this.pid) : ''
            },
            // 表格合并行计算方法
            sumFunc(param) {
                let {columns} = param, sums = [];
                sums = new Array(columns.length).fill('')
                sums[0] = '合计'
                sums[columns.length - 1] = param.data.reduce((v, k) => v + k.count, 0)
                return sums;
            },
            readData() {
                killProcess(this.pid)
                start("java -jar scan.jar", (data) => {
                    if (this.rfids.findIndex((v) => v === data) !== -1) {
                        findByRfids(data).then(res => {
                            this.equipItems.push(res[0])
                            this.fixData()
                        })
                    }
                }, (fail) => {
                    this.index = 1;
                    this.$message.error(fail);
                }, (pid, err) => {
                    pid ? this.pid = pid : this.$message.error(err)
                })
            },
            initData(){
               if (this.isInfo){
                   this.fetchData()
               }
            },
            //读写器数据处理的方法
            fixData() {
                this.expiredOrder = {
                    operatorInfo:{
                        operator:JSON.parse(window.localStorage.getItem("user")).name,
                        operatorId:JSON.JSON.parse(window.localStorage.getItem("user")).id,
                    },
                }
                switch (this.$route.query.expiredCategory) {
                    case '维修报废': {
                        this.expiredCategory = 0
                        break
                    }
                    case '到期报废': {
                        this.expiredCategory = 1
                        break
                    }
                    case '盘点报废': {
                        this.expiredCategory = 2
                        break
                    }
                    case '常规报废': {
                        this.expiredCategory = 3
                        break
                    }
                }
                let tempList = this._.groupBy(this.equipItems, item => `${item.equipArg.model}${item.equipArg.name}`)
                this.expiredOrder.equipItems = this._.map(tempList, (v) => {
                    return {
                        equipArg: v[0].equipArg,
                        location: v[0].location,
                        item: v,
                        count: v.length,
                    }
                })
            },
            fetchData() {
                getBosEntity().then( res => {
                    this.expiredOrder = res
                    this.fixData()
                })
            },
            confirm() {
                let rfidList = []
                this.expiredOrder.equipItems.forEach(item => {
                    item.items.forEach(rf => {
                        rfidList.push(rf.rfid)
                    })
                })
                equipScrap(1, this.expiredOrder.remark, rfidList).then(() => {
                    this.cancel()
                })
            },
            cancel() {
                this.$router.back()
            },
            delRow(list, data) {
                this[list].splice(data.$index, 1,)
            }
        },
        created() {
            this.fetchData()
            // 报废可以调 id equipItems expiredCategory(0:维修报废,1:到期报废,2:盘点报废,3:常规报废) 只需带数字
            this.isInfo = !!this.$route.query.id
            if (this.$route.query.equipItems){

            }
        },
        beforeDestroy() {
            killProcess(this.pid)
        },
        components: {
            myHeader,
            defineInput,
            entityInput,
            divTmp,
            bosTabs,
        }
    };
</script>

<style lang="scss" scoped>
    .maintenance-form-container {
        font-size: 16px;

        .action_box {
            margin-top: 15px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
        }
    }

    .maintenance-form-top {
        padding: 18px 7px;
        border-bottom: 1px solid #ebeef5;
        overflow: hidden;
    }

    .maintenance-form-body {
        margin-top: 15px;
        padding: 0 7px;
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
