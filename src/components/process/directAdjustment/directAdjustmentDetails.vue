<template>
    <div class="directAdjustmentDetails">
        <div class="directAdjustmentDetails-svg">
            <img src="../../icons/svg/未出库.png" v-if="direct.state=='IN'"/>
            <img src="../../icons/svg/已出库.png" v-if="direct.state=='OUT'"/>
        </div>
        <div class="directAdjustmentDetails-context">
            <div class="context-row"><div class="row-item-box"><span v-text="'调拨单号：'"></span><span v-text="direct.number"></span></div><div class="row-item-box"><span v-text="'调拨类型：'"></span><span v-text="filterType(direct.type)"></span></div><div class="row-item-box"></div></div>
            <div class="context-row"><div class="row-item-box"><span v-text="'调拨库房：'"></span><span v-text="direct.outHouseName"></span></div><div class="row-item-box"><span v-text="'调拨操作人员：'"></span><span v-text="direct.operator"></span></div><div class="row-item-box"><span v-text="'调拨时间：'"></span><span v-text="filterTime(direct.transferTime)"></span></div></div>
            <div class="context-row"><div class="row-item-box"><span v-text="'接受库房：'"></span><span v-text="direct.inHouseName"></span></div><div class="row-item-box"><span v-text="'接收人：'"></span><span v-text="direct.receiver"></span></div><div class="row-item-box"><span v-text="'接收时间：'"></span><span v-text="filterTime(direct.receiveTime)"></span></div></div>
            <div class="context-row"><div class="row-item-box"><span v-text="'装备统计：'"></span></div><div class="row-item-box"></div><div class="row-item-box"></div></div>
        </div>
        <div class="directAdjustmentDetails-table">
            <el-table
                    :data="direct.orderItems"
                    height="425"
                    border
                    style="width: 100%"
                    :align="align"
            >
                <el-table-column
                        label="序号"
                        type="index"
                        :index="indexMethod" width="180" :align="align">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="装备名称"
                        width="180"
                        :align="align"
                >
                </el-table-column>
                <el-table-column
                        prop="model"
                        label="装备型号"
                        :align="align"
                >
                </el-table-column>
                <el-table-column
                        prop="count"
                        label="装备数量"
                        :align="align"
                >
                </el-table-column>
            </el-table>
        </div>
        <div class="directAdjustmentDetails-bottom-context">
            <div class="bottom-context-item"><span v-text="'申请人：'"></span><span v-text="direct.applicant"></span></div>
            <div class="bottom-context-item" style="margin-top: 2px"><span v-text="'申请时间：'" style="margin-top: 8px"></span><span v-text="filterTime(direct.applyTime)"></span></div>
        </div>
        <div class="directAdjustmentDetails-buttom">
            <el-button  class="submits" @click="submit">出库</el-button>
        </div>
        <d_dialog ref="directAdjustmentDetails" :directObj="direct"></d_dialog>
    </div>
</template>

<script>
    import d_dialog from './directAdjustmentDialog'
    export default {
        name: "directAdjustmentDetails",
        components:{
          d_dialog
        },
        props:{
            direct:{
                type:Object
            }
        },
        data(){
            return{
                list:[],
                align:'center'
            }
        },
        created(){
          console.log(this.direct)
        },
        methods:{
            indexMethod(index) {
                return index +1;
            },
            submit(){
                this.$refs.directAdjustmentDetails.show();
            },
            filterType(type){
                if(type=='UP_TO_DOWN'){
                    return '直调'
                }else {
                    return '不知道'
                }
            },
            filterTime(date){
                let time='';
                if(date!=''&&date!=null){
                    let dateNow =  new Date(date);
                    let year = dateNow.getFullYear();
                    let moth = dateNow.getMonth()+1;
                    let day = dateNow.getDay();
                    let hour = dateNow.getHours();
                    let min = dateNow.getMinutes();
                    let seconds = dateNow.getSeconds();
                    time = year+'-'+addZero(moth)+'-'+addZero(day)+'\xa0\xa0\xa0'+addZero(hour)+':'+addZero(min)+':'+addZero(seconds);
                }
                function addZero(some) {
                    if (some<10){
                        return '0'+some
                    }else {
                        return some
                    }
                }
                return time
            }
        }
    }
</script>

<style scoped>
    .directAdjustmentDetails{
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #707070;
        position: relative;
    }
    .directAdjustmentDetails .directAdjustmentDetails-svg{
        position: absolute;
        top: 0px;
        right: 0px;
    }
    .directAdjustmentDetails .directAdjustmentDetails-context{
        margin-top: 42px;
        width: 975px;
        display: flex;
        flex-direction: column;
    }
    .directAdjustmentDetails-context .context-row{
        display: flex;
        align-items: center;
        justify-content:space-between;
    }
    .context-row .row-item-box{
        display: flex;
        align-items: center;
        width: 243px;
        height: 22px;
        margin-top: 8px;
    }
    .directAdjustmentDetails .directAdjustmentDetails-table{
        width: 975px;
        margin-top: 8px;
    }
    .directAdjustmentDetails .directAdjustmentDetails-bottom-context{
        width: 975px;
        margin-top: 12px;
        display: flex;
        flex-direction: column;
    }
    .directAdjustmentDetails-bottom-context .bottom-context-item{
        width: 100%;
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
    }
    .directAdjustmentDetails .directAdjustmentDetails-buttom{
        width: 975px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 75px;
    }
    .directAdjustmentDetails-buttom .submits{
        width:70px;
        height:30px;
        background:rgba(47,47,118,1);
        box-shadow:0px 3px 6px rgba(0,0,0,0.16);
        border-radius:6px;
        color: white;
        line-height: 0px;
    }
</style>