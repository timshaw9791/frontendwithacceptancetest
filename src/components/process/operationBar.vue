<template>
    <div class="operator">
        <div>
            <base-button v-if="taskDefinitionKey.includes('outbound')||isShowOut"
                         :label="isShowOut?'查看出库单':'出库'" @click="outbound"></base-button>
            <base-button v-if="taskDefinitionKey.includes('inbound')||isShowIn"
                         :label="isShowIn?'查看入库单':'入库'" @click="inbound"></base-button>
        </div>
        <div v-if="taskDefinitionKey.includes('audit')">
            <base-button label="驳回" @click="refused"></base-button>
            <base-button label="审核" @click="agree"></base-button>
        </div>
        <div v-if="taskDefinitionKey.includes('reapply')">
            <base-button label="重填" @click="edit"></base-button>
            <base-button label="作废" @click="invalid"></base-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "operationBar",
        props: {
            taskDefinitionKey: {
                type: String,
                default: 'apply'
            },
            orderId: {
                type: String,
                default: ''
            },
            isShowIn: {
                type: Boolean,
                default: false
            },
            isShowOut: {
                type: Boolean,
                default: false
            },
        },
        methods: {
            outbound() {
                this.$emit('outbound')
            },
            inbound() {
                this.$emit('inbound')
            },
            refused() {
                this.$emit('refused')
            },
            agree() {
                this.$emit('agree')
            },
            edit() {
                this.$emit('edit')
            },
            invalid() {
                this.$emit('invalid')
            }
        },
    }
</script>

<style scoped>
    .receipt {
        float: right;
    }
</style>