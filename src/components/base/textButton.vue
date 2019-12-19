<template>
    <div class="button_box" :style="havePoint?'cursor: pointer;':'cursor: no-drop;'" :data-test="dataTest"
         @click="clickButton">
        <svg-icon :style="iconSize?`font-size: ${iconSize}px;`:''" :icon-class="iconClass"></svg-icon>
        <span :class="havePoint?'cursor_point':''" :style="'margin-left:'+marginLeft+'rem'" v-text="buttonName"></span>
    </div>
</template>

<script>
    export default {
        name: "textButton",
        data(){
          return{
              color:'red'
          }
        },
        props: {
            iconSize: {
                type: Number,
                default: 16
            },
            iconClass: {
                type: String,
                default: '添加'
            },
            buttonName: {
                type: String,
                default: '这是按钮'
            },

            marginLeft: {
                type: Number,
                default: 0.0417
            },
            dataTest: {
                type: String,
                default: 'button'
            },
            havePoint: {
                type: Boolean,
                default: true
            }
        },
        methods: {
            clickButton() {
                this.$emit('click', true)
            }
        }
    }
</script>

<style scoped>
    .button_box {
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;

    }
    /deep/.cls-1 {
        fill: red;
    }

    /deep/ .cls-2 {
        stroke: red;
        stroke-linecap: round;
        stroke-width: 1.3px;
    }
    .cursor_point {
        cursor: pointer;
    }

</style>