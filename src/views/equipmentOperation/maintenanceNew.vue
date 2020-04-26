<template>
  <div class="process-form-container">
    <my-header :title="$route.meta.title" :haveBlack="false"></my-header>
    <div class="process-form-top">
      <base-button :width="100" size="default" align="right" label="开始保养" ></base-button>
    </div>
    <div class="process-form-body">
      <div class="table-box">
        <bos-tabs :option="['tabs', 'contrast']" :layoutRatio="[2, 1]">
          <define-table :havePage="false" :data="order" height="2.6042rem"
            @changeCurrent="selRow" :summaryFunc="sumFunc" :showSummary="true" :highLightCurrent="true" slot="total" >
            <define-column label="装备参数" v-slot="{ data }">
              <entity-input v-model="data.row.equips" :options="{ detail: 'equipArgsSelect' }" format="{name}({model})" :disabled="true" ></entity-input>
            </define-column>
            <define-column label="装备位置" v-slot="{ data }">
              <div>{{data.row.location.floor+'/'+data.row.location.frameNumber+'/'+data.row.location.surface+'/'+data.row.location.section}}</div>
            </define-column>
            <define-column label="可保养数量" field="count"></define-column>
          </define-table>
          <define-table :havePage="false" :data="detailTable.list" height="2.6042rem" slot="detail" >
            <define-column label="RFID" field="rfid"></define-column>
            <define-column label="装备序号" field="serial"></define-column>
          </define-table>
        </bos-tabs>
      </div>
      <!-- <div class="buttom">
            <base-button label="提交" align="right" :width="128" :height="72" :fontSize="20" @click="submit"></base-button>
            <base-button label="清空" align="right" :width="128" :height="72" :fontSize="20" type="danger" @click="clean"></base-button>
        </div> -->
    </div>
  </div>
</template>

<script>
import myHeader from "components/base/header/header";
import processInfos from "components/process/processInfos";
import textInput from "@/componentized/textBox/textInput";
import defineInput from "@/componentized/textBox/defineInput";
import baseButton from "@/componentized/buttonBox/baseButton";
import dateSelect from "@/componentized/textBox/dateSelect";
import serviceDialog from "components/base/serviceDialog";
import entityInput from "@/componentized/entity/entityInput";
import bosTabs from "@/componentized/table/bosTabs";
import request from "common/js/request";
import { baseBURL } from "api/config";
import { processwarehouseDetail, getHistoryTasks, complete } from "api/process";
var _ = require("lodash");
export default {
  name: "processForm",
  data() {
    return {
      title: "调拨",
      show: true,
      tabsIndex: 1,
      rowData: "", // 选中的单选行数据
      detailTable: {
        list: [],
      },
      order: [
        {
          equips: {
            id: "dhvungiddfhdcscgh",
            name: "警棍",
            model: "JG",
            rfid: "12345",
            serial: "154",
            supper: {
              id: "dsvghnfbdcsax",
              name: "A",
              person: "林",
              phone: "15963247896"
            }
          },
          location: {
            floor: "1",
            frameNumber: "5",
            surface: "A",
            section: "9"
          },
          count:10
        },{
          equips: {
            id: "dhvungiddfhdcscgh",
            name: "警棍",
            model: "JG",
            rfid: "12345",
            serial: "154",
            supper: {
              id: "dsvghnfbdcsax",
              name: "A",
              person: "林",
              phone: "15963247896"
            }
          },
          location: {
            floor: "1",
            frameNumber: "5",
            surface: "A",
            section: "9"
          },
          count:10
        },{
          equips: {
            id: "dhvungiddfhdcscgh",
            name: "警棍",
            model: "JG",
            rfid: "12345",
            serial: "154",
            supper: {
              id: "dsvghnfbdcsax",
              name: "A",
              person: "林",
              phone: "15963247896"
            }
          },
          location: {
            floor: "1",
            frameNumber: "5",
            surface: "A",
            section: "9"
          },
          count:10
        },{
          equips: {
            id: "dhvungiddfhdcscgh",
            name: "警棍",
            model: "JG",
            rfid: "12345",
            serial: "154",
            supper: {
              id: "dsvghnfbdcsax",
              name: "A",
              person: "林",
              phone: "15963247896"
            }
          },
          location: {
            floor: "1",
            frameNumber: "5",
            surface: "A",
            section: "9"
          },
          count:10
        },{
          equips: {
            id: "dhvungiddfhdcscgh",
            name: "警棍",
            model: "JG",
            rfid: "12345",
            serial: "154",
            supper: {
              id: "dsvghnfbdcsax",
              name: "A",
              person: "林",
              phone: "15963247896"
            }
          },
          location: {
            floor: "1",
            frameNumber: "5",
            surface: "A",
            section: "9"
          },
          count:10
        },{
          equips: {
            id: "dhvungiddfhdcscgh",
            name: "警棍",
            model: "JG",
            rfid: "12345",
            serial: "154",
            supper: {
              id: "dsvghnfbdcsax",
              name: "A",
              person: "林",
              phone: "15963247896"
            }
          },
          location: {
            floor: "1",
            frameNumber: "5",
            surface: "A",
            section: "9"
          },
          count:10
        },
      ],
    };
  },
  methods: {
    selRow(current) { // 单选表格行
        if(!current) return; // 避免切换数据时报错
        this.detailTable.list = [];
        this.rowData = current;
        console.log(current);
        if(current.equips.rfid == undefined) return;
        for(let i in current.equips.rfid) {
            this.detailTable.list.push({
                serial: current.equips.serial[i],
                rfid: current.equips.rfid[i]
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
            }else {
                sums[index] = '/';
            }
        })
        return sums;
      },
    },
  created() {
    
  },
  components: {
    myHeader,
    processInfos,
    textInput,
    defineInput,
    baseButton,
    dateSelect,
    serviceDialog,
    entityInput,
    bosTabs,
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-table {
  .el-table__row {
    background-color: #f5f7fa;
  }
  .el-table__body-wrapper {
    // 因为表格切换后，带有合计行的表格高度会变少，所以手动设置其高度
    height: 2.125rem !important;
  }
}
.process-form-container {
  font-size: 16px;
}
.process-form-top {
  padding: 18px 7px;
  border-bottom: 1px solid #ebeef5;
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
    border: 1px;
    .iconfont {
      margin: 0 5px;
    }
    .total-list,
    .detail-list {
      display: inline-block;
      border: 1px solid #eaeaea;
      height: 40px;
      line-height: 40px;
      padding: 0 10px;
      background-color: #dcdfe6;
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
    box-shadow: 0px 0px 12px rgba(235, 238, 245, 1);
    .submit {
      float: right;
    }
    .clear {
      float: right;
    }
    .sum-equip {
      float: right;
      font-size: 20px;
      color: #3f5fe0;
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
