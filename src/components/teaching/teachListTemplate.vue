<template>
    <div class="t-template">
        <div class="t-t-img-box">
            <img class="t-t-img" :src="img" v-if="!showText"/>
            <img :src="img" class="t-t-img" v-else>
           <!-- <img src="@/assets/noThumbnails.png" class="t-t-img" v-else> -->
            <div class="t-t-line"></div>
        </div>
        <div class="t-t-span-box">
            <span v-text="getName(item)"></span>
        </div>
    </div>
</template>

<script>
    import {baseURL} from "../../api/config";
    import {delFile} from "api/basic";
    export default {
        name: "teachListTemplate",
        data(){
            return{
            showText:false,
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
            
              console.log(this.item)
              if(this.item.imageAddress==''||this.item.imageAddress==null){
                  this.showText=true
                  img=require('@/assets/noThumbnails.png');
                  
              }else{
                  img=baseURL+'/images/'+this.item.imageAddress
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
        width: 1.3281rem;
        height: 1.8229rem;
        display: flex;
        flex-direction: column;
        margin-left: 0.0521rem;
        box-shadow:0px 3px 6px rgba(0,0,0,0.16);
        opacity:1;
        margin-top: 0.1094rem;
        margin-bottom: 0.1094rem;
    }
    .t-template .t-t-img-box{
        height: 1.4219rem;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }
    .t-t-img-box .t-t-line{
        width: 1.1719rem;
        position: absolute;
        height: 1px;
        bottom: 0px;
        border:1px solid rgba(112,112,112,1);
        opacity:0.13;
    }
    .t-template .t-t-span-box{
        width: 100%;
        height: 0.401rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .t-t-img-box .t-t-img{
        width: 1.2917rem;
        height: 0.8542rem;
    }
    ._suo{
        display:flex;
        justify-content:center;
        align-items:center;
        width: 1.2917rem;
        height: 0.8542rem;
        
    }
</style>
