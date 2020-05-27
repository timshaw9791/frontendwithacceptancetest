<template>
    <div class="edit-threshold">
        <dialogs :width="398" ref="dialog" :title="'设备阈值控制'">
            <div class="body">
                <div class="box">
                    <span v-text="'空调温度阈值：'"></span>
                    <input class="input" style="border:1px solid #DCDFE6" v-model="temperature.min" /><span>~~</span>
                    <input class="input" style="border:1px solid #DCDFE6" v-model="temperature.max" /><span>&#8451</span>
                
                </div>
                <div class="box">
                    <span v-text="'除湿器湿度阈值：'"></span>
                    <input class="input" style="border:1px solid #DCDFE6" v-model="humidityThreshold" /><span> %</span>
                </div>
                <div class="box">
                    <span v-text="'烟雾浓度报警阈值：'"></span>
                    <input class="input"  v-model="smokeThreshold" style="border:1px solid #DCDFE6"/><span> ppm</span>
                </div>
                <div class="box">
                    <span v-text="'欢迎词轮播时间：'" ></span>
                    <input class="input" style="border:1px solid #DCDFE6" v-model="lunbo.time" /><span> s</span>
                </div>
                <div class="lunboBox">
                    <span v-text="'欢迎词: '" style="width:100px;"></span>
                    <el-input
                            :autosize="{ minRows: 1, maxRows: 3}"
                            type="textarea"
                            placeholder="请输入内容"
                            v-model="lunbo.content"
                            >
                    </el-input>
                </div>
                    <span class="tip" v-if="num">请输入-100~100以内的数值</span>
                    <span class="tip" v-if="order">请从低到高输入温度</span>
                <div class="button" >
                   <span v-text="'提交'" @click="submissionThreshold()" class="submission"></span>
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
    import { temperatureThreshold, 
        humidityThreshold, 
        mokeThreshold, 
        salutatory, 
        modifySalutatory,
        setTemperatureThreshold, 
        setHumidityThreshold,
        smokeThreshold,
        setSmokeThreshold } from 'api/surroundings'
    export default {
        name: "editThreshold",
        components: {
            dialogs,
            surroundingCard,
            switchControl
        },
        data() {
            return {
                num:false, // 错误提示语
                order:false, // 错误提示语
                temperature: {
                    min: 0,
                    max: 0
                },
                lunbo: {
                    time: 5,
                    content: ''
                },
                humidityThreshold:0,
                smokeThreshold:0,
            }
        },
        methods:{
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
            submissionThreshold(){
                this.order = this.num = false;
                if(this.temperature.min > this.temperature.max) {
                    this.order = true;
                    return;
                }
                if(this.temperature.min < -100 || this.temperature.max > 100) {
                    this.num = true;
                    return;
                }
                setTemperatureThreshold(this.temperature, true).then();
                setHumidityThreshold({max: this.humidityThreshold}, true).then();
                setSmokeThreshold({max: this.smokeThreshold}, true).then();
                modifySalutatory({time: this.lunbo.time, words: [this.lunbo.content]}, true).then();
                this.close();
            },
            getHumidity() { // 湿度阈值信息
                humidityThreshold().then(res => {
                    this.humidityThreshold = res.humidityThreshold;
                })
            },
            getSmoke() { // 烟雾阈值信息
                smokeThreshold().then(res => {
                    this.smokeThreshold = res;
                })
            },
            getLunbo(){ // 欢迎屏数据
                salutatory().then(res => {
                    this.lunbo.time = res.time;
                    this.lunbo.content = res.words[0];
                })
            },
            getThreshold(){ // 获取温度阈值
                temperatureThreshold().then(res => {
                    this.temperature.min = res.temperatureMinimum;
                    this.temperature.max = res.temperatureMaximum;
                })
            }
        }
    }
</script>

<style scoped>
    .edit-threshold {
        width: 100%;
    }
    .edit-threshold .body {
        height: 416px;
        display: flex;
        align-items: center;
        padding-top: 20px;
        flex-direction: column;
        font-size: 16px;
        color: #707070;
        position:relative;
    }
    .body .box{
        
        height: 22px;
        margin-top: 29px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .body .lunboBox{

        margin-top: 29px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .box .input{
        width: 45px;
        outline:none;
        line-height: 30px;
        text-align: center;
        color: #707070;
    }
    .body .button{
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        bottom: 33px;
    }
    .button .cancel{
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
    .button .submission{
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
