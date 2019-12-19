<template>
    <div style="width: 180px;margin-left: 40px;margin-top: 20px">
        <surrounding-card :header="(index+1)+'路照明灯'" :height="39">
            <div class="lighting-control-body">
                <svg-icon icon-class="灯光" style="width: 53px;height: 80px"></svg-icon>
                <switch-control ref="switch_single" width="0.3646rem" :active="active" :inactive="inactive" :status="light.status==1?false:true" style="margin-top: 29px" @handleChange="changeItem"></switch-control>
            </div>
        </surrounding-card>
    </div>
</template>

<script>
    import surroundingCard from '../../surroundingCard'
    import switchControl from './switchControl'
    import {baseURL} from "../../../../api/config";

    export default {
        name: "lightControl",
        components:{
            switchControl,
            surroundingCard
        },
        data(){
            return{

            }
        },
        methods:{
            changeItem(data){

                let params={
                    number:this.light.number,
                    route:this.light.route,
                    status:data
                };
                this.$ajax({
                    method:'post',
                    url:baseURL+'/environment/lightSingleSwitch',
                    params:params
                }).then((res)=>{
                    this.$message.success('成功')
                }).catch(err=>{
                    //  this.state = false
                    this.$message.error(err);
                    this.$refs.switch_single.fail()
                    
                });
            },
        },
        props:{
            light:{
                type:Object
            },
            active:{
                type:Object
            },
            inactive:{
                type:Object
            },
            index:{
                type:Number
            }
        }
    }
</script>

<style scoped>
    .lighting-control-body{
        height: 201px;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
    }
</style>
