<template>
    <div class="progress-box">
       <div class="progress-name">
           <span v-text="name" style="right: 0px;position: absolute"></span>
       </div>
       <el-tooltip  placement="bottom" popper-class="progress-box-mouse-card-text" :visible-arrow="false">
           <div slot="content" class="mouseCard">
              <slot></slot>
           </div>
           <el-progress :percentage="percentage" :style="'width:'+width+'px;margin-left:'+marginLeft+'px'" color="#3B86FF" :stroke-width="Number(5)" v-if="status"></el-progress>
           <el-progress :percentage="percentage" :style="'width:'+width+'px;margin-left:'+marginLeft+'px'" color="#3B86FF" :stroke-width="Number(5)" status="text" v-if="!status">{{this.number}}次</el-progress>
       </el-tooltip>
        <span v-text="'（'+number+'件)'" style="margin-left: -15px" v-if="status"></span>
    </div>
</template>

<script>
    export default {
        name: "equipProgress",
        data(){
          return{
              flag:false,
          }
        },
        props: {
            percentage: {
                type: Number,
                default: 100
            },
            name: {
                type: String,
                default: '此乃类别'
            },
            number:{
                type:Number,
                default:890
            },
            width:{
              type:Number,
               default:256
            },
            marginLeft:{
                type:Number,
                default:11
            },
            from:{
                type:String,
                default:'Origin'
            },
            status:{
                type:Boolean
            }
        },
        mounted(){
           /* let mouse = document.getElementById(this.category+this.from);
            let that = this;
            mouse.onmouseover = function(e){
                let div = document.getElementById(that.category+that.from+'label');
            };
            mouse.onmouseout = function(e){

            }*/
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

<style >
    .progress-box-mouse-card-text{
        background: #1ab394 !important;
        width:191px !important;
        height:101px !important;
        background:rgba(255,255,255,1)!important;
        box-shadow:0px 3px 6px rgba(0,0,0,0.16)!important;
        opacity:1!important;
        font-size: 16px!important;
        color: #4D4F5C!important;
    }
    .progress-box {
        display: flex;
        font-size: 14px;
        color: #4D4F5C;
    }
    .progress-box .progress-name{
        width: 70px;
        position:relative;
    }
    .mouseCard{
        display: flex!important;
        align-items: center!important;
        justify-content: center!important;
        flex-direction: column!important;
        font-size: 16px!important;
        color: #4D4F5C!important;
    }

</style>