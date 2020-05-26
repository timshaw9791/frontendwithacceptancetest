<template>
    <div class="environmentalControl">
        <s-card :header="'设备状态及控制'" @editt="edit">
           <div class="control-box">
               <control-template v-for="(item, i) in control"  :templateData="item" :key="i" @handleConctrol="toConctrol"></control-template>
           </div>
        </s-card>
        <edit-threshold ref="editThreshold"></edit-threshold>
        <charging-station ref="chargingStation" :count="deviceObj.ENVIRONMENT_CHARGE_COUNT"></charging-station>
        <dehumidification ref="dehumidification" :count="deviceObj.DEHUMIDIFIER_COUNT"></dehumidification>
        <air-conditioning ref="airConditioning"></air-conditioning>
        <light ref="lighting"></light>
        <smoke-alarm ref="smokeAlarm"></smoke-alarm>
        <exhaust ref="exhaust"></exhaust>
        <disinfection ref="disinfection"></disinfection>
    </div>
</template>

<script>
    import { getDeviceConfig } from 'api/surroundings'
    import sCard from './surroundingCard'
    import controlTemplate from './controlTemplate'
    import chargingStation from './control/chargingStation'
    import dehumidification from './control/dehumidification'
    import airConditioning from './control/airConditioning'
    import editThreshold from './control/editThreshold'
    import smokeAlarm from './control/smokeAlarm'
    import light from './control/lighting'
    import exhaust from './control/exhaust'
    import disinfection from './control/disinfection'
    import { startProcessCamVideo } from '@/externalProcess'

    export default {
        name: "environmentalControl",
        components:{
            sCard,
            controlTemplate,
            chargingStation,
            dehumidification,
            airConditioning,
            light,
            smokeAlarm,
            exhaust,
            disinfection,
            editThreshold
        },
        data(){
            return{
                control:[
                    {svg:'充电台',notSvg:'',text:'智能充电台',flag:true, ref:'chargingStation'},
                    {svg:'除湿器',notSvg:'无除湿器',text:'除湿器控制',flag:true, ref:'dehumidification'},
                    {svg:'灯光',notSvg:'',text:'灯光控制',flag:true, ref:'lighting'},
                    {svg:'烟雾报警',notSvg:'无烟雾报警',text:'烟雾报警',flag:true, ref:'smokeAlarm'},
                    {svg:'视频监控',notSvg:'',text:'视频监控',flag:true},
                    {svg:'空调',notSvg:'无空调',text:'空调控制',flag:true, ref:'airConditioning'},
                    {svg:'排风',notSvg:'无排风',text:'排风控制',flag:true, ref:'exhaust'},
                    {svg:'消毒机',notSvg:'无消毒机',text:'消毒机控制',flag:true, ref:'disinfection'},
                ],
                deviceObj: {}
            }
        },
        created(){
            this.getConfigs();
        },
        methods:{
            edit(){ // 编辑阈值
                this.$refs.editThreshold.show()
            },
            getConfigs(){
                getDeviceConfig().then(res => {
                    this.control[3].flag=res.SMOKE;
                    this.control[1].flag=res.DEHUMIDIFIER;
                    this.control[7].flag=res.DISINFECTION;
                    this.control[5].flag=res.AIR_CONDITIONER;
                    this.control[6].flag=res.EXHAUST_AIR;
                    this.deviceObj = res;
                    this.$store.commit('setConfig', res);
                })
            },
            toConctrol(data){
                if(data.flag){
                    if(data.text == '视频监控') {
                        startProcessCamVideo();
                    } else {
                        this.$refs[data.ref].show();
                    }
                }else {
                    this.$message.error('本仓库尚未开放此功能')
                }
            }
        }
    }
</script>

<style scoped>
    .environmentalControl{
        width: 100%;
        margin-top: 0.1563rem;
    }
    .environmentalControl .control-box{
        height: 2.7448rem;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }

</style>
