<template>
    <div class="maintenance-form-container">
        <bos-tabs :header="false" :option="['contrast']" :layoutRatio="[70,30]" :contrastKey="['total', 'contrast']">
            <define-table slot="total" ref="total" :data="listData" :havePage="false"
                          @changeCurrent="selRow" :highLightCurrent="true" key="2">
                <define-column label="装备参数" v-slot="{ data }">
                    <entity-input v-model="data.row.equipArg" :options="{detail:'equipArgDetail'}"
                                  format="{name}({model})" :disabled="true"></entity-input>
                </define-column>
                <define-column label="装备位置" v-slot="{ data }">
                    <entity-input v-model="data.row.location" :formatFunc="$formatFuncLoc"
                                  :disabled="true"></entity-input>
                </define-column>
                <define-column label="正在保养数量" v-slot="{ data }">
                    <define-input v-model="data.row.count" type="Number" :tableEdit="false"></define-input>
                </define-column>
                <define-column label="保养时长" v-slot="{ data }">
                    <date-input v-model="data.row.keepTime" filter="toDay" :tableEdit="false"></date-input>
                </define-column>
            </define-table>
            <define-table slot="contrast" :data="listData.length!==0?listData[this.findIndex].copyList:[]"
                          :havePage="false">
                <define-column label="RFID" v-slot="{ data }">
                    <define-input v-model="data.row.rfid" type="String" :tableEdit="false"></define-input>
                </define-column>
                <define-column label="装备序号" v-slot="{ data }">
                    <define-input v-model="data.row.serial" type="Number" :tableEdit="false"></define-input>
                </define-column>
            </define-table>
        </bos-tabs>
        <tool-bar>
            <base-button slot="button" type="text" label="结束保养" @click="startMain"></base-button>
        </tool-bar>
    </div>
</template>

<script>
    import myHeader from '@/components/base/header/header'
    import textInput from '@/componentized/textBox/textInput.vue'
    import defineInput from '@/componentized/textBox/defineInput.vue'
    import bosTabs from '@/componentized/table/bosTabs.vue'
    import baseButton from "@/componentized/buttonBox/baseButton.vue"
    import dateSelect from '@/componentized/textBox/dateSelect.vue'
    import entityInput from '@/componentized/entity/entityInput'
    import {inKeepEquips} from "api/operation"

    var _ = require("lodash");
    export default {
        name: "underMaintenance",
        data() {
            return {
                findIndex: 0,
                listData: [],
            }
        },
        methods: {
            selRow(current) {
                this.findIndex = current.index
            },
            fixData(data) { //界面数据处理
                let cList = this._.groupBy(data, item => `${item.equipArg.name}${item.equipArg.model}${item.location.id}`)
                this.listData = this._.map(cList, (v, k) => {
                    return {
                        equipArg: v[0].equipArg,
                        copyList: v,
                        count: v.length,
                        location: v[0].location,
                        keepTime: this.milliTime(v[0].equipArg.updateTime)
                    }
                })
            },
            milliTime(data) {
                let time = (new Date() - data) / (1000 * 60 * 60 * 24) > 1 ? (new Date() - data) / (1000 * 60 * 60 * 24) : 1
                return time;
            },
            fetchData() {
                inKeepEquips().then(res => {
                    this.fixData(res.content)
                })
            },
            changePage(page) {
                this.paginator.page = page;
            },
            startMain() {
                this.$router.push({path: '/equipmentOperation/startMaintenance'});
            }
        },
        created() {
            this.fetchData()
            this.$nextTick(() => {
                this.$refs.total.refreshLayout()
            })
        },
        components: {
            myHeader,
            textInput,
            defineInput,
            baseButton,
            dateSelect,
            bosTabs,
            entityInput,
        },
    };
</script>

<style lang="scss" scoped>

</style>
