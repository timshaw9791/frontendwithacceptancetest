<template>
    <el-menu class="navbar" mode="horizontal">
        <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>

        <!--<breadcrumb></breadcrumb>-->
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
                    <el-badge  :value="0" >
                        <svg-icon icon-class="通知" class="svg"/>
                    </el-badge>
                </el-tooltip>
            </div>
        </div>
        <el-dropdown class="avatar-container" trigger="click">
            <div class="avatar-wrapper">
                <!--<img class="user-avatar" src="./hqq.gif">-->
                <svg-icon icon-class="设置" class="svg" style="font-size: 0.1146rem;"/>
                <!--<i class="el-icon-caret-bottom"></i>-->
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
    import Breadcrumb from 'components/base/Breadcrumb'
    import Hamburger from 'components/base/Hamburger'
    import { localTitle } from 'api/config'
    import { readMsg, getMsgList, getMsgListWithType } from "api/message";

    // const cmdPath = 'C:\\Users\\Administrator';
    // const exec = window.require('child_process').exec;
    // const spawn = window.require('child_process').spawn;todo
    export default {
        data() {
            return {
                title: localTitle,
                haveMessage:false,
                messageNum:0
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
                    // const process = exec(`java -jar SendCamSignal.jar ${0}`, {cwd: cmdPath});
                    // process.stderr.on('data', (err) => {
                    //
                    // });
                    // process.on('exit', (code) => {
                    //     // if (this.index === 0) {
                    //     //       this.$message.error('设备未插入或串口号错误,插入后请重新选择装备!');
                    //     //   }
                    //     console.log(`子进程退出 ${code}`);
                    // });

                })

            },
            windowClose() {
                window.close();
                // const process = exec(`java -jar SendCamSignal.jar ${-1}`, {cwd: cmdPath});
                // process.stderr.on('data', (err) => {
                // });
                // process.on('exit', (code) => {
                //     // if (this.index === 0) {
                //     //       this.$message.error('设备未插入或串口号错误,插入后请重新选择装备!');
                //     //   }
                //     console.log(`子进程退出 ${code}`);
                // });
                // setTimeout(() => {
                //
                // }, 500)
            },
            getList() {
            let data = {
                id: JSON.parse(localStorage.getItem("user")).id,
            };
            getMsgList(data).then(res => {
              this.messageNum=0
              res.content.forEach(item=>{
                  if(item.status==false)
                  {
                      this.messageNum++
                  }
              })
              this.$store.commit('SET_MESSAGE', this.messageNum);    
      });
    },
        },
        created(){
            this.getList()
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

