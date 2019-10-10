<template>
    <div class="inventory-box">
        <div class="header">
            <div class="header-item">
                <span v-text="'开始时间：'"></span>
                <div class="header-content"><span v-text="startTime"></span></div>
            </div>
            <div class="header-item">
                <span v-text="'结束时间：'"></span>
                <div class="header-content"><span v-text="endTime"></span></div>
            </div>
            <div class="header-item">
                <span v-text="'操作人员：'"></span>
                <div class="header-content"><span v-text="overview.adminName"></span></div>
            </div>
        </div>
        <div class="title">
            <div class="title-box">
                <div class="title-item">
                    <span v-text="'盘点总数'"></span><span style="margin-left: 23px" v-text="size"></span>
                </div>
                <div class="title-item" style="margin-left: 73px">
                    <span v-text="'未盘点数'"></span><span style="margin-left: 23px" v-text="overview.withoutRfidCount"></span>
                    <span v-text="'(出库数量'"></span><span style="margin-left: 5px" v-text="overview.outCount"></span><span v-text="')'"></span>
                </div>
                <!--<div class="title-item" style="margin-left: 73px">-->
                    <!--<span v-text="'出库数量'"></span><span style="margin-left: 23px" v-text="overview.outCount"></span>-->
                <!--</div>-->
            </div>
        </div>
        <div class="body">
            <span v-text="'未在库装备统计：'"></span>
            <inventory-table :tableData="tableData" style="margin-top: 7px"></inventory-table>
        </div>
        <div class="bottom">
            <span v-text="'备注：'"></span>
            <el-input v-model="remark" placeholder="请输入内容" style="" :disabled="componentType!='warehouse'"></el-input>
        </div>
        <div class="bottom" style="justify-content: center" v-if="componentType=='warehouse'">
            <el-button style="margin-left: 34px" class="submit" @click="submission">提交</el-button>
        </div>
    </div>
</template>

<script>
    import inventoryTable from './inventoryTable'
    export default {
        name: "inventoryComponent",
        components:{
            inventoryTable
        },
        props:{
          tableData:{
              type:Array
          },
            overview:{
              type:Object
            },
            size:{
              type:String
            },
            componentType:{
              type:String,
                default:'warehouse'
            }
        },
        watch:{
          'remark':{
              handler(newVal){
                 if(this.componentType=='warehouse'&&newVal!=''){
                     this.$emit('newNote',newVal)
                 }
              }
          }
        },
        computed:{
          name: ()=> {
              let user=JSON.parse(localStorage.getItem('user'));
              return user.name
          },
            startTime:function() {
              let time='';
              if(this.overview.startTime){
                  console.log(new Date(this.overview.startTime));
                  time = this.$filterTime(this.overview.startTime);
              }
                return time;
            },
            endTime:function(){
                let time='';
                if(this.overview.endTime){
                    console.log(new Date(this.overview.endTime));
                    time = this.$filterTime(this.overview.endTime);
                }
                return time
            }
        },
        data(){
            return{
                remark:''
            }
        },
        methods:{
        //   filterTime(date){
        //      let time='';
        //      if(date!=''){
        //          let dateNow =  new Date(date);
        //          let year = dateNow.getFullYear();
        //          let moth = dateNow.getMonth()+1;
        //          let day = dateNow.getDate();
        //          let hour = dateNow.getHours();
        //          let min = dateNow.getMinutes();
        //          let seconds = dateNow.getSeconds();
        //          time = year+'-'+addZero(moth)+'-'+addZero(day)+'\xa0\xa0\xa0'+addZero(hour)+':'+addZero(min)+':'+addZero(seconds);
        //      }
        //      function addZero(some) {
        //          if (some<10){
        //              return '0'+some
        //          }else {
        //              return some
        //          }
        //      };
        //      return time
        //   },
            submission(){
               this.$emit('handleSubmission',true)
            }
        }
    }
</script>

<style scoped>
    .inventory-box{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        font-size: 16px;
        color: #707070;
        height: 100%;
    }
    .inventory-box .header{
        width: 1244px;
        height: 30px;
        display: flex;
        justify-content: space-between;
        margin: 24px 0px;
    }
    .header .header-item{
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .header-item .header-content{
        width:217px;
        height:30px;
        background:rgba(235,235,235,1);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .inventory-box .title{
        width:1244px;
        height:46px;
        background:rgba(47,47,118,0.03);
        border:1px solid rgba(112,112,112,0.03);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .title .title-box{
        height: 100%;
        display: flex;
        align-items: center;
    }
    .title-box .title-item{
        color: #2F2F76;
    }
    .inventory-box .body{
        width:1244px;
        display: flex;
        flex-direction:column;
        margin-top: 25px;
        margin-bottom: 15px;
    }
    .inventory-box .bottom{
        width: 1244px;
        margin-top: 15px;
        display: flex;
        align-items: center;
        height: 30px;
        margin-bottom: 15px;
    }

    .bottom .submit{
        width:70px;
        height:30px;
        background:rgba(47,47,118,1);
        color: white;
        line-height: 0px;
        box-shadow:0px 3px 6px rgba(0,0,0,0.16);
        opacity:1;
        border-radius:6px;
    }
</style>