<template>
  <div class="process-form-container">
    <my-header :title="title" :haveBlack="true" @h_black="black"></my-header>
    <div class="process-form-top">
      <text-input label="单号" v-model="applyOrder.number" :disabled="true" class="odd-number"></text-input>
      <base-button name="导出" type="none" class="out"></base-button>
      <base-button name="重填" class="reset"></base-button>
      <base-button name="作废" class="delete"></base-button>
      <!-- <base-button name="审核"></base-button>
      <base-button name="驳回"></base-button> -->
    </div>
    <div class="process-form-body">
      <div class="process-info">
          <text-input label="当前库房" v-model="applyOrder.warehouse.name" :disabled="true"></text-input>
          <date-select v-model="applyOrder.applyTime" :disabled="true"></date-select>
          <text-input label="申请人员" v-model="applyOrder.applicant.name" :disabled="true"></text-input>
          <text-input label="申请原因" v-model="applyOrder.applyReson" :haveTip="true" :tips="tips" :disabled="true"></text-input>
      </div>
      <div class="table">表格组件</div>
      <text-input label="备注" v-model="applyOrder.note" width="100%" :height="40" class="remark"></text-input>
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
      applyOrder: {
        type: 'scrap',
        processInstanceId: '',
        number: 20200324,
        warehouse: {
            id: 'sjkfa',
            name: '市局库房a'
        },
        applyTime: new Date().getTime(),
        applicant: {
            id: '',
            name: '',
            organUnitId: ''
        },
        applyReson: "",
        note: "",
        equips: [{
            id: '1',
            rfid: '00001',
            name: "伸缩警棍",
            model: 'ssjg',
            count: 1
        },{
            id: '2',
            rfid: '00002',
            name: "手铐",
            model: 'sk',
            count: 1
        },{
            id: '3',
            rfid: '00003',
            name: '照明灯',
            model: 'zmd',
            count: 1
        }]
    },
      tips: [{value: '直接报废', key: '1'}, {value: '装备拿去维修，无法修补', key: '2'}]
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