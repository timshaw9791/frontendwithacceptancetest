<template>
    <div>
        <div class="actions">
            <span v-text="'设置'" ></span>
            <el-button type="text" class="_info_textBt" @click="edit">
                <svg-icon icon-class="编辑"/>
                {{disabled?'编辑':'取消编辑'}}
            </el-button>
        </div>
        <div id="myFrom" class="add-personnel-bodey-box">
            <form-container ref="form" :model="form" class="add-personneo-body-from">
                <field-input class="field-input" v-model="form.name" label="姓名" width="4.5"
                              prop="name" :disabled="true"></field-input>
                <field-input class="field-input" v-model="form.policeSign" :disabled="true"  label="警号(账号)" width="4.5"
                              prop="policeSign"></field-input>
                <field-input class="field-input" v-model="form.gender" :disabled="true"  label="性别" width="4.5"
                             prop="policeSign"></field-input>
                <!--<field-checkbox  v-model="gender" label="性别" width="4.5"-->
                                 <!--prop="position" :list="nanlist" @change="changeCheck" :disabled="disabled"></field-checkbox>-->
                <field-input class="field-input" v-model="form.password" label="密码" width="4.5"
                             :rules="r(true).all(R.require)" prop="password" :disabled="disabled" :type="'password'"></field-input>
                <!--<field-checkbox  v-model="roleItems" label="角色" width="4.5" :disabled="disabled"-->
                                 <!--prop="position" :list="cRoleList" @change="changeCheckRole"></field-checkbox>-->
                <field-input class="field-input" v-model="role.roleDescribe" label="角色" width="4.5"
                             prop="password" :disabled="true"></field-input>
                <field-input class="field-input" v-model="form.idNumber" :disabled="true" label="身份证号" width="4.5"
                              prop="idNumber"></field-input>
                <field-input class="field-input" v-model="form.position" :disabled="true"  label="职位" width="4.5"
                              prop="position"></field-input>
                <field-input class="field-input" v-model="form.phone"  :disabled="disabled" label="联系方式" width="4.5"
                             :rules="r(true).all(R.require)" prop="phone"></field-input>
                <field-input class="field-input" v-model="organUnit.name" label="机构单位" width="4.5"
                             prop="organUnit" :disabled="true"></field-input>
                <field-input class="field-input" v-model="form.fingerprintInformation" :disabled="true" :type="'textarea'" label="指纹信息" width="10"
                             prop="fingerprintInformation"></field-input>
            </form-container>
            <div class="add-personneo-upload-img">
                <div class="img-box" v-if="viewStatus.flag"></div>
                <img :src="getSrc()" class="img" v-if="!viewStatus.flag">
                <!--<div :class="disabled?'span disabled':'span'">-->
                    <!--<span v-text="'上传'" @click="uploadImg"></span>-->
                <!--</div>-->
                <form method="post" class="img-form"  enctype="multipart/form-data">
                    <input type="file" name="file" @change="PreviewImage" class="input-file" id="personnelImg"/>
                </form>
            </div>
        </div>
        <div class="add-personneo-bottom" v-show="!disabled">
            <el-button type="primary" @click="confirm">确认</el-button>
        </div>
        <tips :innerVisible="tipStatus" @confirm="tipConfirm" @cancel="cancel"></tips>
    </div>
</template>

