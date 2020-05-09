<template>
    <div class="airConditioning">
        <dialogs :width="1040" ref="dialog" :title="'空调控制'">
         <div class="air_box">
                <div class="airConditioning-box">
                   <airControl
                    v-for="(item,index) in airList" 
                    :index="index"
                    :item="item"
                    :key="'kt'+index"></airControl>
                </div>
          </div>
        </dialogs>
    </div>
</template>

<script>
    import dialogs from '../surroundingDialog'
    import surroundingCard from '../surroundingCard'
    import airControl from './airControl'
    import {baseURL} from "../../../api/config";
    import { getdeploy } from 'api/login'
    import { allAirConditionerStatus, temperatureThresholdSet, temperatureThreshold, airConditionerSwitch, airConditionerStatus } from 'api/surroundings'

    export default {
        name: "airConditioning",
        components: {
            dialogs,
            surroundingCard,
            airControl
        },
        data() {
            return {
                num:false,
                order:false,
                flag:true,
                threshold:{
                    max:'',
                    min:''
                },
                airNum:0,
                airList:''
            }
        },
        methods:{
            getConfig(){
                getdeploy().then(res => {
                    this.airNum = res.AIR_CONDITIONER_COUNT;
                })
            },
            getAirStatusList(){
                allAirConditionerStatus().then(res => {
                    this.arrList = Object.values(res);
                })
            },
            refrigerationControl(data){
               if(data){
                   this.controlAir(1);
                   this.initStatus('refrigeration')
               }else {
                   this.controlAir(0)
               }
            },
            heatingControl(data){
                if(data){
                    this.controlAir(2);
                    this.initStatus('heating')
                }else {
                    this.controlAir(0)
                }
            },
            dehumidificationControl(data){
                if(data){
                    this.controlAir(3);
                    this.initStatus('dehumidification')
                }else {
                    this.controlAir(0)
                }
            },
            initStatus(data){
                switch (data) {
                    case 'refrigeration':
                        this.refrigeration=true;
                        this.heating=false;
                        this.dehumidification=false;
                        break;
                    case 'heating':
                        this.heating=true;
                        this.refrigeration=false;
                        this.dehumidification=false;
                        break;
                    case 'dehumidification':
                        this.dehumidification=true;
                        this.refrigeration=false;
                        this.heating=false;
                        break;
                    case 'close':
                        this.refrigeration=false;
                        this.heating=false;
                        this.dehumidification=false;
                        break;
                }
            },
            show(){
                this.getConfig()
                this.getAirStatusList()
                this.getThreshold();
                
                this.$refs.dialog.show();
            },
            close(){
                this.$refs.dialog.close();
            },
            toSetThreshold(){
                this.flag=!this.flag
            },
            cancel(){
                this.flag=!this.flag
            },
            controlAir(data){
                airConditionerSwitch({status: data}).then(res => {

                })
            },
            submission(){
                this.submissionThreshold()
            },
            submissionThreshold(){
                if(this.threshold.min>this.threshold.max){
                    this.num = false
                    this.order = true
                }else if(this.threshold.min<-100||this.threshold.max>100){
                    this.order = false
                    this.num = true
                }else{
                    this.order = false
                    this.num = false
                    temperatureThresoldSet(this.threshold).then(res => {
                        this.flag=!this.flag;
                        this.$message.success('提交成功');
                    })
                }
            },
            getThreshold(){
                temperatureThreshold().then(res => {
                    this.threshold.max=res.temperatureMaximum;
                    this.threshold.min=res.temperatureMinimum;
                })
                airConditionerStatus().then(res => {
                    let status = res.STATUS;
                    if(status=='REFRIGERATION'){
                        this.refrigeration=true;
                        this.initStatus('refrigeration')
                    }else if(status=='HOT'){
                        this.heating=true;
                        this.initStatus('heating')
                    }else if(status=='DEHUMIDIFICATION'){
                        this.dehumidification=true;
                        this.initStatus('dehumidification')
                    }else if(status=='CLOSE'){
                        this.initStatus('close')
                    }
                })
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
