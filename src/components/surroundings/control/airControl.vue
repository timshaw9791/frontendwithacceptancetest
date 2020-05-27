<template>
    <div style="width: 180px;margin-left: 40px;margin-top: 20px">
        <surrounding-card :header="(index+1)+'号空调'" :height="39">
            <div class="lighting-control-body">
                 <svg-icon icon-class="空调" style="width: 70px;height: 48px"></svg-icon>
                    <span v-text="'空调控制'" style="margin-top: 19px"></span>
                    <switch-control ref="switch_single1" :active="refrigerationActive" :inactive="refrigerationInactive" :status="refrigeration" style="margin-top: 31px" @handleChange="refrigerationControl"></switch-control>
                    <switch-control ref="switch_single2" :active="hotActive" :inactive="hotInactive" :status='hot' style="margin-top: 16px"  @handleChange="hotControl"></switch-control>
                    <switch-control ref="switch_single3" :active="dehumidificationActive" :inactive="dehumidificationInactive" :status="dehumidification" style="margin-top: 16px"  @handleChange="dehumidificationControl"></switch-control>
            </div>
        </surrounding-card>
    </div>
</template>

<script>
    import surroundingCard from '../surroundingCard'
    import switchControl from './controlComponents/switchControl'
    import { airControlSwitch } from 'api/surroundings'

    export default {
        name: "airControl",
        components:{
            switchControl,
            surroundingCard
        },
         data(){
            return{
            refrigerationActive:{
                    text:'',
                    color:'#39BC53',
                },
                refrigerationInactive:{
                    text:'制冷',
                    color:'#B8B8B8',
                },
                hotActive:{
                    text:'',
                    color:'#39BC53',
                },
                hotInactive:{
                    text:'制热',
                    color:'#B8B8B8',
                },
                dehumidificationActive:{
                    text:'',
                    color:'#39BC53',
                },
                dehumidificationInactive:{
                    text:'抽湿',
                    color:'#B8B8B8',
                },
                refrigeration:false,
                hot:false,
                dehumidification:false,
            }
        },
        created(){
        // this.getAirStatusList()
        this.initStatus(this.item.STATUS.toLowerCase())
        },
        methods:{
            refrigerationControl(data){
               if(data){
                   this.controlAir('REFRIGERATION');
                   this.initStatus('refrigeration')
               }else {
                   this.controlAir('CLOSE')
               }
            },
            hotControl(data){
                if(data){
                    this.controlAir('HOT');
                    this.initStatus('hot')
                }else {
                    this.controlAir('CLOSE')
                }
            },
            dehumidificationControl(data){
                if(data){
                    this.controlAir('DEHUMIDIFICATION');
                    this.initStatus('dehumidification')
                }else {
                    this.controlAir('CLOSE')
                }
            },
            initStatus(data){
                switch (data) {
                    case 'refrigeration':
                        this.refrigeration=true;
                        this.hot=false;
                        this.dehumidification=false;
                        break;
                    case 'hot':
                        this.hot=true;
                        this.refrigeration=false;
                        this.dehumidification=false;
                        break;
                    case 'dehumidification':
                        this.dehumidification=true;
                        this.refrigeration=false;
                        this.hot=false;
                        break;
                    case 'close':
                        this.refrigeration=false;
                        this.hot=false;
                        this.dehumidification=false;
                        break;
                }
            },
            controlAir(data){
                airControlSwitch({number: this.index+1, airConditionerEnum: data}).then(res=>{})
                    .catch(err => {
                        switch (data) {
                            case 'REFRIGERATION':
                                this.$refs.switch_single1.fail();
                                break;
                            case 'HOT':
                                this.$refs.switch_single2.fail();
                                break;
                            case 'DEHUMIDIFICATION':
                                this.$refs.switch_single3.fail();
                                break;
                        }
                    })
            },
        },
        props:{
            index:{
                type:Number
            },
            item:{
                type:Object,
                default:''
            }
        },
        
       
    }
</script>

<style scoped>
    .lighting-control-body{
        height: 248px;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
    }
</style>
