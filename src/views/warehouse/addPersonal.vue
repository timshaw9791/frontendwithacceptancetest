<template>
    <div class="addpersonnel">
        <my-header :title="title"  :searchFlag="false" :haveBlack="false" ></my-header>
        <div style="display:block;width:100%;height:500px">
            <div  class="addpersonnelist">
                <entity-input label="机构单位" v-model="organUnit" format="{name}" :options="{search:'organUnits'}" placeholder="请选择"></entity-input>
                <define-input label="警号" :required="true" v-model="order.policeSign" :column="12"></define-input>
                <define-input label="姓名" :required="true" v-model="order.name" :column="12"></define-input>
                <base-select label="性别" :required="true" v-model="order.gender" :column="12" :selectList="genderList"></base-select>
                <base-select label="角色" :required="true" v-model="order.role" :selectList="roleList" :column="12"></base-select>
                <define-input label="职位" :required="true" v-model="order.position" :column="12"></define-input>
                <base-select label="开门库房权限" v-model="order.enterHouse" :selectList="enterhouseList" :column="12"></base-select>
                <define-input label="联系方式" :required="true" type="Phone" v-model="order.phone" :column="12"></define-input>
                <define-input label="身份证号" :required="true" type="CardId" v-model="order.idNumber" :column="12"></define-input>
                <define-input label="密码" :required="true" v-model="order.password" :column="12"></define-input>
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
        <div class="buttom">
            <base-button label="提交" align="right" :width="128" :height="72" :fontSize="20" @click="submit"></base-button>
            <!-- <base-button label="清空" align="right" :width="128" :height="72" :fontSize="20" type="danger"></base-button> -->
        </div>
    </div>
</template>
<script>
    import defineInput from '@/componentized/textBox/defineInput.vue'
    import myHeader from 'components/base/header/header'
    import baseSelect from '@/componentized/textBox/baseSelect.vue'
    import entityInput from '@/componentized/entity/entityInput'
    import { editUser ,addUser } from 'api/user'
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
            if(this.order.enterHouse==undefined||!this.order.enterHouse){
                this.order.enterHouse="不允许"
            }else if(this.order.enterHouse){
                this.order.enterHouse = "允许"
            }
        },
        data(){
            return{
                genderList:[{label:"男",value:"男"},{label:"女",value:"女"}],
                roleList:[{label:"管理员",value:"管理员"},{label:"警员",value:"警员"},{label:"领导",value:"领导"}],
                enterhouseList:[{label:"不允许",value:"不允许"},{label:"允许",value:"允许"}],
                order:{},
                title:"",
                organUnit: {}
            }
        },
        watch:{
            'organUnit':{
                handler(){
                    this.order.organUnitName = this.organUnit.name;
                    this.order.organUnitId = this.organUnit.id
                }
            }
        },
        methods:{
            submit(){
                switch(this.order.role){
                    case '管理员':
                        this.order.role = "ADMIN"
                        break;
                    case '领导':
                        this.order.role = "LEADER"
                        break;
                    case '警员':
                        this.order.role = "POLICE"
                        break;
                    default:
                        break;
                }
                if(this.order.enterHouse=="允许"){
                    this.order.enterHouse=true
                }else if(this.order.enterHouse=="不允许"){
                    this.order.enterHouse=false
                }
                _.forIn(this.order,function(val,key){
                    if(key=="name"||key=="policeSign"||key=="role"||key=="phone"||key=="organUnitName"||key=="position"||key=="idNumber"){
                        if(val==""||val==null){
                            this.$message.success("请填写完整")
                            return false
                        }
                    }
                })
                if(this.$route.params.info.edit){
                    editUser(this.order.id,this.order).then(res=>{
                        this.$message.sucess("编辑成功")
                        this.$router.push({name: 'warehouse/personnelManagement'});
                    })
                }else{
                    addUser(this.order).then(res=>{
                        this.$message.sucess("新增成功")
                        this.$router.push({name: 'warehouse/personnelManagement'});
                    })
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
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
    .buttom {
        height: 72px;
        width:100%;
        margin-top: 25px;
        box-shadow:0px 0px 12px rgba(235,238,245,1);
    }
</style>