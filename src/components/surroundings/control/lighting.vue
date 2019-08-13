<template>
    <div class="lighting">
        <dialogs ref="dialog" :width="1040" :title="'灯光控制'">
            <div class="lighting-box">
                <div class="lighting-select">
                   <div style="width: 210px">
                       <switch-control :active="active.all" :inactive="inactive.all" @handleChange="changeAll"></switch-control>
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
    import switchControl from './controlComponents/switch'
    import lightControl from './controlComponents/lightControl'
    export default {
        name: "lighting",
        components:{
            dialogs,
            switchControl,
            lightControl
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
            getLightInfo(){
                this.$ajax({
                    method:'post',
                    url:'http://62.146.2.40:8010/warehouse/environment/getLightInfo',
                }).then((res)=>{
                   let resC = res.data.data;
                   let lightListCopy = [];
                   for (let key in resC){
                       for (let i=0;i<resC[key];i++){
                           lightListCopy.push({
                               route:Number(key),
                               number:i+1,
                               status:0
                           })
                       }
                   };
                    console.log(lightListCopy)
                   this.getLightQuery(lightListCopy);
                }).catch(err=>{
                    this.$message.error(err);
                });
            },
            getLightQuery(list){
                this.$ajax({
                    method:'post',
                    url:'http://62.146.2.40:8010/warehouse/environment/lightQuery',
                }).then((res)=>{
                    let status=res.data.data;
                    list.forEach(item=>{
                        let str = status[item.route-1].split('').map(Number).reverse();
                        item.status=str[item.number-1]
                    });
                    this.lightList = list;
                    this.$refs.dialog.show();
                }).catch(err=>{
                    this.$message.error(err);
                });
            },
            changeAll(data){
                let flag=1;
                if(data){
                    flag=0
                }
                this.$ajax({
                    method:'post',
                    url:'http://62.146.2.40:8010/warehouse/environment/lightSwitch',
                    params:{status:data}
                }).then((res)=>{
                   this.lightList.forEach(item=>{
                       item.status=flag
                   })
                }).catch(err=>{
                    this.$message.error(err);
                });
            },
            show(){
                this.getLightInfo();
            },
            close(){
                this.$refs.dialog.close();
            }
        }
    }
</script>

<style>
    .lighting{
        width: 1040px;
    }
    .lighting-box{
        width: 100%;
        height: 697px;
    }
    .lighting-box .lighting-controls{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        padding-left: 60px;

    }
    .lighting-box .lighting-select{
        padding-top: 28px;
        padding-bottom: 8px;
        padding-left: 23px;
    }
    .lighting-select #chargingSationSelect .el-select {
        width: 202px;
        background:rgba(47,47,118,1);
        opacity:1;
        border-radius:16px;
    }
    .lighting-select #chargingSationSelect .el-input__icon{
        line-height: 32px;
        color: white;
    }
    .lighting-select #chargingSationSelect .el-input__inner{
        width: 202px;
        height: 32px;
        background:rgba(47,47,118,1);
        opacity:1;
        border-radius:16px;
        color: white;
    }
</style>
