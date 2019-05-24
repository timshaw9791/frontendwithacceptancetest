<template>
    <div class="charging-sation">
        <dialogs ref="dialog" :width="1040" :title="'智能充电台'">
            <div class="charging-sation-box">
                <div class="charging-sation-select">
                    <select-charging-station id="chargingSationSelect" :placeholder="'请选择充电台'" :select="select.selectList"
                                             @selectRole="selectSation" :havaDefault="true"></select-charging-station>
                </div>
                <div class="charging-sation-controls">
                    <socket v-for="item in socketList" :socket="item" v-if="flag"></socket>
                </div>
            </div>
        </dialogs>
    </div>
</template>

<script>
    import dialogs from '../surroundingDialog'
    import selectChargingStation from 'components/personnelManagement/personnelSelect'
    import socket from './controlComponents/socket'
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
                flag:false
            }
        },
        created(){
          this.getChargingStationtList();
        },
        methods:{
            getChargingStationtList(){
              this.ajax('http://10.128.4.100:8088/environment/getChargeCount','',(data)=>{
                  for (let i=1;i<=data.data.data;i++){
                      this.select.selectList.push({
                          label:i+'号智能充电台',
                          value:i
                      })
                  }
              })
            },
            selectSation(data){
                this.getChargingStationtNumber({number:data})
            },
            getChargingStationtNumber(params){
                this.ajax('http://10.128.4.100:8088/environment/chargeQuery',params,(data)=>{
                    let socket = data.data.data.split('').map(Number).reverse();
                    let socketCopy=[];
                    socket.forEach((item,index)=>{
                        let number = index+1
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
                })
            },
            change(data){

            },
            show(){
                this.$refs.dialog.show();
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
                        this.$message.error(err);
                    })
                }else {
                    this.$ajax({
                        method:'post',
                        url:url,
                    }).then((res)=>{
                        sCallback.call(this,res);
                    }).catch(err=>{
                        this.$message.error(err);
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
        width: 1040px;
    }
    .charging-sation-box{
        width: 100%;
        height: 697px;
    }
    .charging-sation-box .charging-sation-controls{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        padding-left: 60px;
    }
    .charging-sation-controls .charging-sation-control-body{
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
    .charging-sation-box .charging-sation-select{
        padding-top: 28px;
        padding-bottom: 8px;
        padding-left: 23px;
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