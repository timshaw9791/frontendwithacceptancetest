<template>
    <div style="width: 180px;margin-left: 40px;margin-top: 20px">
        <surrounding-card :header="(index+1)+'号除湿器'" :height="39">
            <div class="hum_body">
                 <svg-icon icon-class="除湿器" style="width: 70px;height: 48px"></svg-icon>
                   <switch-control ref="switch_single" :active="active" :inactive="inactive" style="margin-top: 31px" :status="dehumidificationStatus?true:false" @handleChange="dehumidificationControl"></switch-control>
            </div>
        </surrounding-card>
    </div>
</template>

<script>
    import surroundingCard from '../surroundingCard'
    import switchControl from './controlComponents/switchControl'
    import {baseURL} from "../../../api/config";
    import {HunSwitch, dehumidifierStatus} from "api/surroundings"

     export default {
        name: "dehumi",
        components: {
            
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
                dehumidificationStatus:false,
                flag:true
            }
        },
        created(){
            // this.getThreshold();
            this.getDehumidification()
            },
        props:{
            index:{
                    type:Number
                },
            item:{
                type:[String, Boolean],
                default:''
            }
        },
        methods:{
            getDehumidification(){
                dehumidifierStatus({number: this.index+1}).then(res => {
                    this.dehumidificationStatus = res
                })
            },
            dehumidificationControl(data){
               HunSwitch({
                   number:this.index+1,
                   status:data
               }).then(res=>{
                   if (res.msg=='成功') {
                        this.dehumidificationStatus=data;
                        if(data){
                            this.$message.success('开启成功');
                        }else {
                            this.$message.success('关闭成功');
                        }
                    }
               }).catch(err=>{
                   this.$message.error(err.response.data.message);
                   this.$refs.switch_single.fail()
                   
               })
             
            },
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
            // submission(){
            //     this.submissionThreshold()
            // },
            // submissionThreshold(){
            //     this.$ajax({
            //         method:'post',
            //         url:baseURL+'/environment/humidityThresholdSet',
            //         params:{max:this.threshold}
            //     }).then((res)=>{
            //         this.flag=!this.flag;
            //         this.$message.success('提交成功');
            //     }).catch(err=>{
            //         this.$message.error(err);
            //     });
            // },
            // getThreshold(){
            //     this.$ajax({
            //         method:'post',
            //         url:baseURL+'/environment/humidityThreshold',
            //     }).then((res)=>{
            //         this.threshold=res.data.data.humidityThreshold
            //     }).catch(err=>{
            //         this.$message.error(err);
            //     });
            // }
        }
    }
</script>

<style scoped>
    .hum_body{
        height: 248px;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
    }
</style>
