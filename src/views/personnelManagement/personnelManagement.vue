<template>
    <div class="personnelManagement">
        <my-header :title="'人员信息管理'" :searchFlag="false" :haveBlack="!viewStatus.flag" @h_black="blackJudge"></my-header>
        <div class="personnel-action-bar">
            <div v-show="viewStatus.flag" class="add">
                <div class="add-personnel">
                    <select-personel id="personnelManagementSelect" :select="select.selectList" @selectRole="selectRole"></select-personel>
                    <div class="checkbox">
                        <el-checkbox v-model="showEnter" label="进入库房权限"  style="margin-left: 0.2604rem;" @change="showEnterpeople">进入库房权限</el-checkbox>
                    </div>
                    <div class="add-personnel-item"><svg-icon icon-class='同步' style="margin-left: 38px" class="icon-search"></svg-icon>
                        <span style="color: #2F2F76" @click="synchronization">信息头像同步</span></div>
                    <div class="add-personnel-item">
                        <svg-icon icon-class='加' style="margin-left: 38px" class="icon-search"></svg-icon>
                        <span style="color: #2F2F76" @click="addPersonnel">新增人员</span>
                    </div>
                    <!-- <div class="add-personnel-item"><svg-icon icon-class='同步' style="margin-left: 38px" class="icon-search"></svg-icon>
                        <span style="color: #2F2F76" @click="syncuser">用户同步</span></div> -->
                </div>
                <div class="input-box">
                    <svg-icon icon-class="搜索" class="icon-search"></svg-icon>
                    <input class="input" v-model="search" :placeholder="'姓名/职位/警号'"></input>
                </div>
            </div>
            <div class="modify" v-if="!viewStatus.flag">
                <span>基础信息</span>
                <div class="modify-box" v-if="type=='add'?false:true" @click="toModify">
                    <svg-icon icon-class="编辑" class="icon-modify"></svg-icon>
                    <span>{{disabled?'编辑':'取消编辑'}}</span>
                </div>
            </div>
        </div>
        <div class="personnelManagement-body"  v-loading="loading" element-loading-text="正在同步中..." element-loading-background="rgba(255,255,255, 0.8)">
            <personnel-list ref="personList" @clickPersonnel="selectPersonnel" :personnel="personnel" :showEnter="showEnter" v-show="viewStatus.flag"></personnel-list>
            <add-personnel ref="addPerson" @black="black" :addType="type" :personenlData="personnel.personenlData" :disabled="disabled" v-if="!viewStatus.flag" :organUnit="unit" @addSucess="addPersonnelSucess" :roleList="select.selectList"></add-personnel>
        </div>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header'
    import selectPersonel from 'components/personnelManagement/personnelSelect'
    import {fetchMixin} from 'field/common/mixinFetch'
    import personnelList from 'components/personnelManagement/personnelLsit'
    import { syncFaceInfo, syncUser } from 'api/personnel'
    import { baseURL } from "api/config"
    import addPersonnel from 'components/personnelManagement/addPersonnel'
    export default {
        name: "personnelManagement",
        components: {
            myHeader,
            selectPersonel,
            personnelList,
            addPersonnel
        },
        mixins: [fetchMixin],
        data() {
            return {
                loading: false,
                search: '',
                select: {
                    selectList: [
                        {label: '全部',value: '',},
                        {label: '领导 ',value: 'LEADER',},
                        {label: '警员',value: 'POLICE',},
                        {label: '管理员',value: 'ADMIN',}
                    ],
                    selectItem: ''
                },
                showEnter:false,
                // personnel: {
                //     graphqlTable: {
                //         graphqlKey: {
                //             qfilter: {key: "role.roleEnum", value: "SUPER_ADMINISTRATOR", operator: "NOTEQUEAL"},
                //             paginator: {size: 12, page: 1}
                //         },
                //         graphqlApi: user.getUserList
                //     },
                //     personenlData:{} // 具体人员信息
                // },
                personnel: {
                    table: {
                        paginator: {size: 12, page: 1},
                        query: {queryValue: '', role: ''}
                    },
                    personenlData: {}
                },
                viewStatus: {
                    flag: true,
                },
                unit:{},
                searchKey: ['name', 'position', 'policeSign'],
                type:'', // 操作类型
                disabled:false // 是否开启编辑
            }
        },
        watch: {
            'search':{
                handler(){
                    this.personnel.table.query.queryValue = this.search
                }
            }
        },
            created() {
                let unit = JSON.parse(localStorage.getItem('user')).unitId;
                this.getUnit(unit)
            },
            methods: {
                /* 需要改 */
                synchronization(){
                    this.loading = true
                    syncFaceInfo().then(res => {
                        this.loading = false
                        if(res.status === 200) {
                            this.$message.success("同步成功")
                        }
                    }).catch(err => {
                        this.loading = false
                        this.$message.error("同步更新失败，无法连接到人脸设备，请检查网络连接")
                    })
                },
                syncuser() {
                    this.loading = true
                    syncUser().then(res => {
                        this.loading = false
                        this.$message.success("同步成功")
                    }).catch(err => {
                        this.loading = false
                        this.$message.error("同步失败")
                    })
                },
                getUnit(id){
                    this.$ajax({
                        url: `${baseURL}/architecture/organUnit/${id}`,
                        method: "GET"
                    }).then(res => {
                        this.unit = res.data
                    })
                },
                toModify(){
                  this.disabled=!this.disabled;
                  console.log(this.disabled)
                },
                selectPersonnel(data){
                    this.type='modify';
                    this.personnel.personenlData=data;
                    this.disabled=true;
                    this.viewStatus.flag=false;
                },
                addPersonnelSucess(){
                    this.viewStatus.flag=true;
                    this.$refs.personList.getUsersList()
                },
                // 由于要加数据是否编辑的判断，而数据在子组件中，所以调用子组件方法
                blackJudge() {
                    this.$refs.addPerson.black()
                },
                black(data) {
                    this.viewStatus.flag=true;
                    this.disabled=false
                },
                addPersonnel(){
                    this.type='add';
                    this.disabled=false;
                    this.viewStatus.flag=false;
                },
                selectRole(data) {
                    console.log("data")
                    console.log(data)
                    console.log("this.personnel.table.query.roleId")
                    console.log(this.personnel.table.query.roleId)
                    this.personnel.table.query.role = data
                },
                // getRoles(qfilter) {
                //     getRolesList().then(res => {
                //         this.select.selectList = [{
                //             label: '全部',
                //             value: ''
                //         }];
                //         let data = JSON.parse(JSON.stringify(res.data))
                //         data.forEach(item => {
                //             if(item.roleEnum!='SUPER_ADMINISTRATOR'){
                //                 this.select.selectList.push({
                //                     label: item.roleDescribe,
                //                     value: item.id
                //                 })
                //             }
                //         })
                //     })
                // },
                showEnterpeople(data){
                    this.showEnter = data
                }
            }
    }
