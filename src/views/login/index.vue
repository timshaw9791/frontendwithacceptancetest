<template>
    <div class="login-container">
        <div class="left-mark">
            <img src="../../common/images/APP.png">
            <label>警用装备智能管理系统</label>
        </div>
        <div class="form-box">
            <div class="logo">
                <img src="../../common/images/policeBadge.png" style="cursor:pointer" @click="windowClose">
                <div>{{ title }}</div>
            </div>
            <define-form ref="form" :tip="false" margin="0.3646rem 0" padding="0 0.1042rem">
                <define-input label="账号" v-model="loginForm.username" type="Require" 
                    placeholder="请输入账号" :column="12" margin="10px 0 0 0" valid>
                </define-input>
                <define-input label="密码" v-model="loginForm.password" type="Require" 
                    placeholder="请输入密码" pattern="password" :column="12" margin="0.1042rem 0 0 0" valid>
                </define-input>
            </define-form>
            <base-button label="登录" @click.native.prevent="handleLogin"></base-button>
        </div>
    </div>
</template>

<script>
    import { localTitle } from 'api/config';
    export default {
        name: 'login',
        data() {
            return {
                title: localTitle,
                loginForm: {
                    username: '',
                    password: ''
                }
            }
        },
        methods: {
            windowClose() {
                window.close();
            },
            handleLogin() {
                this.$refs.form.validate(valid => {
                    if(valid) {
                        this.$store.dispatch('Login', this.loginForm).then(() => {
                            this.$message.success('登录成功');
                            this.$router.push({path: 'overview/index'})
                        })
                    } else {
                        console.log("填写错误");
                        this.$message.warning("填写错误");
                    }
                })
            }
        }
    }
</script>


<style rel="stylesheet/scss" lang="scss">
    .el-message {
        font-size: 16px;
    }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
    /deep/ .define-input-container {
        max-height: 0.2917rem !important;
        height: 0.2917rem !important;
        border-radius: 6px !important;
        background-color: #E3E3EF;
        .label {
            height: 0.2917rem;
            border-radius:6px 0px 0px 6px;
            background-color: #4B4BB3;
        }
        .input {
            font-size: 0.0938rem !important;
            padding-left: 0.0781rem !important;
        }
    }
    /deep/ .base-button-container {
        .button {
            width: 2.2917rem;
            height: 0.3125rem !important;
            border-radius:34px !important;
            box-shadow:0px 5px 20px rgba(75,75,179,0.55);
            background-color: #4B4BB3 !important;
            font-size:0.125rem;
        }
    }
    .login-container {
        width: 100%;
        height: 100%;
        background-image: url("../../common/images/login.jpg");
        background-size: 100% 100%;
        font-size: 16px;

        .left-mark {
            position: absolute;
            top: 30px;
            left: 30px;
            font-size: 24px;
            font-family:Source Han Sans CN;
            color: white;
            label {
                margin-left: 20px;
                vertical-align: middle;
            }
            img {
                vertical-align: middle;
            }
        }
        .form-box {
            width:2.8802rem;
            height:3.1927rem;
            background:rgba(255,255,255,1);
            border-radius:20px;
            float: right;
            margin: 1.0365rem 0.7813rem 0 0;
            text-align: center;
            .logo {
                user-select: none;
                color: #4F4F82;
                font-size: 0.1667rem;
                font-family: Source Han Sans CN;
                font-weight: 600;
            }
        }
    }
</style>
