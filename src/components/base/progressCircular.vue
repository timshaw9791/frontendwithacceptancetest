<template>
    <div :style="'height:'+width/basePx+'rem;'+'width:'+width/basePx+'rem;'" class="ProgressCircular">
        <el-progress type="circle" :percentage="percentage" :width="width/192*basePx" :stroke-width="strokeWidth/192*basePx" :color="color"></el-progress>
        <div class="cover" style="height:auto; width: auto; border-radius: 50%">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: "progressCircular",
        data() {
            return {
                basePx: localStorage.getItem('fontSize')
            }
        },
        props: {
            width: {
                type: Number,
                default: 188
            },
            strokeWidth: {
                type: Number,
                default: 12
            },
            percentage: {
                type: Number,
                default: 0
            },
            color:{
                type:String,
            }
        }
    }
</script>

<style scoped>
    .ProgressCircular {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    .ProgressCircular .cover {
        background: white;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        position: absolute;

    }
</style>