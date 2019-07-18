<template>
    <el-dialog
            width="30%"
            title="提示"
            :visible.sync="innerVisible"
            append-to-body>
        <div class="_dialogDiv">
            您确定要放弃本次操作吗?
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: "tips",
        data(){
            return{
            }
        },
        props:{
            innerVisible:{
                type:Boolean,
                default:false
            }
        },
        methods:{
            cancel(){
                this.$emit('cancel',true);
            },
            confirm() {
                this.$emit('confirm','end');
            },
        }
    }
</script>

<style scoped>

</style>