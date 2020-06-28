<template>
    <view-container>
    <div class="surroundings-box">
        <div class="title" v-if="!flag">
            <span v-text="'视频监控'" v-if="isVideo"></span>
            <span v-text="title" v-if="isLineChart"></span>
        </div>
        <div class="surroundings-body" v-show="flag">
            <div class="_left">
                <s_time></s_time>
                <s_control @toVideo="toVideo"></s_control>
            </div>
            <div class="_middle">
                <s_thermometer id="s_thermometer" :temperature="temperature" @temperature="getTemperature"  :monthDate="date"></s_thermometer>
            </div>
            <div class="_right">
                <s_humidity id="s_humidity" :monthDateH="dateH" :humidity="humidity" @humidity="getHumidity"></s_humidity>
            </div>
        </div>
        <div class="surroundings-body" v-show="!flag">
            <s_video :videoSrc="videoSrc" v-if="isVideo"></s_video>
            <s_line_chart v-show="isLineChart" :chartFlag="chartFlag" :svgData="svgData" :threshold="threshold" :initTime="initTime" :region="region" :ticksNumber="ticksNumber"
                          :characterType="characterType" :timeType="timeType" @changeDate="changeDate" ref="line_chart"></s_line_chart>
        </div>
    </div>
    </view-container>
</template>

<script>
    import myHeader from 'components/base/header/header'
    import s_time from 'components/surroundings/timeSurroundings'
    import s_control from 'components/surroundings/environmentalControl'
    import s_thermometer from 'components/surroundings/thermometer'
    import s_humidity from 'components/surroundings/humidity'
    import s_video from 'components/surroundings/s_video'
    import s_line_chart from 'components/surroundings/linChartView'
    import { humitureQuery } from 'api/surroundings'
    import {baseURL} from "../../api/config";

    export default {
        name: "index",
        components: {
            myHeader,
            s_time,
            s_control,
            s_thermometer,
            s_humidity,
            s_video,
            s_line_chart
        },
        data(){
            return{
                humidity:0,
                temperature:0,
                flag:true,
                videoSrc:[],
                isVideo:false,
                isLineChart:false,
                title:'',
                svgData:[],
                threshold:{
                    max:0,min:0
                },
                initTime:0,
                region:[],
                ticksNumber:0,
                characterType:'°',
                date:'',
                dateH:'',
                chartFlag:true,
                timeType:'hour'
            }
        },
        created(){
            this.defaultVideo();
            this.getHumiture();
            setInterval(this.getHumiture,600000);
        },
        methods:{
            defaultVideo(){
                if(this.$route.query.name=='video'){
                    this.toVideo()
                }
            },
            h_black(data){
                let haveVideo=false;
                if(this.isVideo){
                    haveVideo=true
                }
                this.flag=!this.flag;
                this.isVideo=false;
                this.isLineChart=false;
                this.$refs.line_chart.toZero();
                if (haveVideo){

                }
            },
            changeDate(date){
                if(this.title=='湿度记录'){
                    this.$set(this,'dateH',date);
                }else {
                    this.$set(this,'date',date);
                }
            },
            toVideo(data){
              this.flag=!this.flag;
              this.isVideo=!this.isVideo;
              this.isLineChart=false;
              if (this.isVideo){

              }
            },
            getHumidity(data){
                this.title='湿度记录';
                this.timeType=data.timeType;
                this.svgData=data.svgData;
                this.threshold=data.threshold;
                this.initTime=data.initTime;
                this.region=data.region;
                this.ticksNumber=(this.threshold.max-this.threshold.min)/10;
                this.characterType='%';
                this.flag=false;
                this.isVideo=false;
                this.isLineChart=true;
                this.chartFlag=false;
                setTimeout(()=>{
                    this.chartFlag=true;
                },100);

            },
            getTemperature(data){
                this.title='温度记录';
                this.timeType=data.timeType;
                this.svgData=data.svgData;
                this.threshold=data.threshold;
                this.initTime=data.initTime;
                this.region=data.region;
                this.ticksNumber=(this.threshold.max-this.threshold.min)/5;
                this.characterType='°C';
                this.flag=false;
                this.isVideo=false;
                this.isLineChart=true;
                this.chartFlag=false;
                setTimeout(()=>{
                    this.chartFlag=true;
                },100);

            },
            getHumiture(){
                humitureQuery().then(res => {
                    this.humidity=res.humidity;
                    this.temperature=res.temperature;
                })
            }
        }
    }
</script>

<style scoped>
    .surroundings-box{
        font-size: 16px;
        width: 100%;
    }
    .surroundings-box .title{
        height: 57px;
        width: 100%;
        display: flex;
        align-items: center;
        border-bottom:1px solid rgba(112,112,112,0.13);
        border-top:1px solid rgba(112,112,112,0.13);
        padding-left: 21px;
        color: #707070;
    }
    .surroundings-box .surroundings-body{
        width: 100%;
        min-height: 4.1667rem;
        border:1px solid rgba(112,112,112,0.13);
        padding-right: 0.1563rem;
        padding-left: 0.1563rem;
        padding-top: 0.1563rem;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .surroundings-body ._left{
        width: 2.8542rem;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .surroundings-body ._middle{
        width: 2.5469rem;
        height: 100%;
    }
    .surroundings-body ._right{
        width: 2.5469rem;
        height: 100%;
    }
</style>
