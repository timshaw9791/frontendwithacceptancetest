<template>
    <div class="surroundings-box">
        <my-header :title="'环境管理'" :searchFlag="false" :haveBlackTwo="false"></my-header>
        <div class="surroundings-body">
            <div class="_left">
                <s_time></s_time>
                <s_control></s_control>
            </div>
            <div class="_middle">
                <s_thermometer id="s_thermometer" :temperature="temperature"></s_thermometer>
            </div>
            <div class="_right">
                <s_humidity id="s_humidity" :humidity="humidity"></s_humidity>
            </div>
        </div>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header'
    import s_time from 'components/surroundings/timeSurroundings'
    import s_control from 'components/surroundings/environmentalControl'
    import s_thermometer from 'components/surroundings/thermometer'
    import s_humidity from 'components/surroundings/humidity'
    export default {
        name: "index",
        components: {
            myHeader,
            s_time,
            s_control,
            s_thermometer,
            s_humidity
        },
        data(){
            return{
                humidity:0,
                temperature:0
            }
        },
        created(){
            this.getHumiture();
            setInterval(this.getHumiture,600000);
        },
        methods:{
            getHumiture(){
                this.$ajax({
                    method:'post',
                    url:'http://10.128.4.100:8088/environment/humitureQuery',
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