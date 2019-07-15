<template>
    <div style="width: 180px;margin-left: 40px;margin-top: 20px">
        <surrounding-card :header="socket.socketName" :height="39">
            <div class="charging-sation-control-body">
                <div class="c_s_c_upper">
                    <div class="svg-box-socket">
                        <svg-icon icon-class="插座图标" style="width: 60px;height: 60px;margin-top: 5px"></svg-icon>
                    </div>
                    <span v-text="socket.name" style="margin-top: 11px;font-size: 16px" v-if="socket.name!=''&&flag"></span>
                    <span v-text="time" style="margin-top: 5px;font-size: 14px"  v-if="socket.chargingTime!=''&&flag"></span>
                    <span v-text="'空闲'" style="margin-top: 20px;margin-bottom: 12px" v-if="!flag||socket.name==''"></span>
                </div>
                <switch-control style="margin-top: 13px" :status="socket.status==1?false:true" @handleChange="change"></switch-control>
            </div>
        </surrounding-card>
    </div>
</template>

<script>
    import surroundingCard from '../../surroundingCard'
    import switchControl from './switch'
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
                let params={route:this.socket.route,number:this.socket.number,status:data};
                this.$ajax({
                    method:'post',
                    url:'http://10.128.4.152:8080/warehouse/environment/chargeSwitch',
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
                    this.$message.error(err);
                });
            }
        }
    }
</script>

<style scoped>
    .charging-sation-control-body{
        height: 201px;
        width: 100%;
        text-align: center;
    }
    .charging-sation-control-body .c_s_c_upper{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        padding-top: 13px;
        color: #707070;
    }
    .c_s_c_upper .svg-box-socket{
        text-align: center;
        width: 100%;
        height: 70px;
    }
</style>