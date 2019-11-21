<template>
    <div class="button_box" :style="havePoint?'cursor: pointer;':'cursor: no-drop;'"  data-test="button" @click="clickButton">
        <svg-icon  :icon-class="iconClass" ></svg-icon>
        <label :class="havePoint?'cursor_point':''" :style="'margin-left:'+marginLeft+'rem'" v-text="buttonName"></label>
    </div>
</template>

<script>
    export default {
        name: "textButton",
        props:{
            iconClass:{
                type:String,
                default:'添加'
            },
            buttonName:{
                type:String,
                default:'这是按钮'
            },

            marginLeft:{
                type:Number,
                default: 0.0417
            },
            havePoint:{
                type:Boolean,
                default:true
            }
        },
        methods:{
            clickButton(){
                this.$emit('click',true)
            }
        }
    }
</script>

<style scoped>
    .button_box{
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .cursor_point{
        cursor: pointer;
    }

</style>