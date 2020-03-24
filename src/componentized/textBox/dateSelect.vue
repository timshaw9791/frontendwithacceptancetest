<template>
    <div class="date-select-continer" :style="'width:'+width+'px;height:'+height+'px'">
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
                :default-time="defaultTime">
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
        created() {
          this.selectValue = new Date().getTime()
        }
    }
</script>

<style lang="scss" scoped>

</style>