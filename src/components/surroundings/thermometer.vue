<template>
    <div class="thermometer">
        <s_card :header="'温度'">
            <div class="thermometer-body">
                <div class="thermometer-top">
                    <span v-text="'当前温度： '"></span>
                    <span style="font-size: 30px" v-text="temperature+'°'"></span>
                </div>
                <s_thermometer-component style="margin-top: 47px" :scale="scale" :temperature="temperature" :color="color"></s_thermometer-component>
                <span v-text="'查看温度曲线'" style="margin-top: 62px" @click="toTemLineChart"></span>
                <s_line-chart_t ref="tLine" :characterType="'°'" :svgData="svgData" :region="region" :initTime="initTime" :ticksNumber="3" :titile="'温度'" :threshold="threshold"></s_line-chart_t>
            </div>
        </s_card>
    </div>
</template>

<script>
    import s_card from './surroundingCard'
    import s_thermometerComponent from './control/controlComponents/thermometerComponent'
    import s_lineChart_t from './control/controlComponents/lineChart/lineChart'
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
                region:[]
            }
        },
        props:{
            temperature:{ type:Number, default:0  }
        },
        created(){
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
                        url:'http://192.168.50.15:8080/warehouse/environment/humitureQuery',
                    }).then((res)=>{
                        resolve(res.data.data)
                    }).catch(err=>{
                        this.$message.error(err);
                    });
                });
               return promise
            },
            getHs(temperature){
                this.$ajax({
                    method:'post',
                    url:'http://192.168.50.15:8080/warehouse/environment/temperatureHS',
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
                    this.$refs.tLine.show();
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
        height: 788px;
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