<template>
    <div class="environmentalControl">
        <s_card :header="'设备状态及控制'" @editt="edit">
           <div class="control-box">
               <control-template v-for="item in control"  :templateData="item" @handleConctrol="toConctrol"></control-template>
           </div>
        </s_card>
        <editThreshold ref="editThreshold"></editThreshold>
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
    import editThreshold from './control/editThreshold'
    import smokeAlarm from './control/smokeAlarm'
    import light from './control/lighting'
    import exhaust from './control/exhaust'
    import disinfection from './control/disinfection'
    import {baseURL} from "../../api/config";
   

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
            disinfection,
            editThreshold
        },
        data(){
            return{
                control:[
                    {svg:'插座图标',notSvg:'',text:'智能充电台',flag:true},
                    {svg:'除湿图标',notSvg:'除湿图标灰',text:'除湿器控制',flag:true},
                    {svg:'灯光图标',notSvg:'',text:'灯光控制',flag:true},
                    {svg:'烟雾报警',notSvg:'烟雾报警灰',text:'烟雾报警',flag:true},
                    {svg:'视频监控',notSvg:'',text:'视频监控',flag:true},
                    {svg:'空调图标',notSvg:'空调图标灰',text:'空调控制',flag:true},
                    {svg:'排风图标',notSvg:'排风图标灰',text:'排风控制',flag:true},
                    {svg:'消毒图标',notSvg:'消毒图标灰',text:'消毒机控制',flag:true},
                ],
                clickRefList:[
                    {name:'智能充电台',ref:'chargingStation'},
                    {name:'除湿器控制',ref:'dehumidification'},
                    {name:'空调控制', ref:'airConditioning'},
                    {name:'灯光控制',ref:'lighting'},
                    {name:'烟雾报警',ref:'smokeAlarm'},
                    {name:'排风控制',ref:'exhaust'},
                    {name:'消毒机控制',ref:'disinfection'}
                    ],
                flag:{
                    chargingStation:false,
                    dehumidification:false,
                    airConditioning:false,
                    lighting:false,
                    smokeAlarm:false,
                    exhaust:false,
                    disinfection:false
                }
            }
        },
        created(){
            this.getConfigs();
        },
        methods:{
            edit(){
             this.$refs.editThreshold.show()
            },
            getConfigs(){
                this.$ajax({
                    method:'post',
                    url:baseURL+'/environment/deviceConfig',
                }).then((res)=>{
                    let config=res.data.data;
                    this.control[3].flag=config.SMOKE;
                    this.control[1].flag=config.DEHUMIDIFIER;
                    this.control[7].flag=config.DISINFECTION;
                    this.control[5].flag=config.AIR_CONDITIONER;
                    this.control[6].flag=config.EXHAUST_AIR;
                }).catch(err=>{
                    this.$message.error(err);
                });
            },
            toConctrol(data){
                console.log("dawdawd");
                console.log(data);
               if(data.flag){
                   this.handleClick(data.text);
               }else {
                   this.$message.error('本仓库尚未开放此功能')
               }
            },
            handleClick(clickItem){
                
                let clickRef;
                if(clickItem=='视频监控'){
                   this.$emit('toVideo')
                }else {
                    this.clickRefList.forEach(item=>{
                        if(clickItem==item.name){
                            clickRef = item.ref;
                            this.$refs[clickRef].show();
                        }
                    });
                }

            },
            clickFlag(ref){
                for (let key in this.flag){
                    if(key!=ref){
                        this.flag[key]=false
                    }else {
                        this.flag[key]=true
                    }
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
