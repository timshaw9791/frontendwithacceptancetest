<template>
    <div class="addpersonnel">
        <my-header :title="title"  :searchFlag="false" :haveBlack="false" ></my-header>
        <div style="display:block;width:100%;height:500px">
            <div  class="addpersonnelist">
                <entity-input label="机构单位" margin="15px 0 0 0" :disabled="true" v-model="organUnit" format="{name}" :options="{search:'organUnits'}" placeholder="请选择"></entity-input>
                <define-input label="警号" margin="15px 0 0 0" :required="true" v-model="order.policeSign" :column="12"></define-input>
                <define-input label="姓名" margin="15px 0 0 0" :required="true" v-model="order.name" :column="12"></define-input>
                <base-select label="性别" margin="15px 0 0 0" :required="true" v-model="order.gender" :column="12" :selectList="genderList"></base-select>
                <base-select label="角色" margin="15px 0 0 0" :required="true" v-model="order.role" :selectList="roleList" :column="12"></base-select>
                <define-input label="职位" margin="15px 0 0 0" :required="true" v-model="order.position" :column="12"></define-input>
                <base-select label="开门库房权限"  margin="15px 0 0 0" v-model="order.enterHouse" :selectList="enterhouseList" :column="12"></base-select>
                <define-input label="联系方式" margin="15px 0 0 0" :required="true" type="Phone" v-model="order.phone" :column="12"></define-input>
                <define-input label="身份证号" margin="15px 0 0 0" :required="true" type="CardId" v-model="order.idNumber" :column="12"></define-input>
                <define-input label="密码" margin="15px 0 0 0" pattern="password" :required="true" v-model="order.password" :column="12"></define-input>
                <define-input label="指纹信息" margin="15px 0 0 0" v-model="order.fingerprintInformation" :column="12"></define-input>
            </div>
            <div  class="addpersonnelist">
                <upload-file type="img" v-model="order.faceInformation" margin="15px"></upload-file>
            </div>
        </div>
        <div class="buttom">
            <base-button label="提交" align="right" size="large" @click="submit"></base-button>
            <base-button label="取消" align="right" size="large" type="danger" @click="cansle"></base-button>
        </div>
        <service-dialog title="提示" ref="tip" :button="true" :secondary="false" @confirm="confirm">
            <div>确定放弃{{this.$route.params.info.edit?"编辑":"新增"}}人员？</div>
        </service-dialog>
    </div>
</template>
<script>
    import defineInput from '@/componentized/textBox/defineInput.vue'
    import myHeader from 'components/base/header/header'
    import baseSelect from '@/componentized/textBox/baseSelect.vue'
    import entityInput from '@/componentized/entity/entityInput'
    import { editUser ,addUser } from 'api/user'
    import serviceDialog from "components/base/serviceDialog"
    import { baseURL } from 'api/config'
    import uploadFile from '@/componentized/uploadFile'
    export default {
        name:"addPersonal",
        components:{
            defineInput,
            myHeader,
            uploadFile,
            baseSelect,
            entityInput,
            serviceDialog
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
                this.imagesrc = baseURL+'/images/'+this.order.faceInformation
                this.organUnit = {
                    name:this.order.organUnitName,
                    id:this.order.organUnitId
                }
            }else{
                this.title = "新增人员"
                let user = JSON.parse(localStorage.getItem('user'))
                console.log("user",user);
                this.organUnit = {
                    name:user.organUnitName,
                    id:user.organUnitId
                }
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
                organUnit: {},
                imagesrc:""
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
                            this.$message.error("请填写完整")
                            return false
                        }
                    }
                })
                if(this.$route.params.info.edit){
                    editUser(this.order.id,this.order).then(res=>{
                        this.$message.success("编辑成功")
                        this.$router.push({name: 'warehouse/personnelManagement'});
                    })
                }else{
                    addUser(this.order).then(res=>{
                        this.$message.success("新增成功")
                        this.$router.push({name: 'warehouse/personnelManagement'});
                    })
                }
            },
            confirm(){
                this.$router.push({name: 'warehouse/personnelManagement'});
            },
            cansle(){
                this.$refs.tip.show()
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
        .img{
            width:180px;
            height:251px;
        }
    }
    .buttom {
        height: 72px;
        width:100%;
        margin-top: 25px;
        // box-shadow:0px 0px 12px rgba(235,238,245,1);
    }
</style>