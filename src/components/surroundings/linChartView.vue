<template>
    <div style="width: 100%">
        <div class="up-box">
            <div class="left">
                <span v-text="'当前时间：'"></span><span v-text="nowTime"></span>
            </div>
            <div class="right">
               <div style="width: 150px"><span v-text="'选择时间：'"></span></div>
                <el-date-picker
                        v-model="date"
                        type="month"
                        size="small"
                        placeholder="选择月"
                        @change="changeDate"
                >
                </el-date-picker>
            </div>
        </div>
        <lin-chart-component v-if="chartFlag" :svgData="svgData" :threshold="threshold" :height="height" :timeType="timeType" :yHeight="yHeight" :ticksNumber="ticksNumber" :initTime="initTime" :characterType="characterType" :region="region"></lin-chart-component>
    </div>
</template>

<script>
    import s_lineChart_t from './control/controlComponents/lineChart/lineChart'
    import linChartComponent from './control/controlComponents/lineChart/lineChartComponent'
    export default {
        name: "linChartView",
        components:{
            s_lineChart_t,
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
                default:620
            },
            yHeight:{
                type:Number,
                default:400/192*localStorage.getItem('fontSize')
            },
            ticksNumber:{
                type:Number,
                default:2
            },
            initTime:{
                type:[Number,Date],
                default:16
            },
            characterType:{
                type:String,
                default:'%'
            },
            chartFlag:{
              type:Boolean,
              default:true
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
            },
            timeType:{
                type:String,
                default:'hour'
            }
        },
        data(){
            return{
                nowTime:'',
                date:''
            }
        },
        created(){
            this.init();
        },
        methods:{
            changeDate(date){
                this.$emit('changeDate',date);
            },
            init(){
               if(this.timeType=='hour'){
                   let date = new Date();
                   let seperator1 = "-";
                   let year = date.getFullYear();
                   let month = date.getMonth() + 1;
                   let strDate = date.getDate();
                   if (month >= 1 && month <= 9) {
                       month = "0" + month;
                   }
                   if (strDate >= 0 && strDate <= 9) {
                       strDate = "0" + strDate;
                   }
                   let currentdate = year + seperator1 + month + seperator1 + strDate;
                   this.nowTime =currentdate;
               }
            },
            toZero(){
                this.date=''
            }
        }

    }
</script>

<style scoped>
    .up-box{
        width: 100%;
        padding-left: 0.1719rem;
        padding-right: 0.2604rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #707070;
        height: 32px;
    }
    .up-box .right{
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: row;
    }
</style>