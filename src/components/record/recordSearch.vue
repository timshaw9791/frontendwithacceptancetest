<template>
    <div class="action-bar">
        <div class="action-select">
            <div class="select-box" v-for="(item,index) in action" @click="clickSelect(index)" v-if="haveAction">
                <span v-text="item.name"></span>
                <div v-if="item.flag" class="bottom-line"></div>
            </div>
        </div>
        <div class="input-box">
            <svg-icon icon-class="搜索" class="icon-search"></svg-icon>
            <input class="input" v-model="search" :placeholder="placeholder" />
        </div>
    </div>
</template>

<script>
    export default {
        name: "recordSearch",
        data(){
            return{
                search:'',
                action:[
                    {name:'充电',flag:false},
                    {name:'维修',flag:false},
                    {name:'保养',flag:false}
                ],
                select:''
            }
        },
        props:{
            defaultSearch:{
              type:String,
              default:''
            },
            placeholder:{
                type:String,
                default:'测试'
            },
            haveAction:{
                type:Boolean,
                default:false
            }
        },
        watch:{
            'search':{
                handler(newval){
                    this.$emit('handleSearch',newval)
                }
            },
            'select':{
                handler(newval){
                    this.$emit('handleSelect',newval)
                }
            }
        },
        created(){
          this.action[0].flag=true;
            if(this.defaultSearch!=''){
                this.search=this.defaultSearch
            }
        },
        methods:{
            clickSelect(index){
                this.action[index].flag=true;
                this.action.forEach((item,ind)=>{
                    if(ind==index){
                        item.flag=true;
                        this.select=item.name
                    }else {
                        item.flag=false
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .action-bar {
        padding-right: 23px;
        margin-top: 8px;
        border-top: rgba(112, 112, 112, 0.13) solid 1px;
        border-bottom: rgba(112, 112, 112, 0.13) solid 1px;
        font-family: "PingFang SC";
        height: 57px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: row;
        padding-left: 18px;
        width: 100%;
        color: #707070;
    }
    .action-bar .input-box{
        width:285px;
        position: relative;
    }
    .action-bar .action-select{
        display: flex;
        height: 100%;
        width: 150px;
        align-items: center;
        justify-content: space-between;
    }
    .action-select .select-box{
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        width: 40px;
        height: 100%;
    }
    .select-box .bottom-line{
        width:40px;
        height:5px;
        background:rgba(112,112,112,0.31);
        opacity:1;
        border-radius:16px;
        position: absolute;
        bottom: 0px;
    }
    .input-box .input{
        width: 100%;
        height:38px;
        background:rgba(255,255,255,1);
        border:1px solid rgba(112,112,112,1);
        opacity:1;
        border-radius:19px;
        padding-left: 15px;
        outline:medium;
        color: #707070;
    }
    ::-webkit-input-placeholder { /* Chrome/Opera/Safari */
        color: #BBBBBB;
    }
    .input-box .icon-search{
        position: absolute;
        right: 10px;
        z-index: 1;
        top: 50%; /*偏移*/
        width: 25px;
        height: 25px;
        transform: translateY(-50%);
    }
</style>