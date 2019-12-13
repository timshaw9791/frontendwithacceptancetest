<template>
    <div class="surroundingDialog" v-if="hidden">
        <div @click.stop @touchmove.prevent class="surroundingDialog-confirm" @click="close"></div>
        <div class="zn-center" :style="'width'+':'+width+'px'">
            <div class="surroundingDialog-header" >
                <span v-text="title"></span>
                <div @click="close" class="svg">
                    <svg-icon icon-class="弹窗关闭" style="cursor: pointer;"></svg-icon>
                </div>
            </div>
            <div class="surroundingDialog-content">
                <slot></slot>
            </div>
        </div>
    </div>

</template>
<script>
    export default {
        name:'surroundingDialog',
        data(){
            return {
                hidden:false
            }
        },
        props:{
          width:{
              type:Number,
              default:300,
          },
          title:{
              type:String,
              default:'标题'
          }
        },
        created(){

        },
        methods: {
            camera(){
                this.$emit('Status','camera');
            },
            photo(){
                this.$emit('Status','photo');
            },
            cancels(){
                this.$emit('Status','cancel');
            },
            close(){
                this.hidden=false;
            },
            show(){
                this.hidden=true;
            }
        }
    }
</script>

<style scoped>
    .surroundingDialog{
       width: 100%;
    }
    .surroundingDialog-confirm{
        z-index: 10;
        top: 0;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .zn-center .surroundingDialog-header{
        
        width:100%;
        height:57px;
        background:rgba(47,47,118,1);
        opacity:1;
        display: flex;
        align-items: center;
        justify-content: center;
        color:white;
        font-size: 18px;
    }
    .surroundingDialog-header .svg{
        position: absolute;
        right: 16px;
    }
    .zn-center .surroundingDialog-content{
        width: 100%;
        background:rgba(255,255,255,1);
        box-shadow:0px 3px 6px rgba(0,0,0,0.16);
        opacity:1;
    }
    .zn-center{
        z-index: 11;
        position: absolute;
        top:50%;
        left: 50%;
        transform:translate(-50%,-50%)!important;
    }
</style>
