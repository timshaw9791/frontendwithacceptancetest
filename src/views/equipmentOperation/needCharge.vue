<template>
  <div class="needCharge-form-container">
    <my-header :title="$route.meta.title" :haveBlack="false"></my-header>
    <div class="needCharge-form-body">
        <define-table :havePage="false" :data="order" height="2.6042rem" >
            <define-column label="RFID" field="rfid"></define-column>
            <define-column label="装备序号" field="serial"></define-column>
            <define-column label="装备参数" v-slot="{ data }">
                <entity-input :column="2" v-model="data.row.equipArg" :options="{ detail: 'equipArgsSelect' }" format="{name}({model})" :disabled="true" ></entity-input>
            </define-column>
            <define-column label="装备位置" field="location" :filter="(row)=>locations(row.location)"></define-column>
            <define-column label="充电倒计时" field="chargeCountdown"></define-column>
        </define-table>
    </div>
  </div>
</template>

<script>
import myHeader from "components/base/header/header";
import baseButton from "@/componentized/buttonBox/baseButton";
import entityInput from "@/componentized/entity/entityInput";
import defineInput from '@/componentized/textBox/defineInput'
import dateSelect from '@/componentized/textBox/dateSelect.vue'
import bosTabs from "@/componentized/table/bosTabs";
import request from "common/js/request";
import { getNeedchargeList } from "api/charge";
var _ = require("lodash");
export default {
  name: "needCharge",
  data() {
    return {
      order: [],
    };
  },
  methods: {
      locations(data){
        return data.floor+'/'+data.frameNumber+'/'+data.surface+'/'+data.section
      },
      getData(){
        getNeedchargeList().then(res=>{
          console.log("res",res);
          this.order=res
        })
      },
    },
  created() {
    this.getData()
  },
  components: {
    myHeader,
    baseButton,
    entityInput,
    bosTabs,
    defineInput,
    dateSelect,
  },
};
</script>

<style lang="scss" scoped>
  .needCharge-form-container {
    font-size: 16px;
  }
  .needCharge-form-top {
    padding: 18px 7px;
    border-bottom: 1px solid #ebeef5;
    overflow: hidden;
  }
  .needCharge-form-body {
    padding: 0 7px;
    widows: 100%;
  }
</style>
