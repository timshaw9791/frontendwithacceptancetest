<template>
    <div class="lighting">
        <dialogs ref="dialog" :width="920" :title="'灯光控制'">
            <div class="lighting-box">
                <div class="lighting-select">
                    <select-charging-station :placeholder="'选择照明路数'" :select="select.selectList"
                                             @selectRole="selectSation" :havaDefault="true"></select-charging-station>
                   <div style="width: 210px;margin-left: 0.1042rem">
                       <switch-control :width="70" :active="active.all" :inactive="inactive.all" @handleChange="changeAll"></switch-control>
                   </div>
                </div>
                <div class="lighting-controls">
                   <light-control v-for="(item,index) in lightList" :light="item" :active="active.item" 
                   :inactive="inactive.item" :index="Number(index)" :key="'kt'+index"></light-control>
                </div>
            </div>
        </dialogs>
    </div>
</template>

<script>
    import dialogs from '../surroundingDialog'
    import switchControl from './controlComponents/switchControl'
    import lightControl from './controlComponents/lightControl'
    import { lightQuery, allLightSwitch } from 'api/surroundings'
    import {baseURL} from "../../../api/config";
    import selectChargingStation from 'components/personnelManagement/personnelSelect'

    export default {
        name: "lighting",
        components:{
            dialogs,
            switchControl,
            lightControl,
            selectChargingStation
        },
        data(){
            return{
                status:null,
                select:{
                    selectList:[],
                },
                active:{
                    all:{
                        text:'一键开灯',
                        color:'#39BC53'
                    },
                    item:{
                        text:'开灯',
                        color:'#39BC53'
                    }
                },
                lightList:[],
                inactive:{
                    all:{
                        text:'一键关灯',
                        color:'#B8B8B8',
                    },
                    item:{
                        text:'关灯',
                        color:'#B8B8B8',
                    }
                },
            }
        },
        props: {
            count: {
                default: 0
            }
        },
        methods:{
            selectSation(data){
                let route = Number(data[0])+1,
                    statusArr = data.toString().split('').reverse();
                statusArr.pop(); // 去除route数据
                this.lightList = statusArr.map((status, number) => ({number:number+1,status,route})).slice(0, this.count);
            },
            getLightQuery() {
                lightQuery().then(res => {
                    this.select.selectList = res.map((item, index) => ({label: `${index+1}路照明`, value: index+item}));
                    this.$refs.dialog.show();
                })
            },
            changeAll(data){
                allLightSwitch({status: data}, true).then(res => {
                    this.lightList.forEach(item => {
                        item.status = data?0:1
                    })
                })
            },
            show(){
                this.getLightQuery();
            },
            close(){
                this.$refs.dialog.close();
            }
        }
    }
</script>

<style scoped>

   /deep/ .el-select {
        width: 202px;
        background:rgba(47,47,118,1);
        opacity:1;
        border-radius:16px;
    }
   /deep/ .el-input__icon{
        line-height: 32px;
        color: white;
    }
   /deep/ .el-input__inner{
        width: 202px;
        height: 32px;
        background:rgba(47,47,118,1);
        opacity:1;
        border-radius:16px;
        color: white;
    }
    .lighting{
        font-size: 16px;
        width: 4.6875rem;
    }
    .lighting-box{
        width: 100%;
        height: 3.6302rem;
    }
    .lighting-box .lighting-controls{
        display: flex;
        flex-wrap: wrap;
    }
    .lighting-box .lighting-select{
        padding-top: 0.1458rem;
        padding-bottom: 0.0417rem;
        padding-left: 0.1198rem;
        display: flex;
        align-items: center;
    }
    .lighting-select #chargingSationSelect .el-select {
        width: 1.0521rem;
        background:rgba(47,47,118,1);
        opacity:1;
        border-radius:16px;
    }
    .lighting-select #chargingSationSelect .el-input__icon{
        line-height: 32px;
        color: white;
    }
    .lighting-select #chargingSationSelect .el-input__inner{
        width: 1.0521rem;
        height: 32px;
        background:rgba(47,47,118,1);
        opacity:1;
        border-radius:16px;
        color: white;
    }
</style>
