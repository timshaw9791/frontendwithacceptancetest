<template>
    <div class="tool-bar-container">
        <slot name="input"></slot>
        <div class="button-box">
            <slot name="button"></slot>
            <base-button label="返回" type="text" @click="back" v-show="showBack"></base-button>
        </div>
        <div class="dropdown-container" @mouseleave="showMenu=false" v-show="showMoreButtonBox">
            <span class="label" @click="showMenu=!showMenu">更多</span>
            <div class="menu" v-show="showMenu">
                <slot name="morebutton"></slot>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "toolBar",
        data() {
            return {
                showMenu: false,
                showMoreButtonBox: false
            }
        },
        props: {
            showBack: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            back() {
                this.$router.back()
            }
        },
        mounted() {
            this.showMoreButtonBox = Object.keys(this.$slots).some(slotName=>slotName==='morebutton')
        }
    }
</script>

<style scoped>
    .tool-bar-container {
        width: 40%;
        min-width: 620px;
        height: 59px;
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding-right: 5px;
    }
    .button-box {
        text-align: right;
        white-space: nowrap;
        overflow: hidden;
        flex-grow: 1;
    }
    .dropdown-container {
        display: inline-block;
        width: 50px;
        position: relative;
        text-align: center;
    }
    .label {
        cursor: pointer;
    }
    .menu {
        z-index: 9999999999;
        position: absolute;
        line-height: initial;
        width: 100px;
        min-height: 100px;
        background-color: white;
        border: 1px solid #ebeef5;
        box-shadow:1px 3px 8px rgba(0,0,0,0.1);
        top: 20px;
        left: -60px;
    }
    .menu::before {
        content: '';
        position: absolute;
        bottom: 100%;
        right: 10%;
        width: 0;
        height: 0;
        border-width:5px;
        border-style:solid;
        border-color: transparent;
        border-bottom-width: 8px;
        border-bottom-color: currentColor;
        color: #FFFFFF;
    }
</style>