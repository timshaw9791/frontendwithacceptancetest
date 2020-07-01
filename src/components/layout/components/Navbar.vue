<template>
    <div class="total-bar-container">
        <div class="system-box">
            <img src="@/common/images/警徽2.png" class="logo" @click="windowClose">
            <label class="system-title">{{ title }}</label>
        </div>
        <div class="icon-box">
            <div class="icon" @click="$router.push('/overview/index')">
                <svg-icon icon-class="主页" class="svg"/>
            </div>
            <div class="icon" @click="$router.push('/message/index')">
                <el-badge :value="unreadCount">
                    <svg-icon icon-class="通知" class="svg" title="主页"/>
                </el-badge>
            </div>
            <el-dropdown trigger="click" placement="bottom-start">
                <div><svg-icon icon-class="设置" class="svg"/></div>
                <el-dropdown-menu>
                    <router-link to="/private/index">
                        <el-dropdown-item>个人中心</el-dropdown-item>
                    </router-link>
                    <div @click="logout">
                        <el-dropdown-item>注 销</el-dropdown-item>
                    </div>
                    <el-dropdown-item @click.native="windowClose" divided>退 出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import Hamburger from 'components/base/Hamburger'
    import { localTitle } from 'api/config'
    import { getMsgList } from "api/message";
    import { jsqlPage } from 'api/basic'
    export default {
        data() {
            return {
                title: localTitle,
                fetchParams: {
                    jpql: "select ms from Message ms where ms.userId = ?1 order by ms.createTime desc",
                    returnType: "ARRAY",
                    params: [
                        JSON.parse(localStorage.getItem('user')).id
                    ]
                }
            }
        },
        components: {
            Hamburger
        },
        computed: {
            ...mapGetters([
                'unreadCount'
            ])
        },
        methods: {
            logout() {
                this.$store.dispatch('LogOut').then(() => {
                    location.reload()
                })
            },
            windowClose() {
                window.close();
            },
            fetchData() {
                jsqlPage(this.fetchParams).then(res => {
                   this.$store.commit('setUnreadCount', this._.flatten(res.content).filter(item => !item.status).length);
                })
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
        /deep/.el-badge__content{
            margin-top: 20px;
            user-select: none;
        }
    }

    .total-bar-container {
        font-size: 16px;
        height: 60px;
        line-height: 60px;
        position: relative;
        background-color: #2F2F76;
        .system-box {
            display: inline-flex;
            justify-content: flex-start;
            align-items: center;
            font-size:18px;
            color:rgba(255,255,255,1);
            margin-left: 10px;
            .logo {
                cursor: pointer;
            }
            .system-title {
                margin-left: 10px;
                user-select: none;
            }
        }
        .system-title {
            font-size:18px;
            color:rgba(255,255,255,1);
            vertical-align: middle;
        }
        .icon-box {
            width: 163px;
            height: 59px;
            display: flex;
            justify-content: space-between;
            float: right;
            margin-right: 26px;
            .svg {
                cursor: pointer;
                font-size: 0.1302rem;
                vertical-align: middle;
            }
        }
    }
</style>

