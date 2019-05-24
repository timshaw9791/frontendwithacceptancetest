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
                <s_line-chart_t ref="tLine" :characterType="'°'" :svgData="svgData" :ticksNumber="3" :titile="'温度'" :threshold="threshold"></s_line-chart_t>
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
                threshold:{
                  max:50,min:20
                },
                svgData:[{
                        "sale": 34,
                        "time": new Date(2019, 5, 22,15)
                    }, {
                        "sale": 23,
                        "time": new Date(2019, 5, 22,17)
                    }, {
                        "sale": 45,
                        "time": new Date(2019, 5, 22,19)
                    }, {
                        "sale": 33,
                        "time": new Date(2019, 5, 22,21)
                    }, {
                        "sale": 50,
                        "time": new Date(2019, 5, 22,23)
                    }, {
                        "sale": 47,
                        "time": new Date(2019, 5, 23, 1)
                    },{
                        "sale": 23,
                        "time": new Date(2019, 5, 23, 3)
                    },{
                        "sale": 22,
                        "time": new Date(2019, 5, 23, 5)
                    },{
                        "sale": 24,
                        "time": new Date(2019, 5, 23, 7)
                    },{
                        "sale": 19,
                        "time": new Date(2019, 5, 23, 9)
                    },{
                        "sale": 22,
                        "time": new Date(2019, 5, 23, 11)
                    },{
                        "sale": 28,
                        "time": new Date(2019, 5, 23, 13)
                    },{
                        "sale": 30,
                        "time": new Date(2019, 5, 23, 15)
                    }
                    ]
            }
        },
        props:{
            temperature:{ type:Number, default:0  }
        },
        created(){

        },
        methods:{
            toTemLineChart(){
                this.$refs.tLine.show();
            },
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