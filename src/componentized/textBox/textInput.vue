<template>
    <div :class="{'text-input-container':true, 'bg-disabled':disabled,'border':tableEdit&&eidt}" ref="textInput" 
        :style="'width:'+fixWidth+';height:'+height+'px'"
        @mouseover="changeEditState(true)"
        @mouseout="changeEditState(false)">
        <el-input :placeholder="placeholder"
                  :disabled="disabled"
                  @change="reg"
                  @keydown.native.13="changeEditState(false)"
                  v-if="!haveTip"
                  :clearable="clearable"
                  :readonly="!(tableEdit&&eidt)"
                  v-model="insideValue">
            <div slot="prepend" :class="{'prefix': true, 'disabled': disabled}" v-if="!inTable">
                {{ label }}
                <span class="required" v-if="required">*</span>
            </div>
        </el-input>
        <el-autocomplete class="inline-input"
        v-model="insideValue"
        :fetch-suggestions="querySearch"
        v-if="haveTip"
        :disabled="disabled"
        :placeholder="placeholder">
        <div slot="prepend" :class="{'prefix': true, 'disabled': disabled}">{{ label }}</div>
        </el-autocomplete>
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
              inTable: false, // 是否为表格内联
              // 此处逻辑 !(tableEdit && eidt)
              eidt: true, // 内部判断是否只读
          }
        },
        props: {
            label: {
                type: String,
                default: "标题"
            },
            value: {
                type: [String, Number],
                default: ""
            },
            column: {
                type: Number,
                default: 5
            },
            height: {
                type: Number,
                default: 40
            },
            disabled: {
                type: Boolean,
                default: false
            },
            type: {
                type: String,
                default: "String"
            },
            tableEdit: {
                type: Boolean,
                default: true
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
            },
            haveTip: { // 是否启用建议输入
                type: Boolean,
                default: false
            },
            tips: {
                type: Array,
                default() {
                    return []
                }
            },
            placeholder: {
                type: [Number, String],
                default: ""
            }
        },
        methods: {
            reg(value) {
                let judge = true;
                switch (this.type) {
                    case "Number":
                        judge = /^\d+$/.test(this.value);
                        break;
                    default:
                        judge = this.validate(value)
                        break;
                }
                if(judge) {
                    this.$refs.textInput.classList.remove('error');
                } else {
                    this.$refs.textInput.classList.add('error');
                }
            },
            changePreStyle(state=true) {
                this.inputPrePt.style.background = state?'#f5f7fa':'white';
                this.inputPrePt.style.cursor = state?'not-allowed':'auto';
            },
            querySearch(queryString, cb) {
                var restaurants = this.tips;
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            createFilter(queryString) {
                return (restaurant) => {
                    return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            changeEditState(state) {
                if(!this.inTable) return;
                this.eidt = state
            }
        },
        computed: {
          fixWidth() {
              return this.inTable?`calc(100% - 0.1042rem)`:`calc(${8.33*this.column}% - 0.1042rem)`;
          }  
        },
        watch: {
            disabled: {
                handler(val) {
                    this.changePreStyle(val);
                },
            },
            insideValue(val) {
                this.$emit('input', val)
            }
        },
        created() {
            this.insideValue = this.value
        },
        mounted() {
            this.inputPrePt = document.querySelector('.el-input-group__prepend');
            try {
                if(this.$refs.textInput.parentNode.parentNode.nodeName == 'TD') {
                    this.inTable = true;
                    this.eidt = false;
                }
            } catch (error) {
                
            }
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
        border-radius:4px;
        font-size: 16px;
        margin: 0 0.0521rem;
        display: inline-block;
		box-sizing: border-box;
    }
    .border {
        border: 1px solid #DCDFE6;
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
    .bg-disabled {
        background-color: #F5F7FA;
        color: #C0C4CC;
    }
    .disabled {
        background-color: #f5f7fa !important;
    }
</style>