<template>
    <div class="receiveOrderList-body">
        <div class="receiveOrderList-info">
            <text-input label="装备名称" placeholder="请输入装备名称"></text-input>
            <base-button label="查询"></base-button>
        </div>
        <define-table :data="receiveOrderList" >
            <define-column label="操作" v-slot="{data}">
                <span @click="showFun('info',data.row)">详情</span>
            </define-column>
            <define-column label="装备名称" field="name"></define-column>
            <define-column label="装备型号" field="model"></define-column>
            <define-column label="供应商" field="supplier.name"></define-column>
            <define-column label="质保期" field="shelfLife"></define-column>
            <define-column label="充电周期" field="chargeCycle"></define-column>
            <define-column label="保养周期" field="upkeepCycle"></define-column>
        </define-table>
    </div>
</template>

<script>
    import myHeader from "../../../components/base/header/header";
    import receiveOrderInfo from "./receiveOrderInfo";
    import receiveOrderList from "./receiveOrderList";

    export default {
        name: "RROrderList",
        components: {receiveOrderInfo, receiveOrderList, myHeader,},
        data() {
            return {
                title: "装备领取记录列表",
                receiveOrderList:[]
            }
        },
        methods:{
            showFun(operation, data) {
                this.$emit('showFun', {
                    operation: operation, data: data
                })
            }
        }
    }
</script>

<style scoped>

</style>