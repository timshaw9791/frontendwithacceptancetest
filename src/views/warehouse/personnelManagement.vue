<template>
    <div class="personnelManagement">
        <my-header :title="'人员管理'"  :searchFlag="false" :haveBlack="false" ></my-header>
        <div class="personnel-action-bar">
            <base-button :width="100" size="default" align="right" label="新增人员" @click="addperson"></base-button>
        </div>
        <div v-show="!addpersonflag">
            <define-table :data="list" height="550.0032px" :pageInfo="paginator" 
                :highLightCurrent="true" @changePage="changePage" :haveIndex="true">
                <define-column label="操作" width="180" fixed v-slot="{ data }">
                    <base-button label="编辑" size="mini" @click="editperson(data.row)" type="primary"></base-button>
                    <base-button label="删除" size="mini" type="danger" @click="deleteperson(data.row)"></base-button>
                </define-column>
                <define-column label="图片" v-slot="{ data }" fixed>
                    <upload-file type="img" size="mini" :disabled="true" v-model="data.row.faceInformation" margin="15px"></upload-file>
                </define-column>
                <define-column fixed label="警号" field="policeSign" width="180"></define-column>
                <define-column fixed label="姓名" field="name" width="100"></define-column>
                <define-column label="性别" field="gender" width="100"></define-column>
                <define-column label="机构单位" field="organUnitName" width="180"></define-column>
                <define-column label="角色" field="role" width="180"></define-column>
                <define-column label="职位" field="position" width="180"></define-column>
                <define-column label="联系方式" field="phone" width="180"></define-column>
            </define-table>
        </div>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header'
    import textInput from '@/componentized/textBox/textInput'
    import uploadFile from '@/componentized/uploadFile'
    import { baseURL } from 'api/config'
    import { getUser  ,deleteUser} from 'api/user'
    export default {
        name: "personnelManagement",
        components: {
            myHeader,
            textInput,
            uploadFile,
        },
        data() {
            return {
                addpersonflag:false,
                list: [],
                selected: '',
                paginator: {size: 10, page: 1, totalPages: 0, totalElements: 0, search: ''},
            }
        },
        created() {
            this.getUserList()
        },
        methods: {
            addperson(){
                this.$router.push({
                    name: 'addPersonal',
                    params: {type: 'addPersonal', info: {data:"",edit:false}}
                    })
            },
            changePage(page) {
                this.paginator.page = page;
                this.getUserList();
            },
            editperson(data){
                this.$router.push({
                    name: 'addPersonal',
                    params: {type: 'addPersonal', info: {data:data,edit:true}}
                    })
            },
            deleteperson(data){
                deleteUser(data.id).then(res=>{
                    this.$message.success("删除成功")
                    this.getUserList()
                })
            },
            getUserList() {
                getUser(this.paginator).then(res => {
                    this.list = res.content;
                    this.paginator.totalPages = res.totalPages;
                    this.paginator.totalElements = res.totalElements;
                    for(let i in this.list){
                        switch (this.list[i].role) {
                            case 'ADMIN':
                                this.list[i].role="管理员"
                                break;
                            case 'LEADER':
                                this.list[i].role="领导"
                                break;
                            case 'POLICE':
                                this.list[i].role="警员"
                                break;
                            default:
                                break;
                        }
                    }
                })
            },
            imgsrc(data){
                return baseURL+'/images/'+data.faceInformation
            }
        }
    }
</script>

<style>
    .personnelManagement {
        display: flex;
        width: 100%;
        flex-direction: column;
        font-size: 16px;
        color: rgba(112, 112, 112, 1);
    }
    .personnel-action-bar{
        margin-top: 8px;
        /* border-top: rgba(112, 112, 112, 0.13) solid 1px; */
        border-bottom: rgba(112, 112, 112, 0.13) solid 1px;
        height: 57px;
        width: 100%;
        padding-left: 20px;
        padding-right: 20px;
    }
</style>
