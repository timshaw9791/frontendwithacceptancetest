<template>
    <div class="equipReport" id="equipReport">
        <div class="title">
            <span v-text="title"></span>
        </div>
        <div class="equip-progress-list">
            <equip-progress style="margin-top: 25px" v-for="item in equipData" :from="title" :category="item.name" :percentage="item.maintenanceRate" :number="item.maintainCount"></equip-progress>
        </div>
    </div>
</template>

<script>
    import equipProgress from './reportComponents/equipProgress'
    export default {
        name: "equipReport",
        components:{
            equipProgress
        },
        props:{
            title:{
                type:String,
                default:'测试'
            },
            equipData:{
                type:Array
            }
        }
    }
</script>

<style >
    .equipReport{
        width:466px;
        height:251px;
        background:rgba(255,255,255,1);
        box-shadow:0px 3px 6px rgba(0,0,0,0.16);
        opacity:1;
    }
    .equipReport .title{
        width: 100%;
        padding-left: 15px;
        padding-top: 17px;
        padding-bottom: 17px;
        font-size: 18px;
        color: #707070;
    }
    .equip-progress-list{
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }
    #equipReport .el-progress-bar__inner{
        background: #3B86FF;
    }
</style>