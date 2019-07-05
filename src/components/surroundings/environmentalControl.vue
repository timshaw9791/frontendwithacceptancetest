<template>
    <div class="environmentalControl">
        <s_card :header="'设备状态及控制'">
           <div class="control-box">
               <control-template v-for="item in control" v-if="item.flag"  :templateData="item" @handleConctrol="toConctrol"></control-template>
           </div>
        </s_card>
        <charging-station ref="chargingStation"></charging-station>
        <dehumidification ref="dehumidification"></dehumidification>
        <air-conditioning ref="airConditioning"></air-conditioning>
        <light ref="lighting"></light>
        <smoke-alarm ref="smokeAlarm"></smoke-alarm>
        <exhaust ref="exhaust"></exhaust>
        <disinfection ref="disinfection"></disinfection>
    </div>
</template>

<script>
    import s_card from './surroundingCard'
    import controlTemplate from './controlTemplate'
    import chargingStation from './control/chargingStation'
    import dehumidification from './control/dehumidification'
    import airConditioning from './control/airConditioning'
    import smokeAlarm from './control/smokeAlarm'
    import light from './control/lighting'
    import exhaust from './control/exhaust'
    import disinfection from './control/disinfection'
    export default {
        name: "environmentalControl",
        components:{
            s_card,
            controlTemplate,
            chargingStation,
            dehumidification,
            airConditioning,
            light,
            smokeAlarm,
            exhaust,
            disinfection
        },
        data(){
            return{
                control:[
                    {svg:'插座图标',text:'智能充电台',flag:true},
                    {svg:'除湿图标',text:'除湿器控制',flag:true},
                    {svg:'空调图标',text:'空调控制',flag:true},
                    {svg:'灯光图标',text:'灯光控制',flag:true},
                    {svg:'烟雾报警',text:'烟雾报警',flag:true},
                    {svg:'视频监控',text:'视频监控',flag:true},
                    {svg:'排风图标',text:'排风控制',flag:true},
                    {svg:'消毒图标',text:'消毒机控制',flag:true},
                    {svg:'无排风',text:'排风控制',flag:false},
                    {svg:'无消毒',text:'消毒机控制',flag:false}
                ],
                clickRefList:[
                    {name:'智能充电台',ref:'chargingStation'},
                    {name:'除湿器控制',ref:'dehumidification'},
                    {name:'空调控制', ref:'airConditioning'},
                    {name:'灯光控制',ref:'lighting'},
                    {name:'烟雾报警',ref:'smokeAlarm'},
                    {name:'排风控制',ref:'exhaust'},
                    {name:'消毒机控制',ref:'disinfection'}
                    ]
            }
        },
        methods:{
            toConctrol(data){
               if(data.flag){
                   if(data.text=='视频监控'){
                       this.$emit('toVideo',true)
                   }else {
                       this.handleClick(data.text);
                   }
               }
            },

            handleClick(clickItem){
                let clickRef;
                this.clickRefList.forEach(item=>{
                    if(clickItem==item.name){
                        clickRef = item.ref;
                        this.$refs[clickRef].show();
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .environmentalControl{
        width: 100%;
        margin-top: 30px;
    }
    .environmentalControl .control-box{
        height: 527px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }

</style>