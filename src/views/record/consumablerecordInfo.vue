<template>
  <div class="consumableReceive-form-container">
      <div class="consumableReceive-header">
        <span style="font-size: 20px;">{{title}}</span>
        <base-button label="<-返回" align="right" type="none" @click="returnBack"></base-button>
      </div>
    <div class="consumableReceive-form-body" >
        <div class="process-info">
            <define-input label="单号" :disabled="true" v-model="order.number"  placeholder="-"></define-input>
            <base-select label="类型" v-model="order.category" :disabled="true" :selectList="selectData"></base-select>
            <date-select label="操作时间"  :disabled="true"  v-model="order.createTime"  placeholder="-"></date-select>
            <entity-input label="操作人员" v-model="order.operatorInfo" format="{name}" :disabled="true" ></entity-input>
        </div>
        <div class="process-info" style="z-index:-1">
            <define-input label="备注" v-model="order.remark" :column="12"></define-input>
        </div>
        <define-table v-if="order.category=='新增单'" :havaPage="false" :data="order.consumableItems" height="3.6042rem" >
            <define-column label="操作" width="100">
                <i class="iconfont icontianjialiang"></i>
                <i class="iconfont iconyichuliang"></i>
            </define-column>
            <define-column label="耗材名称" field="name"></define-column>
            <define-column label="库存数量" field="count"></define-column>
            <define-column label="耗材用途" field="describes"></define-column>
        </define-table>
        <define-table v-if="order.category=='领取单'||order.category=='补充单'" :havaPage="false" :data="order.consumableItems" height="3.6042rem" >
            <define-column label="操作" width="100">
                <i class="iconfont icontianjialiang"></i>
                <i class="iconfont iconyichuliang"></i>
            </define-column>
            <define-column label="耗材名称" field="consumableItems.name"></define-column>
            <define-column label="本次领补" field="consumableItems.name"></define-column>
        </define-table>
    </div>
  </div>
</template>

<script>
    import myHeader from "components/base/header/header";
    import baseButton from "@/componentized/buttonBox/baseButton";
    import entityInput from "@/componentized/entity/entityInput";
    import { receiveConsumable, addConsumable } from "api/consumable";
    import dateSelect from '@/componentized/textBox/dateSelect.vue'
    var _ = require("lodash");
    export default {
        name: "consumableReceive",
        data() {
            return {
                order: {},
                selectData:[{
                    label:"领取",
                    value:"领取单",
                },{
                    label:"补充",
                    value:"补充单"
                },{
                    label:"新增",
                    value:"新增单"
                }],
                title:"",
            };
        },
        methods: {
            returnBack(){
                this.$router.go(-1)
            }
        },
        created() {
            if(this.$route.params.info == undefined) {
                this.$message.info("数据丢失，返回耗材记录");
                this.$router.push({name: "record/consumablerecord",})
                return
            }
            this.title = "耗材记录详情",
            this.order = this.$route.params.info.data
            this.order.operatorInfo={
                name:this.order.operatorInfo.operator,
                id:this.order.operatorInfo.operatorId
            }
        },
        components: {
            myHeader,
            baseButton,
            dateSelect,
            entityInput
        },
    };
</script>

<style lang="scss" scoped>
    .consumableReceive-form-container {
        font-size: 16px;
    }
    .consumableReceive-form-top {
        padding: 18px 7px;
        border-bottom: 1px solid #ebeef5;
        overflow: hidden;
    }
    .consumableReceive-form-body {
        padding: 0 7px;
        widows: 100%;
    }
    .process-info {
        padding: 18px 0;
        display: flex;
        justify-content: space-between;
    }
    .buttom {
        height: 72px;
        margin-top: 25px;
        box-shadow:0px 0px 12px rgba(235,238,245,1);
        .sum-equip {
            float: right;
            font-size:20px;
            color: #3F5FE0;
            line-height: 72px;
            margin-right: 72px;
        }
    }
    .consumableReceive-header{
        width: 100%;
        padding-left: 18px;
        padding-right: 35px;
        height: 57px;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: justify;
        -ms-flex-pack: justify;
        justify-content: space-between;
        color: rgba(112,112,112,1);
        border-bottom: 1px solid rgba(112,112,112, 0.13);
    }
</style>
