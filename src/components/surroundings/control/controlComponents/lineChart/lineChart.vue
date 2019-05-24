<template>
    <div class="lineChart">
        <dialogs :width="1040" ref="dialog" :title="title">
            <div class="lineChart-box">
                <lin-chart-component :svgData="svgData" :threshold="threshold" :height="height" :yHeight="yHeight" :ticksNumber="ticksNumber" :initTime="initTime" :characterType="characterType" :region="region"></lin-chart-component>
            </div>
        </dialogs>
    </div>
</template>

<script>
    import dialogs from '../../../surroundingDialog'
    import linChartComponent from './lineChartComponent'
    export default {
        name: "lineChart",
        components: {
            dialogs,
            linChartComponent
        },
        props:{
            svgData:{
                type:Array,
                default(){
                    return [{
                        "sale": 45,
                        "time": new Date(2019, 5, 22,15)
                    }, {
                        "sale": 46,
                        "time": new Date(2019, 5, 22,17)
                    }, {
                        "sale": 47,
                        "time": new Date(2019, 5, 22,19)
                    }, {
                        "sale": 42,
                        "time": new Date(2019, 5, 22,21)
                    }, {
                        "sale": 41,
                        "time": new Date(2019, 5, 22,23)
                    }, {
                        "sale": 50,
                        "time": new Date(2019, 5, 23, 1)
                    },{
                        "sale": 51,
                        "time": new Date(2019, 5, 23, 3)
                    },{
                        "sale": 43,
                        "time": new Date(2019, 5, 23, 5)
                    },{
                        "sale": 53,
                        "time": new Date(2019, 5, 23, 7)
                    },{
                        "sale": 55,
                        "time": new Date(2019, 5, 23, 9)
                    },{
                        "sale": 48,
                        "time": new Date(2019, 5, 23, 11)
                    },{
                        "sale": 89,
                        "time": new Date(2019, 5, 23, 13)
                    },{
                        "sale": 43,
                        "time": new Date(2019, 5, 23, 15)
                    }
                    ]
                }
            },
            height:{
                type:Number,
                default:460
            },
            yHeight:{
                type:Number,
                default:300
            },
            ticksNumber:{
                type:Number,
                default:2
            },
            initTime:{
                type:Number,
                default:15
            },
            characterType:{
                type:String,
                default:'%'
            },
            region:{
                type:Array,
                default(){
                    return [new Date(2019, 5, 22,15), new Date(2019, 5, 23,15)]
                }
            },
            threshold:{
                type:Object,
                default(){
                    return {max:80,min:0}
                }
            },
            title:{
                type:String,
                default:'温度'
            }
        },
        methods:{
            show(){
                this.$refs.dialog.show();
            },
            close(){
                this.$refs.dialog.close();
            }
        }
    }
</script>

<style scoped>
    .lineChart{}
    .lineChart .lineChart-box{
        height: 567px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>