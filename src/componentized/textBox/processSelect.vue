<template>
    <div class="process-select-container" :style="'width:'+width+'px'">
        <el-select v-model="selectValue" placeholder="请选择" id="select" :multiple="multiple" collapse-tags @change="change">
            <el-option
                v-for="(item, i) in selectList"
                :key="item.value+i"
                :label="item.label"
                :value="item.value">
<!--                <span><el-checkbox v-model="item.sel">{{ item.label }}</el-checkbox></span>-->
            </el-option>
            <div class="title-name" slot="prefix">{{ label }}</div>
        </el-select>
    </div>
</template>

<script>
    export default {
        name: 'processSelect',
        data() {
            return {
                selectValue: "", // 内部绑定值/选中值
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
            width: {
                type: Number,
                default: 280
            },
            multiple: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            init() {
                let sel = document.querySelector('#select');
                sel.style.paddingLeft = this.label.length?30+this.label.length*15 + 'px':"15px";
            },
            change(value) {
                this.$emit('input', value)
            }
        },
        mounted() {
            this.init()
        }
    }
</script>

<style lang="scss" scoped>
    .process-select-container {
        width: 200px;
    }
    .title-name {
        line-height: 40px;
        font-size:16px;
        color:rgba(112,112,112,1);
        margin-left: 6px;
    }
</style>