<script>
    import {formRulesMixin} from 'field/common/mixinComponent';
    import user from 'gql/user.gql'
    import tips from 'components/base/tips'
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
                src:'http://10.128.4.152:8080/warehouse/images/',
                personnelImg:'',
                cPassword:'',
                cPhone:'',
                modifyStatus:false,
                tipStatus:false,
                disabled:true
            }
        },
        components:{
            tips
        },
        mixins: [formRulesMixin],
        props: {
            // roleList:{
            //     type:Array
            // },
            organUnit:{
                type:[Object,String]
            },
            role:{
                type:Object
            },
            toBack:{
              type:Boolean
            },
            // addType:{
            //     type:String,
            //     default:'add'
            // },
            personenlData:{
                type:Object,
                default:null
            }
        },
        created(){
            this.initForm();
            // console.log(this.roleList);
            // this.roleList.forEach(item=>{
            //     if(item.value!='ALL'&&item.label!='超级管理员'){
            //         this.cRoleList.push({
            //             val:item.value,
            //             key:item.label
            //         })
            //     }
            // });
            // this.$set(this.form,'organUnit',{id:this.organUnit.value});
        },
        watch:{
          'form':{
              deep:true,
              handler(newVal){
                  if(newVal.password!=this.cPassword||newVal.phone!=this.cPhone){
                     this.modifyStatus=true
                  }else {
                     this.modifyStatus=false
                  }
              }
          },
            'toBack':{
                handler(newVal){
                   if(newVal){
                       if(this.modifyStatus){
                           this.tipStatus=!this.tipStatus
                       }else {
                           this.$router.go(-1);
                       }
                   }
                }
            }
        },
        methods: {
            edit(){
             if(this.modifyStatus){
                 this.tipStatus=!this.tipStatus
             }else {
                 this.disabled=!this.disabled
             }
            },
            cancel(data){
                if(data){
                    if(this.toBack){
                        this.$emit('noBack',true)
                    }
                    this.tipStatus=!this.tipStatus
                }
            },
            tipConfirm(){
               if(this.toBack){
                   this.$router.go(-1);
               }else {
                   this.initForm();
                   this.tipStatus=!this.tipStatus;
                   this.disabled=!this.disabled
               }
            },
            initForm(){
                this.$set(this.form,'gender',this.personenlData.gender);
                this.$set(this.form,'name',this.personenlData.name);
                this.$set(this.form,'password',this.personenlData.password);
                this.cPassword=this.personenlData.password;
                this.cPhone=this.personenlData.phone;
                this.$set(this.form,'position',this.personenlData.position);
                this.$set(this.form,'idNumber',this.personenlData.idNumber);
                this.$set(this.form,'policeSign',this.personenlData.policeSign);
                this.$set(this.form,'phone',this.personenlData.phone);
                this.$set(this.form,'fingerprintInformation',this.personenlData.fingerprintInformation);
                this.personnelImg=this.personenlData.faceInformation;
                this.$set(this.form,'faceInformation',this.personnelImg);
                this.viewStatus.flag=false;
            },
            // black(){
            //     if(this.modifyStatus){
            //        this.tipStatus=!this.tipStatus
            //     }else {
            //         this.$emit('black',true)
            //     }
            // },
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
                // this.$set(this.form,'roleItems', []);
                let cRole=[];
                cRole.push(data[data.length-1]);
                this.roleItems=cRole;
                this.form.role={id:cRole[0]};
                // data.forEach(item=>{
                //
                // });
            },
            PreviewImage(event){
                let formData = new FormData();
                let file = event.target.files[0];
                formData.append('file',file);
                this.Ajax(formData);
            },
            uploadImg(){
                if(true){}else {
                    document.getElementById(['personnelImg']).click()
                }
            },
            Ajax(file){
                let src = 'http://10.128.4.152:8080/warehouse/upload/image/';
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
                let data = JSON.parse(JSON.stringify(this.personenlData));
                if(this.modifyStatus){
                    data.password=this.form.password;
                    data.phone=this.form.phone;
                    let users={
                        position:data.position,
                        policeSign:data.policeSign,
                        faceInformation:data.faceInformation,
                        phone:data.phone,
                        password:data.password,
                        name:data.name,
                        role: {
                            id:this.role.id
                        },
                        fingerprintInformation:data.fingerprintInformation,
                        gender:data.gender,
                        unitId:data.unitId,
                        idNumber:data.idNumber,
                        id:data.id
                    };
                    this.gqlMutate(user.identityUpdateUser,{user:users}, (data) => {
                        this.$message.success('修改成功');
                        setTimeout(()=>{
                            this.$store.dispatch('LogOut').then(() => {
                                location.reload() // 为了重新实例化vue-router对象 避免bug
                                // this.$message.success('退出成功');
                            })
                        },1000);
                    })
                }else {
                    this.$message.error('没有进行修改')
                }
                // if(this.disabled==false){
                //     this.form.username=this.form.policeSign;
                //     if(this.addType=='add'){}else {
                //         this.form.id=this.personenlData.id
                //     }
                //     this.$refs.form.validate.then((valid) => {
                //         if(valid){
                //             this.$refs.form.gqlValidate(this.addType=='add'?user.identitySaveUser:user.identityUpdateUser, {
                //                 user:this.form
                //             }, (res) => {
                //                 this.$message.success('操作成功');
                //                 this.$emit('addSucess',true);
                //             })
                //         }else {
                //             this.$message.error('请先填写完整表单')
                //         }
                //     });
                // }else {
                //     this.$emit('black',true)
                // }
            },

        },
        mounted() {
        },


    }
</script>

<style lang="scss"  scoped>
    @import "common/css/mixin.scss";

    .actions {
        border-top: rgba(112, 112, 112, 0.13) solid 1px;
        border-bottom: rgba(112, 112, 112, 0.13) solid 1px;
        height: 57px;
        width: 100%;
        display: flex;
        align-items: center;
        padding-left: 15px;
        padding-right: 15px;
        color: #707070;

    }
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