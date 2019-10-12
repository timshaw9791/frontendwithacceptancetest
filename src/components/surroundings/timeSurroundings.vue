<template>
    <div class="timeSurroundings">
        <s_card :header="'当前时间'">
            <div class="time-box" v-text="time"></div>
        </s_card>
    </div>
</template>

<script>
    import s_card from './surroundingCard'
    export default {
        name: "timeSurroundings",
        components:{
            s_card
        },
        data(){
          return{
              time:''
          }
        },
        created(){
            this.getTime();
            setInterval(this.getTime,1000);
        },
        methods:{
            getTime(){
                let date =  new Date();
                let hours = date.getHours();
                let minutes = date.getMinutes();
                if(minutes<10){
                    minutes='0'+minutes
                }
                if(hours<10){
                    hours='0'+hours
                }
                this.time = hours+':'+minutes
            }
        }
    }
</script>

<style>
    .timeSurroundings{
        width: 100%;

    }
    .timeSurroundings .time-box{
        height: 123px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #2F2F76;
        font-size:72px;
    }
</style>