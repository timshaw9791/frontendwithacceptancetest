<template>
    <div :class="[styleObj,'date-select-continer',{disabled:disabled&&inTableStateContrl}]" ref="dateSelect" :style="'width:'+fixWidth+';margin:'+margin+';align:'+align">
        <div class="label">{{ label }}
          <span class="required" v-if="required">*</span>
        </div>
        <el-date-picker
                v-model="selectValue"
                :type="type"
                :value-format="valueFormat"
                :format="format"
                placeholder="选择日期"
                :start-placeholder="startPlaceholder" 
                :end-placeholder="endPlaceholder"
                :readonly="disabled"
                :editable="editable"
                :default-time="defaultTime"
                prefix-icon= "el-icon-date"
                @change="change">
        </el-date-picker>
    </div>
</template>

<script>
import { judgeRules } from "../rules"
    export default {
        name: 'dataSelect',
        data() {
            return {
                selectValue: "",
                inTableStateContrl: true,
                styleObj: {
                  error: false
                }
            }
        },
        props: {
            value: {
              type: [String, Number]
            },
            type: { // year/month/date/week/ datetime/datetimerange/daterange
              type: String,
              default: 'datetime'
            },
            label: {
              type: [String, Number],
              default: "日期"
            },
            defaultTime: {
                type: String,
                default: "12:00:00"
            },
            column: {
              type: Number,
              default: 3
            },
            valueFormat: {
              type: String,
              default: 'timestamp'
            },
            format: {
              type: String,
              default: 'yyyy/MM/dd HH:mm:ss'
            },
            startPlaceholder: {
              type: String,
              default: '开始日期'
            },
            endPlaceholder: {
              type: String,
              default: '结束日期'
            },
            disabled: {
              type: Boolean,
              default: false
            },
            editable: { // 文本框可输入
              type: Boolean,
              default: true
            },
            align: {
              type: String,
              default: 'none'
            },
            margin: {
              type: String,
              default: '0 0.0521rem'
            },
            required: {
              type: Boolean,
              default: false
            }
        },
        computed: {
          fixWidth() {
              return `calc(${8.33*this.column}% - 0.1042rem)`;
          }  
        },
        methods: {
          reg() {
            if(judgeRules(this.required, null, this.value)) {
                this.styleObj.error=false;
                return true;
            } 
            this.styleObj.error=true;
            return false;  
          },
          change(value) {
            this.$emit('input', value)
          }
        },
        watch: {
          value(val) {
            this.selectValue = this.value;
          }
        },
        created() {
          this.selectValue = this.value
        },
        mounted() {
          try {
            if(this.$refs.dateSelect.parentNode.parentNode.nodeName == 'TD'&&this.disabled) {
                this.inTableStateContrl = false;
            }
          } catch (error) {
            console.log("当前组件不存在上两级节点");
          }
        }
    }
</script>

<style lang="scss" scoped>
  /deep/ .el-date-editor {
    .el-input__inner {
      height: 40px;
      line-height: 40px;
      background-color: transparent;
      padding: 0 10px !important;
      border: none;
    }
    .el-input__prefix {
      right: 20px;
      text-align: right;
      pointer-events: none; // 自身不捕获鼠标事件，将其传递下去
    }
  }
  .date-select-continer {
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #E4E7ED;
    border-radius: 4px;
    margin: 0 0.0521rem;
    font-size: 16px;
    height: 40px;
    max-height: 40px;
		box-sizing: border-box;
  }
  .label {
    min-width: 55px;
    padding: 0 10px;
    color: #909399;
    overflow: hidden;
    flex-shrink: 0; // 在父元素宽度不够的情况下不自动收缩
  }
  .disabled {
    color: #C0C4CC;
    background:rgba(248,249,251,1);
    border:1px solid rgba(220,223,230,1);
  }
  .required {
    color: red;
  }
  .error {
    border: 1px solid red;
  }
</style>