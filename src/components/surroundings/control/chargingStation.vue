<template>
    <div class="charging-sation">
        <dialogs ref="dialog" :width="920" :title="'智能充电台'">
            <div class="charging-sation-box">
                <div class="charging-sation-select">
                    <select-charging-station id="chargingSationSelect" :placeholder="'请选择充电台'" 
                        :select="select.selectList" @selectRole="getChargingStationtNumber" :havaDefault="true">
                    </select-charging-station>
                </div>
                <div class="charging-sation-controls">
                    <socket v-for="(item, i) in socketList" :key="'cd'+i" :socket="item" @sucess="sucess"></socket>
                </div>
            </div>
        </dialogs>
    </div>
</template>

<script>
    import dialogs from '../surroundingDialog'
    import selectChargingStation from 'components/personnelManagement/personnelSelect'
    import socket from './controlComponents/socket'
    import {chargeInfo, chargeStatus} from 'api/surroundings'

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
                socketList:[]
            }
        },
        props: {
            count: {
                default: 0
            }
        },
        methods:{
            getChargingStationtList(){
                this.select.selectList = Array.from(Array(this.count), (v, i) => i)
                    .map(val => ({label: `${val+1}号智能充电台`, value: val+1}))
                this.$refs.dialog.show();
            },
            sucess(data){ // 判断是关闭还是开启充电
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
            getChargingStationtNumber(station){ // 获取充电台状态
                chargeStatus({station}).then(res => { 
                    let socketCopy = res.toString().split('').reverse().map((item, index) => {
                        return {
                            socketName: `${index+1}号智能插座`,
                            name: '',
                            number: index+1,
                            chargingTime: '',
                            status: Number(item),
                            station
                        }
                    })
                    this.getContextGql(station, socketCopy);
                })
            },
            getContextGql(station, copyList){ // 获取充电台充电装备信息
                chargeInfo({station}).then(res => {
                    res.equipInfo.forEach(item => {
                        let number = Number(item.chargeNumber)-1
                        !copyList[number].name && (copyList[number] = Object.assign(copyList[number], {
                            name: item.equipName,
                            number: item.chargeNumber,
                            station: item.chargeStation,
                            chargingTime: item.occurrenceTimeMillis
                        }))
                    })
                    this.socketList = copyList;
                })
            },
            show(){
                this.getChargingStationtList();
            },
            close(){
                this.$refs.dialog.close();
            }
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
