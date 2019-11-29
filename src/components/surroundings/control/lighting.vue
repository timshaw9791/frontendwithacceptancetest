<template>
    <div class="lighting">
        <dialogs ref="dialog" :width="900" :title="'灯光控制'">
            <div class="lighting-box">
                <div class="lighting-select">
                   <div style="width: 210px">
                       <switch-control width="5.8336px" :active="active.all" :inactive="inactive.all" @handleChange="changeAll"></switch-control>
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

    export default {
        name: "lighting",
        components:{
            dialogs,
            switchControl,
            lightControl,
            contorlNum:0,
            lightNum:0,
            deviceNum:0
        },
        data(){
            return{
                status:null,
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
        created(){
        },
        methods:{
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
                }).then((res)=>{
                    console.log("嘤嘤嘤  我在干什么");
                    console.log(res);
                    let resData=''
                    resData=res.data[0]
                    let listCopy=[]
                    let lig=[]
                    lig=resData.split('')
                    lig=lig.reverse()
                    console.log("lightList")
                    console.log(lig);
                    lig.forEach((item,index)=>{
                        listCopy.push({
                            number:index+1,
                            status:item
                        })
                    })
                    console.log(listCopy);
                    // let status=res.data.data;
                    // list.forEach(item=>{
                    //     let str = status[item.route-1].split('').map(Number).reverse();
                    //     item.status=str[item.number-1]
                    // });
                    this.lightList = listCopy;
                    this.getlightInfo();
                    
                }).catch(err=>{
                    this.$message.error(err);
                });
            },
            getlightInfo(){
            this.$ajax({
                    method:'post',
                    url:baseURL+'/environment/deviceConfig',
                }).then((res)=>{
                 console.log("设备信息")
                 console.log(res);
                 this.contorlNum=res.data.data.ENVIRONMENT_LIGHT_CONTROL_COUNT//有几个开关
                 this.deviceNum=res.data.data.ENVIRONMENT_LIGHT_COUNT//一个开关可操作几盏灯
                 this.lightNum=this.contorlNum*this.deviceNum//总共有几盏灯
                 console.log(this.contorlNum);
                 console.log("实际有几盏灯");
                 let newList=[];
                 for(let i=0;i<this.lightNum;i++)
                 {
                     newList.push(this.lightList[i])
                     console.log("object");
                     console.log(newList[i].number);
                     newList[i].route=Math.ceil((newList[i].number)/this.deviceNum*1.0)
                     
                 }
                 console.log("处理后");
                 console.log(newList);
                 this.lightList=newList
                 

 
                 this.$refs.dialog.show();
                })
            },
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

<style>
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
