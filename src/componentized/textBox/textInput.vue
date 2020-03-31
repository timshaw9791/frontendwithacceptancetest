<template>
    <div class="text-input-container" :style="'width:'+fixWidth+';height:'+height+'px'">
        <el-input :placeholder="placeholder"
                  :disabled="disabled"
                  @change="reg"
                  v-if="!haveTip"
                  :clearable="clearable"
                  v-model="insideValue">
            <div slot="prepend" :class="{'prefix': true, 'disabled': disabled}">
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
            width: {
                type: [Number, String],
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
                default: "请输入内容"
            }
        },
        methods: {
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
            }
        },
        computed: {
          fixWidth() {
              if(isNaN(this.width)) {
                  return this.width;
              } else {
                  return this.width + 'px';
              }
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
        font-size: 16px;
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