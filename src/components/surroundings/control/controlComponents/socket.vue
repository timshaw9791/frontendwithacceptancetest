<template>
    <div style="width: 180px;margin-left: 40px;margin-top: 20px">
        <surrounding-card :header="socket.socketName" :height="39">
            <div class="charging-sation-control-body">
                <div class="c_s_c_upper">
                    <div class="svg-box">
                        <svg-icon icon-class="插座图标" style="width: 60px;height: 60px"></svg-icon>
                    </div>
                    <span v-text="socket.name" style="margin-top: 7px;font-size: 16px"></span>
                    <span v-text="socket.chargingTime" style="margin-top: 5px;font-size: 14px"></span>
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
        methods:{
            change(data){
                this.controlCharging(data);
            },
            controlCharging(data){
                let params={route:this.socket.route,number:this.socket.number,status:data};
                this.$ajax({
                    method:'post',
                    url:'http://10.128.4.100:8088/environment/chargeSwitch',
                    params:params
                }).then((res)=>{
                    this.$message.success('成功')
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
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
    }
    .charging-sation-control-body .c_s_c_upper{
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #707070;
    }
    .c_s_c_upper .svg-box{
        width: 70px;
        height: 70px;
        padding: 5px;
        margin-top: 13px;
    }
</style>