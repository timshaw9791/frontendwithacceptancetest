<template>
    <div class="login-container">
        <!--<video src="../../assets/黑贞.mp4" loop="loop" autoplay="autoplay" class="video"></video>-->
        <div class="video-cover"></div>
        <div class="topTitle">
            <img src="../../common/images/警徽.png" height="89" width="78" style="cursor: pointer;"
                 @click="windowClose"/>

            <h3 class="title">{{ title }}</h3>
        </div>

        <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm"
                 label-position="right">
            <div class="content-title">用户登录</div>

            <el-form-item label="账号 :" prop="username">
                <!--<span class="svg-container svg-container_login">-->
                <!--<svg-icon icon-class="user"/>-->
                <!--</span>-->
                <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" class="input"/>
            </el-form-item>


            <el-form-item label="密码 :" prop="password">
                <!--<span class="svg-container">-->
                <!--<svg-icon icon-class="password"></svg-icon>-->
                <!--</span>-->
                <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password"
                          autoComplete="on" class="input"></el-input>
                <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye"/></span>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" style="width:192px;height:44px;font-size: 20px" :loading="loading"
                           @click.native.prevent="handleLogin">
                    登 录
                </el-button>
            </el-form-item>
        </el-form>

    </div>
</template>

<script>
    import {startSocket} from "common/js/webSocket";
    import { localTitle } from 'api/config';

    const cmdPath = 'C:\\Users\\Administrator';
    //const exec = window.require('child_process').exec;
    //const spawn = window.require('child_process').spawn;
    export default {
        name: 'login',
        data() {
            return {
                title: localTitle,
                loginForm: {
                    username: '',
                    password: ''
                },
                loginRules: {
                    username: [{required: true, trigger: 'blur'}],
                    password: [{required: true, trigger: 'blur'}]
                },
                loading: false,
                pwdType: 'password',
            }
        },
        methods: {
            windowClose() {
                const process = exec(`java -jar SendCamSignal.jar ${-1}`, {cwd: cmdPath});
                process.stderr.on('data', (err) => {

                });
                process.on('exit', (code) => {
                    // if (this.index === 0) {
                    //       this.$message.error('设备未插入或串口号错误,插入后请重新选择装备!');
                    //   }
                    console.log(`子进程退出 ${code}`);
                });
                setTimeout(()=>{
                    window.close();
                },500)

            },
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
                            this.$router.push({path: 'overview/index'});
                            this.$message.success('登陆成功');
                        }).catch(() => {
                            this.loading = false
                        })
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                })
            },
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    $bg: #2d3a4b;
    $light_gray: #eee;


    /* reset element-ui css */
    .login-container {
        background-image: url("../../common/images/登录背景.png");

        .el-input {
            display: inline-block;
            width: 85%;

            input {
                background: transparent;
                border: 0px;
                -webkit-appearance: none;
                border-radius: 0px;

                &:-webkit-autofill {
                    -webkit-box-shadow: 0 0 0 1000px white inset !important;
                    /*-webkit-animation: autofill-fix 1s infinite;*/
                    /*-webkit-text-fill-color: #fff !important;*/
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
            border-radius: 5px;
            color: #454545;
            text-align: center;
            margin-bottom: 44px;

            .el-form-item__label {
                font-size: 24px !important;
                font-weight: 400 !important;
            }
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
            width: 716px;
            height: 402px;
            background: white;
            margin: 0 auto;
            box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
            border-radius: 30px;
            padding: 0 114px;
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


        .show-pwd {
            position: absolute;
            right: 10px;
            top: 7px;
            font-size: 16px;
            color: $dark_gray;
            cursor: pointer;
            user-select: none;
        }

        .content-title {
            text-align: center;
            font-size: 28px;
            color: rgba(67, 66, 93, 1);
            padding: 20px 0 66px 0;
        }

        .input {
            width: 380px;
            background: rgba(255, 255, 255, 1);
            border: 1px solid rgba(112, 112, 112, 1);
            color: black;
        }

        .topTitle {
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 160px 0 0 0;

            .title {
                font-size: 48px;
                font-weight: 400;
                color: $light_gray;
                text-align: center;
                margin-left: 16px;

            }
        }
    }
</style>
