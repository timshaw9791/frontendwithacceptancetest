<template>
  <div class="process-form-container">
    <my-header :title="'我的流程/'+title+'申请单'" :haveBlack="false"></my-header>
    <div class="process-form-top" v-if="show">
      <define-input label="单号" v-model="order.number" :disabled="true"></define-input>
    </div>
    <div class="process-form-body" v-if="show">
        <div class="process-info">
            <date-select  label="申请时间" v-model="order.createTime" :disabled="true"></date-select>
            <entity-input label="申请人员" v-model="order.applicant" :disabled="true" :required="true" placeholder="-"></entity-input>
            <entity-input label="入库机构" v-model="order.inboundOrganUnit" :disabled="true" format="{name}" :options="{search:'organUnits'}" placeholder="-"></entity-input>
            <entity-input  label="入库库房" v-model="order.inboundwarehouse" :disabled="true" format="{name}" :options="{search:'organUnits'}" placeholder="-"></entity-input>
        </div>
        <div class="process-info">
            <entity-input label="入库人员" v-model="order.inboundapplicant" :disabled="true" placeholder="-"></entity-input>
            <entity-input label="出库机构" v-model="order.outboundOrganUnit" :disabled="true" format="{name}" :options="{search:'organUnits'}" placeholder="-"></entity-input>
            <entity-input label="出库库房"  v-model="order.outboundwarehouse"  format="{name}" :disabled="true"  placeholder="-"></entity-input>
            <entity-input label="出库人员" v-model="order.outboundapplicant" :disabled="true"  placeholder="-"></entity-input>
        </div>
        <div class="process-info">
            <text-input label="申请原因" v-model="order.note" :disabled="true" :haveTip="true" :tips="tips" :column="12"></text-input>
        </div>
        <div class="table-box">
          <bos-tabs :option="['tabs', 'contrast']" :layoutRatio="[2,1]">
            <template slot="slotHeader">
               <base-button label="读取数据" align="right" :disabled="!select.selected" :width="96" @click="readData"></base-button>
              <base-select label="硬件选择" v-model="select.selected" align="right" :selectList="select.handWareList"></base-select>
            </template>
            <define-table :havePage="false" :data="order.equips" height="2.6042rem" @changeCurrent="selRow"
              :showSummary="true" :summaryFunc="sumFunc" :highLightCurrent="true" slot="total">
              <define-column label="序号" columnType="index" width="65"></define-column>
              <define-column label="操作" width="100" v-slot="{ data }">
                  <i class="iconfont icontianjialiang" @click="changeRow(true,data)"></i>
                  <i class="iconfont iconyichuliang" @click="changeRow(false,data)"></i>
              </define-column>
              <define-column label="装备参数" v-slot="{ data }">
                  <entity-input v-model="data.row.equipArg" format="{name}({model})" :disabled="true"></entity-input>
              </define-column>
              <define-column label="装备数量" v-slot="{ data }">
                  <define-input v-model="data.row.count" :disabled="true"></define-input>
              </define-column>
              <define-column label="金额" v-slot="{ data }">
                  <define-input v-model="data.row.price" :disabled="true"></define-input>
              </define-column>
            </define-table>
             <define-table :havePage="false" :data="detailTable.list" height="2.6042rem" slot="detail">
                <define-column label="序号" columnType="index" width="65"></define-column>
                <define-column label="RFID" field="rfid"></define-column>
            </define-table> 
            <define-table :havePage="false" :data="applyEquip" height="2.6042rem" slot="contrast">
                <define-column label="序号" columnType="index" width="65"></define-column>
                <define-column label="装备参数" v-slot="{ data }">
                    <entity-input v-model="data.row.equipArg" format="{name}({model})" :disabled="true"></entity-input>
                </define-column>
                <define-column label="装备数量" v-slot="{ data }">
                    <define-input v-model="data.row.count" :disabled="true"></define-input>
                </define-column>
            </define-table>
          </bos-tabs>
        </div>
        <div class="buttom">
            <base-button label="提交" align="right" :width="128" :height="72" :fontSize="20" @click="submit"></base-button>
            <base-button label="清空" align="right" :width="128" :height="72" :fontSize="20" type="danger" @click="clean"></base-button>
        </div>
    </div>
  </div>
