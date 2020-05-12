<template>
    <div class="scrap-list-container">
        <my-header title="装备报废" :haveBlack="true" @h_black="cancel"></my-header>
        <div class="action_box" data-test="action_box">
            <define-input label="单号" v-model="scrapOrder.number" placeholder="--" :disabled="true"></define-input>
            <define-input label="报废类型" v-model="scrapOrder.categoryContent" :disabled="true"></define-input>
            <define-input label="报废时间" v-model="scrapOrder.createTime" :disabled="true"></define-input>
            <entity-input label="操作人员" v-model="scrapOrder.operatorInfo.operator" :disabled="true"></entity-input>
        </div>
        <define-input label="备注" v-model="scrapOrder.remark" margin="15px  0.0521rem"
                      :disabled="isInfo"></define-input>
        <div class="scrap-list-body">
            <bos-tabs @changeTab="changeTab">
                <template slot="slotHeader" v-if="!isInfo||!isHardwareSelect">
                    <base-button label="读取数据" :disabled="!hardwareSelect.select" :width="96"
                                 @click="readData"></base-button>
                    <base-select label="硬件选择" v-model="hardwareSelect.select"
                                 :selectList="hardwareSelect.list"></base-select>
                </template>
                <define-table :data="equipItems" height="2.8646rem" @changeCurrent="changeRow" :havePage="false"
                              :highLightCurrent="true" slot="total" :showSummary="true" :summaryFunc="sumFunc">
                    <define-column label="操作" width="100" v-slot="{ data }">
                        <i class="iconfont iconyichuliang" @click="delRow(data)"></i>
                    </define-column>
                    <define-column label="装备参数" v-slot="{ data }">
                        <entity-input v-model="data.row.equipArg" :options="{detail:'equipArgDetail'}"
                                      format="{name}({model})" :tableEdit="false"></entity-input>
                    </define-column>
                    <define-column label="装备数量" field="count"></define-column>
                </define-table>
                <define-table :data="detailItems" height="2.8646rem" :havePage="false" slot="detail">
                    <define-column label="操作" width="100" v-slot="{ data }">
                        <i class="iconfont iconyichuliang" @click="delRow(data)"></i>
                    </define-column>
                    <define-column label="RFID" field="rfid"></define-column>
                    <define-column label="装备序号" field="serial"></define-column>
                </define-table>
            </bos-tabs>
            <div class="btn-box" v-if="!isInfo">
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
    import {getBosEntity} from '@/api/basic'
    import {transEquipFormat,transScrapCategory} from "../../../common/js";

    export default {
        name: "maintenance",
        data() {
            return {
                scrapOrder: {
                    operatorInfo: {
                        operator: '',
                        operatorId: ''
                    },
                    scrapItems: [{
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
                // 处理后的装备数据，用于渲染
                equipItems: [],
                // 明细表渲染的数据
                detailItems: [],
                // 扫描到的装备rfid
                rfids: [],
                isInfo: [],
                isHardwareSelect: true,
            }
        },
        methods: {
            changeRow(current) {
                this.detailItems = current.current.item
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
                        this.rfids.push(data)
                        this.fetchEquipItems()
                    }
                }, (fail) => {
                    this.index = 1;
                    this.$message.error(fail);
                }, (pid, err) => {
                    pid ? this.pid = pid : this.$message.error(err)
                })
            },
            fetchEquipItems(data){
                findByRfids(data).then(res => {
                    this.scrapOrder.scrapItems.push(res[0])
                    this.fixEquipItems()
                })
            },
            fixEquipItems(){
                this.scrapOrder.scrapItems.forEach(item => {
                    if (item.equipArg) {
                        transEquipFormat(item)
                    }
                })
                // 处理前的装备数据
                let tempEquipItems = this._.groupBy(this.scrapOrder.scrapItems, item => `${item.equipModel}${item.equipName}`)
                this.equipItems = this._.map(tempEquipItems, (item) => {
                    return {
                        equipArg: item[0].equipName+"("+item[0].equipModel+")",
                        location: item[0].location,
                        item: item,
                        count: item.length,
                    }
                })
            },
            fetchData() {
                getBosEntity(this.$route.query.id).then(res => {
                    this.scrapOrder = res
                    this.fixData()
                })
            },
            fixData() {
                transScrapCategory(this.scrapOrder)
                this.fixEquipItems()
            },
            confirm() {
                this._.map(this.equipItems,(item)=>this._.map(item.items,'rfid'))
                equipScrap(this.scrapOrder.category, this.scrapOrder.remark, ).then(() => {
                    this.cancel()
                })
            },
            cancel() {
                this.$router.back()
            },
            delRow(data) {
                data.splice(data.$index, 1,)
            }
        },
        created() {
            // 详情带上id
            // 新建rfids category(0:维修报废,1:到期报废,2:盘点报废,3:常规报废) 只需带数字
            if (this.$route.query.id){
                this.isInfo = true
                this.fetchData()
            }
            else {
                this.scrapOrder.category = this.$route.query.category
                this.fetchEquipItems(this.$route.query.rfids)
                this.fixData()
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
    .scrap-list-container {
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

    .scrap-list-body {
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
