<template>
    <div>
        <div v-if="!isCollapse">
            <div class="topTitle">
                <img src="@/common/images/警徽.png" @click="windowClose()"/>
            </div>
            <topInfo class="topInfo"></topInfo>
        </div>
        <el-scrollbar wrapClass="scrollbar-wrapper">
            <div class="menu">
                <el-menu
                        mode="vertical"
                        :show-timeout="200"
                        :default-active="$route.path"
                        :collapse="isCollapse"
                        background-color="#f9f9f9"
                        text-color="#707070">
                    <sidebar-item :routes="permission_routers"></sidebar-item>
                </el-menu>
                <div class="topBottom" v-if="!isCollapse">
                    服务热线:400-8265186
                </div>
            </div>
        </el-scrollbar>
    </div>


</template>

<script>
    import {mapGetters} from 'vuex'
    import SidebarItem from './SidebarItem'
    import topInfo from './personal'

    // const cmdPath = 'C:\\Users\\Administrator';
    // const exec = window.require('child_process').exec;
    // const spawn = window.require('child_process').spawn;todo
    export default {
        components: {SidebarItem, topInfo},
        methods: {
            windowClose() {
                // const process = exec(`java -jar SendCamSignal.jar ${-1}`, {cwd: cmdPath});
                // process.stderr.on('data', (err) => {
                //
                // });
                // process.on('exit', (code) => {
                //     // if (this.index === 0) {
                //     //       this.$message.error('设备未插入或串口号错误,插入后请重新选择装备!');
                //     //   }
                //     console.log(`子进程退出 ${code}`);
                // });
                // setTimeout(()=>{
                //
                // },500)
                window.close();
            },
        },
        computed: {
            ...mapGetters([
                'permission_routers',
                'sidebar'
            ]),
            routes() {
                return this.$router.options.routes
            },
            isCollapse() {
                return !this.sidebar.opened
            }
        }
    }
</script>
