<template>
    <div class="temperature-shell">
        <div class="temperature-theme">
            <div class="temperature-body">
                <div class="temperature-scale">
                    <div class="temperature-scale-item" v-for="(item,index) in scale">
                        <div class="temperature-scale-short" style="position: absolute;top: 0px" v-if="index!=0"></div>
                        <div class="temperature-scale-long"></div>
                        <div style="width:30px"></div>
                        <span style="position: absolute;right: -5px" v-text="item"></span>
                        <div  style="width: 17px"></div>
                        <div class="temperature-scale-short" style="position: absolute;bottom: 0px"></div>
                    </div>
                    <div style="width: 10px;height: 0.5px;background: black;margin-left: 10px;"></div>
                </div>
                <div class="temperature-column"></div>
                <div class="temperature-columnTwo temperature-columnTwo-background" :id="id"></div>
            </div>
           <!-- <div class="temperature-column temperature-columnTwo"></div>-->
            <div class="temperature-ball" :style="getColor()"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "temperatureComponent",
        data(){
            return{

            }
        },
        props:{
            temperature:{
                type:Number,
                default:20
            },
            scale:{
                type:Array,
                default(){return [-10,0,10,20,30,40,50,60,70]}
            },
            id:{
                type:String,
                default:'columnTwo'
            },
            color:{
                type:String,
                default:'#2F2F76'
            }
        },
        created(){
            this.scale.reverse();
        },
        mounted(){
            this.modifytemperature();
        },
        watch: {
            'temperature':{
                handler(){
                    this.modifytemperature()
                }
            }
        },
        methods:{
            modifytemperature(){
                let height=0;
                height=((this.temperature-(this.scale[this.scale.length-1]-10))/100*400)+20.5;
                document.getElementById(this.id).style.height=height+'px';
                document.getElementById(this.id).style.background=this.color
            },
            getColor(){
                return 'background:'+this.color
            }
        }
    }
</script>

<style scoped>
    .temperature-shell{
        width: 120px;
        height: 527px;
        border: #2F2F76 4px solid;
        border-radius: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .temperature-shell .temperature-theme{
        display: flex;
        align-items: center;
        flex-direction: column;
    }
    .temperature-theme .temperature-body{
        height: 420px;
        display: flex;
        justify-content: center;
        position: relative;
        font-size: 14px;
    }
    .temperature-body .temperature-column{
        height: 420px;
        width: 30px;
        border-radius: 15px;
        background:rgba(112,112,112,0.23);
        position: absolute;
    }
    .temperature-body .temperature-columnTwo{
        width: 30px;
        position: absolute;
        bottom: 0px;
    }
    .temperature-body .temperature-columnTwo-radius{
        border-radius:15px;
    }
    .temperature-body .temperature-scale{
        display: flex;
        flex-direction: column;
        height: 400px;
        padding-top: 20px;
    }
    .temperature-scale .temperature-scale-item{
        height: 40px;
        display: flex;
        align-items: center;
        position: relative;
    }
    .temperature-scale-item .temperature-scale-long{
        width: 20px;
        height: 1px;
        background: black;
    }
    .temperature-scale-item .temperature-scale-short{
        width: 10px;
        height: 0.5px;
        background: black;
        left: 10px;
    }
    .temperature-theme .temperature-ball{
        width: 70px;
        height: 70px;
        border-radius: 40px;
        margin-top: -20px;
    }
</style>