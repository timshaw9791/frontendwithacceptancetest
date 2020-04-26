<template>
  <div class="charge-form-container">
    <my-header :title="$route.meta.title" :haveBlack="false"></my-header>
    <div class="charge-form-body">
        <define-table :havePage="false" :data="order" height="2.6042rem" >
            <define-column label="RFID" field="rfid"></define-column>
            <define-column label="装备序号" field="serial"></define-column>
            <define-column label="装备参数" v-slot="{ data }">
                <entity-input :column="2" v-model="data.row.equipArg" :options="{ detail: 'equipArgsSelect' }" format="{name}({model})" :disabled="true" ></entity-input>
            </define-column>
            <define-column label="装备位置" field="location" :filter="(row)=>locations(row.location)"></define-column>
            <define-column label="充电台位置" field="count"></define-column>
            <define-column label="已充时间" field="count"></define-column>
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
var _ = require("lodash");
export default {
  name: "charge",
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

      },
    },
  created() {
    // this.getData()
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
  .charge-form-container {
    font-size: 16px;
  }
  .charge-form-top {
    padding: 18px 7px;
    border-bottom: 1px solid #ebeef5;
    overflow: hidden;
  }
  .charge-form-body {
    padding: 0 7px;
    widows: 100%;
  }
</style>
