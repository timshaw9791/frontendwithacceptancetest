<template>
    <div class="process-form-container">
        <my-header :title="'我的流程/'+title+'申请单'" :haveBlack="false"></my-header>
        <div class="process-form-top" v-if="show">
            <define-input label="单号" v-model="outOrder.number" :disabled="true"></define-input>
        </div>
        <div class="process-form-body" v-if="show">
            <div class="process-info">
                <define-input label="单号" v-model="outOrder.number"></define-input>
                <entity-input label="出库机构" v-model="outOrder.house.organUnit" :disabled="true" format="{name}"
                              :options="{search:'organUnits'}" placeholder="-"></entity-input>
                <define-input label="出库库房" v-model="outOrder.house" :disabled="true"
                              placeholder="-"></define-input>
                <entity-input label="出库人员" v-model="outOrder.operator" :disabled="true"
                              placeholder="-"></entity-input>
            </div>
            <div class="process-info">
                <text-input label="申请原因" v-model="outOrder.note" :disabled="true" :tips="tips"
                            :column="12"></text-input>
            </div>
            <div class="table-box">
                <bos-tabs :option="['tabs', 'contrast']" :layoutRatio="[2,1]">
                    <template slot="slotHeader">
                        <hardware-select @readDate="readData"></hardware-select>
                    </template>
                    <define-table :havePage="false" :data="equipItems" height="2.6042rem" @changeCurrent="selRow"
                                  :showSummary="true" :summaryFunc="$sumFunc" :highLightCurrent="true" slot="total">
                        <define-column label="操作" width="100" v-slot="{ data }">
                            <i class="iconfont icontianjialiang" @click="(()=>{equipItems.push({items: []})})()"></i>
                            <i class="iconfont iconyichuliang" @click="$delRow(equipItems,data.$index)"></i>
                        </define-column>
                        <define-column label="装备位置" v-slot="{ data }" v-if="type==='outHouse'">
                            <entity-input v-model="data.row.equipArg" format="{name}({model})"
                                          :disabled="true"></entity-input>
                        </define-column>
                        <define-column label="装备参数" v-slot="{ data }">
                            <entity-input v-model="data.row.equipArg" format="{name}({model})"
                                          :disabled="true"></entity-input>
                        </define-column>
                        <define-column label="装备数量" v-slot="{ data }">
                            <define-input v-model="data.row.count" :disabled="true"></define-input>
                        </define-column>
                        <define-column label="金额" v-slot="{ data }">
                            <define-input v-model="data.row.price" :disabled="true"></define-input>
                        </define-column>
                    </define-table>
                    <define-table :havePage="false" :data="equipItems[totalIndex].items" height="2.6042rem"
                                  slot="detail">
                        <define-column label="RFID" field="rfid"></define-column>
                        <define-column label="序号" field="serial"></define-column>
                    </define-table>
                    <define-table :havePage="false" :data="applyEquip" height="2.6042rem" slot="contrast">
                        <define-column label="装备参数" v-slot="{ data }">
                            <entity-input v-model="data.row.equipArg" format="{name}({model})"
                                          :disabled="true"></entity-input>
                        </define-column>
                        <define-column label="装备数量" v-slot="{ data }">
                            <define-input v-model="data.row.count" :disabled="true"></define-input>
                        </define-column>
                    </define-table>
                </bos-tabs>
            </div>
            <div class="buttom">
                <base-button label="提交" align="right" :width="128" :height="72" :fontSize="20"
                             @click="submit"></base-button>
                <base-button label="清空" align="right" :width="128" :height="72" :fontSize="20" type="danger"
                             @click="clean"></base-button>
            </div>
        </div>
    </div>
</template>


<script>
    import bosTabs from "@/componentized/table/bosTabs"
    import {outHouse} from '@/api/storage'
    import myHeader from '@/components/base/header/header'
    import HardwareSelect from "@/components/hardwareSelect";

    export default {
        name: "transferOut",   // 调拨出库
        components: {
            HardwareSelect,
            bosTabs,
            myHeader
        },
        data() {
            return {
                outOrder: {
                    application: {},
                    outboundOrganUnit: {},
                    house: {
                        organUnit: {}
                    }
                },
                equipItems: [{items: []}],
                totalIndex: 0,
                title: '',
                applyEquip: '',
            }
        },
        methods: {
            submit() {
                outHouse().then()
            },
            readData() {

            },
            clean() {

            },
        },
        created() {
            Object.assign(this, this.$route.query)

        }
    }
</script>

<style scoped>

</style>