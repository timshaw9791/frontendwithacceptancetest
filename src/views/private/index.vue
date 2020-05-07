<template>
    <div class="info-box">
        <div slot="header" class="header">
            <span class="_card-title">{{$route.meta.title}}</span>
        </div>
        <div>
            <info v-if="flag" :personenlData="personenlData" :toBack="toBack" @noBack="noBack" :organUnit="unit" :role="role"></info>
            <!--<div class="privateInfo">-->
            <!--&lt;!&ndash;<div class="imgUp">&ndash;&gt;-->
            <!--&lt;!&ndash;<imgUp :disabled="true" :image="imageUrl"></imgUp>&ndash;&gt;-->
            <!--&lt;!&ndash;</div>&ndash;&gt;-->
            <!--&lt;!&ndash;<form-container ref="form" :model="form" class="formList">&ndash;&gt;-->
            <!--&lt;!&ndash;<field-input v-model="form.name" label="姓名 :" width="3" :disabled="true"></field-input>&ndash;&gt;-->
            <!--&lt;!&ndash;<br/>&ndash;&gt;-->
            <!--&lt;!&ndash;<field-input type="password" v-model="form.password" label="密码 :" width="3" :disabled="disabled"&ndash;&gt;-->
            <!--&lt;!&ndash;:rules="r(true).all(R.require)" prop="password"&ndash;&gt;-->
            <!--&lt;!&ndash;&gt;</field-input>&ndash;&gt;-->
            <!--&lt;!&ndash;<br/>&ndash;&gt;-->
            <!--&lt;!&ndash;<field-input v-model="form.phone" label="联系方式 :" width="3" :disabled="disabled"&ndash;&gt;-->
            <!--&lt;!&ndash;:rules="r(true).all(R.integer)" prop="phone"&ndash;&gt;-->
            <!--&lt;!&ndash;&gt;</field-input>&ndash;&gt;-->
            <!--&lt;!&ndash;</form-container>&ndash;&gt;-->
            <!--&lt;!&ndash;<info></info>&ndash;&gt;-->
            <!--</div>-->

            <!--<div class="_box-bottom" v-if="!disabled">-->
            <!--<el-button @click="disabled=!disabled">取消</el-button>-->
            <!--<el-button type="primary" @click="pushButton">提交</el-button>-->
            <!--</div>-->

        </div>
    </div>
</template>

<script>
    import tabs from 'components/base/tabs/index'
    import imgUp from 'components/base/axiosImgUp';
    import {imgBaseUrl} from "api/config";
    import {fetchMixin} from "field/common/mixinFetch";
    import info from 'components/information/inforComponent'
    import { getRolesList,getOrganUnitById,getIdentityUserById} from 'api/personnel'
    export default {
        components: {
            tabs,
            imgUp,
            info
        },
        data() {
            return {
                form: {},
                imageUrl: '',
                personenlData:{},
                unit:'',
                role:{},
                toBack:false,
                flag:false
            }
        },
        mixins: [fetchMixin],
        created(){
            this.getList();
        },
        methods: {
            getList() {
                let data = JSON.parse(localStorage.getItem('user'));
                getIdentityUserById(data.id).then(res=>{
                    this.$set(this,'personenlData',res.data);
                    this.getUnit(this.personenlData.unitId);
                    this.getRoleGql(this.personenlData.role.roleEnum);
                    this.flag=true
                });
                // this.imageUrl = `${imgBaseUrl}${data.faceInformation}`;
            },
            getUnit(id){
                getOrganUnitById(id).then(res=>{
                    this.unit=res.data;
                    console.log(this.unit)
                })
            },
            pushButton() {

            },
            black() {
              this.toBack=true
            },
            noBack(data){
              this.toBack=false
            },
            getRoleGql(roleEnum) {
                getRolesList().then(res=>{
                    console.log('getRoleGql',roleEnum);
                    res.data.forEach(item=>{
                        if(item.roleEnum==roleEnum){
                            this.role={roleDescribe:item.roleDescribe,id:item.id};
                        }
                    });
                    console.log('this.role',this.role);
                })
            },
        },
        mounted() {
        }

    }
</script>

<style lang="scss" scoped>
    .info-box {
        width: 100%;
        min-height: 600px;
        font-size: 16px;
    }

    .info-box .header {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-left: 15px;
        padding-right: 15px;
        height: 58px;
        font-size: 20px;
        color: #707070;
    }

    .header .black {
        display: flex;
        align-items: center;
    }

    .black .svg-info {
        height: 20px;
        width: 20px;
        margin-right: 10px;
    }

    .info-box .actions {
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

    .privateInfo {
        margin-top: 60px;
        display: flex;

        .imgUp {
            margin-left: 92px;
        }

        .formList {
            width: 80%;
            margin: 0 auto;
        }
    }
</style>