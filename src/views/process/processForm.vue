<template>
  <div class="process-form-container">
    <my-header :title="title" :haveBlack="false"></my-header>
    <div class="process-form-top" v-if="show">
      <text-input label="单号" v-model="order.number" :column="3" :disabled="true"></text-input>
      <base-button label="导出" type="none" align="right"></base-button>
      <base-button label="重填" align="right" @click="refill"></base-button>
      <base-button label="作废" align="right" @click="$refs.ratify.show()"></base-button>
    </div>
    <div class="process-form-body" v-if="show">
      <div class="process-info">
          <text-input label="所在库房" v-model="order.warehouse.name" :column="3" :disabled="true"></text-input>
          <date-select v-model="order.applyTime" :column="3" :disabled="true"></date-select>
          <!-- <text-input label="申请人员" v-model="order.applicant.name" :disabled="true"></text-input> -->
          <entity-input label="申请人员" v-model="order.applicant" :column="3" :disabled="true"></entity-input>
          <text-input label="申请原因" v-model="order.note" :column="3" :haveTip="true" :tips="tips" :disabled="true"></text-input>
      </div>
      <div class="table">表格组件</div>
      <!-- <text-input label="备注" v-model="order.note" width="100%" :height="40" class="remark" :disabled="true"></text-input> -->
    </div>
    <div class="process-form-bottom">
      <process-infos :list="historyTasks" :height="154"></process-infos>
    </div>

    <service-dialog title="作废" ref="ratify" confirmInfo="确定" :secondary="false" @confirm="nullify">
      <center>确定要作废此单？</center>
    </service-dialog>
  </div>
</template>

<script>
import myHeader from 'components/base/header/header';
import processInfos from 'components/process/processInfos'
import textInput from '@/componentized/textBox/textInput'
import baseButton from '@/componentized/buttonBox/baseButton'
import dateSelect from '@/componentized/textBox/dateSelect'
import serviceDialog from "components/base/serviceDialog"
import entityInput from '@/componentized/entity/entityInput'
import { processDetail, getHistoryTasks, processDelete } from 'api/process'
export default {
  name: 'processForm',
  data() {
    return {
      title: "我的流程/报废申请单",
      show: false,
      order: {
        type: 'scrap',
        processInstanceId: '',
        number: "",
        warehouse: {
            id: 'sjkfa',
            name: '市局库房a'
        },
        applyTime: 0,
        applicant: {
            id: '',
            name: '',
            organUnitId: ''
        },
        applyReson: "",
        note: "",
        equips: []
    },
      tips: [{value: '直接报废', key: '1'}, {value: '装备拿去维修，无法修补', key: '2'}],
      historyTasks: []
    }
  },
  methods: {
    getData() {
      processDetail({processInstanceId: this.$route.params.info.processInstanceId}).then(res => {
        this.order = Object.assign(this.order, res.processVariables.order)
        this.show = true;
      })
      getHistoryTasks({processInstanceId: this.$route.params.info.processInstanceId}).then(res => {
        this.historyTasks = res
      })
    },
    refill() {
      this.$router.push({
        name: 'processApply',
        params: {type: 'apply', info: {name: this.order.title, processInstanceId: this.order.processInstanceId, taskId: this.$route.params.taskId, number: this.order.number}}
      })
    },
    nullify() { // 作废
      let userId = JSON.parse(localStorage.getItem('user')).id;
      processDelete({processInstanceId: this.order.processInstanceId, startUserId: userId}).then(res => {
        this.$message.success("操作成功！");
        this.$router.push({name: 'agencyMatters'});
      }).catch(err => {
        if(err.response) {
          this.$message.error(err.response.data.message)
        } else {
          console.log(err);
        }
      })
    }
  },
  created() {
    if(this.$route.params.info == undefined) {
      this.$message.info("数据丢失，返回待办界面");
      this.$router.push({name: 'agencyMatters'});
    } else {
      this.getData();
    }
  },
  components: {
    myHeader,
    processInfos,
    textInput,
    baseButton,
    dateSelect,
    serviceDialog,
    entityInput
  }
}
</script>

<style lang="scss" scoped>
  .process-form-container {
    font-size: 16px;
  }
  .process-form-top {
    padding: 18px 7px;
    border-bottom: 1px solid #EBEEF5;
    overflow: hidden;
  }
  .process-form-body {
    padding: 0 7px;
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