<template>
  <div class="editTraining-container">
    <my-header :title="this.$route.params.info.edit?'编辑':'新增'+'视频与文档'" :haveBlack="false"></my-header>
    <div class="editTraining-body" >
        <div>
            <entity-input v-model="order.equipArg" format="{name}({model})" :options="{detail:'equipArgsSelect'}"></entity-input>
        </div>
        <div>
            <upload-file label="文档" type="pdf" v-model="order.pdf[0]"></upload-file>
            <upload-file label="文档" type="pdf" v-model="order.pdf[1]"></upload-file>
            <upload-file label="文档" type="pdf" v-model="order.pdf[2]"></upload-file>
        </div>
        <div>
            <upload-file label="视频" type="video" v-model="order.video[0]"></upload-file>
            <upload-file label="视频" type="video" v-model="order.video[1]"></upload-file>
            <upload-file label="视频" type="video" v-model="order.video[2]"></upload-file>
        </div>
        <div class="buttom">
            <base-button label="提交" align="right" size="large" @click="submit"></base-button>
            <base-button label="取消" align="right" size="large" type="danger" @click="cansle"></base-button>
        </div>
    </div>
  </div>
</template>

<script>
    import myHeader from "components/base/header/header";
    import baseButton from "@/componentized/buttonBox/baseButton";
    import entityInput from "@/componentized/entity/entityInput";
    import uploadFile from '@/componentized/uploadFile'
    import defineInput from '@/componentized/textBox/defineInput'
    import bosTabs from "@/componentized/table/bosTabs";
    import serviceDialog from "components/base/serviceDialog"
    import { addTraining, editTraining } from "api/training";
    var _ = require("lodash");
    export default {
        name: "editTraining",
        data() {
            return {
                order: [],
                editflag:false,
                file:{
                    pdf:[],
                    video:[]
                }
            };
        },
        methods: {
            cansle(){
                this.$router.go(-1)
            },
            submit(){
                console.log("提交");
                if(JSON.stringify(this.order.equipArg)=="{}"){
                    this.$message.error("请选择装备参数")
                    return
                }
                let params = {
                    equipArg:this.order.equipArg,
                    fileName:"",
                    type:""
                }
                console.log("未进入for");
                for( let i in this.order.video){
                    console.log("进入for");
                    if(this.order.video[i]!=""){
                        params.fileName = this.order.video[i]
                        params.type = "MP4"
                        if(this.editflag){
                            editTraining(id,params).then(res=>{
                                console.log("res",res);
                            })
                        }else {
                            addTraining(params).then(res=>{
                                console.log("res",res);
                            })
                        }
                    }
                }
                for( let i in this.order.pdf){
                    if(this.order.pdf[i]!=""){
                        params.fileName = this.order.pdf[i]
                        params.type = "pdf"
                        if(this.editflag){
                            editTraining(id,params).then(res=>{
                                console.log("res",res);
                            })
                        }else {
                            console.log("params",params);
                            addTraining(params).then(res=>{
                                console.log("res",res);
                            })
                        }
                    }
                } 
                this.$router.go(-1)

            },
        },
        created() {
            if(this.$route.params.info == undefined) {
                this.$message.info("数据丢失，返回教学培训");
                this.$router.push({name: 'warehouse/training'});
                return
            }
            this.order = this.$route.params.info.data
        },
        components: {
            myHeader,
            baseButton,
            entityInput,
            bosTabs,
            defineInput,
            serviceDialog,
            uploadFile
        },
    };
</script>

<style lang="scss" scoped>
  .editTraining-container {
    font-size: 16px;
  }
  .editTraining-top {
    padding: 18px 7px;
    border-bottom: 1px solid #ebeef5;
    overflow: hidden;
  }
  .editTraining-body {
    padding: 0 7px;
    widows: 100%;
  }
    .buttom {
        height: 72px;
        width:100%;
        margin-top: 25px;
    }
</style>
