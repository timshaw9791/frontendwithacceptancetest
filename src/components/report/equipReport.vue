<template>
    <div class="equipReport">
        <div class="title">
            <span v-text="title"></span>
        </div>
        <div class="equip-progress-list">
            <equip-progress style="margin-top: 25px"   v-for="(item,index) in equipData" v-if="index<3" :from="title"
                            :detailItem="item" :status="title=='装备使用频次'?false:true" :havePrice="false">
                <span v-text="toolTip[0]+'：'+item.allCount" style="margin-top: 8px"></span>
                <span v-text="toolTip[1]+'：'+item.number" style="margin-top: 8px"></span>
                <span v-text="toolTip[2]+'：'+item.percentage+'%'" style="margin-top: 8px" v-if="flag"></span>
            </equip-progress>
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
        data(){
            return{
                flag:true
            }
        },
        props:{
            title:{
                type:String,
                default:'测试'
            },
            equipData:{
                type:Array
            },
            cardType:{
              type:String,
              default:'default'
            },
            toolTip:{
                type:Array,
                default(){
                    return['装备名称','维修数量','维修率']
                }
            }
        },
        created(){
          if(this.title=='装备使用频次'){
              this.flag=false
          }
        }
    }
</script>

<style scoped>
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
</style>
