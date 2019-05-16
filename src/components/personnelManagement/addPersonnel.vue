<template>
    <div>
        <div id="myFrom" class="add-personnel-bodey-box">
            <form-container ref="form" :model="form" class="add-personneo-body-from">
                <field-input class="field-input" v-model="form.name" label="姓名" width="4.5"
                             :rules="r(true).all(R.require)" prop="name" :disabled="disabled"></field-input>
                <field-input class="field-input" v-model="form.policeSign" :disabled="disabled"  label="警号(账号)" width="4.5"
                             :rules="r(true).all(R.require)" prop="policeSign"></field-input>
                <field-checkbox  v-model="gender" label="性别" width="4.5"
                                prop="position" :list="nanlist" @change="changeCheck" :disabled="disabled"></field-checkbox>
                <field-input class="field-input" v-model="form.password" label="密码" width="4.5"
                             :rules="r(true).all(R.require)" prop="password" :disabled="disabled"></field-input>
                <field-checkbox  v-model="roleItems" label="角色" width="4.5" :disabled="disabled"
                                 prop="position" :list="cRoleList" @change="changeCheckRole"></field-checkbox>
                <field-input class="field-input" v-model="form.idNumber" :disabled="disabled" label="身份证号" width="4.5"
                             :rules="r(true).all(R.require)" prop="idNumber"></field-input>
                <field-input class="field-input" v-model="form.position" :disabled="disabled"  label="职位" width="4.5"
                             :rules="r(true).all(R.require)" prop="position"></field-input>
                <field-input class="field-input" v-model="form.phone"  :disabled="disabled" label="联系方式" width="4.5"
                             :rules="r(true).all(R.require)" prop="phone"></field-input>
                <field-input class="field-input" v-model="organUnit.key" label="机构单位" width="4.5"
                             prop="organUnit" :disabled="true"></field-input>
                <field-input class="field-input" v-model="form.fingerprintInformation" :disabled="disabled" :type="'textarea'" label="指纹信息" width="10"
                             prop="fingerprintInformation"></field-input>
            </form-container>
            <div class="add-personneo-upload-img">
                <div class="img-box" v-if="viewStatus.flag"></div>
                <img :src="getSrc()" class="img" v-if="!viewStatus.flag">
                <div :class="disabled?'span disabled':'span'">
                    <span v-text="'上传'" @click="uploadImg"></span>
                </div>
                <form method="post" class="img-form"  enctype="multipart/form-data">
                    <input type="file" name="file" @change="PreviewImage" class="input-file" id="personnelImg"/>
                </form>
            </div>
        </div>
        <div class="add-personneo-bottom">
            <el-button @click="black">返回</el-button>
            <el-button type="primary" @click="confirm">确认</el-button>
        </div>
    </div>
</template>

