<template>
    <div class="surroundingCard">
        <div class="surroundingCard-head" :style="'height:'+height+'px'" v-text="header"></div>
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
        }
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