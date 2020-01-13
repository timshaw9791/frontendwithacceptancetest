<template>
    <div class="charging-sation">
        <dialogs ref="dialog" :width="920" :title="'智能充电台'">
            <div class="charging-sation-box">
                <div class="charging-sation-select">
                    <select-charging-station id="chargingSationSelect" :placeholder="'请选择充电台'" :select="select.selectList"
                                             @selectRole="selectSation" :havaDefault="true"></select-charging-station>
                </div>
                <div class="charging-sation-controls">
                    <socket v-for="item in socketList" :socket="item" v-if="flag" @sucess="sucess"></socket>
                </div>
            </div>
        </dialogs>
    </div>
</template>

<script>
    import dialogs from '../surroundingDialog'
    import selectChargingStation from 'components/personnelManagement/personnelSelect'
    import socket from './controlComponents/socket'
    import {fetchMixin} from 'field/common/mixinFetch'
    import {baseURL} from "../../../api/config";
    import {getEquipChargeRecordList,getChangeStationStatus} from 'api/surroundings'

    export default {
        name: "chargingStation",
        mixins: [fetchMixin],
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
                qfilter:{
                    key:"chargeStation",
                    operator:"EQUEAL",
                    value:"1",
                    combinator:"AND",
                    next:{
                        value:"0",
                        key:"duration",
                        operator:"EQUEAL"
                    }
                },
                changeCount:0
            }
        },
        created(){
            this.getConfigs()
        },
        methods:{
            getConfigs(){
                this.$ajax({
                    method:'post',
                    url:baseURL+'/environment/deviceConfig',
                }).then((res)=>{
                    this.changeCount=res.data.data.ENVIRONMENT_CHARGE_COUNT;
                }).catch(err=>{
                    this.$message.error(err.response.data.message);
                });
            },
            getChargingStationtList(){
                this.select.selectList=[];
            //   this.ajax(baseURL+'/environment/getChargeCount','',(data)=>{
            //       for (let i=1;i<=data.data.data;i++){
            //           this.select.selectList.push({
            //               label:i+'号智能充电台',
            //               value:i
            //           })
            //       }
            //       this.$refs.dialog.show();
            //   })
            //   getChangeStationStatus({station:1}).then(res=>{
            //       console.log(res);
            //   })
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
                
                // this.qfilter.value=String(number);
                // this.gqlQuery(surroundings.getEquipChargeRecordList,{qfilter:this.qfilter}, (data) => {
                //    let socketCopy=[];
                //    for (let i=0;i<8;i++){
                //       socketCopy.push({
                //           socketName:(i+1)+'号智能插座',
                //           name:'',
                //           number:i+1,
                //           route:number,
                //           chargingTime:'',
                //           status:1
                //       })
                //    };
                //    data.forEach(item=>{
                //        let number = Number(item.chargeNumber)-1;
                //        if(socketCopy[number].name==''){
                //            socketCopy[number].name=item.equipName;
                //            socketCopy[number].number=item.chargeNumber;
                //            socketCopy[number].route=item.chargeStation;
                //            socketCopy[number].status=0;
                //            socketCopy[number].chargingTime=item.startTime;
                //        }
                //    });
                //     this.socketList=socketCopy;
                //     this.flag=false;
                //     setTimeout(()=>{
                //         this.flag=true;
                //     },0)
                // }, true)
               /* this.ajax('http://192.168.50.15:8080/warehouse/environment/chargeQuery',params,(data)=>{
                    let socket = data.data.data.split('').map(Number).reverse();
                    let socketCopy=[];
                    socket.forEach((item,index)=>{
                        let number = index+1;
                        socketCopy.push({
                            socketName:number+'号智能插座',
                            name:'充电警棍',
                            number:index+1,
                            route:params.number,
                            chargingTime:'已冲30分钟',
                            status:item
                        })
                    });
                    this.socketList=socketCopy;
                    this.flag=false;
                    setTimeout(()=>{
                        this.flag=true;
                    },0)
                })*/
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
                // this.qfilter.value=String(number);
                // this.gqlQuery(surroundings.getEquipChargeRecordList,{qfilter:this.qfilter}, (data) => {
                //     data.forEach(item=>{
                //         let number = Number(item.chargeNumber)-1;
                //         if(copyList[number].name==''){
                //             copyList[number].name=item.equipName;
                //             copyList[number].number=item.chargeNumber;
                //             copyList[number].route=item.chargeStation;
                //             copyList[number].chargingTime=item.startTime;
                //         }
                //     });
                //     this.socketList=copyList;
                //     this.flag=false;
                //     setTimeout(()=>{
                //         this.flag=true;
                //     },0)
                // }, true)
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
               /* this.query(graphql, variables).then((data) => {
                    if (data.errors) {   //未通过服务端的表单验证
                        /!*this.$message.error(`${data.errors}`);*!/
                    }
                    else {
                        let defultData = data;
                        if (defult) {//判断是否使用默认格式数据，否或不输defult则为使用原始数据
                            //将数据处理为默认格式,即返回content里的数据
                            var deepclonedata = JSON.parse(JSON.stringify(data.data));
                            var jqlname = Object.keys(deepclonedata)[0];
                            var result = deepclonedata[jqlname];
                            defultData = !result ? null : (result.hasOwnProperty('content') ? result.content : result);
                        }

                    }
                }).catch((error) => {//服务器错误或者网络状态问题
                    this.$message.error(`${error}`);
                })*/
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
