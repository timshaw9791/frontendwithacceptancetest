<template>
    <div>
        <div class="process-info">
            <div class="process-info-top">
                <define-input label="单号" v-model="order.number" :disabled="true"
                              class="odd-number"></define-input>
            </div>
            <div>
                <define-input label="所在库房" v-model="order.warehouse.name" :disabled="true"></define-input>
                <date-select label="申请日期" v-model="order.createTime" :disabled="true"></date-select>
                <entity-input label="申请人员" v-model="order.applicant"
                              :options="{detail:'applicant'}" :disabled="true"
                              format="{name}({policeSign})">
                </entity-input>
                <text-input label="申请原因" v-model="order.note" :tips="tips" :title="order.note"></text-input>
            </div>
        </div>
        <div class="table-box">
            <bos-tabs>
                <template slot="slotHeader">
                    <base-button label="读取数据" align="right" :disabled="!select.selected" :width="96"
                                 @click="readData"></base-button>
                    <base-select label="硬件选择" v-model="select.selected" align="right"
                                 :selectList="select.handWareList"></base-select>
                </template>
                <template>
                    <define-table :data="equipItems" @changeCurrent="selRow" :havePage="false"
                                  :highLightCurrent="true" :showSummary="true" :summaryFunc="sumFunc"
                                  slot="total">
                        <define-column label="操作" width="100" v-slot="{ data }">
                            <i class="iconfont icontianjialiang" @click="changeRow(true,data)"></i>
                            <i class="iconfont iconyichuliang" @click="changeRow(false,data)"></i>
                        </define-column>
                        <define-column label="装备参数" v-slot="{ data }">
                            <entity-input v-model="data.row.equipArg" :options="{detail:'equipArgsSelect'}"
                                          :tableEdit="false" format="{name}({model})"></entity-input>
                        </define-column>
                        <define-column label="装备数量" v-slot="{ data }">
                            <define-input v-model="data.row.count" type="Number"
                                          :tableEdit="false"></define-input>
                        </define-column>
                    </define-table>
                </template>
                <template>
                    <define-table :data="equipItems[findIndex].items" :havePage="false" slot="detail">
                        <define-column label="操作" width="100" v-slot="{ data }">
                            <i class="iconfont iconyichuliang"></i>
                        </define-column>
                        <define-column label="RFID" field="rfid"></define-column>
                    </define-table>
                </template>
            </bos-tabs>
        </div>
    </div>
</template>

<script>
    import bosTabs from "../../componentized/table/bosTabs";

    export default {
        name: "scrapOrder",
        components: {
            bosTabs
        },
        data(){
            return{
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
                tips: [{value: '直接报废', key: '1'}, {value: '装备拿去维修，无法修补', key: '2'}],
                equipItems: [],
                // todo 假数据
                readData:['555566666777'],
            }
        },
        props: {
            order: {
                type: Object,
                default: function () {
                    return {
                        warehouse: {},
                        organUnit: {},
                        applicant: {}
                    }
                },
            },
            equipItems: {
                type: Object,
                default: function () {
                    return [{items: []}]
                }
            },
            isInfo: false,
            isEdit: false,
        },
        methods:{
            readData(){
                this.$emit('handleReadData',this.readData)
            }
        }
    }
</script>

<style scoped>

</style>