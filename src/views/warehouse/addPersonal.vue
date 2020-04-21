<template>
    <div class="addpersonnel">
        <my-header :title="title"  :searchFlag="false" :haveBlack="false" ></my-header>
        <div  class="addpersonnelist">
            <entity-input label="机构单位" v-model="order.organUnit" format="{name}" :options="{search:'organUnits'}" placeholder="请选择"></entity-input>
            <define-input label="警号" v-model="order.policeSign" :column="12"></define-input>
            <define-input label="姓名" v-model="order.name" :column="12"></define-input>
            <base-select label="性别" v-model="order.gender" :column="12" :selectList="genderList"></base-select>
            <base-select label="角色" v-model="order.role" :selectList="roleList" :column="12"></base-select>
            <define-input label="职位" v-model="order.position" :column="12"></define-input>
            <base-select label="开门库房权限" v-model="order.enterhouse" :selectList="enterhouseList" :column="12"></base-select>
            <define-input label="联系方式" v-model="order.phone" :column="12"></define-input>
            <define-input label="身份证号" v-model="order.idNumber" :column="12"></define-input>
            <define-input label="密码" v-model="order.password" :column="12"></define-input>
            <define-input label="指纹信息" v-model="order.fingerprintInformation" :column="12"></define-input>
        </div>
        <div  class="addpersonnelist">
            <div class="add-personneo-upload-img">
                <div class="img-box"  v-if="!this.$route.params.info.edit" >
                    <!-- <img src="./加号.png" v-if="viewStatus.flag" class="img_icon"> -->
                </div>
                <img  class="img" v-if="this.$route.params.info.edit">
                <form method="post" class="img-form"  enctype="multipart/form-data">
                    <input type="file" name="file" class="input-file" id="personnelImg" data-test="upImg"/>
                </form>
                <div style="color:red;font-size:16px;width:200px;margin-top:10px；margin-left:10px">
                    <span>提示：请上传规范证件照，照片大小不超过2M</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import defineInput from '@/componentized/textBox/defineInput.vue'
    import myHeader from 'components/base/header/header'
    import baseSelect from '@/componentized/textBox/baseSelect.vue'
    import entityInput from '@/componentized/entity/entityInput'
    import upFile from '@/componentized/upFile'
    export default {
        name:"addPersonal",
        components:{
            defineInput,
            myHeader,
            upFile,
            baseSelect,
            entityInput
        },
        created(){
            if(this.$route.params.info == undefined) {
                this.$message.info("数据丢失，返回人员管理");
                this.$router.push({name: 'warehouse/personnelManagement'});
                return
            }
            if(this.$route.params.info.edit){
                this.title = "人员编辑"
                this.order = this.$route.params.info.data
            }else{
                this.title = "新增人员"
            }
            if(this.order.enterhouse==undefined){
                this.order.enterhouse="FLASE"
            }
            console.log("this.order",this.order);
        },
        data(){
            return{
                genderList:[{label:"男",value:"男"},{label:"女",value:"女"}],
                roleList:[{label:"管理员",value:"管理员"},{label:"警员",value:"警员"},{label:"领导",value:"领导"}],
                enterhouseList:[{label:"不允许",value:"FLASE"},{label:"允许",value:"TRUE"}],
                order:{
                    name: "",
                    policeSign: "",
                    role: "",
                    gender: "",
                    organUnit: {},
                    phone: "",
                    fingerprintInformation: "",
                    fingerId: null,
                    faceInformation: "",
                    position: "",
                    idNumber: "",
                    id: "",
                    createTime: 0,
                    updateTime: 0,
                    number: "",
                },
                title:""
            }
        }
    }
</script>
<style scoped>
    .addpersonnel {
        display: inline;
        font-size: 16px;
        color: rgba(112, 112, 112, 1);
    }
    .addpersonnelist{
        width:30%;
        float: left;
        margin-top:10px;
        margin-left:100px;
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
        width:180px;
        height:251px;
    }
    .add-personneo-upload-img:hover .img_icon{
        opacity: 1;
    }
    .img_icon{
        opacity: 0;
        margin-left: 60px;
        margin-top: 95px;
    }
    .add-personneo-upload-img .img-box{
        width:180px;
        height:251px;
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
</style>