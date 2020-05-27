<template>
    <div class="thermometer">
        <s_card :header="'温度'">
            <div class="thermometer-body">
                <div class="thermometer-top">
                    <span v-text="'当前温度： '"></span>
                    <span style="font-size:  0.1563rem" v-text="temperature+'°C'"></span>
                </div>
                <s_thermometer-component style="margin-top: 0.2448rem" :scale="scale" :temperature="temperature" :color="color"></s_thermometer-component>
                <span v-text="'查看温度曲线'" style="margin-top: 0.3229rem; color:blue;cursor: pointer" @click="toTemLineChart"></span>
                <!--<s_line-chart_t ref="tLine" :characterType="'°'" :svgData="svgData" :region="region" :initTime="initTime" :ticksNumber="3" :titile="'温度'" :threshold="threshold"></s_line-chart_t>-->
            </div>
        </s_card>
    </div>
</template>

<script>
    import s_card from './surroundingCard'
    import s_thermometerComponent from './control/controlComponents/thermometerComponent'
    import s_lineChart_t from './control/controlComponents/lineChart/lineChart'
    import { humitureQuery, temperatureHistory, temperatureHistoryDay, temperatureHistoryMonth } from 'api/surroundings'

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
                color:'#EF4545',
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
            async toTemLineChart(){
                humitureQuery().then(res => {
                    this.getHs(res.temperature);
                })
            },
            getMonthTemperature(date){ // 选择月后，重新获取月的数据
                let year = date.getFullYear();
                let month = date.getMonth();
                temperatureHistoryMonth({year: String(year), month: String(month+1)}).then(res => {
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
                })
            },
            getMonthDays(month,year){
               let date=new Date(year,month,0);
               return date.getDate();
            },
            getHs(temperature){ // 获取天历史记录并且拼接上当前温度
                temperatureHistoryDay().then(res => {
                    let date = new Date(),
                        year = date.getFullYear(),
                        month = date.getMonth()+1,
                        day = date.getDate(),
                        hour = date.getHours()+1,
                        copyList = [],
                        initTime = new Date(year, month, day, hour);
                    this.initTime = Number(hour);
                    this.region.push(new Date(year, month, day-1, hour), new Date(year, month, day, hour));
                    copyList.push({sale: temperature, time: new Date(year, month, day, hour)});
                    res.forEach((item, index) => {
                        if(index%2==0) {
                            initTime = new Date(initTime.valueOf() - 60*60*1000*2);
                            copyList.push({sale: Number(item), time: initTime});
                        }
                    })
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
                    max:max,
                    min:min
                }
            }
        }
    }
</script>

<style scoped>
    .thermometer{
        width: 2.5469rem;
    }
    .thermometer .thermometer-body{
        height: 3.8438rem;
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
