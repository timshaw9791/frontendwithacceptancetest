<template>
    <div class="charging-sation">
        <dialogs ref="dialog" :width="920" :title="'智能充电台'">
            <div class="charging-sation-box">
                <div class="charging-sation-select">
                    <select-charging-station id="chargingSationSelect" :placeholder="'请选择充电台'" :select="select.selectList"
                                             @selectRole="selectSation" :havaDefault="true"></select-charging-station>
                </div>
                <div class="charging-sation-controls">
                    <socket v-for="(item, i) in socketList" :key="cd+i" :socket="item" v-if="flag" @sucess="sucess"></socket>
                </div>
            </div>
        </dialogs>
    </div>
</template>

<script>
    import dialogs from '../surroundingDialog'
    import selectChargingStation from 'components/personnelManagement/personnelSelect'
    import socket from './controlComponents/socket'
    import { getdeploy } from 'api/login'
    import {getEquipChargeRecordList,getChangeStationStatus} from 'api/surroundings'

    export default {
        name: "chargingStation",
        components:{
            dialogs,
            selectChargingStation,
            socket
        },
        data(){
            return{
                select:{
                    selectList:[],
                },
                socketList:[],
                flag:false,
                changeCount:0
            }
        },
        created(){
            this.getConfigs()
        },
        methods:{
            getConfigs(){
                getdeploy().then(res => {
                    this.changeCount = res.ENVIRONMENT_CHARGE_COUNT;
                })
            },
            getChargingStationtList(){
                this.select.selectList=[];
                for(let i=1;i<=this.changeCount;i++){
                    this.select.selectList.push({
                            label:i+'号智能充电台',
                            value:i
                        })
                }
                this.$refs.dialog.show();
            },
            selectSation(data){
                this.getChargingStationtNumber(data)
            },
            sucess(data){
                if(data.flag){}else {
                    this.socketList[Number(data.number)-1]={
                        socketName:data.number+'号智能插座',
                        name:'',
                        number:0,
                        route:0,
                        chargingTime:'',
                        status:1
                    };
                }
            },
            getChargingStationtNumber(number){
                getChangeStationStatus({station:number}).then(res=>{
                    let soList=''
                    soList=res.toString()
                    let socket = soList.split('').reverse();
                    let socketCopy=[];
                    socket.forEach((item,index)=>{
                        let numberItem = index+1;
                        if(numberItem<=8){
                            socketCopy.push({
                                socketName:numberItem+'号智能插座',
                                name:'',
                                number:numberItem,
                                station:number,
                                chargingTime:'',
                                status:Number(item)
                            })
                        }
                    });
                   
                    this.socketList=socketCopy;
                    this.flag=true;
                    this.getContextGql(number,socketCopy)
                })
            },
            getContextGql(number,copyList){
                getEquipChargeRecordList({station:number}).then(res=>{
                    res.equipInfo.forEach(item=>{
                            let number = Number(item.chargeNumber)-1;
                            if(copyList[number].name==''){
                                copyList[number].name=item.equipName;
                                copyList[number].number=item.chargeNumber;
                                copyList[number].station=item.chargeStation;
                                copyList[number].chargingTime=item.occurrenceTimeMillis;
                            }
                        });
                        this.socketList=copyList;
                        this.flag=false;
                        setTimeout(()=>{
                            this.flag=true;
                        },0)
                }).catch(err=>{
                    this.$message.error(err.response.data.message);
                });
            },
            change(data){

            },
            show(){
                this.getConfigs();
                this.getChargingStationtList();

            },
            close(){
                this.$refs.dialog.close();
            },
            ajax(url, data, sCallback) {
                if(data!=''){
                    this.$ajax({
                        method:'post',
                        url:url,
                        params:data
                    }).then((res)=>{
                        sCallback.call(this,res);
                    }).catch(err=>{
                        this.$message.error(err.response.data.message);
                    })
                }else {
                    this.$ajax({
                        method:'post',
                        url:url,
                    }).then((res)=>{
                        sCallback.call(this,res);
                    }).catch(err=>{
                        this.$message.error(err.response.data.message);
                    })
                }
            },
        }
    }
</script>

<style>
    .charging-sation{
        width: 5.4167rem;
        font-size: 16px;
    }
    .charging-sation-box{
        width: 100%;
        height: 3.6302rem;
        padding: 0 0.1563rem;
    }
    .charging-sation-box .charging-sation-controls{
        display: flex;
        /* flex-direction: row; */
        flex-wrap: wrap;
        justify-content: space-between;
        /* padding-left: 0.1042rem; */
    }

    .charging-sation-box .charging-sation-select{
        padding-top: 0.1458rem;
        padding-bottom: 0.0417rem;
        
    }
    .charging-sation-select #chargingSationSelect .el-select {
        width: 202px;
        background:rgba(47,47,118,1);
        opacity:1;
        border-radius:16px;
    }
    .charging-sation-select #chargingSationSelect .el-input__icon{
        line-height: 32px;
        color: white;
    }
    .charging-sation-select #chargingSationSelect .el-input__inner{
        width: 202px;
        height: 32px;
        background:rgba(47,47,118,1);
        opacity:1;
        border-radius:16px;
        color: white;
    }
</style>
