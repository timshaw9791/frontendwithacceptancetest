<template>
    <div class="humidity">
        <s_card :header="'湿度'">
            <div class="humidity-body">
                <div class="humidity-top">
                    <span v-text="'当前湿度： '"></span>
                    <span style="font-size: 30px" v-text="humidity"></span>
                </div>
                <s_humidity-component style="margin-top: 47px" :scale="scale" :temperature="humidity" :id="'humidity'" :color="color"></s_humidity-component>
                <span v-text="'查看湿度曲线'" style="margin-top: 62px" @click="toLineChart"></span>
                <s_line-chart ref="line" :characterType="'%'" :svgData="svgData" :region="region" :initTime="initTime" :threshold="threshold" :title="'湿度'" :ticksNumber="6"></s_line-chart>
            </div>
        </s_card>
    </div>
</template>

<script>
    import s_card from './surroundingCard'
    import s_humidityComponent from './control/controlComponents/thermometerComponent'
    import s_lineChart from './control/controlComponents/lineChart/lineChart'
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
                color:'#EF4545',
                svgData:[],
                threshold:{
                    max:0,min:0
                },
                initTime:0,
                region:[]
            }
        },
        props:{
            humidity:{ type:Number, default:0  }
        },
        created(){
        },
        methods:{
            toLineChart(){
                this.getHumiture().then(data=>{
                    this.getHs(data.humidity);
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
            getHs(humidity){
                this.$ajax({
                    method:'post',
                    url:'http://192.168.50.15:8080/warehouse/environment/humidityHS',
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
                    copyList.push({sale:humidity,time:new Date(year,moth,day,hour)});
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
                    this.$refs.line.show();
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
    .humidity{
        width: 489px;
    }
    .humidity .humidity-body{
        height: 788px;
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