<script>
    import {formRulesMixin} from 'field/common/mixinComponent';
    import user from 'gql/user.gql'
   /* import {scrappedUp} from "api/workflow";*/

    export default {
        data() {
            return {
                form: {},
                nanlist:[{val:'男',key:'男'},{val:'女',key:'女'}],
                gender:[],
                roleItems:[],
                cRoleList:[],
                viewStatus:{
                    flag:true
                },
                src:'http://115.159.154.194/warehouse/images/',
                personnelImg:''
            }
        },
        mixins: [formRulesMixin],
        props: {
            roleList:{
                type:Array
            },
            organUnit:{
                type:Object
            },
            addType:{
                type:String,
                default:'add'
            },
            personenlData:{
                type:Object,
                default:null
            },
            disabled:{
                type:Boolean,
                default:false
            }
        },
        created(){
            if(this.addType=='add'){}else {
                this.initForm()
            }
            this.roleList.forEach(item=>{
               if(item.value!='ALL'&&item.label!='超级管理员'){
                   this.cRoleList.push({
                       val:item.value,
                       key:item.label
                   })
               }
            });
            this.$set(this.form,'organUnit',{id:this.organUnit.value});
        },
        methods: {
            initForm(){
                this.gender=[this.personenlData.gender];
                this.$set(this.form,'gender',this.gender[0]);
                this.$set(this.form,'name',this.personenlData.name);
                this.$set(this.form,'password',this.personenlData.password);
                this.$set(this.form,'position',this.personenlData.position);
                this.$set(this.form,'idNumber',this.personenlData.idNumber);
                this.$set(this.form,'policeSign',this.personenlData.policeSign);
                this.$set(this.form,'phone',this.personenlData.phone);
                this.$set(this.form,'fingerprintInformation',this.personenlData.fingerprintInformation);
                this.$set(this.form,'roleItems',[]);
                this.personenlData.roleItems.forEach(item=>{
                    this.form.roleItems.push({id:item.id});
                });
                this.personnelImg=this.personenlData.faceInformation;
                this.$set(this.form,'faceInformation',this.personnelImg);
                this.viewStatus.flag=false;
                this.form.roleItems.forEach(item=>{
                    this.roleItems.push(item.id);
                });
            },
            black(){
                this.$emit('black',true)
            },
            getSrc(){
              let srcs;
              srcs=this.src+this.personnelImg;
              return srcs
            },
            changeCheck(data){
               let cGender=[];
               cGender.push(data[data.length-1]);
               this.gender=cGender;
                this.$set(this.form,'gender',this.gender[0]);
            },
            changeCheckRole(data){
                this.$set(this.form,'roleItems', []);
                data.forEach(item=>{
                    this.form.roleItems.push({id:item});
                });
            },
            PreviewImage(event){
                let formData = new FormData();
                let file = event.target.files[0];
                formData.append('file',file);
                this.Ajax(formData);
            },
            uploadImg(){
                if(this.disabled){}else {
                    document.getElementById(['personnelImg']).click()
                }
            },
            Ajax(file){
                let src = 'http://115.159.154.194/warehouse/upload/image/';
                const instance=this.$ajax.create({
                    withCredentials: true
                });
                instance.post(src,file)
                    .then(response=>{
                        this.personnelImg=response.data;
                        this.viewStatus.flag=false;
                        this.$set(this.form,'faceInformation',this.personnelImg);
                        this.$message.success('上传成功');
                    })
            },
            confirm(){
                if(this.disabled==false){
                    this.form.username=this.form.policeSign;
                    if(this.addType=='add'){}else {
                        console.log(1212121);
                        this.form.id=this.personenlData.id
                    }
                    this.$refs.form.validate.then((valid) => {
                        if(valid){
                            this.$refs.form.gqlValidate(this.addType=='add'?user.identitySaveUser:user.identityUpdateUser, {
                                user:this.form
                            }, (res) => {
                                this.$message.success('操作成功');
                                this.$emit('addSucess',true);
                            })
                        }else {
                            this.$message.error('请先填写完整表单')
                        }
                    });
                }else {
                    this.$emit('black',true)
                }
            },

        },
        mounted() {
        },


    }
</script>

<style lang="scss" >
    @import "common/css/mixin.scss";

    .add-personnel-bodey-box{
        width: 100%;
        display: flex;
        flex-direction: row;
    }
    .add-personneo-body-from{
        width: 738px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        margin-left: 100px;
        margin-top: 30px;
        font-size: 16px;
    }
    .add-personneo-upload-img{
        margin-left: 164px;
        margin-top: 35px;
        width: 137px;
        display: flex;
       align-items: center;
        flex-direction: column;
    }
    .add-personneo-upload-img .img{
        width:100%;
        height: 192px;
    }
    .add-personneo-upload-img .img-box{
        width:137px;
        height:192px;
        background:rgba(112,112,112,1);
        opacity:0.5;
    }
    .add-personneo-upload-img .span{
        margin-top: 33px;
        display: flex;
        align-items: center;
        justify-content: center;
        width:70px;
        height:30px;
        background:rgba(255,255,255,1);
        box-shadow:0px 3px 6px rgba(0,0,0,0.16);
        opacity:1;
        border-radius:6px;
    }
    .add-personneo-upload-img .disabled{
        background:#C0C4CC;
    }
    .add-personneo-upload-img .img-form{
        display: none;
        z-index: -9999;
    }
    .img-form .input-file{
        display: none;
        z-index: -9999;
    }
     .add-personneo-bottom {
        @include center;
        margin: 3% 0;

    }
    #myFrom .el-form-item__error {
       margin-left: 52px;
    }
    #myFrom .el-form-item__label {
        text-align: right;
        float: left;
        font-size: 16px;
        color: #707070;
        line-height: 40px;
        padding: 0 12px 0 0;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
    }
    #myFrom .el-input__inner{
        line-height: 30px;
        height: 30px;
    }
    #myFrom .el-checkbox-group{
        margin-left: 52px;
    }
    #myFrom .el-input__inner{
        margin-left: 52px;
    }
    #myFrom .el-form-item{
        margin-bottom: 20px;
    }
    #myFrom .el-textarea{
        margin-left: 52px;
    }
</style>