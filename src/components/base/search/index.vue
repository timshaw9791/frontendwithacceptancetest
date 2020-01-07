<template>
    <div>
        <!--<svg-icon icon-class="搜索" class="icon-search"></svg-icon>-->
        <!--<input class="input" v-model="searchObject.search" :placeholder="placeholder">-->
        <BosInput
                :placeholder="placeholder"
                suffix="el-icon-search"
                v-model="searchObject.search"
                :wrapforlike="true"
                :style="'width:'+width+'px;'">
        </BosInput>
    </div>
</template>

<script>
    export default {
        name: "index",
        data(){
            return{
                searchObject:{
                    search:'',
                    type:'routine'
                }
            }
        },
        watch:{
            'searchObject.search':{
                handler(newVal){
                    if(this.searchObject.type==='routine'){
                        this.$emit('search',newVal)
                    }else {
                        this.searchObject.type='routine';
                    }
                }
            }
        },
        methods:{
            emptySearch(){
                if(this.searchObject.search!==''){
                    this.searchObject.type='empty';
                    this.searchObject.search='';
                }
            }
        },
        props:{
            placeholder:{
                type:String
            },
            width:{
                type:Number,
                default:285
            }
        }
    }
</script>

<style  scoped>

    /deep/ .el-input__inner {
        border-radius: 19px;
    }
    /*.search {*/
        /*width: 100%;*/
        /*position: relative;*/
    /*}*/

    /*.search .input {*/
        /*width: 100%;*/
        /*height: 0.1667rem;*/
        /*background: rgba(255, 255, 255, 1);*/
        /*border: 0.0052rem solid rgba(112, 112, 112, 0.13);*/
        /*opacity: 1;*/
        /*border-radius: 0.099rem;*/
        /*padding-left: 0.078125rem;*/
        /*outline: medium;*/
    /*}*/

    /*.search .icon-search {*/
        /*position: absolute;*/
        /*right: 0.0521rem;*/
        /*z-index: 1;*/
        /*top: 50%; !*偏移*!*/
        /*width: 0.1302rem;*/
        /*height: 0.1302rem;*/
        /*transform: translateY(-50%);*/
    /*}*/
</style>