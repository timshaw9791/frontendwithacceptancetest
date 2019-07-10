<template>
    <div>
        <el-button @click="getList">读全部卡</el-button>
        <el-button @click="end(pid)">关闭</el-button>
        <el-button @click="getone">读单卡</el-button>
        {{data}}
        {{one}}
    </div>
</template>

<script>

    // const cmdPath = 'C:\\Users\\Administrator';
    // const exec = window.require('child_process').exec;
    // const spawn = window.require('child_process').spawn;


    export default {
        name: "read",
        data() {
            return {
                pid: '',
                data: [],
                one: '',
            }
        },
        methods: {
            getList() {
                const process = exec(`java -jar read.jar 5`, {cwd: cmdPath});
                this.pid = process.pid;
                process.stderr.on('data', (err) => {
                    console.log(err);
                });

                process.stdout.on('data', (data) => {
                    console.log(data);
                    this.data.push(data);
                });

                process.on('exit', (code) => {
                    console.log(`子进程退出，退出码 ${code}`);
                });
            },


            getone() {
                exec(`java -jar reading.jar 5`, {cwd: cmdPath}, (err, data) => {
                    console.log(data);
                    if (data.includes('succeed')) {
                        this.one = data.split('\n')[1];
                    }
                })
            },

            end(pid) {
                if (pid) {
                    spawn("taskkill", ["/PID", pid, "/T", "/F"]);
                }
            },

        }
    }
</script>

<style scoped>

</style>