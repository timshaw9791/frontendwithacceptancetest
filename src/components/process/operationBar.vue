<template>
    <div class="operator">
        <div v-if="taskDefinitionKey.includes('outbound')">
            <base-button label="出库" @click="outbound"></base-button>
        </div>
        <div v-if="taskDefinitionKey.includes('inbound')">
            <base-button label="入库" @click="inbound"></base-button>
        </div>
        <div v-if="taskDefinitionKey.includes('apply')">
            <base-button label="驳回" @click="refused"></base-button>
            <base-button label="审核" @click="agree"></base-button>
        </div>
        <div v-if="taskDefinitionKey.includes('reApply')">
            <base-button label="重填" @click="edit"></base-button>
            <base-button label="作废" @click="invalid"></base-button>
        </div>
        <div v-if="isShowIn||isShowOut">
            <base-button label="查看入库单" @click="showInOrder" v-if="isShowIn"></base-button>
            <base-button label="查看出库单" @click="showOutOrder" v-if="isShowOut"></base-button>
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
                type:Boolean,
                default:false
            },
            isShowOut: {
                type:Boolean,
                default:false
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
            showOutOrder() {
                this.$emit('showOutOrder')
            },
            showInOrder() {
                this.$emit('showInOrder')
            },
            edit() {
                this.$emit('edit')
            },
            invalid() {
                this.$emit('invalid')
            }
        },
        created(){
            console.log("我是组件")
            console.log(this.isShowOut)
        }
    }
</script>

<style scoped>
    .receipt {
        float: right;
    }
</style>