<template>
    <div class="personal-container">
      <my-header title="个人中心"></my-header>
      <div class="body">
          <define-form :column="6" ref="form">
              <define-input label="姓名" v-model="userInfo.name" :column="6" :disabled="true" margin="10px 5px"></define-input>
              <checkbox label="权限" :column="6" v-model="userInfo.enterHouse" margin="10px 5px" :disabled="true">开门库房</checkbox>    
              <radio label="性别" :column="6" v-model="userInfo.gender" :data="genderList" :disabled="true" margin="10px 5px"></radio>
              <define-input label="职位" :column="6" v-model="userInfo.position" :disabled="true" margin="10px 5px"></define-input><br>
              <define-input label="身份证号" :column="6" v-model="userInfo.idNumber" :disabled="true" margin="10px 5px"></define-input>
              <define-input label="警号(账号)" :column="6" v-model="userInfo.policeSign" :disabled="true" margin="10px 5px"></define-input>
              <define-input label="联系电话" :column="6" type="Phone"  v-model="userInfo.phone" :disabled="disabled" margin="10px 5px" valid></define-input>
              <define-input label="密码" :column="6" v-model="userInfo.password" :disabled="disabled" margin="10px 5px"></define-input>
              <define-input label="机构单位" :column="6" v-model="userInfo.organUnitName" :disabled="true" margin="10px 5px"></define-input>
              <define-input label="指纹信息" :column="6" v-model="userInfo.fingerprintInformation" :disabled="true" margin="10px 5px"></define-input>
              <radio label="角色" :column="6" v-model="userInfo.role" :data="roleList" :disabled="true" margin="10px 5px"></radio>
          </define-form>
          <div class="right-image">
              <upload-file v-model="userInfo.faceInformation" :disabled="disabled" size="large"></upload-file>
          </div>
      </div>
      <div class="footer">
          <base-button :label="buttonLabel" @click="changeEdit"></base-button>
          <base-button label="确定" @click="submit"></base-button>
      </div>
    </div>
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
            disabled: true,
            genderList: [
                {label: '男', key: '男'},
                {label: '女', key: '女'}
            ],
            roleList: [
                {label: '管理员', key: 1}, 
                {label: '领导', key: 2}, 
                {label: '警员', key: 3}
            ]
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
    font-size: 16px;
    .body {
        display: flex;
        width: 80%;
        min-width: 1000px;
        justify-content:space-around;
        margin: 50px auto;
    }
    .footer {
        text-align: center;
    }
}
</style>