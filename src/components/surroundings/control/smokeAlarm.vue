<template>
    <div class="smokeAlarm">
        <dialogs :width="398" ref="dialog" :title="'烟雾报警'">
            <div class="smokeAlarm-body">
                <div class="smokeAlarm-top">
                    <svg-icon icon-class="烟雾报警" style="width: 56px;height: 70px"></svg-icon>
                    <span v-text="'烟雾报警'" style="margin-top: 8px"></span>
                    <!-- <span v-text="'关闭报警'" class="smokeAlarm-button"></span> -->
                </div>
                <div class="smokeAlarm-bottom">
                    <span v-text="'当前浓度：'+concentration+'ppm'"></span>
                </div>
               
            </div>
        </dialogs>
    </div>
</template>

<script>
    import dialogs from '../surroundingDialog'
    import surroundingCard from '../surroundingCard'
    import switchControl from './controlComponents/switchControl'
    import { smokeThreshold, setSmokeThreshold } from "api/surroundings"
    import {baseURL} from "../../../api/config";

    export default {
        name: "smokeAlarm",
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
                concentration:'',
                notModify: true,
                threshold: 0, // 烟雾阈值
            }
        },
        created(){
            this.getConcentration();
        },
        methods:{
            show(){
                this.$refs.dialog.show();
            },
            close(){
                this.$refs.dialog.close();
            },
            getConcentration(){
                this.$ajax({
                    method:'post',
                    url:baseURL+'/environment/smokeQuery',
                }).then((res)=>{
                    this.concentration=res.data.data
                }).catch(err=>{
                    this.$message.error(err.response.data.message);
                });
                
                smokeThreshold().then(res => {
                    this.threshold = res.data
                })
            },
            submission() {
                if(this.threshold < 0) {
                    this.$message.error("烟雾浓度不可小于0%")
                } else if(this.threshold > 100) {
                    this.$message.error("烟雾浓度不可大于100%")
                } else {
                    setSmokeThreshold({max: this.threshold}).then(res => {
                        this.$message.success("设置成功")
                        this.notModify = true
                    })
                }
            }
        }
    }
</script>

<style scoped>
    .smokeAlarm {
        width: 100%;
    }

     .dehumidification-bottom{
        height: 22px;
        margin-top: 0.0885rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .input{
        width: 41px;
        outline:none;
        line-height: 30px;
        text-align: center;
        color: #707070;
    }

    .dehumidification-button{
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        bottom: 16px;
    }
    
    .cancel{
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
    .submission{
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

    .smokeAlarm .smokeAlarm-body {
        height: 422px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        font-size: 16px;
        color: #707070;
    }
    .smokeAlarm-body .smokeAlarm-top{
        width: 180px;
        height: 207px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        box-shadow:0px 3px 6px rgba(0,0,0,0.16);
    }
    .smokeAlarm-top .smokeAlarm-button{
        width:93px;
        height:30px;
        background:rgba(239,69,69,1);
        box-shadow:0px 3px 6px rgba(0,0,0,0.16);
        opacity:1;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius:6px;
        color: white;
        margin-top: 24px;
    }
    .smokeAlarm-body .smokeAlarm-bottom{
        height: 22px;
        margin-top: 29px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
