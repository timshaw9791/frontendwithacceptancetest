<template>
    <div style="margin: 0 10px ">
        <bos-tabs :option="['contrast']" :layoutRatio="[70,30]" :contrastKey="['total', 'contrast']" :header="false">
            <define-table ref="total" :havePage="false" :data="listData"
                          @changeCurrent="selRow" :highLightCurrent="true"
                          slot="total" key="1" height="928px">
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
            <define-table slot="contrast" :data="listData.length!==0?listData[this.findIndex].copyList:[]"
                          height="928px" :havePage="false">
                <define-column label="RFID" field="rfid"></define-column>
                <define-column label="装备序号" field="serial"></define-column>
            </define-table>
        </bos-tabs>
        <tool-bar>
            <base-button slot="button" type="text" label="开始保养" @click="endMain"></base-button>
        </tool-bar>
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
                listData: [{copyList: []}],
            }
        },
        methods: {
            selRow(data) { // 单选表格行
                this.findIndex = data.index
            },
            classDataify(data) {
                let cList = this._.groupBy(data, item => `${item.equipArg.model}${item.equipArg.name}${item.location.id}`)
                this.listData = this._.map(cList, (v, k) => {
                    return {equipArg: v[0].equipArg, copyList: v, count: v.length, location: v[0].location}
                })
            },
            getList() {
                needKeepEquips().then(res => {
                    this.classDataify(res.content)
                })
            },
            endMain() {
                this.$router.push({path: '/equipmentOperation/endMaintenance'});
            }
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
