<template>
    <div class="lighting">
        <dialogs ref="dialog" :width="900" :title="'灯光控制'">
            <div class="lighting-box">
                <div class="lighting-select">
                    <select-charging-station id="" :placeholder="'选择照明路数'" :select="select.selectList"
                                             @selectRole="selectSation" :havaDefault="true"></select-charging-station>
                   <div style="width: 210px;margin-left: 0.1042rem">
                       <switch-control :width="70" :active="active.all" :inactive="inactive.all" @handleChange="changeAll"></switch-control>
                   </div>
                </div>
                <div class="lighting-controls">
                   <light-control v-for="(item,index) in lightList" :light="item" :active="active.item" :inactive="inactive.item" :index="Number(index)"></light-control>
                </div>
            </div>
        </dialogs>
    </div>
</template>

<script>
    import dialogs from '../surroundingDialog'
    import switchControl from './controlComponents/switchControl'
    import lightControl from './controlComponents/lightControl'
    import {baseURL} from "../../../api/config";
    import selectChargingStation from 'components/personnelManagement/personnelSelect'

    export default {
        name: "lighting",
        components:{
            dialogs,
            switchControl,
            lightControl,
            selectChargingStation,
            contorlNum:0,
            lightNum:0,
            deviceNum:0
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
                lightCopy:[],
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
        created(){
        },
        methods:{
            selectSation(data){
                let route=_.findIndex(this.lightCopy,(item)=>{ return item === data; }),list=[];
                let li=data;
                list=[{number:1,route:route, status:li[8]},{number:2,route:route, status:li[7]}];
                this.lightList=list;
            },
            // getLightInfo(){
            //     this.$ajax({
            //         method:'post',
            //         url:baseURL+'/environment/lightQuery',
            //     }).then((res)=>{
            //         console.log("获得灯的信息");
            //         console.log(res);
            //        let resC = res.data.data;
            //        let lightListCopy = [];
            //        for (let key in resC){
            //            for (let i=0;i<resC[key];i++){
            //                lightListCopy.push({
            //                    route:Number(key),
            //                    number:i+1,
            //                    status:0
            //                })
            //            }
            //        };
            //         console.log(lightListCopy)
            //        this.getLightQuery(lightListCopy);
            //     }).catch(err=>{
            //         this.$message.error(err);
            //     });
            // },
            getLightQuery(){
                this.$ajax({
                    method:'post',
                    url:baseURL+'/environment/lightQuery',
                }).then(res=>{
                    let resData=res;
                    this.lightCopy=JSON.parse(JSON.stringify(resData));
                    this.select.selectList=[];
                    resData.forEach((item,index)=>{
                        let i=index+1;
                        this.select.selectList.push({
                            label:i+'路照明',
                            value:i+item
                        })
                    });
                    this.$refs.dialog.show();
                }).catch(err=>{
                    this.$message.error(err.response.data.message);
                });
            },
            // getlightInfo(){
            //     // this.contorlNum=5//有几个开关
            //     // this.deviceNum=2//一个开关可操作几盏灯
            //     // this.lightNum=this.contorlNum*this.deviceNum//总共有几盏灯
            //     // // let newList=[];
            //     // // for(let i=0;i<this.lightNum;i++) {
            //     // //     newList.push(this.lightList[i]);
            //     // //     newList[i].route=Math.ceil((newList[i].number)/this.deviceNum*1.0)
            //     // // }
            //     // this.lightList=newList;
            //     console.log('111',this.lightNum)
            //     this.$refs.dialog.show();
            // // this.$ajax({
            // //         method:'post',
            // //         url:baseURL+'/environment/deviceConfig',
            // //     }).then((res)=>{
            // //      this.contorlNum=res.data.data.ENVIRONMENT_LIGHT_CONTROL_COUNT//有几个开关
            // //      this.deviceNum=res.data.data.ENVIRONMENT_LIGHT_COUNT//一个开关可操作几盏灯
            // //      this.lightNum=this.contorlNum*this.deviceNum//总共有几盏灯
            // //      let newList=[];
            // //      for(let i=0;i<this.lightNum;i++) {
            // //          newList.push(this.lightList[i]);
            // //          console.log("object");
            // //          console.log(newList[i].number);
            // //          newList[i].route=Math.ceil((newList[i].number)/this.deviceNum*1.0)
            // //
            // //      }
            // //      this.lightList=newList;
            // //      this.$refs.dialog.show();
            // //     })
            // },
            changeAll(data){
                let flag=1;
                if(data){
                    flag=0
                }
                this.$ajax({
                    method:'post',
                    url:baseURL+'/environment/lightSwitch',
                    params:{status:data}
                }).then((res)=>{
                   this.lightList.forEach(item=>{
                       item.status=flag
                   });
                   this.$message.sucess('成功')
                }).catch(err=>{
                    this.$message.error(err);
                });
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
        flex-direction: row;
        flex-wrap: wrap;
        padding-left: 0.3125rem;
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
