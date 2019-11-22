<template>
    <div>
        <div id="myFrom" class="add-personnel-bodey-box">
            <form-container ref="form" :model="form" class="add-personneo-body-from">
                <field-input class="field-input" v-model="form.name" label="姓名" width="4.5"
                             :rules="r(true).all(R.require)" prop="name" :disabled="disabled"></field-input>
                <!--<field-checkbox  v-model="gender" label="性别" width="4.5" :rules="r(true).all(R.require)"-->
                                <!--prop="position" :list="nanlist" @change="changeCheck" :disabled="disabled"></field-checkbox>-->
                <el-form :model="ruleFormGs" :rules="rulesG" ref="ruleForm" style="margin-left: 0.3385rem;margin-top: 10px;">
                    <el-form-item label="性别" prop="type">
                        <el-checkbox-group v-model="ruleFormGs.type" style="display: flex;flex-direction: column" :disabled="disabled" @change="changeCheck">
                            <el-checkbox  v-for="item in nanlist" :label="item.val" name="type"  style="margin-left: 0.2604rem;" data-test="check">{{item.val}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-form>
                <field-input class="field-input" v-model="form.idNumber" :disabled="disabled" label="身份证号" width="4.5"
                             :rules="r(true).all(R.cardId)" prop="idNumber"></field-input>
                <field-input class="field-input" v-model="form.phone"  :disabled="disabled" label="联系方式" width="4.5"
                             :rules="r(true).all(R.mobile)" prop="phone"></field-input>
                <field-input class="field-input" v-model="form.unitName" label="机构单位" width="4.5"
                             prop="organUnit" :disabled="true"></field-input>
                <el-form :model="roleFormGs" :rules="rulesG" ref="roleForm" style="margin-left: 0.3385rem;margin-top: 10px;">
                    <el-form-item label="角色" prop="type">
                        <el-checkbox-group v-model="roleFormGs.type" style="display: flex;flex-direction: column" :disabled="disabled" @change="changeCheckRole">
                            <el-checkbox  v-for="item in cRoleList"  :label="item.val"  name="type"  style="margin-left: 0.2604rem;" data-test="check">{{item.key}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-form>
                <el-form :model="raleFormGs" ref="raleForm" style="margin-left: 0.3385rem;margin-top: 10px;">
                    <el-form-item label="权限" prop="type">
                        <el-checkbox-group  v-model="raleFormGs.type" style="display: flex;flex-direction: column" :disabled="disabled" @change="changeCheckPermission">
                            <el-checkbox  v-for="item in cRaleList"  :label="item.val"  name="type"  style="margin-left: 0.2604rem;" data-test="check">{{item.key}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-form>
                <field-input class="field-input" v-model="form.position" :disabled="disabled"  label="职位" width="4.5"
                             :rules="r(true).all(R.require)" prop="position"></field-input>
                <field-input class="field-input" v-model="form.policeSign" :disabled="disabled"  label="警号(账号)" width="4.5"
                             :rules="r(true).all(R.require)" prop="policeSign"></field-input>
                <field-input class="field-input" v-model="form.password" label="密码" width="4.5"
                             :rules="r(true).all(R.require)" prop="password" :disabled="disabled" :type="'password'"></field-input>
                <!--<field-checkbox  v-model="roleItems" label="角色" width="4.5" :disabled="disabled" :rules="r(true).all(R.require)"-->
                                 <!--prop="position" :list="cRoleList" @change="changeCheckRole"></field-checkbox>-->
                <field-input class="field-input" v-model="form.fingerprintInformation" :disabled="disabled" :type="'textarea'" label="指纹信息" width="10"
                             prop="fingerprintInformation"></field-input>
            </form-container>
            <div class="add-personneo-upload-img">
                <div class="img-box" v-if="viewStatus.flag" @click="uploadImg"></div>
                <img :src="img" class="img" v-if="!viewStatus.flag" @click="uploadImg">
                <!-- <div :class="disabled?'span disabled':'span'">
                    <span v-text="'上传'" @click="uploadImg"></span>
                </div> -->
                <form method="post" class="img-form"  enctype="multipart/form-data">
                    <input type="file" name="file" @change="PreviewImage" class="input-file" id="personnelImg" data-test="upImg"/>
                </form>
            </div>
        </div>
        <div class="add-personneo-bottom">
            <!-- <el-button @click="black">返回</el-button> -->
            <el-button data-test="button" type="primary" @click="confirm" :disabled="isClick" v-show="!disabled">确认</el-button>
        </div>

        <field-dialog title="提示" ref="dialog" @confirm="dialogConfirm">
            <div class="_dialogDiv">
                您确定要放弃本次操作吗?
            </div>
        </field-dialog>
    </div>
</template>

<script>
    import {formRulesMixin} from 'field/common/mixinComponent';
    import { addUser, modifyUser } from "api/personnel"
    import {baseURL} from "../../api/config";
    /* import {scrappedUp} from "api/workflow";*/

    export default {
        data() {
            return {
                form2:{},
                form: {},
                nanlist:[{val:'男',key:'男'},{val:'女',key:'女'}],
                gender:[],
                ruleForm:{},
                roleItems:[],
                cRoleList:[
                    {val: 'LEADER',key: '领导',},
                    {val: 'POLICE',key: '警员',},
                    {val: 'ADMIN',key: '管理员',}
                ],
                cRaleList:[{val:'进入库房',key:'进入库房'}],
                viewStatus:{
                    flag:true
                },

                ruleFormGs:{type: [
                    ]},
                roleFormGs:{type: [
                    ]},
                raleFormGs:{type: [
                    ]},
                rulesG: {
                    type: [
                        { type: 'array', required: true, message: '请至少选择一个', trigger: 'change' }
                    ]
                },
                src:baseURL+'/images/',
                personnelImg:'',
                judgeForm: {}, // 用于判断是否编辑内容
                isClick: false,
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
            if(this.addType=='add'){
                this.$set(this.form,'unitName',this.organUnit.name)
            }else {
                this.initForm()
            }
            console.log("this.form")
            console.log(this.form)
            console.log(this.roleList);
            // this.roleList.forEach(item=>{
            //    if(item.value!=''&&item.label!='超级管理员'){
            //        this.cRoleList.push({
            //            val:item.value,
            //            key:item.label
            //        })
            //    }
            // });
            // this.$set(this.form,'organUnit',{id:this.organUnit.value});
            let _form = JSON.stringify(this.form)
            this.form2 = JSON.parse(_form)
        },
        computed:{
          img(){
              let img;
              console.log('this.personnelImg',this.personnelImg);
              if(this.personnelImg!=null&&this.personnelImg!=''){
                  img=this.src+this.personnelImg;
              }else {
                  img=require('./无头像.png');
              }
              return img
          }
        },
        methods: {
            initForm(){
                this.ruleFormGs.type=[this.personenlData.row.gender];
                this.$set(this.form,'gender',this.ruleFormGs.type[0]);
                this.$set(this.form,'name',this.personenlData.row.name);
                this.$set(this.form,'password',this.personenlData.row.password);
                this.$set(this.form,'position',this.personenlData.row.position);
                this.$set(this.form,'idNumber',this.personenlData.row.idNumber);
                this.$set(this.form,'policeSign',this.personenlData.row.policeSign);
                this.$set(this.form,'enterHouse',this.personenlData.row.enterHouse);
                this.$set(this.form,'phone',this.personenlData.row.phone);
                this.$set(this.form,'fingerprintInformation',this.personenlData.row.fingerprintInformation);
                this.$set(this.form,'role',{id:this.personenlData.row.role});
                this.$set(this.form,'unitName',this.personenlData.row.unitName);
                this.personnelImg=this.personenlData.row.faceInformation;
                this.$set(this.form,'faceInformation',this.personnelImg);
                if(this.personenlData.row.role=="警员"){
                    this.roleFormGs.type.push("POLICE");
                }else if(this.personenlData.row.role=="管理员"){
                    this.roleFormGs.type.push("ADMIN");
                }else if(this.personenlData.row.role=="领导"){
                    this.roleFormGs.type.push("LEADER");
                }
                this.raleFormGs.type = this.form.enterHouse
                this.viewStatus.flag=false;
                this.judgeForm = JSON.parse(JSON.stringify(this.form))
                console.log("this.roleFormGs.type")
                console.log(this.roleFormGs.type)
            },
            black(){
                if(JSON.stringify(this.form) == JSON.stringify(this.judgeForm)) {
                    this.$emit('black',true)
                } else {
                    this.$refs.dialog.show();
                }
            },
            dialogConfirm() {
                this.$emit('black', true);
            },
            changeCheck(data){
                if(data.length==0){
                    this.ruleFormGs.type=[];
                    this.$set(this.form,'gender','');
                }else {
                    let cGender=[];
                    cGender.push(data[data.length-1]);
                    this.ruleFormGs.type=cGender;
                    this.$set(this.form,'gender',this.ruleFormGs.type[0]);
                }

            },
            changeCheckRole(data){
                // this.$set(this.form,'roleItems', []);
                console.log("data")
                console.log(data[data.length-1])
                if(data.length==0){
                    this.roleFormGs.type=[];
                    this.form.role={id:''};
                }else {
                    let cRole=[];
                    cRole.push(data[data.length-1]);
                    this.roleFormGs.type=cRole;
                    this.form.role=cRole[0];
                }
                // data.forEach(item=>{
                //
                // });
            },
            changeCheckPermission(data){
                if(data==''){
                    this.raleFormGs.type=false;
                }else{
                    this.raleFormGs.type=true;
                }
                console.log("this.raleFormGs.type")
                console.log(this.raleFormGs.type)
                this.form.enterHouse = this.raleFormGs.type
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
                let src =baseURL+'/upload/image/';
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
                this.isClick = true
                setTimeout(() => this.isClick = false, 1000)
                if(this.disabled==false){
                    this.form.username=this.form.policeSign;
                    if(this.addType=='add'){}else {
                        this.form.id=this.personenlData.row.id
                    }
                    let  flag=true;
                    this.form.unitId=JSON.parse(localStorage.getItem('user')).unitId;
                    this.$refs['ruleForm'].validate((valid) => {
                        console.log('ruleForm',valid)
                        if(valid){}else {
                            flag=false
                        }
                    });
                    this.form.role = this.roleFormGs.type[0]
                    this.form.enterHouse = this.raleFormGs.type
                    console.log("this.form")
                    console.log(this.form)
                    this.$refs.form.validate.then((valid) => {
                        if(valid){
                           if(flag){
                            this.$refs.form.restValidate(this.addType == 'add'?addUser:modifyUser, this.form, res => {
                                this.$message.success('操作成功')
                                this.$emit('addSucess', true)
                            })
                           }else {
                               this.$message.error('请先填写完整表单')
                           }
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
        width: 3.8438rem;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        margin-left: 0.5208rem;
        margin-top: 0.1563rem;
        font-size: 16px;
    }
    .add-personneo-upload-img{
        margin-left: 164.0064px;
        margin-top: 35.0016px;
        width: 0.7135rem;
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
       margin-left: 0.2708rem;
       min-width: 116px;
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
