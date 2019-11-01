<template>
    <div class="temperature-shell">
        <div class="temperature-theme">
            <div class="temperature-body">
                <div class="temperature-scale">
                    <div class="temperature-scale-item" v-for="(item,index) in scale">
                        <div class="temperature-scale-short" style="position: absolute;top: 0px" v-if="index!=0"></div>
                        <div class="temperature-scale-long"></div>
                        <div style="width:0.1719rem"></div>
                        <span style="position: absolute;right: -8px" v-text="item"></span>
                        <div  style="width: 0.0885rem"></div>
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
            /* 随html元素变化(网页页面大小改变)响应式计算 */
            window.addEventListener('resize', this.modifytemperature)
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
                let height=0, multi = 0, add = 0,
                    rootFontSize = localStorage.getItem('fontSize');
                multi = (400*rootFontSize/192).toFixed(1)
                add = (20.5*rootFontSize/192).toFixed(1)
                height=((this.temperature-(this.scale[this.scale.length-1]-10))/100*multi)+(+add);
                console.log('multi' + multi);
                console.log('add' + add);
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
        width: 0.625rem;
        height: 2.7448rem;
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
        height: 2.1875rem;
        display: flex;
        justify-content: center;
        position: relative;
        font-size: 0.0729rem;
    }
    .temperature-body .temperature-column{
        height: 2.1875rem;
        width: 0.1563rem;
        border-radius: 15px;
        background:rgba(112,112,112,0.23);
        position: absolute;
    }
    .temperature-body .temperature-columnTwo{
        width: 0.1563rem;
        position: absolute;
        bottom: 0px;
    }
    .temperature-body .temperature-columnTwo-radius{
        border-radius:15px;
    }
    .temperature-body .temperature-scale{
        display: flex;
        flex-direction: column;
        height: 2.0833rem;
        padding-top: 0.1042rem;
    }
    .temperature-scale .temperature-scale-item{
        height: 0.2083rem;
        display: flex;
        align-items: center;
        position: relative;
    }
    .temperature-scale-item .temperature-scale-long{
        width: 0.1042rem;
        height: 1px;
        background: black;
    }
    .temperature-scale-item .temperature-scale-short{
        width: 0.0521rem;
        height: 0.5px;
        background: black;
        left: 0.0521rem;
    }
    .temperature-theme .temperature-ball{
        width: 0.3646rem;
        height: 0.3646rem;
        border-radius: 40px;
        margin-top: -0.1042rem;
    }
</style>