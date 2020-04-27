<template>
  <div class="maintenance-form-container">
    <my-header :title="$route.meta.title" :haveBlack="false"></my-header>
    <div class="maintenance-form-top" v-if="show">
      <base-button size="default" align="right" label="开始保养" @click="show=false"></base-button>
    </div>
    <div class="process-info" v-else>
      <define-input label="单号" v-model="order.number" :disabled="true" class="odd-number"></define-input>
      <date-select label="申请时间" v-model="order.createTime" :disabled="true"></date-select>
      <entity-input label="申请人员" v-model="order.applicant" :required="true" placeholder="请选择"></entity-input>
    </div>
    <div class="maintenance-form-body" v-if="show">
        <bos-tabs :option="['tabs']" :layoutRatio="[2, 1]">
          <define-table :havePage="false" :data="order" height="2.6042rem"
            @changeCurrent="selRow" :summaryFunc="sumFunc" :showSummary="true" :highLightCurrent="true" slot="total" >
            <define-column label="装备参数" v-slot="{ data }">
              <entity-input v-model="data.row.equips" :options="{ detail: 'equipArgsSelect' }" format="{name}({model})" :disabled="true" ></entity-input>
            </define-column>
            <define-column label="装备位置" field="location" :filter="(row)=>locations(row.location)"></define-column>
            <define-column label="可保养数量" field="count"></define-column>
          </define-table>
          <define-table :havePage="false" :data="detailTable.list" height="2.6042rem" slot="detail" >
            <define-column label="RFID" field="rfid"></define-column>
            <define-column label="装备序号" field="serial"></define-column>
          </define-table>
        </bos-tabs>
    </div>
    <div v-else class="maintenance-form-body">
      <bos-tabs :option="['tabs']" :layoutRatio="[2, 1]">
        <template slot="slotHeader">
          <base-button label="读取数据" align="right" :disabled="!select.selected" :width="96"></base-button>
          <base-select label="硬件选择" v-model="select.selected" align="right" :selectList="select.handWareList"></base-select>
        </template>
        <define-table :havePage="false" :data="order" height="2.6042rem"
          @changeCurrent="selRow" :summaryFunc="sumFunc" :showSummary="true" :highLightCurrent="true" slot="total" >
          <define-column label="操作" width="100">
              <i class="iconfont icontianjialiang"></i>
              <i class="iconfont iconyichuliang"></i>
          </define-column>
          <define-column label="装备参数" v-slot="{ data }">
            <entity-input v-model="data.row.equips" :options="{ detail: 'equipArgsSelect' }" format="{name}({model})" :disabled="true" ></entity-input>
          </define-column>
          <define-column label="装备位置" field="location" :filter="(row)=>locations(row.location)"></define-column>
          <define-column label="可保养数量" field="count"></define-column>
          <define-column label="本次保养数量" field="canCount"></define-column>
        </define-table>
        <define-table :havePage="false" :data="detailTable.list" height="2.6042rem" slot="detail" >
          <define-column label="RFID" field="rfid"></define-column>
          <define-column label="装备序号" field="serial"></define-column>
        </define-table>
      </bos-tabs>
      <div class="buttom">
          <base-button label="提交" align="right" size="large" ></base-button>
          <base-button label="取消" align="right" size="large" type="danger" @click="cancel"></base-button>
      </div>
    </div>
  </div>
</template>

<script>
import myHeader from "components/base/header/header";
import baseButton from "@/componentized/buttonBox/baseButton";
import serviceDialog from "components/base/serviceDialog";
import defineInput from '@/componentized/textBox/defineInput'
import bosTabs from "@/componentized/table/bosTabs";
import request from "common/js/request";
var _ = require("lodash");
export default {
  name: "maintenance",
  data() {
    return {
      show: true,
      rowData: "", // 选中的单选行数据
      detailTable: {
        list: [],
      },
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
      locations(data){
        // console.log(data);
        return data.floor+'/'+data.frameNumber+'/'+data.surface+'/'+data.section
      },
      cancel(){this.show = true},
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
    baseButton,
    bosTabs,
  },
};
</script>

<style lang="scss" scoped>
  .maintenance-form-container {
    font-size: 16px;
  }
  .maintenance-form-top {
    padding: 18px 7px;
    border-bottom: 1px solid #ebeef5;
    overflow: hidden;
  }
  .maintenance-form-body {
    padding: 0 7px;
    widows: 100%;
  }
  .process-info {
      padding: 18px 0;
      display: flex;
      justify-content: space-between;
      overflow: hidden;
  }
  .buttom {
      height: 72px;
      width:100%;
      margin-top: 25px;
      // box-shadow:0px 0px 12px rgba(235,238,245,1);
  }
</style>
