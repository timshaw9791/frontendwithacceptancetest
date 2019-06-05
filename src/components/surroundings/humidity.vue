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
                <s_line-chart ref="line" :characterType="'%'" :title="'湿度'" :ticksNumber="6"></s_line-chart>
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
                history:[45,46,45,45,47,48,49,44,46,47,39,45,44,49,50,51,52,47,49,44,42,43,43,49]
            }
        },
        props:{
            humidity:{ type:Number, default:0  }
        },
        created(){
        },
        methods:{
            toLineChart(){
                this.$refs.line.show();
            },
            getHumidityHistroy(){
                this.$ajax({
                    method:'post',
                    url:'http://10.128.4.109:8088/environment/humidityHS',
                }).then(res=>{
                    console.log(res);
                }).catch(err=>{
                    console.log(err);
                })
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