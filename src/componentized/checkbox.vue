<template>
    <div class="checkbox-container" :class="{border}" :style="`width:${fixWidth};float:${align};margin:${margin}`">
        <div class="label" v-if="!isCheckboxGroup">{{ label }}
            <span class="required" v-if="required">*</span>
        </div>
        <div class="checkbox-box">
            <div class="checkbox" :class="[disabled?'disabled':'edit',{selected:value&&!disabled}]">
                <div class="select-box" @click="select">
                    <div class="tick" v-show="value"></div>
                </div>
                <span class="checkbox-label"><slot></slot></span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'checkbox',
    data() {
        return {
            isCheckboxGroup: false, // 判断是否为复选框组
            itemLabel: '', // 选项名
            insideSel: false, // 内部选择，用以多选组控制
        }
    },
    props: {
        value: {},
        label: {
            type: String
        },
        required: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
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
        border: {
            type: Boolean,
            default: false
        },
        autoWidth: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        select() {
            if(this.disabled) return;
            if(this.isCheckboxGroup) {
                this.$parent.select(this.itemLabel, !Boolean(this.value))
            }
            this.$emit('input', !Boolean(this.value));
            this.$emit('change', !Boolean(this.value));
        }
    },
    computed: {
        fixWidth() {
            return this.isCheckboxGroup?0:this.autoWidth?'auto':`calc(${8.33*this.column}% - 0.1042rem)`;
        },
        isSelect() {
            return this.insideSel || this.value;
        }
    },
    mounted() {
        try {
            this.itemLabel = this.$slots.default[0].text;
            if(this.$parent.key == 'CHECKBOX_GROUP') {
                this.isCheckboxGroup = true;
            }
        } catch (error) {
            
        }
    }
}
</script>

<style lang="scss" scoped>
.checkbox-container {
    display: inline-flex;
    justify-content: flex-start;
    flex-grow: 1;
    align-items: center;
    font-size: 16px;
    // min-width: 180px;
    height: 40px;
    max-height: 40px;
    border-radius: 4px;
    box-sizing: border-box;
    margin: 0 0.0521rem;
    .border {
        border: 1px solid #DCDFE6;
    }
    .label {
        min-width: 55px;
        padding: 0 0 0 10px;
        color: #909399;
        overflow: hidden;
        flex-shrink: 0;
    }
    .required {
        color: red;
    }
    .checkbox-box {
        display: inline-flex;
        width: 100%;
        height: 100%;
        justify-content: flex-start;
        align-items: center;
        // padding: 0 5px;
    }
    .checkbox {
        margin: 0 5px;
    }
    .select-box {
        display: inline-block;
        width: 18px;
        height: 18px;
        vertical-align: middle;
        border-radius: 2px;
        margin: 0 3px;
        cursor: pointer;
    }
    .checkbox-label {
        vertical-align: middle;
    }
    .tick {
        width: 40%;
        height: 70%;
        margin: 0 auto;
        transform: rotate(40deg);
    }
    .edit {
        .select-box {
            border: 2px solid #DCDFE6;
        }
        .tick {
            border-right: 1px solid white;
            border-bottom: 1px solid white;
        }
    }
    .disabled {
        color: #c0c4cc;
        .select-box {
            border: 2px solid #DCDFE6;
        }
        .tick {
            border-right: 1px solid #c0c4cc;
            border-bottom: 1px solid #c0c4cc;
        }
    }
    .selected {
        .select-box {
            border: 2px solid #409eff;
            background-color: #409eff;
        }
    }
}
</style>