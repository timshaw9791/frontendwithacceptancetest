<template>
    <div>
        <base-button label="读取数据" align="right" :disabled="!select.selected" :width="96"
                     @click="readDate"></base-button>
        <base-select label="硬件选择" v-model="select.selected" align="right"
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
                        label: "手持机",
                        value: 'handheld'
                    }, {
                        label: "读写器",
                        value: "reader"
                    }],
                    selected: ""
                },
            }
        },
        methods: {
            readDate() {
                this.$emit('readDate',this.select.selected)
            }
        }

    }
</script>

<style scoped>

</style>