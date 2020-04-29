<template>
    <div class="login-container">
        <div class="topTitle">
            <img src="../../common/images/警徽.png" height="89" width="225" style="cursor: pointer;"
                 @click="windowClose"/>

            <h3 class="title">{{ title }}</h3>
        </div>

        <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm"
                 label-position="right">
            <div class="content-title">用户登录</div>
            <el-form-item label="账号 :" prop="username">
                <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" class="input"/>
            </el-form-item>

            <el-form-item label="密码 :" prop="password">
                <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password"
                          autoComplete="on" class="input"></el-input>
                <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye"/></span>
            </el-form-item>

            <el-form-item>
                <base-button label="登 录" size="medium" @click.native.prevent="handleLogin"></base-button>
            </el-form-item>
        </el-form>

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
                },
                loginRules: {
                    username: [{required: true, trigger: 'blur'}],
                    password: [{required: true, trigger: 'blur'}]
                },
                pwdType: 'password',
            }
        },
        methods: {
            windowClose() {
                window.close();
            },
            showPwd() {
                this.pwdType = this.pwdType?'':'password';
            },
            handleLogin() {
                this.$refs.loginForm.validate(valid => {
                    if (valid) {
                        this.$store.dispatch('Login', this.loginForm).then(() => {
                            this.$router.push({path: 'overview/index'});
                            this.$message.success('登陆成功');
                        })
                    } else {
                        console.log('填写错误');
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

    .el-message {
        font-size: 16px;
    }

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
            margin-bottom: 0.2292rem;

            .el-form-item__label {
                font-size: 0.125rem !important;
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
        .login-form {
            position: absolute;
            left: 0;
            right: 0;
            width: 3.7292rem;
            height: 2.0938rem;
            min-height: 300px;
            background: white;
            margin: 0 auto;
            box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
            border-radius: 30px;
            padding: 0 0.5938rem;
        }

        .tips {
            font-size: 0.0729rem;
            color: #fff;
            margin-bottom: 0.0521rem;

            span {
                &:first-of-type {
                    margin-right: 0.0833rem;
                }
            }
        }

        .svg-container {
            padding: 0.0313rem 0.026rem 0.0313rem 0.0781rem;
            color: $dark_gray;
            vertical-align: middle;
            width: 0.1563rem;
            display: inline-block;

            &_login {
                font-size: 0.1042rem;
            }
        }


        .show-pwd {
            position: absolute;
            right: 0.0521rem;
            top: 0.0365rem;
            font-size: 0.0833rem;
            color: $dark_gray;
            cursor: pointer;
            user-select: none;
        }

        .content-title {
            text-align: center;
            font-size: 0.1458rem;
            color: rgba(67, 66, 93, 1);
            padding: 0.1042rem 0 0.3438rem 0;
        }

        .input {
            width: 1.9792rem;
            background: rgba(255, 255, 255, 1);
            border: 1px solid rgba(112, 112, 112, 1);
            color: black;
        }

        .topTitle {
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0.8333rem 0 0 0;

            .title {
                font-size: 0.25rem;
                font-weight: 400;
                color: $light_gray;
                text-align: center;
                margin-left: 0.0833rem;

            }
        }
    }
</style>
