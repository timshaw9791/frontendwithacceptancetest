<template>
    <div class="inventory-box" v-if="!show">
        <div class="header">
            <div class="header-item">
                <span v-text="'开始时间：'"></span>
                <div class="header-content">
                    <span v-text="startTime"></span>
                </div>
            </div>
            <div class="header-item">
                <span v-text="'结束时间：'"></span>
                <div class="header-content">
                    <span v-text="endTime"></span>
                </div>
            </div>
            <div class="header-item">
                <span v-text="'操作人员：'"></span>
                <div class="header-content">
                    <span v-text="overview.operatorInfo.operator"></span>
                </div>
            </div>
        </div>
        <div class="title">
            <div class="title-box">
                <div class="title-item">
                    <span v-text="'盘点总数'"></span><span style="margin-left: 23px" v-text="overview.inventoryCount"></span>
                </div>
                <div class="title-item" style="margin-left: 73px">
                    <span v-text="'未盘点数'"></span>
                    <span style="margin-left: 23px" v-text="overview.notCount"></span>
                    <span v-text="'(出库数量'"></span>
                    <span style="margin-left: 5px" v-text="overview.outHouseCount"></span><span v-text="')'"></span>
                </div>
            </div>
        </div>
        <div class="body">
            <span v-text="'未在库装备统计：'"></span>
            <field-table :list="overview.inventoryDetailSet" :labelList="table.labelList" height="3rem" :havePage="false"
                        :tableAction="table.tableAction"  style="width: 100%">
            </field-table>
        </div>
        <div class="bottom">
            <span v-text="'备注：'"></span>
            <span v-model="overview.remark"></span>
        </div>
    </div>
</template>

<script>
    import {transformMixin} from "common/js/transformMixin";

    export default {
        name: "inventoryinfo",
        components:{
            
        },
        mixins: [transformMixin],
        data(){
            return{
                table: {
                    flag: false,
                    labelList: [
                        {lable: 'RFID', field: 'equipInfo.rfid',sort:false},
                        {lable: '装备序号', field: 'equipInfo.serial',sort:false},
                        {lable: '装备型号', field: 'equipInfo.model',sort:false},
                        {lable: '装备名称', field: 'equipInfo.equipName',sort:false},
                        {lable: '装备位置', field: 'equipInfo',filter: (ns) => this.fixposition(ns.equipInfo)},
                    ],
                },
            }
        },
        props:{
            overview:{
              type:Object
            },
            show:{
                type:Boolean,
                default:true
            }
        },
        watch:{

        },
        computed:{
          name: ()=> {
              return this.overview.operatorInfo.operator
          },
            startTime:function() {
              let time='';
              if(this.overview.createTime){
                  console.log(new Date(this.overview.createTime));
                  time = this.$filterTime(this.overview.createTime);
              }
                return time;
            },
            endTime:function(){
                let time='';
                if(this.overview.updateTime){
                    console.log(new Date(this.overview.updateTime));
                    time = this.$filterTime(this.overview.updateTime);
                }
                return time
            }
        },

        methods:{
        }
    }
</script>

<style scoped>
    .inventory-box{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        font-size: 0.0833rem;
        color: #707070;
        height: 100%;
    }
    .inventory-box .header{
        width: 6.4792rem;
        height: 30.0096px;
        display: flex;
        justify-content: space-between;
        margin: 0.125rem 0px;
    }
    .header .header-item{
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .header-item .header-content{
        width:1.1302rem;
        height:0.1563rem;
        background:rgba(235,235,235,1);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .inventory-box .title{
        width:6.4792rem;
        height:0.2396rem;
        background:rgba(47,47,118,0.03);
        border:1px solid rgba(112,112,112,0.03);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .title .title-box{
        height: 100%;
        display: flex;
        align-items: center;
    }
    .title-box .title-item{
        color: #2F2F76;
    }
    .inventory-box .body{
        width:6.4792rem;
        display: flex;
        flex-direction:column;
        margin-top: 0.1302rem;
        margin-bottom: 0.0781rem;
    }
    .inventory-box .bottom{
        width: 6.4792rem;
        margin-top: 0.0781rem;
        display: flex;
        align-items: center;
        height: 0.1563rem;
        margin-bottom: 0.0781rem;
    }

    .bottom .submit{
        width:70.0032px;
        height:30.0096px;
        background:rgba(47,47,118,1);
        color: white;
        line-height: 0px;
        box-shadow:0px 3px 6px rgba(0,0,0,0.16);
        opacity:1;
        border-radius:6px;
    }
    .tip{
        width:6.4792rem;
        margin-top: 0.0781rem;
        height:0.2396rem;
    }
    .tip-span{
        float: right;
        color: red;
    }
</style>