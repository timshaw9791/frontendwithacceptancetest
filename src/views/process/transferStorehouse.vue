<template>
  <div class="process-form-container">
    <my-header :title="'我的流程/'+title+'申请单'" :haveBlack="false"></my-header>
    <div class="process-form-top" v-if="show">
      <text-input label="单号" v-model="order.number" :column="3" :disabled="true"></text-input>
    </div>
    <div class="process-form-body" v-if="show">
        <div class="process-info">
            <date-select  label="申请时间" v-model="order.createTime" :disabled="true"></date-select>
            <entity-input label="申请人员" v-model="order.applicant" :disabled="true" :required="true" placeholder="请选择"></entity-input>
            <entity-input label="入库机构" v-model="order.inboundOrganUnit" :disabled="true" format="{name}" :options="{search:'organUnits'}" placeholder=""></entity-input>
            <entity-input  label="入库库房" :disabled="true" placeholder="-"></entity-input>
        </div>
        <div class="process-info">
            <entity-input label="入库人员" :disabled="true"  placeholder="-"></entity-input>
            <entity-input label="出库机构" v-model="order.outboundOrganUnit" :disabled="true" format="{name}" :options="{search:'organUnits'}" placeholder=""></entity-input>
            <entity-input label="出库库房"  :disabled="true"  placeholder="-"></entity-input>
            <entity-input label="出库人员" :disabled="true"  placeholder="-"></entity-input>
        </div>
        <div class="process-info">
            <entity-input label="申请原因" v-model="order.note" :disabled="true" :column="12" align="right" ></entity-input>
        </div>
        <div class="table-box">
          <div style="width:74%;display:inline;margin-top:5px;float:left">
            <bos-tabs>
              <template  slot="total">
                <el-table :havePgae="false" :data="order.equips" fit height="2.6042rem" @current-change="selRow" style="float:left"
                    show-summary :summary-method="sumFunc" highlight-current-row border>
                    <define-column label="序号" columnType="index" width="65" align="center"></define-column>
                    <define-column label="操作" width="100" v-slot="{ data }">
                        <i class="iconfont icontianjialiang" @click="changeRow(true,data)"></i>
                        <i class="iconfont iconyichuliang" @click="changeRow(false,data)"></i>
                    </define-column>
                    <define-column label="装备参数" v-slot="{ data }">
                        <entity-input v-model="data.row.equipArg" format="{name}({model})" :disabled="true"></entity-input>
                    </define-column>
                    <define-column label="装备数量" v-slot="{ data }">
                        <text-input v-model="data.row.count" :disabled="true"></text-input>
                    </define-column>
                    <define-column label="金额" v-slot="{ data }">
                        <text-input v-model="data.row.count" :disabled="true"></text-input>
                    </define-column>
                </el-table>
              </template>
              <template slot="detail">
                <el-table :havePgae="false" :data="detailTable.list" fit height="2.6042rem" border>
                    <define-column label="序号" columnType="index" width="65" align="center"></define-column>
                    <define-column label="RFID" field="rfid"></define-column>
                </el-table> 
              </template>
            </bos-tabs>
          </div>
            <base-button label="读取数据" align="right" :disabled="!select.selected" :width="96" @click="readData"></base-button>
            <base-select label="硬件选择" v-model="select.selected" :column="2" align="right" :selectList="select.handWareList"></base-select>
            <div style="width:24%;display:inline;float:left;margin-left:15px;margin-top:5px">
                <el-table :havePgae="false" :data="applyEquip" height="2.6042rem" border>
                    <define-column label="序号" columnType="index" width="65" align="center"></define-column>
                    <define-column label="装备参数" v-slot="{ data }">
                        <entity-input v-model="data.row.equipArg" format="{name}({model})" :disabled="true"></entity-input>
                    </define-column>
                    <define-column label="装备数量" v-slot="{ data }">
                        <text-input v-model="data.row.count" :disabled="true"></text-input>
                    </define-column>
                </el-table>
            </div>
        </div>
        <div class="buttom">
            <base-button label="提交" align="right" :width="128" :height="72" :fontSize="20" @click="submit"></base-button>
            <base-button label="清空" align="right" :width="128" :height="72" :fontSize="20" type="danger"></base-button>
        </div>
    </div>
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
import bosTabs from '@/componentized/table/bosTabs'
import defineTable from '@/componentized/entity/defineTable'
import { processDetail, getHistoryTasks, processDelete } from 'api/process'
var _ = require('lodash');
export default {
  name: 'processForm',
  data() {
    return {
      title: "调拨",
      show: false,
      tabsIndex: 1,
      rowData: '', // 选中的单选行数据
      showDetail: false, // 明细列表
      detailTable: {
        list: [],
      },
      order: {
        // equips: []
      },
      applyEquip:[],
      select: {
        handWareList: [{
            label: "手持机",
            value: 'handheld'
        }, {
            label: "读卡器",
            value: "reader"
        }],
        selected: ""
      },
      tips: [{value: '111', key: '1'}, {value: '222', key: '2'}],
      historyTasks: []
      }
  },
  methods: {
    getData() {
      processDetail({processInstanceId: this.$route.params.info.processInstanceId}).then(res => {
        this.title = res.name.substr(0, 2);
        this.order = Object.assign(this.order, res.processVariables.order)
        this.order.equips=[]
        for(let i = 0;i<10;i++){
            this.order.equips.push({
                equipArg: {},
                count: ''
                }
            )
        }
        console.log(this.order);
        this.applyEquip = res.processVariables.order.equips
        this.show = true;
      })
      getHistoryTasks({processInstanceId: this.$route.params.info.processInstanceId}).then(res => {
        this.historyTasks = res
      })
    },
    changeRow(state, data) { // 总清单删除
        let temp = JSON.parse(JSON.stringify(this.order.equips));
        if(state) {
            temp.splice(data.$index+1, 0, {count: '', rfid: [], equipId: [], equipArg: {}});
        } else if(this.order.equips.length>1) {
            temp.splice(data.$index, 1); 
        } else {
            temp = [{count: '', rfid: [], equipId: [], equipArg: {}}]
        }
        this.order.equips = temp;
    },
    readData() { // 读取数据
        let data = [{equipId: [4, 5], rfid: ['4', '5'], count: 2, equipArg: {"id": "3",
                    "updateTime": 1585892996324,
                    "createTime": 1585892992627,
                    "name": "test_金属手铐",
                    "model": "gssk",
                    "shelfLife": 31104000000,
                    "upkeepCycle": 0,
                    "chargeCycle": 0,
                    "supplier": {
                        "id": "1",
                        "updateTime": 1586498582568,
                        "createTime": 1586498581845,
                        "name": "测试_供应商",
                        "person": "测试_人员",
                        "phone": "13922224444"
                    },
                    "alphabetic": "JSSK",
                    "image": "",
                    "pdf": null,
                    "video": null,
                    "categoryId": "1"}},
                    {equipId: [3], rfid: ['3'], count: 1, equipArg: {"id": "4",
                    "updateTime": 1585892996324,
                    "createTime": 1585892992628,
                    "name": "test_塑料手铐",
                    "model": "slsk",
                    "shelfLife": 31104000000,
                    "upkeepCycle": 0,
                    "chargeCycle": 0,
                    "supplier": {
                        "id": "1",
                        "updateTime": 1586498582568,
                        "createTime": 1586498581845,
                        "name": "测试_供应商",
                        "person": "测试_人员",
                        "phone": "13922224444"
                    },
                    "alphabetic": "SLSK",
                    "image": "",
                    "pdf": null,
                    "video": null,
                    "categoryId": "2"}}];
              data.forEach((obj, index) => {
                  this.order.equips[index].count = obj.count; // 这样赋值是为了避免绑定源丢失，导致页面不刷新
                  this.order.equips[index].rfid = obj.rfid;
                  this.order.equips[index].equipArg = obj.equipArg;
                  this.order.equips[index].equipId = obj.equipId;
              })
    },
    submit(){
        console.log("提交");
    },
    selRow(current) { // 单选表格行
      if(!current) return; // 避免切换数据时报错
      this.detailTable.list = [];
      this.rowData = current;
      console.log("current",current);
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
    defineColumn,
    defineTable,
    bosTabs
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
        padding: 9px 0;
        display: flex;
        justify-content: space-between;
        overflow: hidden;
    }
    .table-box {
        border:1px;
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