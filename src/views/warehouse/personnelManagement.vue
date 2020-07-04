<template>
    <view-container>
        <tool-bar>
            <base-button type="text" slot="button" label="新增人员" @click="addperson"></base-button>
        </tool-bar>
        <define-table :data="list"  :pageInfo="paginator"
                      :highLightCurrent="true" @changePage="changePage" :haveIndex="true">
            <define-column label="操作" width="180" fixed v-slot="{ data }">
                <i class=" iconfont iconbianji" @click="editperson(data.row)" style="margin:8px"></i>
                <i class=" iconfont iconshanchu" @click="deleteperson(data.row)" style="margin:8px"></i>
            </define-column>
            <define-column label="图片" v-slot="{ data }" fixed>
                <hover-img :imageUrl="data.row.faceInformation"></hover-img>
            </define-column>
            <define-column fixed label="警号" field="policeSign" width="180"></define-column>
            <define-column fixed label="姓名" field="name" width="100"></define-column>
            <define-column label="性别" field="gender" width="100"></define-column>
            <define-column label="机构单位" field="organUnitName" width="180"></define-column>
            <define-column label="角色" field="role" :filter="row=>enumsObj.Role[row.role]" width="180"></define-column>
            <define-column label="职位" field="position" width="180"></define-column>
            <define-column label="联系方式" field="phone"></define-column>
            <define-column label="身份证号" field="idNumber"></define-column>
            <define-column label="指纹信息"
                           :filter="(row)=>{return row.fingerprintInformation==''||row.fingerprintInformation==null?'无':'有'}"></define-column>
            <define-column label="开门权限" :filter="(row)=>{return row.enterHouse?'有':'无'}"></define-column>
        </define-table>
    </view-container>
</template>

<script>
    import myHeader from 'components/base/header/header'
    import textInput from '@/componentized/textBox/textInput'
    import uploadFile from '@/componentized/uploadFile'
    import {baseURL} from 'api/config'
    import {getUser, deleteUser} from 'api/user'
    import {mapGetters} from 'vuex'
    import DefineImage from "@/componentized/defineImage";
    export default {
        name: "personnelManagement",
        components: {
            DefineImage,
            myHeader,
            textInput,
            uploadFile,
        },
        data() {
            return {
                list: [],
                selected: '',
                paginator: {size: 10, page: 1, totalPages: 0, totalElements: 0, search: ''},
            }
        },
        created() {
            this.getUserList()
        },
        computed:{
            ...mapGetters(['enumsObj'])
        },
        methods: {
            addperson() {
                this.$router.push({
                    name: 'addPersonal',
                    params: {type: 'addPersonal', info: {data: "", edit: false}}
                })
            },
            changePage(page) {
                this.paginator.page = page;
                this.getUserList();
            },
            editperson(data) {
                this.$router.push({
                    name: 'addPersonal',
                    params: {type: 'addPersonal', info: {data: data, edit: true}}
                })
            },
            deleteperson(data) {
                deleteUser(data.id).then(res => {
                    this.$message.success("删除成功")
                    this.getUserList()
                })
            },
            getUserList() {
                getUser(this.paginator).then(res => {
                    this.list = res.content;
                    this.paginator.totalPages = res.totalPages;
                    this.paginator.totalElements = res.totalElements;
                })
            },
            imgsrc(data) {
                return baseURL + '/images/' + data.faceInformation
            }
        }
    }
</script>

<style>
    .personnelManagement {
        /* display: flex; */
        /* width: 100%; */
        /* flex-direction: column; */
        font-size: 16px;
        color: rgba(112, 112, 112, 1);
    }

    .personnel-action-bar {
        margin-top: 8px;
        /* border-top: rgba(112, 112, 112, 0.13) solid 1px; */
        border-bottom: rgba(112, 112, 112, 0.13) solid 1px;
        height: 57px;
        width: 100%;
        padding-left: 20px;
        padding-right: 20px;
    }
</style>
