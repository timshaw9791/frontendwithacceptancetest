<template>
    <div class="thermometer">
        <s_card :header="'温度'">
            <div class="thermometer-body">
                <div class="thermometer-top">
                    <span v-text="'当前温度： '"></span>
                    <span style="font-size: 30px" v-text="temperature+'°'"></span>
                </div>
                <s_thermometer-component style="margin-top: 47px" :scale="scale" :temperature="temperature" :color="color"></s_thermometer-component>
                <span v-text="'查看温度曲线'" style="margin-top: 62px; color:blue" @click="toTemLineChart"></span>
                <!--<s_line-chart_t ref="tLine" :characterType="'°'" :svgData="svgData" :region="region" :initTime="initTime" :ticksNumber="3" :titile="'温度'" :threshold="threshold"></s_line-chart_t>-->
            </div>
        </s_card>
    </div>
</template>

<script>
    import s_card from './surroundingCard'
    import s_thermometerComponent from './control/controlComponents/thermometerComponent'
    import s_lineChart_t from './control/controlComponents/lineChart/lineChart'
    import {baseURL} from "../../api/config";

    export default {
        name: "thermometer",
        components:{
            s_card,
            s_thermometerComponent,
            s_lineChart_t
        },
        data(){
            return{
                scale:[-10,0,10,20,30,40,50,60,70],
                color:'#2F2F76',
                svgData:[],
                threshold:{
                  max:0,min:0
                },
                initTime:0,
                region:[],
            }
        },
        props:{
            temperature:{ type:Number, default:0  },
            monthDate:{
                type:[String,Date],
                default:''
            }
        },
        created(){
        },
        watch:{
            'monthDate':{
                handler(newval){
                    if(newval!=''){
                        this.getMonthTemperature(newval)
                    }
                }
            }
        },
        methods:{
            toTemLineChart(){
                this.getHumiture().then(data=>{
                    this.getHs(data.temperature);
                })
            },
            getHumiture(){
                let promise=new Promise((resolve,reject)=>{
                    this.$ajax({
                        method:'post',
                        url:baseURL+'/environment/humitureQuery',
                    }).then((res)=>{
                        resolve(res.data.data)
                    }).catch(err=>{
                        this.$message.error(err);
                    });
                });
               return promise
            },
            getMonthTemperature(date){
                let year = date.getFullYear();
                let month = date.getMonth();
                    let params={
                    month:String(month+1),
                    year:String(year)
                };
                this.$ajax({
                    method:'post',
                    url:baseURL+'/environment/temperatureMonthHS',
                    params:params
                }).then((res)=>{
                    let copyList=[];
                    let region=[];
                    let days=this.getMonthDays(month+1,year);
                    region.push(new Date(year,month,1),new Date(year,month,days));
                    if(res.data.data.length!=0){
                        res.data.data.forEach((item,index)=>{
                            copyList.push({sale:item,time:new Date(year,month,index+1)})
                        });
                        this.getThreshold(copyList);
                    }else {
                        this.threshold={
                            max:30,
                            min:20
                        }
                    }
                    let dataTemperature={
                        svgData:copyList,
                        initTime:new Date(),
                        region:region,
                        threshold:this.threshold,
                        timeType:'day'
                    };
                    this.$emit('temperature',dataTemperature);
                }).catch(err=>{
                    this.$message.error(err);
                });
            },
            getMonthDays(month,year){
               let date=new Date(year,month,0);
               return date.getDate();
            },
            getHs(temperature){
                this.$ajax({
                    method:'post',
                    url:baseURL+'/environment/temperatureHS',
                }).then((res)=>{
                    let dateNow =  new Date();
                    let year = dateNow.getFullYear();
                    let moth = dateNow.getMonth()+1;
                    let day = dateNow.getDate();
                    let hour = dateNow.getHours()+1;
                    let copyList=[];
                    let initTime=new Date(year,moth,day,hour);
                    this.initTime = Number(hour);
                    this.region.push(new Date(year,moth,day-1,hour),new Date(year,moth,day,hour));
                    copyList.push({sale:temperature,time:new Date(year,moth,day,hour)});
                    res.data.data.forEach((item,index)=>{
                        if(index%2==0){
                            initTime = new Date(initTime.valueOf()-60*60*1000*2);
                            copyList.push({
                                sale:Number(item),time:initTime
                            })
                        }
                    });
                    this.getThreshold(copyList);
                    this.$set(this,'svgData',copyList);
                    let dataTemperature={
                        svgData:copyList,
                        initTime:this.initTime,
                        region:this.region,
                        threshold:this.threshold,
                        timeType:'hour'
                    };
                    this.$emit('temperature',dataTemperature);
                    // this.$refs.tLine.show();
                }).catch(err=>{
                    this.$message.error(err);
                });
            },
            getThreshold(copyList){
                let sortList=[];
                copyList.forEach(item=>{
                    sortList.push(item.sale);
                });
                sortList.sort(function(a,b){
                    return a-b;
                });
                let max = sortList[sortList.length-1];
                let min = sortList[0];
                if(min.length<2){
                    min=0
                }else {
                    min=min.toString();
                    min=Number(min[0]+'0');
                }
                if(max>90){
                    max=100
                }else {
                    max=max.toString();
                    let number = Number(max[0])+1;
                    max=Number(number+'0');
                }
                this.threshold={
                    max:max,
                    min:min
                }
            }
        }
    }
</script>

<style scoped>
    .thermometer{
        width: 489px;
    }
    .thermometer .thermometer-body{
        height: 738px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        color: #707070;
        font-size: 16px;
    }
    .thermometer-body .thermometer-top{

        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
