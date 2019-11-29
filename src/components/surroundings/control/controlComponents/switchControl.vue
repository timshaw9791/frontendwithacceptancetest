<template>
    <div class="switch-box" id="controlSwitch">
        <el-switch
                style="display: block"
                v-model="value"
                :width="width"
                :active-color="active.color"
                :inactive-color="inactive.color"
                :active-text="active.text"
                :inactive-text="inactive.text"
                @change="change"
        >
        </el-switch>
    </div>
</template>

<script>
    export default {
        name: "switchControl",
        data(){
            return{
                value:''
            }
        },
        props:{
            active:{
                type:Object,
                default(){
                    return{
                        text:'上电',
                        color:'#39BC53',
                    }
                }
            },
            inactive:{
                default(){
                    return{
                        text:'断电',
                        color:'#B8B8B8',
                    }
                }
            },
            width:{
                type:Number,
                default:70
            },
            status:{
                type:Boolean,
                default:false
            }
        },
        watch:{
            'status':{
                handler(newVal){
                    console.log("newVal");
                    console.log(newVal);
                    if(this.status){
                        this.value=true
                    }else if(this.status==false){
                        this.value=false
                    }
                }
            }
        },
        created(){
            console.log("this.status");
            console.log(this.status);
          if(this.status){
              this.value=true
          }else {
              this.value=false
          }
        },
        methods:{
            change(data){
                console.log("wdadwad66666666666666666");
                console.log(data);
                this.$emit('handleChange',data)
            }
        }
    }
</script>

<style>
    #controlSwitch span{
        font-size: 14px;
        color: #707070;
    }
</style>