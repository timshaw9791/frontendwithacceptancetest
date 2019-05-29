<template>
    <div class="warehousingComponents">
        <span v-text="equipment.name"></span>
        <progress-circular :width="142" :percentage="getPercentage()" style="margin-top: 31px">
            <span v-text="equipment.outHouseCount" class="inCircular"></span>
            <span v-text="'出库'" class="inCircular" style="margin-top: 5px"></span>
        </progress-circular>
        <div class="warehousingData" style="margin-top: 27px">
            <div class="circular"></div>
            <span v-text="'在库'" style="margin-left: 6px"></span>
            <span v-text="equipment.inHouseCount+'件'" style="margin-left: 10px"></span>
        </div>
        <div class="warehousingData" style="margin-top: 17px">
            <div class="circular" style="background:rgba(59,134,255,1);"></div>
            <span v-text="'出库'" style="margin-left: 6px"></span>
            <span v-text="equipment.outHouseCount+'件'" style="margin-left: 10px"></span>
        </div>
    </div>
</template>

<script>
    import ProgressCircular from "../../base/progressCircular";
    export default {
        name: "warehousingComponents",
        components: {ProgressCircular},
        props:{
            equipment:{
                type:Object,
                default(){
                    return{
                        typeEquipment:'警械类',
                        entNumber:1260,
                        outNumber:200,
                        percentage:45
                    }
                }
            }
        },
        methods:{
            getPercentage(){

                return this.equipment.outHouseCount==0?0:this.equipment.outHouseCount/(this.equipment.outHouseCount+this.equipment.inHouseCount)*100
            }
        }
    }
</script>

<style scoped>
    .warehousingComponents{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    .warehousingComponents .warehousingData{
        width: 142px;
        display: flex;
        align-items: center;
    }
    .warehousingComponents .inCircular{
        font-size: 18px;
        color: #4D4F5C;
    }
    .warehousingData .circular{
        width:10px;
        height:10px;
        border-radius:50%;
        background:rgba(232,234,239,1);
        margin-left: 23px;
    }
</style>