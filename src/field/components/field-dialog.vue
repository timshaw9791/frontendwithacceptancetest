<template>
    <el-dialog :title="title" :visible.sync="showFlag" v-if="showFlag" center>
        <slot></slot>
        <div slot="footer" class="dialog-footer">
            <el-button @click="showFlag = false">取 消</el-button>
            <el-button type="primary" :disabled="isClick" @click="dialogConfirm">确 定</el-button>
        </div>
    </el-dialog>
</template>


<script>

    export default {
        data() {
            return {
                showFlag:false,
                isClick: false
            }
        },
        props: {
            title: {
                type: String,
                default: '标题'
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
                this.isClick = true
                setTimeout(() => this.isClick = false, 1000)
                this.$emit('confirm');
            }
        }
    }


</script>