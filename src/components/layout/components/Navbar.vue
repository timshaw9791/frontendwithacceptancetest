<template>
    <el-menu class="navbar" mode="horizontal">
        <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>

        <!--<breadcrumb></breadcrumb>-->
        <div class="logo">{{ title }}</div>

        <div class="icons">
            <div @click="$router.push('/message/index')">
                <el-tooltip class="item" effect="dark" content="消息中心" placement="bottom">
                    <el-badge :is-dot="$store.state.socket.message?true:false">
                        <svg-icon icon-class="消息中心" class="svg"/>
                    </el-badge>
                </el-tooltip>
            </div>
        </div>
        <el-dropdown class="avatar-container" trigger="click">
            <div class="avatar-wrapper">
                <!--<img class="user-avatar" src="./hqq.gif">-->
                <svg-icon icon-class="设置" class="svg" style="font-size: 22px;"/>
                <!--<i class="el-icon-caret-bottom"></i>-->
            </div>
            <el-dropdown-menu class="user-dropdown" slot="dropdown">
                <router-link class="inlineBlock" to="/overview/index">
                    <el-dropdown-item>
                        主 页
                    </el-dropdown-item>
                </router-link>
                <router-link class="inlineBlock" to="/private/index">
                    <el-dropdown-item>
                        个人中心
                    </el-dropdown-item>
                </router-link>

                <div @click="logout">
                    <el-dropdown-item>
                        <span>注 销</span>
                    </el-dropdown-item>
                </div>

                <div @click="windowClose" style="display:block;">
                    <el-dropdown-item divided>
                        <span>退 出</span>
                    </el-dropdown-item>
                </div>

            </el-dropdown-menu>
        </el-dropdown>


    </el-menu>
</template>

<script>
    import {mapGetters} from 'vuex'
    import Breadcrumb from 'components/base/Breadcrumb'
    import Hamburger from 'components/base/Hamburger'
    import {startSocket} from "common/js/webSocket";
    import { localTitle } from 'api/config'

    export default {
        data() {
            return {
                title: localTitle
            }
        },
        components: {
            Breadcrumb,
            Hamburger
        },
        computed: {
            ...mapGetters([
                'sidebar',
                'avatar'
            ])
        },
        methods: {
            toggleSideBar() {
                this.$store.dispatch('ToggleSideBar')
            },
            logout() {
                this.$store.dispatch('LogOut').then(() => {
                    location.reload() // 为了重新实例化vue-router对象 避免bug
                    // this.$message.success('退出成功');
                })
            },
            windowClose() {
                window.close();
            },
        },
        mounted() {
            startSocket(JSON.parse(localStorage.getItem('user')).id);
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .navbar {
        height: 60px;
        line-height: 60px;
        border-radius: 0px !important;
        position: relative;

        .logo {
            font-size: 18px;
            color: #707070;
        }

        .icons {
            display: flex;
            position: absolute;
            right: 100px;
            top: 8px;

            .item {
                margin-left: 20px;

                .svg {
                    cursor: pointer;
                    font-size: 22px;
                    color: rgba(47, 47, 118, 0.9);
                }
            }

        }

        .hamburger-container {
            line-height: 70px;
            height: 50px;
            float: left;
            padding: 0 10px;
        }

        .screenfull {
            position: absolute;
            right: 90px;
            top: 16px;
            color: red;
        }

        .avatar-container {
            height: 50px;
            display: inline-block;
            position: absolute;
            right: 35px;
            top: 5px;

            .avatar-wrapper {
                cursor: pointer;
                margin-top: 5px;
                position: relative;

                .user-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                }

                .el-icon-caret-bottom {
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }
    }
</style>

