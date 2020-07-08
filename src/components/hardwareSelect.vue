<template>
    <div>
        <base-button label="读取数据" align="right" :disabled="!select.selected" :width="96"
                     @click="readData"></base-button>
        <base-select label="硬件选择" v-model="select.selected"
                     :list="$store.getters.enums.device"></base-select>
    </div>
</template>

<script>
    export default {
        /*
         新写的代码,可以不使用该组件 2020.07.08
         部分硬件选择没有使用该组件
         */
        name: "hardwareSelect",   // 硬件选择
        data() {
            return {
                select: { // 选择列表
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