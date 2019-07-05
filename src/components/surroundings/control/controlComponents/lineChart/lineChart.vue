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
                    return []
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
                default:16
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