<template>
    <tool-bar>
        <!--出库或者入库显示-->
            <base-button v-if="taskDefinitionKey.includes('outbound')||isShowOut"
                         :label="isShowOut?'查看出库单':'出库'" @click="outbound"
                         slot="button" type="text"></base-button>
            <base-button v-if="taskDefinitionKey.includes('inbound')||isShowIn"
                         :label="isShowIn?'查看入库单':'入库'" @click="inbound"
                         slot="button" type="text"></base-button>
        <!--审核的时候显示-->
            <base-button v-if="taskDefinitionKey.includes('audit')"
                         label="驳回" @click="refused"
                         slot="button" type="text"></base-button>
            <base-button v-if="taskDefinitionKey.includes('audit')"
                         label="审核" @click="agree"
                         slot="button" type="text"></base-button>
        <!--只有重填的时候会显示-->
            <base-button v-if="taskDefinitionKey.includes('reapply')"
                         label="重填" @click="edit"  slot="button" type="text"></base-button>
            <base-button v-if="taskDefinitionKey.includes('reapply')"
                         label="作废" @click="invalid"  slot="button" type="text"></base-button>
    </tool-bar>
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