<template>
    <div class="airConditioning">
        <dialogs :width="398" ref="dialog" :title="'设备阈值控制'">
            <div class="airConditioning-body">
               
                <div class="airConditioning-bottom">
                    <span v-text="'空调温度阈值：'"></span>
                    <input class="input" style="border:1px solid #DCDFE6" v-model="thresholdMin" /><span>~~</span>
                    <input class="input" style="border:1px solid #DCDFE6" v-model="thresholdMax" /><span>&#8451</span>
                
                </div>
                <div class="airConditioning-bottom">
                    <span v-text="'除湿器湿度阈值：'"></span>
                    <input class="input" style="border:1px solid #DCDFE6" v-model="humidityThreshold" /><span> %</span>
                </div>
                <div class="airConditioning-bottom">
                    <span v-text="'烟雾浓度报警阈值：'"></span>
                    <input class="input"  v-model="smokeThreshold" style="border:1px solid #DCDFE6"/><span> ppm</span>
                </div>
                <div class="airConditioning-bottom">
                    <span v-text="'欢迎词轮播时间：'" ></span>
                    <input class="input" style="border:1px solid #DCDFE6" v-model="lunbotime" /><span> s</span>
                </div>
                <div class="lunboBox">
                    <span v-text="'欢迎词: '" style="width:100px;"></span>
                    <el-input
                            :autosize="{ minRows: 1, maxRows: 3}"
                            type="textarea"
                            placeholder="请输入内容"
                            v-model="lunboContent"
                            >
                    </el-input>
                </div>
                    <span class="tip" v-if="num">请输入-100~100以内的数值</span>
                    <span class="tip" v-if="order">请从低到高输入温度</span>
                <div class="airConditioning-button" >
                   <span v-text="'提交'" @click="submission('时间')" class="submission"></span>
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
     import {setSmokeThreshold,Salutatory } from "api/surroundings"
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
                thresholdMin:'',
                oldThresholdMin:'',
                oldThresholdMax:'',
                oldThreshold:'',
                oldDehumi:'',
                oldSmoke:'',
                oldTime:'',
                oldContent:'',
                thresholdMax:'',
                threshold:{
                    max:'',
                    min:''
                },
                lunboContent:'',
                humidityThreshold:0,
                smokeThreshold:0,
                lunbotime:5
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
                this.getHumidity();
                this.getSmoke();
                this.getLunbo()
                this.$refs.dialog.show();
            },
            close(){
                this.$refs.dialog.close();
            },

            controlAir(data){
                this.$ajax({
                    method:'post',
                    url:baseURL+'/environment/airConditionerSwitch',
                    params:{status:data}
                }).then((res)=>{
                    this.$message.success('操作成功')
                }).catch(err=>{
                    this.$message.error(err.response.data.message);
                });
            },
            submission(data){
                this.submissionThreshold()
            },
            submissionThreshold(){
                if(this.thresholdMin!=this.oldThresholdMin||this.thresholdMax!=this.oldThresholdMax)
                {
                   
                 if(this.thresholdMin>this.thresholdMax){
                    this.num = false
                    this.order = true
                }else if(this.thresholdMin<-100||this.thresholdMax>100){
                    this.order = false
                    this.num = true
                }else{
                    this.order = false
                    this.num = false
                    this.$ajax({
                        method:'post',
                        url:baseURL+'/environment/temperatureThresholdSet',
                        params:{max:this.thresholdMax,min:this.thresholdMin}
                    }).then((res)=>{
                        this.oldThresholdMin=this.thresholdMin
                        this.oldThresholdMax=this.thresholdMax
                        this.$message.success('温度设置成功');
                    }).catch(err=>{
                        this.$message.error(err.response.data.message);
                    });
                }
                }
                if(this.smokeThreshold!=this.oldSmoke)
                {
                setSmokeThreshold({max: this.smokeThreshold}).then(res => {
                    this.oldSmoke=this.smokeThreshold
                        this.$message.success("烟雾浓度设置成功")
                    })
                  
                }
                if(this.humidityThreshold!=this.oldDehumi)
                {
                    
                this.$ajax({
                    method:'post',
                    url:baseURL+'/environment/humidityThresholdSet',
                    params:{max:this.humidityThreshold}
                }).then((res)=>{
                    this.oldDehumi=this.humidityThreshold
                    this.$message.success('湿度设置成功');
                }).catch(err=>{
                    this.$message.error(err.response.data.message);
                });
                }
                if(this.lunboContent!=this.oldContent||this.lunbotime!=this.oldTime)
                {
                 
                 let postData=[]
                   postData[0]=this.lunboContent
                    Salutatory({
                        time:this.lunbotime,
                        words:postData
                    }).then((res)=>{
                 this.oldTime=this.lunbotime
                 this.oldContent=this.lunboContent
                 this.$message.success('轮播词设置成功');
                }).catch(err=>{
                    this.$message.error(err.response.data.message);
                });
                }

                   

            },
            getHumidity()
            {
              this.$ajax({
                    method:'post',
                    url:baseURL+'/environment/humidityThreshold',
                }).then((res)=>{
                    this.humidityThreshold=res.data.data.humidityThreshold;
                    this.oldThreshold=res.data.data.humidityThreshold
                }).catch(err=>{
                    this.$message.error(err.response.data.message);
                });
            },
            getSmoke(){
            
            this.$ajax({
                    method:'post',
                    url:baseURL+'/environment/smokeThreshold',
                }).then((res)=>{
                    this.smokeThreshold=res.data.data;
                    this.oldSmoke=res.data.data
                }).catch(err=>{
                    this.$message.error(err.response.data.message);
                });
            },
            getLunbo(){
            this.$ajax({
                    method:'get',
                    url:baseURL+'/exhibition/salutatory',
                }).then((res)=>{
                    this.lunbotime=res.data.time;
                    this.lunboContent=res.data.words[0];
                    this.oldTime=res.data.time;
                    this.oldContent=res.data.words[0];
                }).catch(err=>{
                    this.$message.error(err.response.data.message);
                });
            },
            getThreshold(){
                this.$ajax({
                    method:'post',
                    url:baseURL+'/environment/temperatureThreshold',
                }).then((res)=>{
                    this.thresholdMax=res.data.data.temperatureMaximum;
                    this.thresholdMin=res.data.data.temperatureMinimum;
                    this.oldThresholdMin=res.data.data.temperatureMinimum;
                    this.oldThresholdMax=res.data.data.temperatureMaximum
                    // this.changeThreshold=false
                   
                }).catch(err=>{
                    this.$message.error(err.response.data.message);
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
    .airConditioning-body .lunboBox{

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
        cursor: pointer;
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
        cursor: pointer;
    }
    .tip{
        color: red;
        margin-top: 10px
    }
</style>
