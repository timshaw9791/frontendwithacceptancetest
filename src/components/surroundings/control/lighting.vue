<template>
    <div class="lighting">
        <dialogs ref="dialog" :width="1040" :title="'灯光控制'">
            <div class="lighting-box">
                <div class="lighting-select">
                    <switch-control :active="active.all" :inactive="inactive.all" @handleChange="changeAll"></switch-control>
                </div>
                <div class="lighting-controls">
                    <div style="width: 180px;margin-left: 40px;margin-top: 20px" v-for="n in 8">
                        <surrounding-card :header="'1路照明灯'" :height="39">
                            <div class="lighting-control-body">
                                <svg-icon icon-class="灯光图标1" style="width: 53px;height: 80px"></svg-icon>
                                <switch-control :active="active.item" :inactive="inactive.item" style="margin-top: 29px" @handleChange="changeItem"></switch-control>
                            </div>
                        </surrounding-card>
                    </div>
                </div>
            </div>
        </dialogs>
    </div>
</template>

<script>
    import dialogs from '../surroundingDialog'
    import selectChargingStation from 'components/personnelManagement/personnelSelect'
    import surroundingCard from '../surroundingCard'
    import switchControl from './controlComponents/switch'
    export default {
        name: "lighting",
        components:{
            dialogs,
            selectChargingStation,
            surroundingCard,
            switchControl
        },
        data(){
            return{
                select:{
                    selectList:[{ label: '1号智能充电台', value: '1'},
                        { label: '2号智能充电台',
                            value: '2'}],
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
        methods:{
            selectRole(data){
                console.log(data)
            },
            changeItem(data){
                console.log('has change',data);
            },
            changeAll(data){

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
    .lighting-controls .lighting-control-body{
        height: 201px;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
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