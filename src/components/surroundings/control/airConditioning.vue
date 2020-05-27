<template>
    <div class="airConditioning">
        <dialogs :width="1040" ref="dialog" :title="'空调控制'">
         <div class="air_box">
                <div class="airConditioning-box">
                   <air-control
                    v-for="(item,index) in airList" 
                    :index="index"
                    :item="item"
                    :key="'kt'+index"></air-control>
                </div>
          </div>
        </dialogs>
    </div>
</template>

<script>
    import dialogs from '../surroundingDialog'
    import surroundingCard from '../surroundingCard'
    import airControl from './airControl'
    import { getdeploy } from 'api/login'
    import { allAirControlStatus, temperatureThresholdSet, temperatureThreshold, airConditionerSwitch, airConditionerStatus } from 'api/surroundings'

    export default {
        name: "airConditioning",
        components: {
            dialogs,
            surroundingCard,
            airControl
        },
        data() {
            return {
                airList: []
            }
        },
        props: {
            count: {
                default: 0
            }  
        },
        methods:{
            getAirStatusList(){
                allAirControlStatus().then(res => {
                    this.airList = Object.values(res)
                })
            },
            show(){
                this.getAirStatusList()
                this.$refs.dialog.show();
            },
            close(){
                this.$refs.dialog.close();
            }
        }
    }
</script>

<style scoped>
    .airConditioning {
       font-size: 16px;
        width: 4.6875rem;
        
    }
    .air_box{
      width: 100%;
        height: 3.6302rem;
   
    }
    .airConditioning .airConditioning-body {
        height: 416px;
        display: flex;
        align-items: center;
        /* padding-top: 20px; */
        flex-direction: column;
        font-size: 16px;
        color: #707070;
        position:relative;
    }
    .airConditioning-box{
        /* border: 1px solid black;
        width: 180px;
        height: 248px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        box-shadow:0px 3px 6px rgba(0,0,0,0.16); */
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        padding-left: 0.3125rem;
    }
    .airConditioning-body .airConditioning-bottom{
        height: 22px;
        /* 
         */
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .airConditioning-bottom .input{
        width: 41px;
        outline:none;
        line-height: 30px;
        text-align: center;
        color: #707070;
    }
    .airConditioning-body .airConditioning-button{
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        bottom: 33px;
    }
    .airConditioning-button .cancel{
        width:70px;
        height:30px;
        background:rgba(255,255,255,1);
        box-shadow:0px 3px 6px rgba(0,0,0,0.16);
        opacity:1;
        border-radius:6px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #707070;
    }
    .airConditioning-button .submission{
        width:70px;
        height:30px;
        background:rgba(47,47,118,1);
        box-shadow:0px 3px 6px rgba(0,0,0,0.16);
        opacity:1;
        border-radius:6px;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 27px;
    }
    .tip{
        color: red;
        margin-top: 10px
    }
</style>
