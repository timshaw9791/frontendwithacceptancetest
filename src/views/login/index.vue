<template>
    <div class="login-container">
        <video src="../../assets/黑贞.mp4" loop="loop" autoplay="autoplay" class="video"></video>
        <div class="video-cover"></div>
        <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm"
                 label-position="left">
            <h3 class="title">警用装备智能管理系统</h3>
            <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user"/>
        </span>
                <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on"/>
            </el-form-item>
            <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
                <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password"
                          autoComplete="on"></el-input>
                <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye"/></span>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
                    登 录
                </el-button>
            </el-form-item>
        </el-form>

    </div>
</template>

<script>
    import {startSocket} from "common/js/webSocket";

    export default {
        name: 'login',
        data() {
            return {
                loginForm: {
                    username: '1',
                    password: '1'
                },
                loginRules: {
                    username: [{required: true, trigger: 'blur'}],
                    password: [{required: true, trigger: 'blur'}]
                },
                loading: false,
                pwdType: 'password'
            }
        },
        methods: {
            showPwd() {
                if (this.pwdType === 'password') {
                    this.pwdType = ''
                } else {
                    this.pwdType = 'password'
                }
            },
            handleLogin() {
                this.$refs.loginForm.validate(valid => {
                    if (valid) {
                        this.loading = true
                        this.$store.dispatch('Login', this.loginForm).then(() => {
                            this.loading = false;
                            this.$router.push({path: '/'});
                            this.$message.success('登陆成功');
                        }).catch(() => {
                            this.loading = false
                        })
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                })
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    $bg: #2d3a4b;
    $light_gray: #eee;


    /* reset element-ui css */
    .login-container {
        .el-input {
            display: inline-block;
            height: 47px;
            width: 85%;

            input {
                background: transparent;
                border: 0px;
                -webkit-appearance: none;
                border-radius: 0px;
                padding: 12px 5px 12px 15px;
                color: $light_gray;
                height: 47px;

                &:-webkit-autofill {
                    /*-webkit-box-shadow: 0 0 0 1000px rgba(255,255,255,0) inset !important;*/
                    -webkit-animation: autofill-fix 1s infinite;

                    -webkit-text-fill-color: #fff !important;
                }

                @-webkit-keyframes autofill-fix {
                    from {
                        background-color: transparent
                    }
                    to {
                        background-color: transparent
                    }
                }
            }
        }

        .el-form-item {
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(0, 0, 0, 0.1);
            border-radius: 5px;
            color: #454545;
        }
    }

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
    $bg: #2d3a4b;
    $dark_gray: #889aa4;
    $light_gray: #eee;

    .login-container {
        position: fixed;
        width: 100%;
        height: 100%;
        /*background-color: $bg;*/

        .video {
            position: fixed; //视频定位方式设为固定
            right: 0;
            bottom: 0; //视频位置
            min-width: 100%;
            min-height: 100%; //不会因视频尺寸造成页面需要滚动
            width: auto;
            height: auto; //尺寸保持原视频大小
            z-index: -100; //z轴定位，小于0即可
            -webkit-filter: grayscale(20%); //添加灰度蒙版，如果设定为100%则视频显示为黑白
        }

        .video-cover {
            position: fixed; //视频定位方式设为固定
            right: 0;
            bottom: 0; //视频位置
            min-width: 100%;
            min-height: 100%; //不会因视频尺寸造成页面需要滚动
            width: auto;
            height: auto; //尺寸保持原视频大小
            z-index: -99; //z轴定位，小于0即可
            background: transparent;
        }

        .login-form {
            position: absolute;
            left: 0;
            right: 0;
            width: 520px;
            padding: 35px 35px 15px 35px;
            margin: 120px auto;
        }

        .tips {
            font-size: 14px;
            color: #fff;
            margin-bottom: 10px;

            span {
                &:first-of-type {
                    margin-right: 16px;
                }
            }
        }

        .svg-container {
            padding: 6px 5px 6px 15px;
            color: $dark_gray;
            vertical-align: middle;
            width: 30px;
            display: inline-block;

            &_login {
                font-size: 20px;
            }
        }

        .title {
            font-size: 26px;
            font-weight: 400;
            color: $light_gray;
            margin: 0px auto 40px auto;
            text-align: center;
            font-weight: bold;
        }

        .show-pwd {
            position: absolute;
            right: 10px;
            top: 7px;
            font-size: 16px;
            color: $dark_gray;
            cursor: pointer;
            user-select: none;
        }
    }
</style>
