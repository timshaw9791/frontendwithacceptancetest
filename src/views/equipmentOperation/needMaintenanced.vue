<template>
  <div class="maintenance-form-container">
    <my-header :title="$route.meta.title" :haveBlack="false"></my-header>
    <div class="maintenance-form-top">
      <base-button :width="100" size="default" align="right" label="结束保养" ></base-button>
    </div>
    <div class="maintenance-form-body">
        <bos-tabs :option="['tabs']" :layoutRatio="[2, 1]">
          <define-table :havePage="false" :data="order" height="2.6042rem"
            @changeCurrent="selRow" :summaryFunc="sumFunc" :showSummary="true" :highLightCurrent="true" slot="total" >
            <define-column label="装备参数" v-slot="{ data }">
              <entity-input v-model="data.row.equips" :options="{ detail: 'equipArgsSelect' }" format="{name}({model})" :disabled="true" ></entity-input>
            </define-column>
            <define-column label="装备位置" v-slot="{ data }">
              <div>{{data.row.location.floor+'/'+data.row.location.frameNumber+'/'+data.row.location.surface+'/'+data.row.location.section}}</div>
            </define-column>
            <define-column label="正在保养数量" field="count"></define-column>
            <define-column label="保养时长" field="count"></define-column>
          </define-table>
          <define-table :havePage="false" :data="detailTable.list" height="2.6042rem" slot="detail" >
            <define-column label="RFID" field="rfid"></define-column>
            <define-column label="装备序号" field="serial"></define-column>
          </define-table>
        </bos-tabs>
    </div>
  </div>
</template>

<script>
import myHeader from "components/base/header/header";
import baseButton from "@/componentized/buttonBox/baseButton";
import entityInput from "@/componentized/entity/entityInput";
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
            } else if(index == columns.length-2) {
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
    entityInput,
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
  }
</style>
