<template>
<div class="teaching">
    <div>
    <my-header :title="'教学培训'" :searchFlag="false" :haveBlack="viewStatus.hasBlack" @h_black="black"></my-header>
     <div style="float:right;margin-left:20px" v-if="viewStatus.insFlag">
            <svg-icon icon-class="返回" class="svg-info"></svg-icon>
            <span v-text="'返回'" @click="back"></span>
        </div>
    </div>
    <div class="action-bar">
        <el-button type="text" class="_textBt" v-if="!viewStatus.insFlag" @click="edit" data-test="button">
            <svg-icon icon-class="加" class="textBt" /> 编辑视频与文档
        </el-button>
        <div class="input-box" v-if="!viewStatus.insFlag" data-test="search">
            <svg-icon icon-class="搜索" class="icon-search"></svg-icon>
            <input class="input" v-model="search" :placeholder="'装备名称'" accept="video/*,.pdf"></input>
        </div>
        
        <span v-if="viewStatus.insFlag">
                {{this.title+'使用方法'}}
            </span>
       
    </div>
    <div>
        <el-table :data="list" fit highlight-current-row height="3.55rem" v-if="!viewStatus.insFlag">
            <bos-table-column lable="装备名称" field="name" :width="250"></bos-table-column>
            <bos-table-column lable="装备型号" field="model" :width="250"></bos-table-column>
            <teach-table-column lable="教学视频" field="video" @isvideo="isvideo" @videoname="videoname"></teach-table-column>
            <teach-table-column lable="教学文档" field="pdf" @ispdf="ispdf"></teach-table-column>

        </el-table>
        <instructional v-if="viewStatus.insFlag" :ins="insData" title=""></instructional>

        <serviceDialog title="编辑教学文档与视频" ref="editDialog" @cancel="quit" @confirm="addEquip" width="800px">
            <div class="main_box">
                <div class="select">
                <div class="select_name">
                    <div class="textbox"> <span>装备名称：</span></div>
                   <div class="el_selectBox">
                        <el-select v-model="equipName" placeholder="请选择"  value-key="id" name="装备名称">
                        <el-option v-for="(item,index) in nameList" :label="item" :value="item" :key="item">
                        </el-option>
                    </el-select>
                   </div>
                   
                </div>
                <div class="select_model">
                    <div class="textbox"> <span>装备型号：</span></div>
                   <div class="el_selectBox">
                        <el-select v-model="equipModel" placeholder="请选择"  value-key="id" name="装备名称">
                        <el-option v-for="(item,index) in modelList" :label="item.model" :value="item" :key="item.id">
                        </el-option>
                    </el-select>
                   </div>
                   
                </div>
                </div>
                <div class="up_box">
                    <span>视频限制{{equipModel.video?equipModel.video.length:0}}/3</span>
                    <span style="margin-left:33px;">文档限制{{equipModel.pdf?equipModel.pdf.length:0}}/3</span>
                   
                    <div @click="videoUp" class="up-box">
                        <input type="file" ref="fileVideo" @change="videoFileChange" >
                        <span>上传</span>
                    </div>

                </div>
                <div class=video_box>
                    <div  v-for="(item,index) in equipModel.video" class="video">
                       <div @click="delVideo(index)">
                        <svg-icon icon-class="关闭1" style="width:20px;height:20px; float:right" />
                    </div>
                    <div>
                        <img src="@/common/images/电视-视频缩略.png" style="width:50px;height:50px;"/>
                        <div>
                            {{equipModel.video[index]}}
                        </div>
                    </div>
                    </div>
                    
                </div>
                <div class="pdf_box">
                    <div class="video" v-for="(item,index) in equipModel.pdf">
                         <div @click="delPdf(index)">
                        <svg-icon icon-class="关闭1" style="width:20px;height:20px; float:right" />
                    </div>
                        <div>
                        <svg-icon icon-class="pdf" class="icon" style="width:50px;height:50px;" />
                        <div>
                            {{equipModel.pdf[index]}}
                        </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </serviceDialog>
    </div>

