<template>
        <view-container class="container" :tabs="tabs"  @changeTab="changeTab" style="height:100%">
            <!-- 标签1 -->
            <template slot="car1" >
                <define-table :havePage="false" :data="order" height="100%" slot="detail">
                    <define-column label="RFID" field="rfid"></define-column>
                    <define-column label="装备序号" field="serial"></define-column>
                    <define-column label="装备参数" v-slot="{ data }">
                        <entity-input :column="2" v-model="data.row.equipArg" :options="{ detail: 'equipArgsSelect' }"
                                      format="{name}({model})" :tableEdit="false"></entity-input>
                    </define-column>
                    <define-column label="装备位置" field="location"
                                   :filter="(row)=>locations(row.location)"></define-column>
                    <define-column label="充电台位置" field="chargeLocation"></define-column>
                    <define-column label="已充时间" v-slot="{ data }">
                        <date-input v-model="data.row.chargeingTime" :tableEdit="false" filter="toDay"></date-input>
                    </define-column>
                </define-table>
            </template>
            <!-- 标签2 -->
            <template slot="car2" >
                <define-table :havePage="false" :data="order" height="100%" slot="total">
                    <define-column label="RFID" field="rfid"></define-column>
                    <define-column label="装备序号" field="serial"></define-column>
                    <define-column label="装备参数" v-slot="{ data }">
                        <entity-input :column="2" v-model="data.row.equipArg" :options="{ detail: 'equipArgsSelect' }"
                                      format="{name}({model})" :tableEdit="false"></entity-input>
                    </define-column>
                    <define-column label="装备位置" field="location"
                                   :filter="(row)=>locations(row.location)"></define-column>
                    <define-column label="充电倒计时/天" v-slot="{ data }">
                        <date-input v-model="data.row.chargeCountdown" :tableEdit="false" filter="toDay"></date-input>
                    </define-column>
                </define-table>
            </template>
        </view-container>
</template>

<script>
    import baseButton from "@/componentized/buttonBox/baseButton";
    import entityInput from "@/componentized/entity/entityInput";
    import bosTabs from "@/componentized/table/bosTabs";
    import {getChargeList, getNeedchargeList} from "api/charge";

    var _ = require("lodash");
    export default {
        name: "newCharge",
        data() {
            return {
                order: [],
                tabs:[{
                    label: '需要充电',
                    key: 'car1',
                    baseSearch: false,
                    advancedSearch: false,
                    baseSearchValue: ''
                }, {
                    label: '正在充电',
                    key: 'car2'
                }],
            };
        },
        methods: {
            locations(data) {
                return data.frameNumber + '架/' + data.surface + '面/' + data.floor + '层/' + data.section + '节'
            },
            changeTab(data) {
                if (data.key == "car1") {
                    getNeedchargeList().then(res => {
                        this.order = res
                    })
                } else if (data.key == "car2") {
                    getChargeList().then(res => {
                        this.order = res
                    })
                }
            },
        },
        created() {
            getNeedchargeList().then(res => {
                this.order = res
            })
        },
        components: {
            baseButton,
            entityInput,
            bosTabs,
        },
    };
</script>

<style lang="scss">
    .charge-container {
        font-size: 16px;
    }

    .charge-body {
        padding: 0 7px;
        widows: 100%;
    }

    .charge-header {
        width: 100%;
        padding-left: 18px;
        padding-right: 35px;
        height: 57px;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: justify;
        -ms-flex-pack: justify;
        justify-content: space-between;
        color: rgba(112, 112, 112, 1);
        border-bottom: 1px solid rgba(112, 112, 112, 0.13);
    }
</style>
