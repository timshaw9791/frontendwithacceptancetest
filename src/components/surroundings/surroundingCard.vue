<template>
    <div class="surroundingCard">
        <div class="surroundingCard-head" :style="'height:'+cHeight+'px'" >
            <span>{{header}}</span>
            <div @click="edit" v-if="header=='设备状态及控制'"  style="width:100px">
                <svg-icon icon-class="环境管理设置" style="margin-left:1.2rem;cursor: pointer;"></svg-icon>
            </div>
        </div>
        <div class="surroundingCard-body">
            <slot>
            </slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: "surroundingCard",
        props:{
            header:{
                type:String,
                default:'标题'
            },
            height:{
                type:Number,
                default:57
            }
        },
        methods:{
            edit(){
                this.$emit('editt')
            }
        },
        computed: {
            cHeight() {
                let fontSize = localStorage.getItem('fontSize')
                return (this.height/192*fontSize).toFixed(2)
            },
            
        },
    }
</script>

<style>
    .surroundingCard{
        width: 100%;
    }
    .surroundingCard .surroundingCard-head{
        width:100%;
        background:rgba(47,47,118,1);
        opacity:1;
        display: flex;
        align-items: center;
        justify-content: center;
        color:white;
        font-size: 18px;
    }
    .surroundingCard .surroundingCard-body{
        width: 100%;
        background:rgba(255,255,255,1);
        box-shadow:0px 3px 6px rgba(0,0,0,0.16);
        opacity:1;
    }
</style>