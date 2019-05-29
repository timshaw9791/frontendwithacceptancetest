<template>
    <div>
        {{fsData}}
    </div>
</template>

<script>
    const $fs = window.require('fs');

    console.log(window);
    export default {
        data() {
            return {
                fsData: '1'
            }
        },
        methods: {},
        mounted() {
            $fs.readFile('C:\\下载\\1.txt', (err, data) => {
                // 读取文件失败/错误
                if (err) {
                    throw err;
                }
                // 读取文件成功
                console.log(data);
                this.fsData = data;
            });
        }
    }
</script>

<style scoped>

</style>