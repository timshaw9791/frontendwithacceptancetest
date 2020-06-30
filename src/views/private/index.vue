<template>
    <view-container>
        <tool-bar>
            <base-button :label="buttonLabel" @click="changeEdit" type="text" slot="button"></base-button>
            <base-button label="确定" @click="submit" type="text" slot="button"></base-button>
        </tool-bar>
        <div class="personal-container">
            <define-form :column="6" ref="form">
                <define-input label="姓名" v-model="userInfo.name" :column="6" :disabled="true" margin="10px 5px"></define-input>
                <checkbox label="权限" :column="6" v-model="userInfo.enterHouse" margin="10px 5px" :disabled="true">开门库房</checkbox>
                <radio label="性别" :column="6" v-model="userInfo.gender" :data="$store.getters.enums.gender" :disabled="true" margin="10px 5px"></radio>
                <define-input label="职位" :column="6" v-model="userInfo.position" :disabled="true" margin="10px 5px"></define-input><br>
                <define-input label="身份证号" :column="6" v-model="userInfo.idNumber" :disabled="true" margin="10px 5px"></define-input>
                <define-input label="警号(账号)" :column="6" v-model="userInfo.policeSign" :disabled="true" margin="10px 5px"></define-input>
                <define-input label="联系电话" :column="6" type="Phone"  v-model="userInfo.phone" :disabled="disabled" margin="10px 5px" valid></define-input>
                <define-input label="密码" :column="6" v-model="userInfo.password" :disabled="disabled" margin="10px 5px"></define-input>
                <define-input label="机构单位" :column="6" v-model="userInfo.organUnitName" :disabled="true" margin="10px 5px"></define-input>
                <define-input label="指纹信息" :column="6" v-model="userInfo.fingerprintInformation" :disabled="true" margin="10px 5px"></define-input>
                <radio label="角色" :column="6" v-model="userInfo.role" :data="$store.getters.RoleEnum" :disabled="true" margin="10px 5px"></radio>
            </define-form>
            <div class="right-image">
                <upload-file v-model="userInfo.faceInformation" :disabled="disabled" size="large"></upload-file>
            </div>
        </div>
    </view-container>
</template>

<script>
import myHeader from 'components/base/header/header';
import uploadFile from '@/componentized/uploadFile'
import { editUser } from 'api/user'
export default({
    name: 'personal',
    components: {myHeader, uploadFile},
    data() {
        return {
            userInfo: JSON.parse(localStorage.getItem('user')),
            disabled: true
        }
    },
    computed: {
        buttonLabel() {
            return this.disabled?'编辑':'取消编辑'
        },
    },
    methods: {
        submit() {
            if(this.disabled) return
            this.$refs.form.validate(valid => {
                if(valid) {
                    editUser(this.userInfo.id, this.userInfo).then(res => {
                        this.userInfo = JSON.parse(JSON.stringify(res));
                        localStorage.setItem('user', JSON.stringify(res));
                        this.disabled = true;
                    })
                }
            })
        },
        changeEdit() {
            if(!this.disabled) {
                this.userInfo = JSON.parse(localStorage.getItem('user'));
            }
            this.disabled = !this.disabled;
        }
    }
})
 
</script>

<style lang="scss" scoped>
    .personal-container {
        display: flex;
        width: 80%;
        min-width: 1000px;
        justify-content:space-around;
        margin: 50px auto;
    }
</style>