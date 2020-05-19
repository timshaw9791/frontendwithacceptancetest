<template>
    <el-menu class="navbar" mode="horizontal">
        <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>

        <div class="logo">{{ title }}</div>

        <div class="icons">
            <div @click="$router.push('/overview/index')">
                <el-tooltip class="item" effect="dark" content="主页" placement="bottom">
                    <el-badge :is-dot="false">
                        <svg-icon icon-class="主页" class="svg"/>
                    </el-badge>
                </el-tooltip>
            </div>
            <div @click="$router.push('/message/index')">
                <el-tooltip class="item" effect="dark" content="消息中心" placement="bottom">
                    <el-badge :value="unreadCount">
                        <svg-icon icon-class="通知" class="svg"/>
                    </el-badge>
                </el-tooltip>
            </div>
        </div>
        <el-dropdown class="avatar-container" trigger="click">
            <div class="avatar-wrapper">
                <svg-icon icon-class="设置" class="svg" style="font-size: 0.1146rem;"/>
            </div>
            <el-dropdown-menu class="user-dropdown" slot="dropdown">
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
    import Hamburger from 'components/base/Hamburger'
    import { localTitle } from 'api/config'
    import { getMsgList } from "api/message";
    import { jsqlPage } from 'api/basic'
    import { message } from 'api/bosQuery/message'
    export default {
        data() {
            return {
                title: localTitle,
            }
        },
        components: {
            Hamburger
        },
        computed: {
            ...mapGetters([
                'sidebar',
                'unreadCount'
            ])
        },
        methods: {
            toggleSideBar() {
                this.$store.dispatch('ToggleSideBar')
            },
            logout() {
                this.$store.dispatch('LogOut').then(() => {
                    location.reload() 
                })
            },
            windowClose() {
                window.close();
            },
            fetchData() {
                jsqlPage(message).then(res => {
                   this.$store.commit('setUnreadCount', this._.flatten(res.content).filter(item => !item.status).length);
                })
                // getMsgList({id: JSON.parse(localStorage.getItem("user")).id}).then(res => {
                //     this.$store.commit('setUnreadCount', res.content.filter(item => !item.status).length);
                // });
            }
        },
        created(){
            this.fetchData();
            setInterval(this.fetchData, 2000)
        },
    }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .el-badge {
        /deep/.el-badge__content
    {
        margin-top:0.06rem;
    } 
    }
    
    
    .navbar {
        font-size: .083rem;
        height: 0.3125rem;
        line-height: 0.3125rem;
        border-radius: 0px !important;
        position: relative;

        .logo {
            font-size: 0.0938rem;
            color: #707070;
        }

        .icons {
            display: flex;
            position: absolute;
            right: 0.5208rem;
            top: 0.026rem;
            font-size: .083rem;
            
            .item {
                margin-left: 0.1042rem;
                

                .svg {
                    cursor: pointer;
                    font-size: 0.1146rem;
                    color: rgba(47, 47, 118, 0.9);
                }
            }

        }
        .hamburger-container {
            height: 0.2604rem;
            float: left;
            padding: 0 0.0521rem;
        }

        .screenfull {
            position: absolute;
            right: 0.4688rem;
            top: 0.0833rem;
            color: red;
        }

        .avatar-container {
            height: 0.2604rem;
            display: inline-block;
            position: absolute;
            right: 0.1823rem;
            top: 0.026rem;

            .menu-item {
                font-size: .083rem;
            }

            .avatar-wrapper {
                cursor: pointer;
                margin-top: 0.026rem;
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

