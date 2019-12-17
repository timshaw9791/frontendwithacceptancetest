<template>
    <div class="dehumidification">
        <dialogs :width="1040" ref="dialog" :title="'除湿器控制'">
            <div class="hum_box">
            <div class="dehumidification-box">
               <dehumi
                v-for="(item,index) in humList" 
                    :index="index"
                    :item="item"
               >
               </dehumi>
               </div>
               </div>
        </dialogs>
    </div>
</template>

<script>
    import dialogs from '../surroundingDialog'
    import dehumi from './dehumi'
    import surroundingCard from '../surroundingCard'
    import switchControl from './controlComponents/switchControl'
    import {baseURL} from "../../../api/config";

    export default {
        name: "dehumidification",
        components: {
            dialogs,
            surroundingCard,
            switchControl,
            dehumi,
           
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
                flag:true,
                humNum:0,
                humList:''
            }
        },
        created(){
             
           
            },
        methods:{
            getConfig(){
                this.$ajax({
                    method:'post',
                    url:baseURL+'/environment/deviceConfig',
                }).then((res)=>{
                    this.humNum=res.data.data.DEHUMIDIFIER_COUNT
                }).catch(err=>{
                    this.$message.error(err);
                });
            },
            
            dehumidificationControl(){
                this.$ajax({
                    method:'post',
                    url:baseURL+'/environment/dehumidifierSwitch?status='+data,
                }).then((res)=>{
                    if (res.data.msg=='成功') {
                        this.dehumidificationStatus=data;
                        if(data){
                            this.$message.success('开启成功');
                        }else {
                            this.$message.success('关闭成功');
                        }
                    }
                }).catch(err=>{
                    this.$message.error(err);
                });
            },
            gethumList(){
                this.$ajax({
                    method:'post',
                    url:baseURL+'/environment/allDehumidifierStatus',
                }).then(res=>{
                    console.log("res");
                    console.log(res);
                    let arrList=res.data.data
                    let newList=Object.values(arrList)
                    this.humList=newList
                    console.log(this.humList);
                    console.log(res);
                })
            },
            show(){
                this.getConfig()
                this.gethumList();
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
                    url:baseURL+'/environment/humidityThresholdSet',
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
                    url:baseURL+'/environment/humidityThreshold',
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
        font-size: 16px;
        width: 4.6875rem;
    }

    .dehumidification .dehumidification-body {
        height: 416px;
        display: flex;
        align-items: center;
        /* padding-top: 20px; */
        flex-direction: column;
        font-size: 16px;
        color: #707070;
        position:relative;
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
    .hum_box{
        /* border:1px solid red; */
        width: 100%;
        height: 3.6302rem;
   
    }
    .dehumidification-box{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        padding-left: 0.3125rem;
    }
    .airConditioning-box{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        padding-left: 0.3125rem;
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
