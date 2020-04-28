<template>
  <div class="charge-container">
    <my-header :title="$route.meta.title" :haveBlack="false"></my-header>
    <div class="charge-body">
        <bos-tabs :label="label" @changeTab="change">
            <define-table :havePage="false" :data="order" height="2.6042rem" slot="detail">
                <define-column label="RFID" field="rfid"></define-column>
                <define-column label="装备序号" field="serial"></define-column>
                <define-column label="装备参数" v-slot="{ data }">
                    <entity-input :column="2" v-model="data.row.equipArg" :options="{ detail: 'equipArgsSelect' }" format="{name}({model})" :disabled="true" ></entity-input>
                </define-column>
                <define-column label="装备位置" field="location" :filter="(row)=>locations(row.location)"></define-column>
                <define-column label="充电台位置" field="chargeLocation"></define-column>
                <define-column label="已充时间" field="chargeingTime"></define-column>
            </define-table>
            <define-table :havePage="false" :data="order" height="2.6042rem"  slot="total">
                <define-column label="RFID" field="rfid"></define-column>
                <define-column label="装备序号" field="serial"></define-column>
                <define-column label="装备参数" v-slot="{ data }">
                    <entity-input :column="2" v-model="data.row.equipArg" :options="{ detail: 'equipArgsSelect' }" format="{name}({model})" :disabled="true" ></entity-input>
                </define-column>
                <define-column label="装备位置" field="location" :filter="(row)=>locations(row.location)"></define-column>
                <define-column label="充电倒计时" field="chargeCountdown"></define-column>
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
import { getChargeList ,getNeedchargeList } from "api/charge";
var _ = require("lodash");
export default {
  name: "charge",
  data() {
    return {
        label:[{label: "需要充电", key: "total"},{label: "正在充电", key: "detail"}],
        order: [],
    };
  },
  methods: {
		locations(data){
			return data.floor+'/'+data.frameNumber+'/'+data.surface+'/'+data.section
		},
		change(data){
			if(data.key == "total"){
				getNeedchargeList().then(res=>{
				this.order=res
				})
			}else if(data.key == "detail"){
				getChargeList().then(res=>{
				this.order = res
				})
			}
		},
    },
	created() {
		getNeedchargeList().then(res=>{
			this.order = res
		})
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
	.charge-container {
		font-size: 16px;
	}
	.charge-body {
		padding: 0 7px;
		widows: 100%;
	}
</style>
