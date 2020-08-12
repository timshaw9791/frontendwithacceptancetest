<template>
    <div class="total-bar-container">
        <div class="system-box">
            <img src="@/components/icons/svg/警徽.png" class="logo" @click="windowClose" style="width: 50px;height: 56px">
            <label class="system-title">{{ title }}</label>
        </div>
        <div class="icon-box">
            <div class="icon" @click="$router.push('/overview/index')">
                <svg-icon icon-class="主页" class="svg"/>
            </div>
            <div class="icon" @click="$router.push('/message/index')">
                <el-badge v-if="unreadCount" :value="unreadCount">
                    <svg-icon icon-class="通知"  class="svg" title="主页"/>
                </el-badge>
                <svg-icon v-else icon-class="通知"  class="svg" title="主页"/>
            </div>
            <el-dropdown  class="icon" trigger="click" placement="bottom-start">
                <div>
                    <svg-icon icon-class="设置" class="svg"/>
                </div>
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
    import {localTitle} from 'api/config'
    import {getMsgList} from "api/message";
    import {jsqlPage} from 'api/basic'

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
        created() {
            // this.fetchData();
            // setInterval(this.fetchData, 2000)
        },
    }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

    .total-bar-container {
        font-size: 16px;
        height: 60px;
        position: relative;
        background-color: #2F2F76;
        align-items: center;
        margin: 0 auto;
        .system-box {
            height: 60px;
            display: inline-flex;
            justify-content: flex-start;
            align-items: center;
            font-size: 18px;
            color: rgba(255, 255, 255, 1);
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
            font-size: 18px;
            color: rgba(255, 255, 255, 1);
        }

        .icon-box {
            width: 150px;
            height: 60px;
            display: flex;
            justify-content: space-between;
            float: right;
            margin-right: 10px;
            align-items:center;

            .svg {
                cursor: pointer;
                width: 25px;
                height: 25px;
            }
        }
    }
</style>

