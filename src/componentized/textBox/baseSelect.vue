<template>
    <div class="base-select-container" :class="[styleObj]" :style="'width:'+fixWidth+';float:'+align+';margin:'+margin">
        <div class="slot-label">{{ label }}
            <span class="required" v-if="required">*</span>
        </div>
        <div class="select" @click="clickSel">
            <span class="context" v-if="selectValue">{{ selectValue }}</span>
            <span class="placeholder" v-else>{{ placeholder }}</span>
            <i class="iconfont iconxiala1" :class="{'icon-rotate': showOptions}" v-show="!disabled"></i>
            <div class="options-box" v-show="showOptions">
                <div class="option" v-for="option in selectList" :key="option.value" @click.stop="clickOpt(option)">
                    <span class="label">{{ option.label }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { judgeRules } from "../rules"
    export default {
        name: 'baseSelect',
        data() {
            return {
                selectValue: "", // 内部绑定值/选中值
                showOptions: false, // 是否显示option的值
                styleObj: {
                    error: false
                }
            }
        },
        props: {
            label: { // 标题名
                type: String,
                default: "流程管理"
            },
            value: { // 父组件绑定值/选中值
                type: [String, Object, Array]
            },
            selectList: {
                type: Array,
                default() {
                    return [{label: '默认', value: 'init'}]
                }
            },
            column: {
                type: Number,
                default: 3
            },
            align: {
                type: String,
                default: 'none'
            },
            margin: {
                type: String,
                default: '0 0.0521rem'
            },
            placeholder: {
                type: String,
                default: '请选择'
            },
            disabled: {
                type: Boolean,
                default: false
            },
            required: {
                type: Boolean,
                default: false
            },
            type: {
                type: String,
                default: "String"
            },
            validate: {
                // 验证函数
                type: Function,
                default() {
                    return () => true;
                }
            },
        },
        computed: {
            fixWidth() {
              return `calc(${8.33*this.column}% - 0.1042rem)`;
          }  
        },
        methods: {
            reg() {
                if(judgeRules(this.required, this.type, this.value, this.validate)) {
                    this.styleObj.error=false;
                    return true;
                } 
                this.styleObj.error=true;
                return false;   
            },
            clickSel() {
                if(this.disabled) {
                    this.showOptions = false;
                    return;
                }
                this.showOptions = !this.showOptions;
            },
            clickOpt(data) {
                this.selectValue = data.label;
                this.showOptions = false;
                this.$emit('input', data.value);
            }
        },
        created() {
            for(let k of this.selectList) {
                if(k.value == this.value) {
                    this.selectValue = k.label;
                    break;
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .base-select-container {
        font-size: 16px;
        margin: 0 0.0521rem;
        display: inline-flex;
        box-sizing: border-box;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
        border: 1px solid #E4E7ED;
    }
    .title-name {
        line-height: 40px;
        font-size:16px;
        color:rgba(112,112,112,1);
        margin-left: 6px;
    }
    .slot-label {
        min-width: 55px;
        padding-left: 10px;
        color: #909399;
        overflow: hidden;
        flex-shrink: 0;
    }
    .select {
        width: 80%;
        height: 40px;
        line-height: 40px;
        flex-grow: 1;
        position: relative;
        user-select: none;
        cursor: pointer;
    }
    .context {
        margin-left: 10px;
    }
    .required {
        color: red;
    }
    .placeholder {
        color: #c0c4cc;
        margin-left: 10px;
    }
    .iconxiala1 {
        font-size: 30px;
        color: #c0c4cc;
        float: right;
        transition: 0.5s all;
    }
    .icon-rotate {
        transform: rotateX(180deg);
    }
    .options-box {
        position: absolute;
        width: 100%;
        max-height: 160px;
        overflow-x: hidden;
        overflow-y: scroll;
        text-align: left;
        background-color: #fff;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        z-index: 99999;
        .label {
            margin-left: 10px;
        }
        .option:hover {
            background-color: #f5f7fa;
        }
    }
    .options-box::-webkit-scrollbar {
            width: 6px;
            height: 8px;
        }
    .options-box::-webkit-scrollbar-thumb {
            background:rgba(178,178,204,1);
            border-radius: 20px;
        }
    .error {
        border: 1px solid red;
    }
</style>