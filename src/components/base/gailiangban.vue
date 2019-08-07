<template>
    <div class="dialog">
        <el-dialog :title="title" :visible.sync="showFlag" v-if="showFlag" center :before-close="handleClose"
                   :width="width">
            <slot></slot>

            <div slot="footer" class="dialog-footer" v-if="button">
                <el-button @click="cancelDb">取 消</el-button>
                <el-button type="primary" @click="dialogConfirm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name:'gailiangban',
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
            },
            secondary: {
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
                this.$emit('cancel','end');
            },
            handleClose(done) {
                this.hide()
            },
            cancelDb() {
                this.hide();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .dialog {
        /deep/ .el-dialog__header {
            height: 57px;
            padding: 0px 20px;
            background: #2F2F76 !important;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        /deep/ .el-dialog__title {
            color: white;
        }

        /deep/ .el-dialog__headerbtn /deep/ .el-dialog__close {
            margin-top: -3px;
            font-size: 25px;
            color: white;
        }
    }
</style>