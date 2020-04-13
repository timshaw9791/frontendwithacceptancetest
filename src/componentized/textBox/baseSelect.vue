<template>
    <div class="base-select-container" :style="'width:'+fixWidth+';float:'+align">
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
        name: 'baseSelect',
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
            column: {
                type: Number,
                default: 3
            },
            multiple: {
                type: Boolean,
                default: false
            },
            align: {
                type: String,
                default: 'none'
            }
        },
        computed: {
            fixWidth() {
              return `calc(${8.33*this.column}% - 0.1042rem)`;
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
    .base-select-container {
        margin: 0 0.0521rem;
        display: inline-block;
		box-sizing: border-box;
    }
    .title-name {
        line-height: 40px;
        font-size:16px;
        color:rgba(112,112,112,1);
        margin-left: 6px;
    }
</style>