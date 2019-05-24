<template>
    <div class="thermometer">
        <s_card :header="'温度'">
            <div class="thermometer-body">
                <div class="thermometer-top">
                    <span v-text="'当前温度： '"></span>
                    <span style="font-size: 30px" v-text="temperature+'°'"></span>
                </div>
                <s_thermometer-component style="margin-top: 47px" :scale="scale" :temperature="temperature" :color="color"></s_thermometer-component>
                <span v-text="'查看温度曲线'" style="margin-top: 62px" @click="ach"></span>
            </div>
        </s_card>
    </div>
</template>

<script>
    import s_card from './surroundingCard'
    import s_thermometerComponent from './control/controlComponents/thermometerComponent'
    export default {
        name: "thermometer",
        components:{
            s_card,
            s_thermometerComponent
        },
        data(){
            return{
                scale:[-10,0,10,20,30,40,50,60,70],
                color:'#2F2F76'
            }
        },
        props:{
            temperature:{ type:Number, default:0  }
        },
        created(){

        },
        methods:{
            ach(){
                console.log((new Date(2019, 5, 22,15)))
            }
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