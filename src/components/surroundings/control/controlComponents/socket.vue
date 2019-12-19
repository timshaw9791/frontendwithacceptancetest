<template>
    <div style="width: 180px;margin-top: 0.1042rem">
        <surrounding-card :header="socket.socketName" :height="39">
            <div class="charging-sation-control-body">
                <div class="c_s_c_upper">
                    <div class="svg-box-socket">
                        <svg-icon icon-class="充电台" style="width: 0.3125rem;height: 0.3125rem;margin-top: 0.026rem"></svg-icon>
                    </div>
                    <span v-text="socket.name" style="margin-top: 0.0573rem;font-size: 16px" v-if="socket.name!=''&&flag"></span>
                    <span v-text="time" style="margin-top: 0.026rem;font-size: 14px"  v-if="socket.chargingTime!=''&&flag"></span>
                    <span v-text="'空闲'" style="margin-top: 0.1042rem;margin-bottom: 0.0625rem" v-if="!flag||socket.name==''"></span>
                </div>
                <switch-control ref="switch_single" style="margin-top: 0.0677rem" width="0.3646rem" :status="socket.status==1?false:true" @handleChange="change"></switch-control>
            </div>
        </surrounding-card>
    </div>
</template>

<script>
    import surroundingCard from '../../surroundingCard'
    import switchControl from './switchControl'
    import {baseURL} from "../../../../api/config";

    export default {
        name: "socket",
        components:{
            surroundingCard,
            switchControl
        },
        props:{
            socket:{
                type:Object
            }
        },
        data(){
            return{
                flag:true
            }
        },
        computed:{
          time(){
              let nowDate = new Date().valueOf();
              return '已充电'+Math.round((nowDate-this.socket.chargingTime)/1000/60)+'分钟'
          }
        },
        methods:{
            change(data){
                this.controlCharging(data);
            },
            getFlag(){
              if(this.socket.name==''){
                  return false
              }else {
                  if(this.flag){
                      return false
                  }else {
                      return true
                  }
              }
            },
            controlCharging(data){
                let params={station:this.socket.station,number:this.socket.number,status:data};
                this.$ajax({
                    method:'post',
                    url:baseURL+'/environment/chargeSwitch',
                    params:params
                }).then((res)=>{
                    let resData={
                        number:this.socket.number,
                        flag:data
                    };
                    this.flag=false;
                    this.$emit('sucess',resData);
                    this.$message.success('成功');
                }).catch(err=>{
                    console.log(err);
                    this.$message.error(err);
                    this.$refs.switch_single.fail()
                    
                });
            }
        }
    }
</script>

<style scoped>
    .charging-sation-control-body{
        height: 1.0469rem;
        width: 100%;
        text-align: center;
    }
    .charging-sation-control-body .c_s_c_upper{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        padding-top: 0.0677rem;
        color: #707070;
    }
    .c_s_c_upper .svg-box-socket{
        text-align: center;
        width: 100%;
        height: 0.3646rem;
    }
</style>
