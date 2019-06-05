<template>
    <div class="airConditioning">
        <dialogs :width="398" ref="dialog" :title="'空调控制'">
            <div class="airConditioning-body">
                <div class="airConditioning-box">
                    <svg-icon icon-class="空调图标" style="width: 70px;height: 48px"></svg-icon>
                    <span v-text="'空调控制'" style="margin-top: 19px"></span>
                    <switch-control :active="active" :inactive="inactive" style="margin-top: 31px"></switch-control>
                    <switch-control :active="activeTwo" :inactive="inactiveTwo" style="margin-top: 31px"></switch-control>
                </div>
                <div class="airConditioning-bottom">
                    <span v-text="'温度阈值：'"></span><input class="input" :style="flag?'border:none;':''" v-model="threshold.max" :disabled="flag"/>
                    <span>~~</span><input class="input" :style="flag?'border:none;':''" v-model="threshold.min" :disabled="flag"/>
                    <div @click="toSetThreshold">
                        <svg-icon icon-class="编辑" style="width: 18px;height: 18px;margin-left: 24px"></svg-icon>
                    </div>
                </div>
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
    import switchControl from './controlComponents/switch'
    export default {
        name: "airConditioning",
        components: {
            dialogs,
            surroundingCard,
            switchControl
        },
        data() {
            return {
                active:{
                    text:'打开',
                    color:'#39BC53',
                },
                inactive:{
                    text:'关闭',
                    color:'#B8B8B8',
                },
                activeTwo:{
                    text:'制热',
                    color:'#EF4545',
                },
                inactiveTwo:{
                    text:'制冷',
                    color:'#2680EB',
                },
                flag:true,
                threshold:{
                    max:'',
                    min:''
                }
            }
        },
        created(){
            this.getThreshold()
        },
        methods:{
            show(){
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
            submission(){
                this.submissionThreshold()
            },
            submissionThreshold(){
                this.$ajax({
                    method:'post',
                    url:'http://10.128.4.109:8088/environment//temperatureThresholdSet',
                    params:{max:this.threshold.max,min:this.threshold.min}
                }).then((res)=>{
                    this.flag=!this.flag;
                    this.$message.success('提交成功');
                }).catch(err=>{
                    this.$message.error(err);
                });
            },
            getThreshold(){
                this.$ajax({
                    method:'post',
                    url:'http://10.128.4.109:8088/environment/temperatureThreshold',
                }).then((res)=>{
                    this.threshold.max=res.data.data.temperatureMaximum;
                    this.threshold.min=res.data.data.temperatureMinimum;
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
</style>