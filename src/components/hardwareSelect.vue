<template>
    <div>
        <base-button label="读取数据" align="right" :disabled="!select.selected" :width="96"
                     @click="readData"></base-button>
        <base-select label="硬件选择" v-model="select.selected"
                     :selectList="select.handWareList"></base-select>
    </div>
</template>

<script>
    export default {
        name: "hardwareSelect",   // 硬件选择
        data() {
            return {
                select: { // 选择列表
                    handWareList: [{
                        label: '手持机',
                        value: 'handheld'
                    }, {
                        label: '读写器',
                        value: 'reader'
                    }],
                    selected: this.selected
                },
            }
        },
        props:{
            selected:{
                type:String,
                default:''
            }
        },
        methods: {
            readData() {
                // 发布readData事件
                this.$emit('readData',this.select.selected)
                this.$eventBus.$emit('readData',this.select.selected)
            }
        },
    }
</script>

<style scoped>

</style>