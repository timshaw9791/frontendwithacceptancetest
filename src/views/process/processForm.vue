<template>
  <div class="process-form-container">
    <my-header :title="'我的流程/'+title+'申请单'" :haveBlack="false"></my-header>
    <div class="process-form-top" v-if="show">
      <text-input label="单号" v-model="order.number" :column="3" :disabled="true"></text-input>
      <base-button label="导出" type="none" align="right" v-show="operate"></base-button>
      <base-button label="重填" align="right" @click="refill" v-show="operate"  v-if="title!='调拨'"></base-button>
      <base-button label="作废" align="right" @click="$refs.ratify.show()" v-show="operate"></base-button>
    </div>
    <div class="process-form-body" v-if="show">
      <div class="process-info" v-if="title!='调拨'">
          <text-input label="所在库房" v-model="order.warehouse.name" :column="3" :disabled="true"></text-input>
          <date-select v-model="order.applyTime" :column="3" :disabled="true"></date-select>
          <entity-input label="申请人员" v-model="order.applicant" :column="3" :disabled="true"></entity-input>
          <text-input label="申请原因" v-model="order.note" :column="3" :haveTip="true" :tips="tips" :title="order.note" :disabled="true"></text-input>
      </div>
      <div class="process-info"  v-if="title=='调拨'">
          <date-select  label="申请时间" v-model="order.createTime" :disabled="true"></date-select>
          <entity-input label="申请人员" v-model="order.applicant" :disabled="true" :required="true" placeholder="请选择"></entity-input>
          <entity-input label="入库机构" v-model="order.inboundOrganUnit" :disabled="true" format="{name}" :options="{search:'organUnits'}" placeholder=""></entity-input>
          <entity-input  label="入库库房" :disabled="true" placeholder="-"></entity-input>
      </div>
      <div class="process-info"  v-if="title=='调拨'">
          <entity-input label="入库人员" :disabled="true"  placeholder="请选择"></entity-input>
          <entity-input label="出库机构" v-model="order.outboundOrganUnit" :disabled="true" format="{name}" :options="{search:'organUnits'}" placeholder=""></entity-input>
          <entity-input label="出库库房"  :disabled="true"  placeholder="-"></entity-input>
          <entity-input label="出库人员" :disabled="true"  placeholder="-"></entity-input>
      </div>
      <div class="process-info"  v-if="title=='调拨'">
          <base-select label="申请原因" v-model="order.note" :column="12" :disabled="true" align="right" :selectList="tips"></base-select>
      </div>
      <div class="table-box">
        <div :class="{'total-list':true,'active':tabsIndex==1}" @click="switchTab(1)">总清单</div>
        <div :class="{'detail-list':true,'active':tabsIndex==2}" @click="switchTab(2)"  v-if="title!='调拨'">明细</div>
        <el-table :data="order.equips" fit height="2.6042rem" @current-change="selRow" 
          show-summary :summary-method="sumFunc" highlight-current-row border v-if="!showDetail">
          <el-table-column label="序号" type="index" width="65" align="center"></el-table-column>
          <define-column label="装备参数" v-slot="{ data }">
            <entity-input v-model="data.row.equipArg" format="{name}({model})" :disabled="true"></entity-input>
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
       <!-- <div class="total"><span>合计</span><span>{{ total }}</span></div> -->
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
import baseSelect from '@/componentized/textBox/baseSelect'
import serviceDialog from "components/base/serviceDialog"
import entityInput from '@/componentized/entity/entityInput'
import defineColumn from '@/componentized/entity/defineColumn'
import { processDetail, getHistoryTasks, processDelete } from 'api/process'
var _ = require('lodash');
export default {
  name: 'processForm',
  data() {
    return {
      title: "报废",
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
        this.title = res.name.substr(0, 2);
        res.processVariables.order.equips = _.values(_.reduce(res.processVariables.order.equips, (result, obj) => {
          if(result[obj.equipArg.model]) {
            result[obj.equipArg.model].count++;
            result[obj.equipArg.model].rfid.push(obj.rfid);
            result[obj.equipArg.model].equipId.push(obj.equipId);
          } else {
            result[obj.equipArg.model] = {count: 1, rfid: [obj.rfid], equipId: [obj.equipId], equipArg: obj.equipArg};
          }
          return result;
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
        params: {type: 'apply', info: {name: this.title, processInstanceId: this.order.processInstanceId, taskId: this.$route.params.info.taskId, number: this.order.number}}
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
      if(current.rfid == undefined) return;
      for(let rfid of current.rfid) {
          this.detailTable.list.push({
              rfid: rfid
          })
      }
    },
    sumFunc(param) { // 表格合并行计算方法
      let { columns, data } = param, sums = [];
      columns.forEach((colum, index) => {
          if(index == 0) {
              sums[index] =  '合计';
          } else if(index == columns.length-1) {
              const values = data.map(item => item.count?Number(item.count):0);
              if(!values.every(value => isNaN(value))) {
                  sums[index] = values.reduce((pre, cur) => !isNaN(cur)?pre+cur:pre);
              }
          } else {
              sums[index] = '';
          }
      })
      return sums;
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
    baseSelect,
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
  .el-table__body-wrapper { // 因为表格切换后，带有合计行的表格高度会变少，所以手动设置其高度
      height: 2.125rem !important;
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
  .process-form-bottom {
    padding: 0 18px;
    margin-top: 18px;
  }
</style>