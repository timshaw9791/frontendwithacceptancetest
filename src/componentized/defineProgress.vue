<template>
    <div class="define-progress-container">
        <el-progress :type="type" :percentage="percentage" :color="colors"
            :stroke-width="height" :text-inside="textInside" :status="status"
            :width="width" :show-text="showText"></el-progress>
    </div>
</template>

<script>
export default {
    name: 'defineProgress',
    props: {
        type: {
            type: String,
            default: 'line'
        },
        percentage: {
            type: Number,
            default: 0
        },
        colors: {
            type: Array,
            default() {
                return [
                    {color: '#f56c6c', percentage: 40},
                    {color: '#e6a23c', percentage: 60},
                    {color: '#1989fa', percentage: 80},
                    {color: '#5cb87a', percentage: 100}
                 ]
            }
        },
        width: {
            type: Number,
            default: 126
        },
        height: {
            type: Number,
            default: 16
        },
        textInside: {
            type: Boolean,
            default: false
        },
        showText: {
            type: Boolean,
            default: true
        },
        status: {
            type: String,
            default: 'success'
        },

    }
}
</script>

<style scoped>

</style>