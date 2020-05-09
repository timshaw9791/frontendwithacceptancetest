<template>
    <div class="checkbox-group-container" :class="{border}" :style="`width:${fixWidth};float:${align};margin:${margin}`">
        <div class="label">{{ label }}
            <span class="required" v-if="required">*</span>
        </div>
        <div class="checkbox-box">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'checkboxGroup',
    data() {
        return {
           key: 'CHECKBOX_GROUP',
           selectedArr: '',
        }
    },
    props: {
        value: {
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
        select(key, state) {
            if(state) {
                this.selectedArr.add(key);
            } else {
                this.selectedArr.delete(key);
            }
            this.$emit('input', [...this.selectedArr]);
        }
    },
    computed: {
        fixWidth() {
            return this.inTable?`calc(100% - 0.1042rem)`:`calc(${8.33*this.column}% - 0.1042rem)`;
        }
    },
    created() {
        this.selectedArr = new Set(this.value);
    }
}
</script>

<style lang="scss" scoped>
.checkbox-group-container {
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
    .checkbox-box {
        width: 100%;
        height: 100%;
        display: inline-flex;
        justify-content: flex-start;
        align-items: center;
    }
}
</style>