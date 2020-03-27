<template>
  <div class="process-form-container">
    <my-header :title="title" :haveBlack="true" @h_black="black"></my-header>
    <div class="process-form-top">
      <text-input label="单号" v-model="oddNumber" :disabled="true" class="odd-number"></text-input>
      <base-button name="导出" type="none" class="out"></base-button>
      <base-button name="重填" class="reset"></base-button>
      <base-button name="作废" class="delete"></base-button>
    </div>
    <div class="process-form-body">
      <div class="process-info">
          <text-input label="当前库房" v-model="processInfo.currentHouse" :disabled="true"></text-input>
          <date-select v-model="processInfo.date" :disabled="true"></date-select>
          <text-input label="申请人员" v-model="processInfo.applyPerson" :disabled="true"></text-input>
          <text-input label="申请原因" v-model="processInfo.applyReson" :haveTip="true" :tips="processInfo.tips" :disabled="true"></text-input>
      </div>
      <div class="table">表格组件</div>
      <text-input label="备注" v-model="reMarks" width="100%" :height="40" class="remark"></text-input>
    </div>
    <div class="process-form-bottom">
      <process-infos :height="154"></process-infos>
    </div>
  </div>
</template>

<script>
import myHeader from 'components/base/header/header';
import processInfos from 'components/process/processInfos'
import textInput from '@/componentized/textBox/textInput'
import baseButton from '@/componentized/buttonBox/baseButton'
import dateSelect from '@/componentized/textBox/dateSelect'
export default {
  name: 'processForm',
  data() {
    return {
      title: "我的流程/报废申请单",
      oddNumber: 20200324,
        processInfo: {
        currentHouse: "XXXXXX",
        date: new Date().getTime(),
        applyPerson: "王小明",
        applyReson: "",
        tips: [{value: '直接报废', key: '1'}, {value: '装备拿去维修，无法修补', key: '2'}]
      },
      reMarks: "",
    }
  },
  methods: {
    black() {
      this.$router.back()
    }
  },
  components: {
    myHeader,
    processInfos,
    textInput,
    baseButton,
    dateSelect
  }
}
</script>

<style lang="scss" scoped>
  .process-form-container {
    font-size: 16px;
  }
  .process-form-top {
    padding: 18px;
    border-bottom: 1px solid #EBEEF5;
    overflow: hidden;
    .odd-number {
      float: left;
    }
    .out,
    .reset,
    .delete {
      float: right;
      margin-right: 10px;
    }
  }
  .process-form-body {
    padding: 0 18px;
    .process-info {
        padding: 18px 0;
        display: flex;
        justify-content: space-between;
        overflow: hidden;
    }
    .table {
        height: 500px;
        border: 1px solid orange;
    }
    .remark {
        margin-top: 18px;
    }
    .buttom {
        height: 72px;
        margin-top: 25px;
        box-shadow:0px 0px 12px rgba(235,238,245,1);
        .submit {
            float: right;
        }
        .clear {
            float: right;
        }
        .sum-equip {
            float: right;
            font-size:20px;
            color: #3F5FE0;
            line-height: 72px;
            margin-right: 72px;
        }
    }
  }
  .process-form-bottom {
    padding: 0 18px;
    margin-top: 18px;
  }
</style>