<template>
  <div>
    <div class="process-info-box">
      <div class="title">审批流程</div>
        <div class="process-info" v-for="(item, i) in infoList" :key="i">
          <div class="people">{{ item.lable }}人员</div>
          <div>{{ item.name }}</div>
          <div class="pass" v-if="['通过', '正常'].includes(item.passVal)">{{ item.passVal }}</div>
          <div class="turn" v-else-if="item.passVal == '驳回'">驳回 <a style="color: #2F2F76" @click="lookReson(item.note)">[查看原因]</a></div>
          <div class="turn" v-else-if="item.passVal == '异常'">异常 <a style="color: #2F2F76" @click="lookAbnormal(item)">[查看详情]</a></div>
          <div v-else-if="item.lable == '申请'" class="pass">申请</div>
          <div v-else>{{ item.passVal }}</div>
          <div>{{ item.lable }}时间:</div>
          <div>{{ item.time }}</div>
        </div>
    </div>
    <service-dialog title="查看原因" ref="reson" :button="false" :secondary="false" width="600px">
      驳回原因: <el-input type="textarea" v-model="reson" :disabled="true" :autosize="true" resize="none" style="margin-top: 6px"></el-input>
    </service-dialog>

    <service-dialog title="异常详情" ref="abnormal" :button="false" :secondary="false" width="750px">
      <div class="abnormal">
        <div class="note">
          <div class="tip">备注：</div>
          <div>{{ abnormalNote }}</div>
        </div>
        <div class="box">
          <div class="tip">异常装备：</div>
          <div class="abnormal-equip-box">{{ abnormalInfo }}</div>
        </div>
      </div>
    </service-dialog>
  </div>
</template>

<script>
import serviceDialog from "components/base/serviceDialog"
export default {
  name: 'processtitle',
  data() {
    return {
      infoList: [],
      reson: "",
      abnormalNote: "",
      abnormalInfo: "缺【充电警棍SHD-874】1件 缺【充电警棍DHG-235】1件缺【充电警棍DHG-235】1件"
    }
  },
  props: {
    preData: {
      type: Array,
      default: []
    },
  },
  methods: {
    lookReson(reson) {
      this.reson = reson
      this.$refs.reson.show()
    },
    lookAbnormal(item) {
      let temp = item.errEquip.map(equip => `${equip.count>0?'多':'缺'} 【${equip.name} ${equip.model}】 ${Math.abs(equip.count)}件`)
      this.abnormalNote = item.note
      this.abnormalInfo = temp.join(',')
      this.$refs.abnormal.show()
    },
    fixData() {
      let tempList = [], errEquip = [], lable = "";
        this.preData.forEach(item => {
          switch (item.taskDefinitionKey) {
            case 'apply':
              lable = "申请"
              break;
            case 'audit':
              lable = "审核"
              break;
            case 'equips_outbound_house':
              lable =  "出库"
              errEquip = item.processVariables.outboundEquipsOrder && this._.cloneDeep(item.processVariables.outboundEquipsOrder.error)
              break;
            case 'equips_inbound_house':
              lable = "入库"
              errEquip = item.processVariables.inboundEquipsOrder && this._.cloneDeep(item.processVariables.inboundEquipsOrder.error)
              break;
            default:
              lable = "审批"
              break;
          }
          tempList.push({
            lable,
            name: item.taskVariables.name,
            passVal: item.taskVariables.content,
            note: item.taskVariables.note || '',
            errEquip,
            time: item.endTime?this.$filterTime(item.endTime):'-'
          })
        })
        this.infoList = tempList
    }
  },
  created() {
    this.fixData()
  },
  components: {
    serviceDialog
  }
}
</script>

<style lang="scss" scoped>
.process-info-box {
  width: 100%;
  margin-top: 10px;
  color: #707070;
}
.process-info-box::-webkit-scrollbar {
    width: 6px;
  }
.process-info-box::-webkit-scrollbar-thumb {
  background: #99a9bf;
  border-radius: 20px;
}

.title {
  padding-bottom: 3px;
  border-bottom: 1px solid #ccc;
}
.process-info {
  display: grid;
  grid-template-columns: 15% 30% 23% 10% 22%;
  padding: 6px 0;
  border-bottom: 1px solid #ccc;
  .people {
    color: #2F2F76;
  }
  .pass {
    color: #009B4C;
  }
  .turn {
    color: #EF4545;
  }
}
.abnormal {
  font-size:20px;
  font-family:PingFang SC;
  color: #707070;
  .note {
    height: 100px;
  }
  .abnormal-equip-box::-webkit-scrollbar {
    width: 6px;
  }
  .abnormal-equip-box::-webkit-scrollbar-thumb {
    background: #99a9bf;
    border-radius: 20px;
  }
  .abnormal-equip-box {
    height: 300px;
    overflow-x: hidden;
    overflow-y: auto;
    color: #EF4545;
  }
  .tip {
    margin-bottom: 10px;
  }
}
</style>