<template>
  <div class="consumableReceive-form-container">
    <my-header :title="title" :haveBlack="false"></my-header>
    <div class="consumableReceive-form-body" >
        <div class="process-info">
            <define-input label="单号" :disabled="true"  placeholder="-"></define-input>
            <base-select label="类型" v-model="order.outboundOrganUnit" :selectList="selectData"></base-select>
            <date-select label="操作时间"  :disabled="true"  placeholder="-"></date-select>
            <define-input label="操作人员" :disabled="true"  placeholder="-"></define-input>
        </div>
        <div class="process-info" style="z-index:-1">
            <define-input label="备注" :column="12"></define-input>
        </div>
        <define-table v-if="title=='耗材新增'" :havaPage="false" :data="order" height="3.6042rem" >
            <define-column label="操作" width="100" v-slot="{ data }">
                <i class="iconfont icontianjialiang" @click="changeRow(true,data)"></i>
                <i class="iconfont iconyichuliang" @click="changeRow(false,data)"></i>
            </define-column>
            <define-column label="耗材名称" v-slot="{ data }">
                <define-input v-model="data.row.name"></define-input>
            </define-column>
            <define-column label="库存数量" v-slot="{ data }">
                <define-input v-model="data.row.count"></define-input>
            </define-column>
            <define-column label="耗材用途" v-slot="{ data }">
                <define-input v-model="data.row.describes"></define-input>
            </define-column>
        </define-table>
        <define-table v-if="title=='耗材领补'" :havaPage="false" :data="order" height="3.6042rem" >
            <define-column label="操作" width="100" v-slot="{ data }">
                <i class="iconfont icontianjialiang" @click="changeRow(true,data)"></i>
                <i class="iconfont iconyichuliang" @click="changeRow(false,data)"></i>
            </define-column>
            <define-column label="耗材名称" v-slot="{ data }">
                <entity-input v-model="data.row.consumable" format="{name}" :options="{search:'consumableSelect'}"></entity-input>
            </define-column>
            <define-column label="库存数量" v-slot="{ data }">
                <define-input v-model="data.row.consumable.count"></define-input>
            </define-column>
            <define-column label="本次领补" v-slot="{ data }">
                <define-input v-model="data.row.count"></define-input>
            </define-column>
        </define-table>
        <div class="buttom">
            <base-button label="提交" align="right" size="large" @click="submit"></base-button>
            <base-button label="返回" align="right" size="large" type="danger" @click="this.$router.go(-1);"></base-button>
        </div>
    </div>
  </div>
</template>

<script>
    import myHeader from "components/base/header/header";
    import baseButton from "@/componentized/buttonBox/baseButton";
    import entityInput from "@/componentized/entity/entityInput";
    import { consumableRecordList } from "api/consumable";
    import dateSelect from '@/componentized/textBox/dateSelect.vue'
    var _ = require("lodash");
    export default {
        name: "consumableReceive",
        data() {
            return {
                order: [],
                selectData:[{
                    label:"领取",
                    value:"1"
                },{
                    label:"补充",
                    value:"2"
                }],
                title:""
            };
        },
        methods: {
            changeRow(state, data) { // 总清单删除
                let temp = JSON.parse(JSON.stringify(this.order));
                console.log("data",data);
				if(state) {
					temp.splice(data.$index+1, 0, {name:"",count:"",describes:""});
				} else if(this.order.length>1) {
					temp.splice(data.$index, 1); 
				} else {
                    temp = [{name:"",count:"",describes:""}]
                }
				this.order.equips = temp;
            },
            submit(){
                console.log("this.order",this.order);
            }
        },
        created() {
            if(this.$route.params.info == undefined) {
                this.$message.info("数据丢失，返回耗材管理");
                this.$router.go(-1);
                return
            }
            this.title = this.$route.params.info.title
            if(this.title == '耗材新增'){
                this.order = [
                    {name:"",count:"",describes:""},
                    {name:"",count:"",describes:""},
                    {name:"",count:"",describes:""},
                    {name:"",count:"",describes:""},
                    {name:"",count:"",describes:""},
                    {name:"",count:"",describes:""},
                    {name:"",count:"",describes:""},
                    {name:"",count:"",describes:""},
                    {name:"",count:"",describes:""},
                    {name:"",count:"",describes:""},
                    {name:"",count:"",describes:""},
                ]
            }else if (this.title == '耗材领补'){
                this.order = [
                    {consumable:{name:"",count:""},count:""},
                    {consumable:{name:"",count:""},count:""},
                    {consumable:{name:"",count:""},count:""},
                    {consumable:{name:"",count:""},count:""},
                    {consumable:{name:"",count:""},count:""},
                    {consumable:{name:"",count:""},count:""},
                    {consumable:{name:"",count:""},count:""},
                    {consumable:{name:"",count:""},count:""},
                    {consumable:{name:"",count:""},count:""},
                ]
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
        overflow: hidden;
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
</style>
