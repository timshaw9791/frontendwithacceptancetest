<template>
    <div class="personal-container">
      <my-header title="个人中心"></my-header>
      <div class="body">
          <div class="left-info">
              <define-input label="姓名" v-model="userInfo.name" :column="6" :disabled="disabled" margin="10px 5px"></define-input>
              <define-input label="姓名" :column="6" :disabled="disabled" margin="10px 5px"></define-input><br>
              <define-input label="姓名" :column="6" :disabled="disabled" margin="10px 5px"></define-input>
              <define-input label="职位" :column="6" v-model="userInfo.position" :disabled="disabled" margin="10px 5px"></define-input><br>
              <define-input label="身份证号" :column="6" v-model="userInfo.idNumber" :disabled="disabled" margin="10px 5px"></define-input>
              <define-input label="警号(账号)" :column="6" v-model="userInfo.policeSign" :disabled="disabled" margin="10px 5px"></define-input><br>
              <define-input label="联系电话" :column="6" v-model="userInfo.phone" :disabled="disabled" margin="10px 5px"></define-input>
              <define-input label="密码" :column="6" v-model="userInfo.password" :disabled="disabled" margin="10px 5px"></define-input><br>
              <define-input label="机构单位" :column="6" v-model="userInfo.organUnitName" :disabled="disabled" margin="10px 5px"></define-input>
              <define-input label="指纹信息" :column="6" v-model="userInfo.fingerprintInformation" :disabled="disabled" margin="10px 5px"></define-input><br>
              <radio label="角色" :column="6" v-model="userInfo.role" :data="roleList" :disabled="disabled" margin="10px 5px"></radio>
          </div>
          <div class="right-image">
              <upload-file v-model="userInfo.faceInformation" :disabled="disabled" size="large"></upload-file>
          </div>
      </div>
      <div class="footer">
          <base-button :label="buttonLabel" @click="disabled=!disabled"></base-button>
          <base-button label="确定"></base-button>
      </div>
    </div>
</template>

<script>
import myHeader from 'components/base/header/header';
import uploadFile from '@/componentized/uploadFile'
import radio from '@/componentized/radio'
export default({
    name: 'personal',
    components: {myHeader, uploadFile, radio},
    data() {
        return {
            userInfo: JSON.parse(localStorage.getItem('user')),
            disabled: true,
            roleList: [
                {label: '管理员',key: 'ADMIN'}, 
                {label: '领导', key: 'LEADER'}, 
                {label: '警员',key: 'POLICE'
                }],
            
        }
    },
    computed: {
        buttonLabel() {
            return this.disabled?'编辑':'取消编辑'
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
        border: 1px solid black;
        margin: 50px auto;
    }
    .left-info {
        width: 700px;
        border: 1px solid orange;
    }
    .footer {
        text-align: center;
    }
}
</style>