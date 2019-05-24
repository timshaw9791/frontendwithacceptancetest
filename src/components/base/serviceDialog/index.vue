<template>
    <div class="dialog">
        <el-dialog :title="title" :visible.sync="showFlag" v-if="showFlag" center :before-close="handleClose"
                   :width="width">
            <slot></slot>
            <el-dialog
                    width="30%"
                    title="提示"
                    :visible.sync="innerVisible"
                    append-to-body>
                <div class="_dialogDiv">
                    您确定要放弃本次操作吗?
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="innerVisible = false">取 消</el-button>
                    <el-button type="primary" @click="cancel">确 定</el-button>
                </div>
            </el-dialog>
            <div slot="footer" class="dialog-footer" v-if="button">
                <el-button @click="innerVisible = true">取 消</el-button>
                <el-button type="primary" @click="dialogConfirm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                showFlag: false,
                innerVisible: false,
            }
        },
        props: {
            title: {
                type: String,
                default: '标题'
            },
            width: {
                type: String,
            },
            button: {
                type: Boolean,
                default: true
            }
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
                this.$emit('cancel');
            },
            handleClose(done) {
                this.innerVisible = true;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .dialog {
        /deep/ .el-dialog__header {
            background: #2F2F76 !important;
        }

        /deep/ .el-dialog__title {
            color: white;
        }

        /deep/ .el-dialog__headerbtn /deep/ .el-dialog__close {
            color: white;
        }
    }
</style>