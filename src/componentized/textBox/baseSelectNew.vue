<template>
    <div class="base-select-container">
        <aside class="label" v-if="haveLabel">
            <i :class="`iconfont ${iconfont}`" v-if="iconfont"></i>
            <span v-else>{{ label }}</span>
            <span class="required" v-show="required">*</span>
        </aside>
        <article class="main">
            <input type="text" :placeholder="placeholder" readonly class="input" @click="clkSel">
            <i class="iconfont iconxiala1" :class="{'icon-rotate': showOptions}" @click="clkSel"></i>
            <div class="select-option">
                <ul class="select-ul">
                    <li v-for="(item, i) in list" :key="item.abc+''+i" class="select-li">{{ item.value }}</li>
                </ul>
            </div>
        </article>
        <!-- <input type="text" :placeholder="placeholder" readonly class="input" @click="clkSel">
        <i class="iconfont iconxiala1" :class="{'icon-rotate': showOptions}" @click="clkSel"></i>
        <div class="select-option">
            <ul>
                <li>test1</li>
                <li>test2</li>
                <li>test3</li>
            </ul>
        </div> -->
    </div>
</template>

<script>
export default {
    name: 'baseSelect',
    props: {
        label: {
            type: String,
            default: '标签'
        },
        iconfont: {
            type: String,
            default: ''
        },
        haveLabel: {
            type: Boolean,
            default: true
        },
        list: { // 选项数据
            type: Array,
            default() {
                return []
            }
        },
        required: { // 是否必须
            type: Boolean,
            default: false
        },
        placeholder: {
            default: '请选择'
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            showOptions: false
        }
    },
    methods: {
        clkSel() {
            if(this.disabled) {
                this.showOptions = false
                return
            }
            this.showOptions = !this.showOptions
        }
    }
}
</script>

<style scoped>
    .base-select-container {
        position: relative;
        box-sizing: border-box;
        width: 130px;
        font-size: 16px;
        height: 40px;
        max-height: 40px;
        display: inline-flex;
        justify-content: flex-start;
        align-items: center;
        border-radius: 4px;
        border: 1px solid black;
    }
    .label {
        min-width: 30px;
        padding: 0 10px 0 5px;
        color: #909399;
        overflow: hidden;
        flex-shrink: 0;
        display: inline-block;
        text-align: center;
        user-select: none;
    }
    .main {
        position: relative;
        width: 100%;
        height: 100%;
        display: inline-flex;
        justify-content: flex-start;
        align-items: center;
    }
    input::-webkit-input-placeholder {
        color: #c0c4cc;
    }
    .input {
        box-sizing: border-box;
        border: none;
        outline-style: none;
        width: 100%;
        height: 100%;
        cursor: pointer;
        background-color: orange;
    }
    .select-option {
        position: absolute;
        min-width: 100%;
        height: 170px;
        max-height: 170px;
        overflow: hidden auto;
        left: 0;
        top: 40px;
        border: 1px solid #e4e7ed;
        border-radius: 4px;
        background-color: #fff;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        box-sizing: border-box;
    }
    .select-ul {
        margin: 0;
        padding: 6px 0;
        list-style-type: none;
    }
    .select-li {
        height: 34px;
        line-height: 34px;
        padding: 0 10px;
        white-space: nowrap;
        cursor: pointer;
    }
    .select-li:hover {
        background-color: #f5f7fa;
    }
    .required {
        color: red;
    }
    .iconxiala1 {
        font-size: 16px;
        color: #d7d2df;
        transition: 0.5s all;
    }
    .icon-rotate {
        transform: rotate(-180deg);
    }
    .select-option::-webkit-scrollbar {
        width: 6px;
        height: 8px;
    }
    .select-option::-webkit-scrollbar-thumb {
        background: rgba(221, 222, 224, 1);
        border-radius: 20px;
    }
</style>