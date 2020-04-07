<template>
  <div class="process-form-container">
    <my-header :title="title" :haveBlack="false"></my-header>
    <div class="process-form-top" v-if="show">
      <text-input label="单号" v-model="order.number" :column="3" :disabled="true"></text-input>
      <base-button label="导出" type="none" align="right" v-show="operate"></base-button>
      <base-button label="重填" align="right" @click="refill" v-show="operate"></base-button>
      <base-button label="作废" align="right" @click="$refs.ratify.show()" v-show="operate"></base-button>
    </div>
    <div class="process-form-body" v-if="show">
      <div class="process-info">
          <text-input label="所在库房" v-model="order.warehouse.name" :column="3" :disabled="true"></text-input>
          <date-select v-model="order.applyTime" :column="3" :disabled="true"></date-select>
          <entity-input label="申请人员" v-model="order.applicant" :column="3" :disabled="true"></entity-input>
          <text-input label="申请原因" v-model="order.note" :column="3" :haveTip="true" :tips="tips" :disabled="true"></text-input>
      </div>
      <div class="table-box">
        <div :class="{'total-list':true,'active':tabsIndex==1}" @click="switchTab(1)">总清单</div>
        <div :class="{'detail-list':true,'active':tabsIndex==2}" @click="switchTab(2)">明细</div>
        <el-table :data="order.equips" fit height="500px" @current-change="selRow" highlight-current-row border v-if="!showDetail">
          <el-table-column label="序号" type="index" width="65" align="center"></el-table-column>
          <define-column label="装备参数" v-slot="{ data }">
            <entity-input v-model="data.row.param" format="{name}({model})" :disabled="true"></entity-input>
          </define-column>
          <define-column label="装备数量" v-slot="{ data }">
            <text-input v-model="data.row.count" :disabled="true"></text-input>
          </define-column>
        </el-table>
        <el-table :data="detailTable.list" fit height="505px" border v-else>
          <el-table-column label="序号" type="index" width="65" align="center"></el-table-column>
          <define-column label="RFID" field="rfid"></define-column>
        </el-table>
      </div>
       <!-- <text-input label="合计" :column="12"></text-input> -->
       <div class="total"><span>合计</span><span>{{ total }}</span></div>
      <!-- <text-input label="备注" v-model="order.note" width="100%" :height="40" class="remark" :disabled="true"></text-input> -->
    </div>
    <div class="process-form-bottom">
      <process-infos :list="historyTasks" :height="136"></process-infos>
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
import defineColumn from '@/componentized/entity/defineColumn'
import { processDetail, getHistoryTasks, processDelete } from 'api/process'
var _ = require('lodash');
export default {
  name: 'processForm',
  data() {
    return {
      title: "我的流程/报废申请单",
      show: false,
      operate: true,
      tabsIndex: 1,
      rowData: '', // 选中的单选行数据
      showDetail: false, // 明细列表
      detailTable: {
        list: [],
      },
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
        res.processVariables.order.equips = _.values(_.reduce(res.processVariables.order.equips, (res, obj) => {
          if(res[obj.model]) {
            res[obj.model].count++;
            res[obj.model].param.rfid.push(obj.rfid);
            res[obj.model].param.id.push(obj.equipId);
          } else {
            res[obj.model] = {count: 1, param: Object.assign(obj, {rfid: [obj.rfid], id: [obj.equipId]})};
          }
          return res;
        }, {}))
        this.order = Object.assign(this.order, res.processVariables.order)
        this.show = true;
      })
      getHistoryTasks({processInstanceId: this.$route.params.info.processInstanceId}).then(res => {
        this.historyTasks = res
      })
    },
    refill() { // 重填
      this.$router.push({
        name: 'processApply',
        params: {type: 'apply', info: {name: this.order.title, processInstanceId: this.order.processInstanceId, taskId: this.$route.params.info.taskId, number: this.order.number}}
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
    },
    switchTab(index) { // 切换标签卡
      if(index == 1) {
          this.showDetail = false;
      } else if(this.detailTable.list.length == 0) {
          this.$message.warning('未选择装备信息');
          return;
      } else {
          this.showDetail = true;
      }
      this.tabsIndex = index;
    },
    selRow(current) { // 单选表格行
      if(!current) return; // 避免切换数据时报错
      this.detailTable.list = [];
      this.rowData = current;
      if(current.param.rfid == undefined) return;
      for(let rfid of current.param.rfid) {
          this.detailTable.list.push({
              rfid: rfid
          })
      }
    },
  },
  computed: {
    total() {
      if(!this.order.equips) return 0;
      if(this.order.equips.length == 0) return 0;
      return _.reduce(this.order.equips, (r, v, k) => v.count==undefined?r:r+ +v.count, 0);
    }
	},
  created() {
    if(this.$route.params.info == undefined) {
      this.$message.info("数据丢失，返回待办界面");
      this.$router.push({name: 'agencyMatters'});
    } else {
      this.getData();
    }
    if(this.$route.params.info.operate == false) {
      this.operate = false;
    }
  },
  components: {
    myHeader,
    processInfos,
    textInput,
    baseButton,
    dateSelect,
    serviceDialog,
    entityInput,
    defineColumn
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-table {
  .el-table__row {
    background-color: #f5f7fa;
  }
}
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
    .table-box {
      padding: 0 10px;
      .iconfont {
        margin: 0 5px;
      }
      .total-list,
      .detail-list {
          display: inline-block;
          border: 1px solid #EAEAEA;
          height: 40px;
          line-height: 40px;
          padding: 0 10px;
          background-color: #DCDFE6;
          cursor: pointer;
      }
      .active {
          background-color: white;
      }
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
  .total {
      height: 36px;
      border: 1px solid #DCDFE6;
      display: flex;
      justify-content: space-between;
      margin: 0 10px;
      padding: 0 15px;
      font-size: 16px;
      align-items: center;
    }
  .process-form-bottom {
    padding: 0 18px;
    margin-top: 18px;
  }
</style>