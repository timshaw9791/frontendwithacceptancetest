<template>
    <div class="text-input-container" :style="'width:'+width+'px;height:'+height+'px'">
        <el-input id="elInput" ref="elInput" placeholder="请输入内容"
                  :disabled="disabled"
                  @input="change"
                  @change="reg"
                  :clearable="clearable"
                  v-model="insideValue">
            <div slot="prepend" :class="{'prefix': true, 'disabled': disabled}">{{ titleName }}</div>
            <span slot="prepend" class="required" v-if="required">*</span>
        </el-input>
    </div>
</template>

<script>
    export default {
        name: 'textInput',
        data() {
          return {
              inputPt: null,
              inputPrePt: null,
              insideValue: "",
          }
        },
        props: {
            titleName: {
                type: String,
                default: "标题"
            },
            value: {
                type: String,
                default: ""
            },
            width: {
                type: Number,
                default: 288
            },
            height: {
                type: Number,
                default: 40
            },
            disabled: {
                type: Boolean,
                default: false
            },
            clearable: { // 是否可清空
                type: Boolean,
                default: true
            },
            maxlength: {
                type: Number,
                default: 0
            },
            minlength: {
                type: Number,
                default: 0
            },
            required: { // 是否必填
                type: Boolean,
                default: false
            },
            validate: { // 验证函数
                type: Function,
                default() {
                    return () => true
                }
            }
        },
        methods: {
            change(value) {
                this.$emit('input', value);
            },
            reg(value) {
                if(!this.validate(value)) {
                    this.inputPt.classList.add('error')
                } else {
                    this.inputPt.classList.remove('error')
                }
            },
            changePreStyle(state=true) {
                this.inputPrePt.style.background = state?'#f5f7fa':'white';
                this.inputPrePt.style.cursor = state?'not-allowed':'auto';
            }
        },
        watch: {
            disabled: {
                handler(val) {
                    this.changePreStyle(val);
                },
            }
        },
        created() {
            this.insideValue = this.value
        },
        mounted() {
            this.inputPt = document.querySelector('.text-input-container');
            this.inputPrePt = document.querySelector('.el-input-group__prepend');
            // console.log(document.getElementsByClassName('el-input-group__prepend'));
            // document.querySelector('#elInput').setAttribute('maxlength', 5); // 限制最大输入长度
            // document.querySelector('#elInput').setAttribute('minlength', 2); // 无效
            // document.querySelector('#elInput').style.borderColor = 'red'; // 更改边框颜色(验证)
            // document.querySelector('#elInput').classList.add('error'); // 用添加样式的方法改变边框颜色
        }
    }
</script>

<style lang="scss" scoped> 
    /deep/ .el-input {
        font-size: 16px;
        .el-input-group__prepend {
            // background-color: white;
            // padding: 9px 0 9px 10px;
            padding: 0;
            border: none;
            line-height: 20px;
        }
        .el-input__inner {
            border: none;
            height: 38px !important;
        }
        /* error类要放在这里，因为el-input为组件，其样式不在该层(scoped封住了) */
        .error {
            border-color: red;
        }
    }
    .text-input-container {
        border: 1px solid #DCDFE6;
        border-radius:4px;
    }
    .text-input-container:hover {
        border-color: #409EFF;
    }
    .required {
        font-size: 16px;
        color: red;
    }
    .error {
        border-color: red;
    }
    .prefix {
        width: auto;
        height: 37px;
        line-height: 37px !important;
        padding-left: 10px;
        background-color: white;
    }
    .prefix:hover {
        border-color: #409EFF;
    }
    .disabled {
        background-color: #f5f7fa !important;
    }
</style>