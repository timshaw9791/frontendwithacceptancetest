<template>
    <div id="personnelSelect">
        <div class="personnel-box" data-test="select">
            <el-select v-model="value" :placeholder="placeholder" @change="toChange">
                <el-option
                        v-for="item in select"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
        </div>
    </div>
</template>

<script>
    export default {
        name: "personnelSelect",
        props:{
            select:{
                type:Array,
            },
            placeholder:{
                type:String,
                default:'请选择'
            },
            havaDefault:{
                type:Boolean,
                default:false
            }
        },
        data(){
            return{
                value:''
            }
        },
        created(){
          if(this.havaDefault){
              this.value=this.select[0].label;
              this.$emit('selectRole',this.select[0].value);
          }
        },
        methods:{
            toChange(data){
               this.$emit('selectRole',data);
            }
        }
    }
</script>

<style scoped>
    .personnel-box{
        color:rgba(112,112,112,1)
    }
    .personnel-box .selectBox{
        margin-left: 15px;
        width: 180px;
    }
    #personnelSelect .el-input__inner {
        height: 30px;
    }
    #personnelSelect .el-input__icon{
        line-height: 30px;
    }
</style>