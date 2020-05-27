<template>
    <div style="width: 180px;margin-left: 40px;margin-top: 20px">
        <surrounding-card :header="(index+1)+'号除湿器'" :height="39">
            <div class="hum_body">
                <svg-icon icon-class="除湿器" style="width: 70px;height: 48px"></svg-icon>
                   <switch-control ref="switch_single" :active="active" :inactive="inactive" 
                   style="margin-top: 31px" :status="item" @handleChange="dehumidificationControl">
                </switch-control>
            </div>
        </surrounding-card>
    </div>
</template>

<script>
    import surroundingCard from '../surroundingCard'
    import switchControl from './controlComponents/switchControl'
    import {dehumidifierSwitch} from "api/surroundings"

     export default {
        name: "dehumi",
        components: {
            
            surroundingCard,
            switchControl
        },
        data() {
            return {
                active:{
                    text:'打开',
                    color:'#39BC53',
                },
                inactive:{
                    text:'关闭',
                    color:'#B8B8B8',
                },
                threshold:'',
                flag:true
            }
        },
        props:{
            index:{
                    type:Number
                },
            item:{
                type:[String, Boolean],
                default:''
            }
        },
        methods:{
            dehumidificationControl(data){
                dehumidifierSwitch({number: this.index+1, status: data}).then(res => {
                    this.$emit('success', {number: this.index, status: data});
                }).catch(err => {
                    this.$refs.switch_single.fail();
                })
            },
            show(){
                this.$refs.dialog.show();
            },
            close(){
                this.$refs.dialog.close();
            }
        }
    }
</script>

<style scoped>
    .hum_body{
        height: 248px;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
    }
</style>
