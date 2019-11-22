<template>
    <div class="dialog">
        <el-dialog title="提示"  :visible.sync="showFlag" v-if="showFlag"  center :before-close="handleClose">
            <div class="tips_box">
                <div class="_dialogDiv">
                    {{contentText}}
                </div>
                <div slot="footer" class="tips_footer" v-if="button">
                    <el-button @click="cancelDb" data-test="button">取 消</el-button>
                    <el-button type="primary" @click="dialogConfirm" data-test="button">确 定</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name:'tips',
        data() {
            return {
                showFlag: false,
                innerVisible: false,
            }
        },
        props: {
            button: {
                type: Boolean,
                default: true
            },
            contentText:{
                type: String,
                default: '您确定要放弃本次操作吗'
            },
            width: {
                type: String,
            },
        },
        methods: {
            show() {
                this.showFlag = true;
            },
            hide() {
                this.showFlag = false;
            },
            dialogConfirm() {
                this.$emit('confirm');
            },
            cancel() {
                this.innerVisible = false;
                this.showFlag = false;
                this.$emit('cancel','end');
            },
            handleClose(done) {
                this.cancel()
            },
            cancelDb() {
                this.cancel();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .tips_box{
        width: 100%;height: 1.6042rem;display: flex;
        padding-top: 0.6104rem;
        justify-content: center;position: relative;
    }
    .tips_box .tips_footer{
        position: absolute;
        right: 0.1146rem;
        bottom: 0.1875rem;
    }
    .dialog {
        /deep/ .el-dialog__header {
            height: 0.296875rem;
            padding: 0px 0.1042rem;
            background: #2F2F76 !important;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        /deep/ .el-dialog{
            width: 3.3021rem;
        }
        /deep/ .el-dialog__title {
            color: white;
        }
        /deep/ .el-dialog--center .el-dialog__body{
            padding: 0px 0px;
        }
    }
</style>