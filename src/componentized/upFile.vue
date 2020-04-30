<template>
    <div class="upfile-container" :style="'width:'+width+'px'">
        <div class="main-body" ref="mainBody" @click="triggle">
            <img class="img" :src="img" alt="图片错误">
            <div :class="{'name': true, 'band': disabled}">{{ label }}</div>
        </div>
        <div class="attach-body">
            <div class="attach-box" :style="'min-width:'+width+'px;'" v-show="showAttach&&!disabled">
                <div class="selected-box" v-show="showAttach">
                    <div v-for="(item, i) in selectedArr" :key="i" @click="delItem(i)" class="selItem">{{ item }}</div>
                </div>
                <div class="info-box" :style="'width:'+infoWidth" @click="upFile" v-show="showAttach&&!disabled&&!readOnly">
                    <div class="info">{{ attachLabel }}</div>
                </div>
            </div>
            <input type="file" class="file-input" ref="fileInput" @change="selected" :multiple="multiple">
        </div>
    </div>
</template>

<script>
    export default {
        name: 'upFile',
        data() {
            return {
                img: require('../assets/附件.png'),
                showAttach: false,
                infoWidth: 0,
                selectedArr: []
            }
        },
        props: {
            width: {
                type: Number,
                default: 160
            },
            label: {
                type: String,
                default: "附件"
            },
            disabled: { // 组件功能禁用
                type: Boolean,
                default: false
            },
            readOnly: { // 只读
                type: Boolean,
                default: false
            },
            attachLabel: {
                type: String,
                default: "上传附件"
            },
            value: { // 只读状态下的列表
                type: Array,
                default: () => []
            },
            multiple: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            init() {
                this.infoWidth = this.width/2 +'px';
                if(this.disabled) {
                    this.$refs.mainBody.style.cursor = 'not-allowed';
                }
                if(this.readOnly) {
                    this.selectedArr = [...this.list];
                }
            },
            triggle() {
                this.showAttach = !this.showAttach;
            },
            upFile() {
                if(!this.disabled || !this.readOnly) {
                    this.$refs.fileInput.click();
                }
            },
            selected() {
                // 这里加入接口
                for(let obj of this.$refs.fileInput.files) {
                    this.selectedArr.push(obj.name);
                }
                this.selectedArr = Array.from(new Set(this.selectedArr));
                this.$emit('input', this.selectedArr);
            },
            delItem(index){
                if(this.disabled || this.readOnly) return
                this.selectedArr.splice(index, 1);
                this.$emit('input', this.selectedArr);
            }
        },
        watch: {
            disabled(now) {
                if(now) {
                    this.$refs.mainBody.style.cursor = 'not-allowed';
                }
            },
            readOnly(now) {
                if(now) {
                    this.selectedArr = [...this.list];
                }
            }
        },
        mounted() {
            this.init();
        }
    }
</script>

<style>
    .upfile-container {
        font-size: 16px;
        height: 40px;
        line-height: 40px;
        position: relative;
        user-select: none;
    }
    .main-body {
        width: 100%;
        text-align: center;
        cursor: pointer;
    }
    .main-body .img {
        display: inline;
        vertical-align: middle;
    }
    .main-body .name {
        display: inline;
        vertical-align: middle;
        color: rgba(47, 47, 118, 1);
        font-size: 22px;
    }
    .selected-box {
        max-height: 130px;
        overflow-y: auto;
        margin-top: 10px;
    }
    .selected-box::-webkit-scrollbar-track-piece {
        background: #d3dce6;
    }
    .selected-box::-webkit-scrollbar {
         width: 6px;
    }
    .selected-box::-webkit-scrollbar-thumb {
         background: #99a9bf;
         border-radius: 20px;
    }
    .attach-body {
        position: absolute;
        line-height: normal;
        cursor: pointer;
    }
    .attach-box {
        text-align: center;
        position: relative;
        margin-top: 16px;
        max-height: 180px;
        min-height: 20px;
        padding-bottom: 10px;
        box-shadow:0px 0px 8px rgba(235,238,245,1);
    }
    .attach-box:before {
        content: '';
        position: absolute;
        bottom: 100%;
        left: 40%;
        width: 0;
        height: 0;
        border-width:8px;
        border-style:solid;
        border-color: transparent;
        border-bottom-width: 16px;
        border-bottom-color: currentColor;
        color: #FFFFFF;
    }
    .info-box {
        display: inline-block;
        text-align: center;
        height: 40px;
        background-color: #2F2F76;
        margin-top: 10px;
        border-radius: 4px;
    }
    .info {
        font-size: 16px;
        color: #ffffff;
        line-height: 40px;
    }
    .file-input {
        position: absolute;
        width: 0;
        height: 0;
        top: 0;
        left: 0;
    }
    .selItem:hover {
        color: red;
    }
    .band {
        color: #c0c4cc !important;
    }
</style>