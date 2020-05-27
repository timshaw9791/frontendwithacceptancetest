<template>
    <div class="humidity">
        <s_card :header="'湿度'">
            <div class="humidity-body">
                <div class="humidity-top">
                    <span v-text="'当前湿度： '"></span>
                    <span style="font-size: 0.1563rem" v-text="humidity"></span>
                    <span v-text="'%'"></span>
                </div>
                <s_humidity-component style="margin-top: 0.2448rem" :scale="scale" :temperature="humidity" :id="'humidity'" :color="color"></s_humidity-component>
                <span v-text="'查看湿度曲线'" style="margin-top: 0.3229rem;color: blue;cursor: pointer" @click="toLineChart"></span>
                <!--<s_line-chart ref="line" :characterType="'%'" :svgData="svgData" :region="region" :initTime="initTime" :threshold="threshold" :title="'湿度'" :ticksNumber="6"></s_line-chart>-->
            </div>
        </s_card>
    </div>
</template>

<script>
    import s_card from './surroundingCard'
    import s_humidityComponent from './control/controlComponents/thermometerComponent'
    import s_lineChart from './control/controlComponents/lineChart/lineChart'
    import {baseURL} from "../../api/config";
    import { humitureQuery, humidityHistoryDay, humidityHistoryMonth } from 'api/surroundings'

    export default {
        name: "humidity",
        components:{
            s_card,
            s_humidityComponent,
            s_lineChart
        },
        data(){
            return{
                scale:[10,20,30,40,50,60,70,80,90],
                color:'#2F2F76',
                svgData:[],
                threshold:{
                    max:0,min:0
                },
                initTime:0,
                region:[]
            }
        },
        props:{
            humidity:{ type:Number, default:0  },
            monthDateH:{
                type:[Date,String]
            }
        },
        created(){
        },
        watch:{
            'monthDateH':{
                handler(newval){
                    if(newval!=''){
                        this.getMonthHumidity(newval)
                    }
                }
            }
        },
        methods:{
            toLineChart(){
                humitureQuery().then(res => {
                    this.getHs(res.humidity)
                })
            },
            getMonthHumidity(date){
                let year = date.getFullYear(),
                    month = date.getMonth();
                humidityHistoryMonth({year: String(year), month: String(month+1)}).then(res => {
                    let copyList=[],
                        region=[],
                        days = new Date(year, month+1, 0).getDate();
                    region.push(new Date(year,month,1),new Date(year,month,days));
                    if(res.length!=0){
                        res.forEach((item,index)=>{
                            copyList.push({sale:item,time:new Date(year,month,index+1)})
                        });
                        this.getThreshold(copyList);
                    }else {
                        this.threshold={
                            max:80,
                            min:0
                        }
                    }
                    let dataHumidity={
                        svgData:copyList,
                        initTime:new Date(),
                        region:region,
                        threshold:this.threshold,
                        timeType:'day'
                    };
                    this.$emit('humidity',dataHumidity);
                })
            },
            getHs(humidity){ // 获取天湿度记录并拼接当前湿度
                humidityHistoryDay().then(res => {
                    let dateNow =  new Date(),
                        year = dateNow.getFullYear(),
                        moth = dateNow.getMonth()+1,
                        day = dateNow.getDate(),
                        hour = dateNow.getHours()+1,
                        copyList=[],
                        initTime=new Date(year,moth,day,hour);
                    this.initTime = Number(hour);
                    this.region.push(new Date(year,moth,day-1,hour),new Date(year,moth,day,hour));
                    copyList.push({sale:humidity,time:new Date(year,moth,day,hour)});
                    res.forEach((item,index)=>{
                        if(index%2==0){
                            initTime = new Date(initTime.valueOf()-60*60*1000*2);
                            copyList.push({sale:Number(item),time:initTime})
                        }
                    });
                    this.getThreshold(copyList);
                    this.$set(this,'svgData',copyList);
                    let dataHumidity={
                        svgData:copyList,
                        initTime:this.initTime,
                        region:this.region,
                        threshold:this.threshold,
                        timeType:'hour'
                    };
                    this.$emit('humidity',dataHumidity);
                })
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
                    max:80,
                    min:0
                }
            }
        }
    }
</script>

<style scoped>
    .humidity{
        width: 2.5469rem;
    }
    .humidity .humidity-body{
        height: 3.8438rem;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        color: #707070;
        font-size: 16px;
    }
    .humidity-body .humidity-top{

        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
