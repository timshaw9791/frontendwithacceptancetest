<template>
  <div class="consumableReceiveInfo-form-container">
      <div class="consumableReceiveInfo-header">
        <span style="font-size: 20px;">耗材记录详情</span>
        <base-button label="<-返回" align="right" type="none" @click="returnBack"></base-button>
      </div>
    <div class="consumableReceiveInfo-form-body" >
        <div class="process-info">
            <define-input label="单号" :disabled="true" v-model="order.number"  placeholder="-"></define-input>
            <base-select label="类型" v-model="order.category" :disabled="true" :selectList="selectData"></base-select>
            <date-select label="操作时间"  :disabled="true"  v-model="order.createTime"  placeholder="-"></date-select>
            <entity-input label="操作人员" v-model="order.operatorInfo" format="{name}" :disabled="true" ></entity-input>
        </div>
        <div class="process-info">
            <define-input label="备注" margin="15px 15px " v-model="order.remark" placeholder="--"  :disabled="true"></define-input>
        </div>
        <define-table :showSummary="true" :summaryFunc="sumFunc" ref="table" :havePage="false" :data="order.consumableItems" height="4rem" >
            <define-column label="操作" width="100">
                <i class="iconfont icontianjia"></i>
                <i class="iconfont iconyichu"></i>
            </define-column>
            <define-column label="耗材名称" field="name"></define-column>
            <define-column label="本次领补" field="count"></define-column>
        </define-table>
    </div>
  </div>
</template>

<script>
    import baseButton from "@/componentized/buttonBox/baseButton";
    import entityInput from "@/componentized/entity/entityInput";
    import { getBosEntity } from "api/basic";
    import dateSelect from '@/componentized/textBox/dateSelect.vue'
    var _ = require("lodash");
    export default {
        name: "consumableReceiveInfo",
        data() {
            return {
                order: {
                    consumableItems:[]
                },
                selectData:[{
                    label:"领取",
                    value:"0",
                },{
                    label:"补充",
                    value:"1"
                }],
                title:"",
            };
        },
        methods: {
            returnBack(){
                this.$router.back()
            },
            fetchData(){
                getBosEntity(this.$route.query.info).then(res=>{
                    this.order = res
                    this.order.operatorInfo={
                        name:this.order.operatorInfo.operator,
                        id:this.order.operatorInfo.operatorId
                    }
                })
            },
            sumFunc(param) { // 表格合并行计算方法
                this.$nextTick(() => {
            this.$refs.table.refreshLayout();
               });
                let { columns, data } = param, sums = [];
                sums=new Array(columns.length).fill('')
                sums[0]='合计'
                sums[columns.length-1]=param.data.reduce((v,k)=>v+k.count,0)
                return sums;
            },
        },
        created() {
            this.fetchData()
        },
        components: {
            baseButton,
            dateSelect,
            entityInput
        },
    };
</script>

<style lang="scss" scoped>
// /deep/.el-table__footer-wrapper{
// overflow: visible !important
// }
    .consumableReceiveInfo-form-container {
        font-size: 16px;
    }
    .consumableReceiveInfo-form-top {
        padding: 18px 7px;
        border-bottom: 1px solid #ebeef5;
        overflow: hidden;
    }
    .consumableReceiveInfo-form-body {
        padding: 0 7px;
        widows: 100%;
    }
    .process-info {
        // padding: 18px 0;
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
    .consumableReceiveInfo-header{
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
