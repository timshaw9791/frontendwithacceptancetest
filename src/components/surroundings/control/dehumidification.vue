<template>
    <div class="dehumidification">
        <dialogs :width="398" ref="dialog" :title="'湿度控制器'">
            <div class="dehumidification-body">
               <div class="dehumidification-top">
                   <svg-icon icon-class="除湿图标" style="width: 56px;height: 70px"></svg-icon>
                   <span v-text="'除湿控制器'" style="margin-top: 8px"></span>
                   <switch-control :active="active" :inactive="inactive" style="margin-top: 31px"></switch-control>
               </div>
               <div class="dehumidification-bottom">
                   <span v-text="'湿度阈值：'"></span><input class="input" :style="flag?'border:none;':''" v-model="threshold" :disabled="flag"/>
                   <div @click="toSetThreshold">
                       <svg-icon icon-class="编辑" style="width: 18px;height: 18px;margin-left: 24px"></svg-icon>
                   </div>
               </div>
                <div class="dehumidification-button" v-if="!flag">
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
        name: "dehumidification",
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
                threshold:'',
                flag:true
            }
        },
        created(){
            this.getThreshold();
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
                    url:'http://10.128.4.152:8080/warehouse/environment/humidityThresholdSet',
                    params:{max:this.threshold}
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
                    url:'http://10.128.4.152:8080/warehouse/environment/humidityThreshold',
                }).then((res)=>{
                    this.threshold=res.data.data.humidityThreshold
                }).catch(err=>{
                    this.$message.error(err);
                });
            }
        }
    }
</script>

<style scoped>
    .dehumidification {
        width: 100%;
    }

    .dehumidification .dehumidification-body {
        height: 416px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        font-size: 16px;
        color: #707070;
        position: relative;
    }
    .dehumidification-body .dehumidification-top{
        width: 180px;
        height: 207px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        box-shadow:0px 3px 6px rgba(0,0,0,0.16);
    }
    .dehumidification-body .dehumidification-bottom{
        height: 22px;
        margin-top: 29px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .dehumidification-bottom .input{
        width: 41px;
        outline:none;
        line-height: 30px;
        text-align: center;
        color: #707070;
    }
    .dehumidification-body .dehumidification-button{
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        bottom: 33px;
    }
    .dehumidification-button .cancel{
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
    .dehumidification-button .submission{
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
