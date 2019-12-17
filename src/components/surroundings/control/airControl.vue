<template>
    <div style="width: 180px;margin-left: 40px;margin-top: 20px">
        <surrounding-card :header="(index+1)+'号空调'" :height="39">
            <div class="lighting-control-body">
                 <svg-icon icon-class="空调" style="width: 70px;height: 48px"></svg-icon>
                    <span v-text="'空调控制'" style="margin-top: 19px"></span>
                    <switch-control :active="refrigerationActive" :inactive="refrigerationInactive" :status="refrigeration" style="margin-top: 31px" @handleChange="refrigerationControl"></switch-control>
                    <switch-control :active="hotActive" :inactive="hotInactive" :status='hot' style="margin-top: 16px"  @handleChange="hotControl"></switch-control>
                    <switch-control :active="dehumidificationActive" :inactive="dehumidificationInactive" :status="dehumidification" style="margin-top: 16px"  @handleChange="dehumidificationControl"></switch-control>
            </div>
        </surrounding-card>
    </div>
</template>

<script>
    import surroundingCard from '../surroundingCard'
    import switchControl from './controlComponents/switchControl'
    import {baseURL} from "../../../api/config";

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
        this.getAirStatusList()
        this.initStatus(this.item.STATUS.toLowerCase())
        },
        methods:{
            refrigerationControl(data){
               if(data){
                   this.controlAir(1);
                   this.initStatus('refrigeration')
               }else {
                   this.controlAir(0)
               }
            },
            getAirStatusList(){
               this.$ajax({
                    method:'post',
                    url:baseURL+'/environment/allAirConditionerStatus',
                }).then(res=>{
                    let arrList=res.data.data
                    let newList=Object.values(arrList)
                    this.initStatus(newList[this.index].STATUS.toLowerCase())
                })
            },
            hotControl(data){
                if(data){
                    this.controlAir(2);
                    this.initStatus('hot')
                }else {
                    this.controlAir(0)
                }
            },
            dehumidificationControl(data){
                if(data){
                    this.controlAir(3);
                    this.initStatus('dehumidification')
                }else {
                    this.controlAir(0)
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
                this.$ajax({
                    method:'post',
                    url:baseURL+'/environment/airConditionerSwitch',
                    params:{
                        number:this.index+1,
                        status:data
                        }
                }).then((res)=>{
                    this.$message.success('操作成功')
                }).catch(err=>{
                    this.$message.error(err);
                });
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
