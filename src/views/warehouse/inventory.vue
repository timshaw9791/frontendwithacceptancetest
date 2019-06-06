<template>
    <div class="inventory">
        <my-header :title="'盘点'" :searchFlag="false"></my-header>
        <div class="action-bar">
            <el-button type="text" class="in_button"  @click="toInventory">
                <svg-icon icon-class="加"/>
                开始盘点
            </el-button>
        </div>
        <i_inventory></i_inventory>
        <i_dialog ref="inventory_dialog" :rfList="inventory.rflist" :size="inventory.size" @submit=""></i_dialog>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header'
    import i_inventory from 'components/inventory/inventoryComponent'
    import i_dialog from 'components/inventory/inventoryDialog'
    import inventoryData from './inventoryData'
    export default {
        name: "inventory",
        components:{
            myHeader,
            i_inventory,
            i_dialog
        },
        data(){
            return{
                inventory:{
                    rflist:[],
                    endTime:'',
                    startTime:'',
                    size:''
                }
            }
        },
        methods:{
            toInventory(){
                this.getInventoryRf();
                this.$refs['inventory_dialog'].show();
            },
            getInventoryRf(){
                this.inventory.rflist=[];
                inventoryData.rfid.forEach((item,index)=>{
                    let number = index+1;
                    if(number<10){
                        number='0'+number
                    }
                    this.inventory.rflist.push({
                        number:number,
                        rfId:item
                    })
                });
                this.inventory.endTime=inventoryData.endTime;
                this.inventory.startTime=inventoryData.startTime;
                this.inventory.size=inventoryData.size;
            }
        }
    }
</script>

<style scoped>
.inventory{
width: 100%;
}
    .inventory .action-bar{
        height: 58px;
        width: 100%;
        display: flex;
        align-items: center;
        border-bottom: 1px solid rgba(112,112,112,0.13);
        border-top: 1px solid rgba(112,112,112,0.13);
        padding-left: 18px;
    }
    .action-bar .in_button{
        color: #2F2F76;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>