<template>
    <div class="base-select-container" :class="[styleObj]" @mouseleave="showOptions=false"
        :style="`width:${fixWidth};float:${align};margin:${margin}`" >
        <aside class="label" v-if="haveLabel">
            <i :class="`iconfont ${iconfont}`" v-if="iconfont"></i>
            <span v-else>{{ label }}</span>
            <span class="required" v-show="required">*</span>
        </aside>
        <article class="main">
            <input type="text" v-model="insideValue" :placeholder="placeholder" readonly class="input" @click="clkSel">
            <i class="iconfont iconxiala1" :class="{'icon-rotate': showOptions}" @click="clkSel"></i>
            <div class="select-option" :class="{'show-options': showOptions}">
                <ul class="select-ul">
                    <li v-for="(item, i) in insideList" :key="item.key+''+i" class="select-li"
                        :class="{selected:item.insideSel||!multiple&&value===item.key}" @click="selOption(item, i)">
                        {{ item.value }}
                        <i class="iconfont icongou" v-show="item.insideSel"></i>
                    </li>
                </ul>
            </div>
        </article>
    </div>
</template>

<script>
export default {
    name: 'baseSelect',
    props: {
        value: { // v-model
            default: ''
        },
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
        },
        multiple: {
            type: Boolean,
            default: false
        },
        column: {
            type: Number,
            default: 3
        },
        align: {
            default: 'none'
        },
        margin: {
            default: '0 0.0521rem'
        }
    },
    data() {
        return {
            showOptions: false, // 是否显示下拉项
            insideValue: '', // 内部绑定值
            insideList: [], // 内部选项列表
            styleObj: { // 样式
                error: false
            },
        }
    },
    computed: {
        fixWidth() {
            return `${8.33*this.column}%`
        }
    },
    methods: {
        listInit() { // 初始化选项数据
            let tmpList = JSON.parse(JSON.stringify(this.list));
            this.insideValue = ""
            this.insideList = this.multiple?tmpList.map(item => Object.assign(item, {insideSel: this.value.includes(item.key)})):tmpList
            this.init(this.value)
        },
        init(val) { // 初始化组件状态
            let tmp;
            if(this.multiple) { // 如果是多选
                if(!(val instanceof Array)) {
                    console.error("v-model绑定值须为数组");
                    return
                }
                tmp = this.list.filter(item => val.includes(item.key)).map(item => item.value).join(';')
                this.insideValue = tmp?tmp:''
            } else {
                tmp = this.list.filter(item => item.key == val);
                this.insideValue = tmp[0]?tmp[0].value:''
            }
        },
        clkSel() { // 是否显示下拉选项框
            this.showOptions = this.disabled?false:!this.showOptions
        },
        selOption(data, index) { // 选中选项后
            if(this.multiple) { // 如果是多选
                data.insideSel = !data.insideSel
                let selTmp = this.insideList.filter(item=>item.insideSel).map(item=>item.key)
                this.$emit('input', selTmp)
                this.$emit('selected', selTmp)
            } else { // 单选
                this.$emit('input', data.key)
                this.$emit('selected', data)
                this.showOptions = false
            }
        },
        reg() { // 验证函数
            return Boolean(!this.required || this.value.length)
        }
    },
    watch: {
        value: {
            handler(val) {
                this.init(val)
            },
            deep: true
        },
        list: {
            handler() {
                this.listInit()
            },
            deep: true,
            immediate: true
        }
    }
}
</script>

<style scoped>
    .base-select-container {
        position: relative;
        box-sizing: border-box;
        /* 130px */
        width: 300px;
        font-size: 16px;
        height: 40px;
        max-height: 40px;
        display: inline-flex;
        justify-content: flex-start;
        align-items: center;
        border-radius: 4px;
        border: 1px solid #E4E7Ed;
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
        /*height: 100%;*/
        cursor: pointer;
    }
    .select-option {
        position: absolute;
        min-width: 100%;
        /*height: 0;*/
        min-height: 0px;
        max-height: 0px;
        overflow: hidden auto;
        left: 0;
        top: 100%;
        /* border: 1px solid #e4e7ed; */
        border-radius: 4px;
        background-color: #fff;
        box-sizing: border-box;
        transition: 0.3s all;
        z-index: 2020;
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
    .selected {
        color: #409eff;
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
    .show-options {
        min-height: 36px;
        /*height: 36px;*/
        max-height: 170px;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    }
    .select-option::-webkit-scrollbar {
        width: 6px;
        height: 8px;
    }
    .select-option::-webkit-scrollbar-thumb {
        background: rgba(221, 222, 224, 1);
        border-radius: 20px;
    }
    .icongou {
        position: absolute;
        right: 6px;
        color: #409eff;
    }
    .error {
        border: 1px solid red;
    }
</style>