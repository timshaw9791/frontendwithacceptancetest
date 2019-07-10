<template>
    <div class="smokeAlarm">
        <dialogs :width="398" ref="dialog" :title="'烟雾报警'">
            <div class="smokeAlarm-body">
                <div class="smokeAlarm-top">
                    <svg-icon icon-class="烟雾报警" style="width: 56px;height: 70px"></svg-icon>
                    <span v-text="'烟雾报警'" style="margin-top: 8px"></span>
                    <!--<span v-text="'关闭报警'" class="smokeAlarm-button"></span>-->
                </div>
                <div class="smokeAlarm-bottom">
                    <span v-text="'当前浓度：'+concentration+'%'"></span>
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
                concentration:''
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
                    url:'http://10.128.4.152:8080/warehouse/environment/smokeQuery',
                }).then((res)=>{
                    this.concentration=res.data.data
                }).catch(err=>{
                    this.$message.error(err);
                });
            }
        }
    }
</script>

<style scoped>
    .smokeAlarm {
        width: 100%;
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