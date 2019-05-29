<template>
    <div :style="'height:'+width+'px;'+'width:'+width+'px;'" class="ProgressCircular">
        <el-progress type="circle" :percentage="percentage" :width="width" :stroke-width="strokeWidth"></el-progress>
        <div class="cover" :style="'height:'+(width-strokeWidth*2)+'px;'+'width:'+(width-strokeWidth*2)+'px;'+'border-radius:'+(width-strokeWidth*2)/2+'px;'">
           <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: "progressCircular",
        props:{
            width:{
                type:Number,
                default:188
            },
            strokeWidth:{
                type:Number,
                default:12
            },
            percentage:{
                type:Number,
                default:0
            }
        }
    }
</script>

<style scoped>
    .ProgressCircular{
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }
    .ProgressCircular .cover{
        background: white;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        position: absolute;

    }
</style>