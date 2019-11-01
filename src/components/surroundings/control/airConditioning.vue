<template>
    <div class="airConditioning">
        <dialogs :width="398" ref="dialog" :title="'空调控制'">
            <div class="airConditioning-body">
                <div class="airConditioning-box">
                    <svg-icon icon-class="空调图标" style="width: 70px;height: 48px"></svg-icon>
                    <span v-text="'空调控制'" style="margin-top: 19px"></span>
                    <switch-control :active="refrigerationActive" :inactive="refrigerationInactive" :status="refrigeration" style="margin-top: 31px" @handleChange="refrigerationControl"></switch-control>
                    <switch-control :active="heatingActive" :inactive="heatingInactive" :status='heating' style="margin-top: 16px"  @handleChange="heatingControl"></switch-control>
                    <switch-control :active="dehumidificationActive" :inactive="dehumidificationInactive" :status="dehumidification" style="margin-top: 16px"  @handleChange="dehumidificationControl"></switch-control>
                </div>
                <div class="airConditioning-bottom">
                    <span v-text="'温度阈值：'"></span>
                    <input class="input" :style="flag?'border:none;':''" v-model="threshold.min" :disabled="flag"/><span>~~</span>
                    <input class="input" :style="flag?'border:none;':''" v-model="threshold.max" :disabled="flag"/>
                    <div @click="toSetThreshold">
                        <svg-icon icon-class="编辑" style="width: 18px;height: 18px;margin-left: 24px"></svg-icon>
                    </div>
                </div>
                    <span class="tip" v-if="num">请输入-100~100以内的数值</span>
                    <span class="tip" v-if="order">请从低到高输入温度</span>
                <div class="airConditioning-button" v-if="!flag">
                    <span v-text="'取消'" @click="cancel" class="cancel"></span><span v-text="'提交'" @click="submission" class="submission"></span>
                </div>
            </div>
        </dialogs>
    </div>
</template>

<script>
    import dialogs from '../surroundingDialog'
    import surroundingCard from '../surroundingCard'
    import switchControl from './controlComponents/switchControl'
    import {baseURL} from "../../../api/config";

    export default {
        name: "airConditioning",
        components: {
            dialogs,
            surroundingCard,
            switchControl
        },
        data() {
            return {
                num:false,
                order:false,
                refrigerationActive:{
                    text:'',
                    color:'#39BC53',
                },
                refrigerationInactive:{
                    text:'制冷',
                    color:'#B8B8B8',
                },
                heatingActive:{
                    text:'',
                    color:'#39BC53',
                },
                heatingInactive:{
                    text:'制热',
                    color:'#B8B8B8',
                },
                dehumidificationActive:{
                    text:'',
                    color:'#39BC53',
                },
                dehumidificationInactive:{
                    text:'抽湿',
                    color:'#B8B8B8',
                },
                refrigeration:false,
                heating:false,
                dehumidification:false,
                flag:true,
                threshold:{
                    max:'',
                    min:''
                }
            }
        },
        created(){

        },
        methods:{
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
                this.$ajax({
                    method:'post',
                    url:baseURL+'/environment/airConditionerSwitch',
                    params:{status:data}
                }).then((res)=>{
                    this.$message.success('操作成功')
                }).catch(err=>{
                    this.$message.error(err);
                });
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
                    this.$ajax({
                        method:'post',
                        url:baseURL+'/environment/temperatureThresholdSet',
                        params:{max:this.threshold.max,min:this.threshold.min}
                    }).then((res)=>{
                        this.flag=!this.flag;
                        this.$message.success('提交成功');
                    }).catch(err=>{
                        this.$message.error(err);
                    });
                }

            },
            getThreshold(){
                this.$ajax({
                    method:'post',
                    url:baseURL+'/environment/temperatureThreshold',
                }).then((res)=>{
                    this.threshold.max=res.data.data.temperatureMaximum;
                    this.threshold.min=res.data.data.temperatureMinimum;
                }).catch(err=>{
                    this.$message.error(err);
                });
                this.$ajax({
                    method:'post',
                    url:baseURL+'/environment/airConditionerStatus',
                }).then((res)=>{
                    let status = res.data.data.STATUS;
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
                    //"REFRIGERATION"'"HOT""DEHUMIDIFICATION"
                    // if(res.data){
                    //     this.closeFlag=true
                    // }else {
                    //     this.closeFlag=false
                    // }

                }).catch(err=>{
                    this.$message.error(err);
                });
            }
        }
    }
</script>

<style scoped>
    .airConditioning {
        width: 100%;
    }

    .airConditioning .airConditioning-body {
        height: 416px;
        display: flex;
        align-items: center;
        padding-top: 20px;
        flex-direction: column;
        font-size: 16px;
        color: #707070;
        position:relative;
    }
    .airConditioning-body .airConditioning-box{
        width: 180px;
        height: 248px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        box-shadow:0px 3px 6px rgba(0,0,0,0.16);
    }
    .airConditioning-body .airConditioning-bottom{
        height: 22px;
        margin-top: 29px;
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
