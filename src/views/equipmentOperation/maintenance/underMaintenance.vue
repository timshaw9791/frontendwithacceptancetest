<template>
    <div class="maintenance-form-container">
        <div class="maintenance-form-body">
            <bos-tabs :option="['tabs']" :layoutRatio="[2, 1]" :header="false" >
                <define-table ref="total" :havePage="false" :data="listData"
                              @changeCurrent="selRow"
                              :highLightCurrent="true" slot="total" key="1">
                    <define-column label="装备参数" v-slot="{ data }">
                        <entity-input v-model="data.row.equipArg" :detailParam="data.row.equipArg"
                                      :options="{ detail: 'equipArgsDetail' }" format="{name}({model})"
                                      :disabled="true"></entity-input>
                    </define-column>
                    <define-column label="装备位置" v-slot="{ data }">
                        <entity-input v-model="data.row.location" :formatFunc="$formatFuncLoc"
                                      :tableEdit="false"></entity-input>
                    </define-column>
                    <define-column label="可保养数量" field="count"></define-column>
                </define-table>
                <define-table :havePage="false" :data="listData[findIndex].copyList"  slot="detail" >
                    <define-column label="RFID" field="rfid"></define-column>
                    <define-column label="装备序号" field="serial"></define-column>
                </define-table>
            </bos-tabs>
        </div>
    </div>
</template>

<script>
    import myHeader from "components/base/header/header";
    import baseButton from "@/componentized/buttonBox/baseButton";
    import bosTabs from "@/componentized/table/bosTabs";
    import entityInput from '@/componentized/entity/entityInput'
    import {needKeepEquips} from "@/api/operation"

    var _ = require("lodash");
    export default {
        name: "maintenance",
        data() {
            return {
                findIndex: 0,
                listData: [],
                list: [],
            }
        },
        methods: {
            selRow(data) { // 单选表格行
                this.findIndex = data.index
            },
            classDataify(data)
            {
                data.forEach(item => {
                    this.list.push(item)
                })
                let cList = this._.groupBy(this.list, item => `${item.equipArg.model}${item.equipArg.name}${item.location.id}`)
                this.listData = this._.map(cList, (v, k) => {
                    return {equipArg: v[0].equipArg, copyList: v, count: v.length, location: v[0].location}
                })
            },
            sumFunc(param) { // 表格合并行计算方法
                let {columns, data} = param, sums = [];
                sums = new Array(columns.length).fill('')
                sums[0] = '合计'
                sums[columns.length - 1] = 0
                return sums;
            },
            getList() {
                needKeepEquips().then(res => {
                    this.classDataify(res.content)
                })
            },
        },
        created() {
            this.getList()
            this.$nextTick(() => {
                this.$refs.total.refreshLayout()
            })
        },
        components: {
            myHeader,
            baseButton,
            bosTabs,
            entityInput
        },
    };
</script>

<style lang="scss" scoped>
    .maintenance-form-container {
        font-size: 16px;
    }

    .maintenance-form-top {
        padding: 18px 7px;
        border-bottom: 1px solid #ebeef5;
        overflow: hidden;
    }

    .maintenance-form-body {
        padding: 0 7px;
        widows: 100%;
    }

    .process-info {
        padding: 18px 0;
        display: flex;
        justify-content: flex-start;
        overflow: hidden;
    }

    .buttom {
        height: 72px;
        width: 100%;
        margin-top: 25px;
        // box-shadow:0px 0px 12px rgba(235,238,245,1);
    }

</style>
