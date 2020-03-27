<template>
    <div :class="{'date-select-continer':true,disabled}" :style="'width:'+width+'px;height:'+height+'px'">
        <div class="label">{{ label }}</div>
        <el-date-picker
                v-model="selectValue"
                :type="type"
                :value-format="valueFormat"
                :format="format"
                placeholder="选择日期"
                :start-placeholder="startPlaceholder" 
                :end-placeholder="endPlaceholder"
                :disabled="disabled"
                :editable="editable"
                :default-time="defaultTime"
                prefix-icon="el-icon-date"
                @change="change">
        </el-date-picker>
    </div>
</template>

<script>
    export default {
        name: 'dataSelect',
        data() {
            return {
                selectValue: "",
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
            width: {
              type: Number,
              default: 288
            },
            height: {
              type: Number,
              default: 40
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
            }
        },
        methods: {
          change(value) {
            this.$emit('input', value)
          }
        },
        created() {
          this.selectValue = this.value
        }
    }
</script>

<style lang="scss" scoped>
  /deep/ .el-date-editor {
    width: 203px !important;
    .el-input__inner {
      padding: 0 10px !important;
      border: none;
      border-bottom: 1px solid #E4E7ED;
    }
    .el-input__prefix {
      pointer-events: none; // 自身不捕获鼠标事件，将其传递下去
    }
    .el-icon-date {
      margin-left: 150px;
    }
  }
  .date-select-continer {
    display: flex;
    justify-content: space-between;
    border: 1px solid #E4E7ED;
    border-radius: 4px;
  }
  .label {
    flex-shrink: 0; // 在父元素宽度不够的情况下不自动收缩
    padding: 10px;
  }
  .disabled {
    background-color: #F5F7FA;
    color: #C0C4CC;
  }
</style>