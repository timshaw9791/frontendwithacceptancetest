<template>
    <div class="inventory-box">
        <div class="header">
            <div class="header-item">
                <span v-text="'开始时间：'"></span>
                <div class="header-content"><span v-text="'aaaaaaaa'"></span></div>
            </div>
            <div class="header-item">
                <span v-text="'结束时间：'"></span>
                <div class="header-content"><span v-text="'aaaaaaaa'"></span></div>
            </div>
            <div class="header-item">
                <span v-text="'操作人员：'"></span>
                <div class="header-content"><span v-text="'小明'"></span></div>
            </div>
        </div>
        <div class="title">
            <div class="title-box">
                <div class="title-item">
                    <span v-text="'盘点总数'"></span><span style="margin-left: 23px">0</span>
                </div>
                <div class="title-item" style="margin-left: 73px">
                    <span v-text="'未盘点数'"></span><span style="margin-left: 23px">0</span>
                </div>
                <div class="title-item" style="margin-left: 73px">
                    <span v-text="'出库数量'"></span><span style="margin-left: 23px">0</span>
                </div>
            </div>
        </div>
        <div class="body">
            <span v-text="'未在库装备统计：'"></span>
            <inventory-table style="margin-top: 7px"></inventory-table>
        </div>
        <div class="bottom">
            <span v-text="'备注：'"></span>
            <el-input v-model="remark" placeholder="请输入内容" style=""></el-input>
        </div>
    </div>
</template>

<script>
    import inventoryTable from './inventoryTable'
    export default {
        name: "inventoryComponent",
        components:{
            inventoryTable
        },
        data(){
            return{
                remark:''
            }
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
        font-size: 16px;
        color: #707070;
        height: 100%;
    }
    .inventory-box .header{
        width: 976px;
        height: 30px;
        display: flex;
        justify-content: space-between;
        margin: 24px 0px;
    }
    .header .header-item{
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .header-item .header-content{
        width:217px;
        height:30px;
        background:rgba(235,235,235,1);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .inventory-box .title{
        width:976px;
        height:46px;
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
        width:976px;
        display: flex;
        flex-direction:column;
        margin-top: 25px;
        margin-bottom: 15px;
    }
    .inventory-box .bottom{
        width: 976px;
        margin-top: 15px;
        display: flex;
        align-items: center;
        height: 30px;
        margin-bottom: 15px;
    }
</style>