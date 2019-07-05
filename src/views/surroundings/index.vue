<template>
    <div class="surroundings-box">
        <my-header :title="'环境管理'" :searchFlag="false" :haveBlack="!flag" @h_black="h_black"></my-header>
        <div class="title">
            <span v-text="'视频监控'"></span>
        </div>
        <div class="surroundings-body" v-if="flag">
            <div class="_left">
                <s_time></s_time>
                <s_control @toVideo="toVideo"></s_control>
            </div>
            <div class="_middle">
                <s_thermometer id="s_thermometer" :temperature="temperature"></s_thermometer>
            </div>
            <div class="_right">
                <s_humidity id="s_humidity" :humidity="humidity"></s_humidity>
            </div>
        </div>
        <div class="surroundings-body" v-if="!flag">
            <s_video :videoSrc="videoSrc"></s_video>
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
    export default {
        name: "index",
        components: {
            myHeader,
            s_time,
            s_control,
            s_thermometer,
            s_humidity,
            s_video
        },
        data(){
            return{
                humidity:0,
                temperature:0,
                flag:true,
                videoSrc:[]
            }
        },
        created(){
            this.getHumiture();
            this.videoSrc=this.$store.state.user.deploy.data['HIK_CAMERA_ADDRESS'];
            console.log(this.videoSrc);
            setInterval(this.getHumiture,600000);
        },
        methods:{
            h_black(data){
                this.flag=!this.flag
            },
            toVideo(data){
              this.flag=!this.flag
            },
            getHumiture(){
                this.$ajax({
                    method:'post',
                    url:'http://192.168.50.15:8080/warehouse/environment/humitureQuery',
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
        height: 100%;
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
        height: 900px;
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