</div>
</template>

<script>
import {
    baseURL
} from "../../api/config";
 
import myHeader from 'components/base/header/header'

import request from 'common/js/request'
import serviceDialog from "components/base/serviceDialog";
import {
    formRulesMiixin
} from 'field/common/mixinAxios';
import resourcesMaterial from 'components/teaching/resourcesMaterial'
import instructional from 'components/teaching/instructional'
import {
    getEquipArgs
} from 'api/teach'
import axios from 'axios';
import {
    imgUpUrl,
    pdfUpUrl,
    videoUpUrl,
    imgBaseUrl,
    pdfBaseUrl,
    videoBaseUrl
} from "api/config";
// import teaching from 'gql/teaching.gql'
// import {fetchMixin} from 'field/common/mixinFetch'

export default {
    name: "index",
    components: {
        myHeader,
        resourcesMaterial,
        instructional,
        serviceDialog

    },
    // mixins: [fetchMixin],
    data() {
        return {
            title: '',
            search: '',
            condition: [],
            list: [],
            equipList: [],
            gqlList: [],
            insData: {
                keyname: '',
                name: '',
                typeName: '',
                title:''
            },
            sendList:{},
            resourcesList: [],
            viewStatus: {
                listFlag: true,
                rMFlag: false,
                insFlag: false,
                searchFlag: true,
                hasBlack: false
            },
            equipName: '',
            equipModel:'',
            nameList:[],
            modelList:[],
            videoNum: 0,
            pdfNum: 0
        }
    },
    watch: {
        equipName(newVal){
               this.changeModel(newVal)
            },
        'search': {
            handler(newval) {
                this.getListGql(newval);
            }
        }
    },
    created() {
        this.getListGql('');
    },
    methods: {
        edit() {
            this.$refs.editDialog.show()
        },
        changeModel(data){
               this.equipModel=''
               this.modelList=[]
               this.equipList.forEach(item=>{
                   if(this.equipName==item.name)
                   {
                       this.modelList.push(item)
                       console.log("this.modelList");
                       console.log(this.modelList);
                   }
               })
            },
        clickCard(data) { // 这里点击后，组件/页面没有变化，只是数据变化
            if (this.condition.length == 0) {
                this.viewStatus.searchFlag = false;
                this.list = data.modelList;
                this.viewStatus.hasBlack = !this.viewStatus.hasBlack
            } else {
                let rList = [];
                if (data.video != null && data.video != '') {
                    data.video.forEach(item => {
                        if (item != '') {
                            rList.push({
                                typeName: 'MP4',
                                name: item,
                                key: item
                            })

                        }

                    })
                }
                if (data.pdf != null && data.pdf != '') {
                    data.pdf.forEach(item => {
                        if (item != '') {
                            rList.push({
                                typeName: 'PDF',
                                name: item,
                                key: item
                            })
                        }

                    })
                }
                this.resourcesList = rList;
                this.title = data.name + '-' + data.model;
                this.viewStatus.listFlag = false;
                this.viewStatus.rMFlag = true;
            }

            this.condition.push(data);
        },
        black(data) {
            if (data) {
                this.condition.splice(this.condition.length - 1, 1);
                if (this.condition.length == 0) {
                    this.viewStatus.searchFlag = true;
                    this.list = this.gqlList;
                
                    this.viewStatus.hasBlack = !this.viewStatus.hasBlack
                } else if (this.condition.length == 1) {
                    this.title = '装备的使用';
                    this.list = this.condition[0].modelList;
                    this.viewStatus.listFlag = true;
                    this.viewStatus.rMFlag = false;
                } else {
                    let deletAll = (source, willDeleted) => {
                        willDeleted = willDeleted.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1');
                        return source.replace(new RegExp(willDeleted, "g"), "");
                    };
                    this.title = deletAll(this.title, '的使用方法');
                    this.viewStatus.rMFlag = true;
                    this.viewStatus.insFlag = false
                }
            }
        },
            
        instructional(data) {
            this.insData = data;
            this.viewStatus.rMFlag = false;
            this.viewStatus.insFlag = true;
            this.condition.push(data);
        },
        delVideo(index){
        console.log("删除成功")
        this.videoNum=this.equipModel.video.length;
        this.equipModel.video.splice(index,1)
        
        },
        delPdf(index){
        
        console.log("删除成功")
        this.pdfNum=this.equipModel.pdf.length;
        this.equipModel.pdf.splice(index,1)
        this.getListGql('')

        },
        videoname(data){
        this.title=data.name+data.model
      
        },
        isvideo(data) {
            console.log(data)
            this.insData = {
                key: data,
                name: data,
                typeName: 'MP4'
            };
            this.viewStatus.rMFlag = false;
            this.viewStatus.insFlag = true;
            this.condition.push(data);
        },
        ispdf(data) {
            console.log(data)
            this.insData = {
                key: data,
                name: data,
                typeName: 'PDF'
            };
            console.log(this.title)
            this.viewStatus.rMFlag = false;
            this.viewStatus.insFlag = true;
            this.condition.push(data);
        },
        back() {
            this.viewStatus.insFlag = false;
        },
        getListGql(search) {
            getEquipArgs({
                name: search
            }).then(res => {
                console.log("res")
                console.log(res)
                  res.forEach(item=>{
                      
                        let flag=false;
                        for(var i=0;i<this.nameList.length;i++)
                        {
                            if(item.name==this.nameList[i])
                            {
                                flag=true
                            }
                        }
                        if(!flag)
                        {
                        this.nameList.push(item.name)
                        }
                        
                    })
              
                this.list = JSON.parse(JSON.stringify(res));
                this.list.forEach(item => {
                    if (item.video!= null &&item.pdf!='' ) {
                            item.video = item.video.split(',');
                           
                    }else{
                             item.video = [];
                           
                        }
                    if (item.pdf != null &&item.pdf!='') {
                       
                            item.pdf = item.pdf.split(',');
                            
                    }else{
                             item.pdf = [];
                        }
                })
               
                this.equipList=JSON.parse(JSON.stringify(this.list))
            })
        },
        videoUp(data) {
                this.$refs.fileVideo.click();
        },
        videoFileChange(){
                let files = this.$refs.fileVideo.files[0];
                let a=files.name.lastIndexOf(".");
                let b=files.name.length;
                let c=files.name.substring(a,b)
                let fileFormData = new FormData();
                fileFormData.append('file', files,files.name);
                let requestConfig = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                };
                const instance = axios.create({
                    withCrDedentials: true
                });
                const loading = this.$loading({
                    lock: true,
                    text: '正在上传请稍等!',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                if(c=='.mp4')
                {
                if(this.videoNum==3)
                {
                    this.$message.error("视频上传已达最大值")
                }
                else{
                     instance.post(videoUpUrl, fileFormData, requestConfig).then(res => {
                    this.videoNum++
                    this.equipName.video.push(files.name)
                    loading.close();
                }).catch(err => {
                    loading.close();
                    this.$message.error('上传失败');
                });
                }
               
                }
                if(c=='.pdf')
                {
                    if(this.pdfNum==3)
                    {
                        this.$message.error("文档上传已达最大值")
                    }
                    else{
                     instance.post(pdfUpUrl, fileFormData, requestConfig).then(res => {
                    console.log("上传成功")
                    this.pdfNum++
                    this.equipName.pdf.push(files.name)
                     loading.close();
                }).catch(err => {
                    loading.close();
                    console.log(err);
                    this.$message.error('上传失败');

                });
                    }
               

                }
                
            },
            quit(){
            this.equipName=''
            this.equipList=JSON.parse(JSON.stringify(this.list))
            },
            addEquip(){
            this.sendList=JSON.parse(JSON.stringify(this.equipModel))
            if(this.sendList.video instanceof Array)
            {
            this.sendList.video ? this.sendList.video = this.sendList.video.join(',') : '';
            }
            if(this.sendList.pdf instanceof Array)
            {
            this.sendList.pdf ? this.sendList.pdf = this.sendList.pdf.join(',') : '';
            }
            let newData = JSON.parse(JSON.stringify(this.sendList));
            let config={
               url: '/equip/updateEquipArg',
                        method: 'POST',
                        params:{
                            categoryId: this.sendList.categoryId ? this.sendList.categoryId: '',
                        },
                        data:newData
            }
            console.log("config")
            console.log(config)
            request(config).then(res => {
            this.$message.success("修改成功");
            this.$refs.editDialog.hide();
            this.equipName=''
            this.getListGql('')
            })
            }
    }
}
</script>

<style lang="scss" scoped>
@import "common/css/mixin.scss";
@import "common/css/variables.scss";
.teaching {
    display: flex;
    width: 100%;
    flex-direction: column;
    font-size: 16px;
    color: rgba(112, 112, 112, 1);
}

.teaching .t-body {
    width: 100%;
}

.teaching .action-bar {
    margin-top: 0.0417rem;
    border-top: rgba(112, 112, 112, 0.13) solid 1px;
    border-bottom: rgba(112, 112, 112, 0.13) solid 1px;
    height: 0.2969rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
    padding-left: 0.1042rem;
    width: 100%;
}

.action-bar .input-box {
    width: 1.4844rem;
    position: relative;
}

.input-box .input {
    width: 100%;
    height: 0.1979rem;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(112, 112, 112, 1);
    opacity: 1;
    border-radius: 19px;
    padding-left: 0.0781rem;
    outline: medium;
}

.input-box .icon-search {
    position: absolute;
    right: 0.0521rem;
    z-index: 1;
    top: 50%;
    /*偏移*/
    width: 0.1302rem;
    height: 0.1302rem;
    transform: translateY(-50%);
}

.main_box {
    height: 500px;
    width:500px;
}
.select{
    width:680px;
    height:55px;
    float:left;
}
.select_name {
    height:50px;
    width: 300px;
    float:left;
    .el_selectBox
    {
       
        width:210px;
        float: left;
    }
    .textbox
    {
     margin-top: 10px;
     display: inline-block;
     float: left;
     width:80px;
     height:22px;
    }
    
}
.select_model {
    height:50px;
    width: 300px;
    margin-left:20px;
    float:left;
    .el_selectBox
    {
        width:210px;
        float: left;
    }
    .textbox
    {
     margin-top: 10px;
     display: inline-block;
     float: left;
     width:80px;
     height:22px;
    }
    
}

.up_box {
    margin-top: 30px;
    width: 680px;
    height: 32px;
    cursor: pointer;
    font-size: 14px;
   
     input {
        display: none;
        height:32px;
        width: 50px
    }
    span{
         line-height:32px; 
    }
 
}

.up-box {
    float: right;
    width:72px;
    height:32px;
    border:1px solid rgba(47,47,118,1);
    opacity:1;
    border-radius:4px;
    text-align: center;
    line-height:32px; 
}

.video_box {
    margin-top: 100px;
    height: 80px;
    width: 480px;
}
.pdf_box {
    margin-top: 55px;
   
    height: 80px;
    width: 480px;
}
.video {
    margin-right: 60px;
    float: left;
    height: 70px;
    width: 70px; // margin: 0 0.2604rem 0.1042rem 0.2604rem;
    cursor: pointer;
    text-align: center;
    .icon {
        font-size: 0.2604rem;
        color: #2f2f76;
    }
    div {
        text-align: center;
        word-wrap: break-word;
    }
}
</style>