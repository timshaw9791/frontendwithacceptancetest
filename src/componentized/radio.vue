<template>
    <div class="radio-container" :class="{border}" :style="`width:${fixWidth};float:${align};margin:${margin}`">
        <div class="label">{{ label }}
            <span class="required" v-if="required">*</span>
        </div>
        <div class="radio-box">
            <div class="radio" :class="[disabled?'disabled':'edit',{selected:selectIndex==i&&!disabled}]" v-for="(item, i) in data" :key="item.key">
                <div class="select-box" @click="select(i, item)">
                    <div class="tick" v-show="selectIndex==i"></div>
                </div>
                <span class="radio-label">{{ item.label }}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'radio',
    data() {
        return {
            selectIndex: 0,
            selectItem: '', // 用以通过实例访问选择项数据
        }
    },
    props: {
        value: {},
        data: {
            type: Array,
            default() {
                return []
            }
        },
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
        }
    },
    methods: {
        select(index, item) {
            if(this.disabled) return;
            this.selectIndex = index;
            this.selectItem = item;
            this.$emit('change', item);
            this.$emit('input', item.key);
        }
    },
    computed: {
        fixWidth() {
            return this.inTable?`calc(100% - 0.1042rem)`:`calc(${8.33*this.column}% - 0.1042rem)`;
        }
    },
    watch: {
        value: {
            handler(newVal, oldVal) {
                this.selectIndex = this.data.findIndex(item => item.key == newVal);
            },
            immediate: true
        }
    }
}
</script>

<style lang="scss" scoped>
.radio-container {
    display: inline-flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 16px;
    min-width: 180px;
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
        padding: 0 10px;
        color: #909399;
        overflow: hidden;
        flex-shrink: 0;
    }
    .required {
        color: red;
    }
    .radio-box {
        display: inline-flex;
        width: 100%;
        height: 100%;
        justify-content: flex-start;
        align-items: center;
        padding: 0 5px;
    }
    .radio {
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
    .radio-label {
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