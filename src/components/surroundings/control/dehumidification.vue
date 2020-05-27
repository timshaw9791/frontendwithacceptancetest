<template>
    <div class="dehumidification">
        <dialogs :width="1040" ref="dialog" :title="'除湿器控制'">
            <div class="hum_box">
                <div class="dehumidification-box">
                    <dehumi v-for="(item,index) in humList" :index="index" :item="item" :key="index" @success="success"></dehumi>
                </div>
            </div>
        </dialogs>
    </div>
</template>

<script>
    import dialogs from '../surroundingDialog'
    import dehumi from './dehumi'
    import surroundingCard from '../surroundingCard'
    import switchControl from './controlComponents/switchControl'
    import { getdeploy } from 'api/login'
    import { HunSwitch, allDehumidifierStatus } from 'api/surroundings'
    import {baseURL} from "../../../api/config";

    export default {
        name: "dehumidification",
        components: {
            dialogs,
            surroundingCard,
            switchControl,
            dehumi,
           
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
                dehumidificationStatus:false,
                flag:true,
                humList: []
            }
        },
        props: {
            count: {
                default: 0
            }
        },
        methods:{
            gethumList(){
                allDehumidifierStatus().then(res => {
                    this.humList = Object.values(res);
                })
            },
            success(data) { // 改变状态成功
                this.gethumList();
            },
            show(){
                this.gethumList();
                this.$refs.dialog.show();
            },
            close(){
                this.$refs.dialog.close();
            }
        }
    }
</script>

<style scoped>
    .dehumidification {
        font-size: 16px;
        width: 4.6875rem;
    }

    .dehumidification .dehumidification-body {
        height: 416px;
        display: flex;
        align-items: center;
        /* padding-top: 20px; */
        flex-direction: column;
        font-size: 16px;
        color: #707070;
        position:relative;
    }
    .dehumidification-body .dehumidification-top{
        width: 180px;
        height: 207px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        box-shadow:0px 3px 6px rgba(0,0,0,0.16);
    }
    .hum_box{
        /* border:1px solid red; */
        width: 100%;
        height: 3.6302rem;
   
    }
    .dehumidification-box{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        padding-left: 0.3125rem;
    }
    .airConditioning-box{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        padding-left: 0.3125rem;
    }
    .dehumidification-body .dehumidification-bottom{
        height: 22px;
        margin-top: 29px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .dehumidification-bottom .input{
        width: 41px;
        outline:none;
        line-height: 30px;
        text-align: center;
        color: #707070;
    }
    .dehumidification-body .dehumidification-button{
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        bottom: 33px;
    }
    .dehumidification-button .cancel{
        width:70px;
        height:30px;
        background:rgba(255,255,255,1);
        box-shadow:0px 3px 6px rgba(0,0,0,0.16);
        opacity:1;
        border-radius:6px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #707070;
    }
    .dehumidification-button .submission{
        width:70px;
        height:30px;
        background:rgba(47,47,118,1);
        box-shadow:0px 3px 6px rgba(0,0,0,0.16);
        opacity:1;
        border-radius:6px;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 27px;
    }
</style>
