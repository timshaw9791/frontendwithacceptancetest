<template>
    <div class="surroundings-box">
        <my-header :title="'环境管理'" :searchFlag="false" :haveBlack="!flag" @h_black="h_black"></my-header>
        <div class="title" v-if="!flag">
            <span v-text="'视频监控'" v-if="isVideo"></span>
            <span v-text="title" v-if="isLineChart"></span>
        </div>
        <div class="surroundings-body" v-if="flag">
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
        <div class="surroundings-body" v-if="!flag">
            <s_video :videoSrc="videoSrc" v-if="isVideo"></s_video>
            <s_line_chart v-if="isLineChart" :chartFlag="chartFlag" :svgData="svgData" :threshold="threshold" :initTime="initTime" :region="region" :ticksNumber="ticksNumber"
                          :characterType="characterType" :timeType="timeType" @changeDate="changeDate"></s_line_chart>
        </div>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header'
    import s_time from 'components/surroundings/timeSurroundings'
    import s_control from 'components/surroundings/environmentalControl'
    import s_thermometer from 'components/surroundings/thermometer'
    import s_humidity from 'components/surroundings/humidity'
    import s_video from 'components/surroundings/s_video'
    import s_line_chart from 'components/surroundings/linChartView'
    import {baseURL} from "../../api/config";

    const cmdPath = 'C:\\Users\\Administrator';
    const exec = window.require('child_process').exec;
    const spawn = window.require('child_process').spawn;

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
            // this.videoSrc=this.$store.state.user.deploy.data['HIK_CAMERA_ADDRESS'];
            setInterval(this.getHumiture,600000);
        },
        beforeDestroy() {
            this.controlVideo(0)
            // clearTimeout(this.videoTime);
        },
        methods:{
            defaultVideo(){
                if(this.$route.query.name=='video'){
                    this.toVideo()
                }
            },
            controlVideo(a){
                const process = exec(`java -jar SendCamSignal.jar ${a}`, {cwd: cmdPath});
                process.stderr.on('data', (err) => {
                    console.log(err);
                });
                // process.stdout.on('data', (data) => {
                //     console.log(data);
                //     if (this.index > 0) {
                //         if (this.index == 1) {
                //             this.list[0].rfid = data;
                //         } else {
                //             this.list.push({rfid: data});
                //         }
                //         this.index = this.index + 1;
                //     } else {
                //         let newData = JSON.parse(data);
                //         newData.status === 'succeed' ? this.index = 1 : this.index = 0;
                //     }
                // });
                process.on('exit', (code) => {
                    // if (this.index === 0) {
                    //       this.$message.error('设备未插入或串口号错误,插入后请重新选择装备!');
                    //   }
                    console.log(`子进程退出 ${code}`);
                });
            },
            h_black(data){
                let haveVideo=false;
                if(this.isVideo){
                    haveVideo=true
                }
                this.flag=!this.flag;
                this.isVideo=false;
                this.isLineChart=false;
                if (haveVideo){
                    this.controlVideo(0)
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
                  this.controlVideo(4);
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
                this.characterType='°';
                this.flag=false;
                this.isVideo=false;
                this.isLineChart=true;
                this.chartFlag=false;
                setTimeout(()=>{
                    this.chartFlag=true;
                },100);

            },
            getHumiture(){
                this.$ajax({
                    method:'post',
                    url:baseURL+'/environment/humitureQuery',
                }).then((res)=>{
                    this.humidity=res.data.data.humidity;
                    this.temperature=res.data.data.temperature;
                }).catch(err=>{
                    this.$message.error(err);
                });
            }
        }
    }
</script>

<style scoped>
    .surroundings-box{
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
        min-height: 830px;
        border:1px solid rgba(112,112,112,0.13);
        padding-right: 30px;
        padding-left: 30px;
        padding-top: 30px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .surroundings-body ._left{
        width: 548px;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .surroundings-body ._middle{
        width: 489px;
        height: 100%;
    }
    .surroundings-body ._right{
        width: 489px;
        height: 100%;
    }
</style>
