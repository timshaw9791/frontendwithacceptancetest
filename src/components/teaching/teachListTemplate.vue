<template>
    <div class="t-template">
        <div class="t-t-img-box">
            <img class="t-t-img" :src="img"/>
            <div class="t-t-line"></div>
        </div>
        <div class="t-t-span-box">
            <span v-text="getName(item)"></span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "teachListTemplate",
        data(){
            return{

            }
        },
        props:{
            item:{
                type:Object
            }
        },
        created(){

        },
        computed:{
          img:function () {
              let img;
              if(this.item.imageAddress==''||this.item.imageAddress==null){
                  img=require('@/assets/noImg.png');
              }else{
                  img='http://192.168.50.15:8080/warehouse/images/'+this.item.imageAddress
              }
              return img
          }
        },
        methods:{
            getName(item){
                if(item.modelList!=undefined){
                    return item.name
                }else {
                    return item.name+'-'+item.model
                }
            }
        }
    }
</script>

<style scoped>
    .t-template{
        width: 255px;
        height: 350px;
        display: flex;
        flex-direction: column;
        margin-left: 10px;
        box-shadow:0px 3px 6px rgba(0,0,0,0.16);
        opacity:1;
        margin-top: 21px;
        margin-bottom: 21px;
    }
    .t-template .t-t-img-box{
        height: 273px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }
    .t-t-img-box .t-t-line{
        width: 225px;
        position: absolute;
        height: 1px;
        bottom: 0px;
        border:1px solid rgba(112,112,112,1);
        opacity:0.13;
    }
    .t-template .t-t-span-box{
        width: 100%;
        height: 77px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .t-t-img-box .t-t-img{
        width: 248px;
        height: 164px;
    }
</style>