</template>

<script>
import myHeader from 'components/base/header/header';
import processInfos from 'components/process/processInfos'
import textInput from '@/componentized/textBox/textInput'
import defineInput from '@/componentized/textBox/defineInput'
import baseButton from '@/componentized/buttonBox/baseButton'
import dateSelect from '@/componentized/textBox/dateSelect'
import baseSelect from '@/componentized/textBox/baseSelect'
import serviceDialog from "components/base/serviceDialog"
import entityInput from '@/componentized/entity/entityInput'
import defineColumn from '@/componentized/entity/defineColumn'
import bosTabs from '@/componentized/table/bosTabs'
import request from 'common/js/request'
import {baseBURL} from "api/config";
import defineTable from '@/componentized/entity/defineTable'
import { processDetail, getHistoryTasks, complete } from 'api/process'
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
      tips: [{value: '直接报废', key: '1'}, {value: '装备拿去维修，无法修补', key: '2'}],
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
      request({
          method: 'get',
          url: baseBURL + `/houses/by-organ-unit?organUnitId=${JSON.parse(localStorage.getItem('user')).organUnitId}`})
          .then(res=>{
            this.order.outboundwarehouse = res[0]
          })
      console.log("order",this.order);
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
                    "price":100,
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
                    "price":100,
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
                  this.order.equips[index].price = obj.equipArg.price*obj.count;
              })
    },
    submit(){
        console.log("提交");
        console.log("this.order",this.order);
        let opeator={}
        let user = JSON.parse(localStorage.getItem('user'))
        opeator.name = user.name;
        opeator.id = user.id;
        opeator.policeSign = user.policeSign
        this.order.opeator = opeator
        let order = JSON.parse(JSON.stringify(this.order));
        console.log(_.filter(order.equips,obj=>obj.rfid&&obj.equipId&&obj.price));
        order.equips=_.filter(order.equips,obj=>obj.rfid&&obj.equipId&&obj.price)
        if(order.equips.length == 0) {
          this.$message.warning('未扫入装备');
          return;
        }
        let userId = JSON.parse(localStorage.getItem('user')).id;
        complete(this.$route.params.info.taskId,{userId:userId},{order:order}).then(res=>{
          if(this.$route.params.info.house == false){
            this.$message.success("入库成功")
          }else{
            this.$message.success("出库成功")
          }
          this.$router.push({name: 'myProcess'});
        })
    },
    clean(){
      for(let i in this.order.equips){
        this.order.equips.splice(this.order.equips.i, 0, {count: '', rfid: [], equipId: [], equipArg: {}});
      }
      this.detailTable.list = []
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
    console.log("param",param);
      let { columns, data } = param, sums = [];
      columns.forEach((colum, index) => {
          if(index == 0) {
              sums[index] =  '合计';
          } else if(index == columns.length-2) {
              const values = data.map(item => item.count?Number(item.count):0);
              if(!values.every(value => isNaN(value))) {
                  sums[index] = values.reduce((pre, cur) => !isNaN(cur)?pre+cur:pre);
              }
          }  else if(index == columns.length-1) {
              const values = data.map(item => item.price?Number(item.price):0);
              if(!values.every(value => isNaN(value))) {
                  sums[index] = values.reduce((pre, cur) => !isNaN(cur)?pre+cur:pre);
              }
          } else {
              sums[index] = '';
          }
      })
      return sums;
    },
    getinit(){
      console.log("入库");
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
      request({
          method: 'get',
          url: baseBURL + `/houses/by-organ-unit?organUnitId=${JSON.parse(localStorage.getItem('user')).organUnitId}`})
          .then(res=>{
            this.order.inboundwarehouse = res[0]
          })
      console.log("order",this.order);
    },
  },
  created() {
    if(this.$route.params.info == undefined) {
      this.$message.info("数据丢失，返回待办界面");
      this.$router.push({name: 'agencyMatters'});
    } else if(this.$route.params.info.house == false){
      this.getinit()
    } else{
      this.getData();
    }
  },
  components: {
    myHeader,
    processInfos,
    textInput,
    defineInput,
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