</script>

<style>
    #personnelManagementSelect  .el-select {
        width: 97px;
        background:rgba(47,47,118,1);
        opacity:1;
        border-radius:16px;
    }
    #personnelManagementSelect .el-input__icon{
        line-height: 30px;
        color: white;
    }
    #personnelManagementSelect .el-input__inner{
        width: 97px;
        height: 30px;
        background:rgba(47,47,118,1);
        opacity:1;
        border-radius:16px;
        color: white;
    }
    .personnelManagement {
        display: flex;
        width: 100%;
        flex-direction: column;
        font-size: 16px;
        color: rgba(112, 112, 112, 1);
    }
    .personnelManagement .personnel-action-bar {
        margin-top: 8px;
        border-top: rgba(112, 112, 112, 0.13) solid 1px;
        border-bottom: rgba(112, 112, 112, 0.13) solid 1px;
        height: 57px;
        width: 100%;
        padding-left: 20px;
        padding-right: 20px;
    }

    .personnel-action-bar .modify {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 57px;
        justify-content: left;
    }
    .modify .modify-box{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: left;
    }
    .modify-box .icon-modify{
        margin-left: 67px;
    }

    .personnelManagement .personnelManagement-body {
        width: 100%;
    }
    .personnel-action-bar .add{
        height: 57px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: row;
    }
    .add .add-personnel{
        display: flex;
        align-items: center;
        justify-content: left;
        flex-direction: row;
    }
    .add-personnel .add-personnel-item{
        display: flex;
        align-items: center;
        justify-content: left;
        flex-direction: row;
        cursor: pointer;
    }
    .personnel-action-bar .input-box {
        width: 285px;
        position: relative;
    }

    .input-box .input {
        width: 100%;
        height: 38px;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(112, 112, 112, 1);
        opacity: 1;
        border-radius: 19px;
        padding-left: 15px;
        outline: medium;
    }

    .input-box .icon-search {
        position: absolute;
        right: 10px;
        z-index: 1;
        top: 50%; /*偏移*/
        width: 25px;
        height: 25px;
        transform: translateY(-50%);
    }
    
    .el-loading-spinner {
        margin-top: -10vh !important;
    }
    .el-loading-spinner .el-loading-text {
    color: #2f2f76 !important;
    font-size: 18px !important;
}
.checkbox{
    margin-left: 0.151rem;
}
</style>
