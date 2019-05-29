<template>
    <div class="progress-box">
       <div class="progress-name">
           <span v-text="category" style="right: 0px;position: absolute"></span>
       </div>
       <div :id="category+from"><el-progress :percentage="percentage" :style="'width: 256px;margin-left:'+marginLeft+'px'" :stroke-width="Number(5)"></el-progress></div>
        <span v-text="'（'+number+'件)'" style="margin-left: -15px"></span>
    </div>
</template>

<script>
    export default {
        name: "equipProgress",
        props: {
            percentage: {
                type: Number,
                default: 100
            },
            category: {
                type: String,
                default: '此乃类别'
            },
            number:{
                type:Number,
                default:890
            },
            marginLeft:{
                type:Number,
                default:11
            },
            from:{
                type:String,
                default:'Origin'
            }
        },
        mounted(){
            let mouse = document.getElementById(this.category+this.from);
            mouse.onmouseover = function(){
                console.log('onmouseover')
            };
            mouse.onmouseout = function(){
               console.log('onmouseout')
            }
        },
        methods:{
            mOver(){
                console.log('mOver');
            },
            mOut(){
                console.log('mOut');
            }
        }
    }
</script>

<style scoped>
    .progress-box {
        display: flex;
        font-size: 14px;
        color: #4D4F5C;
    }
    .progress-box .progress-name{
        width: 70px;
        position:relative;
    }
</style>