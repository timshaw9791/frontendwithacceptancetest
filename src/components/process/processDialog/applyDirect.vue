<template>
    <div>
        <serviceDialog :title="'申请直调流程'" ref="applyDirect" width="5.4167rem"
                       :button="false">
            <div class="apply-direct-box">
                <div class="apply-direct-action">
                    <div class="action-button-item">
                        <span v-text="'接收机构：'"></span>
                        <process-cascader></process-cascader>
                    </div>
                    <div class="action-button-item">
                        <span v-text="'接收库房：'"></span>
                        <p_select :options="options" @selected="selectValue"></p_select>
                    </div>
                    <div class="action-button-item">
                        <span v-text="'接收人员：'"></span>
                        <p_select :options="options" @selected="selectValue"></p_select>
                    </div>
                </div>
                <div class="apply-direct-action">
                    <div class="action-button-item">
                        <span v-text="'指定领导：'"></span>
                        <p_select :options="options" @selected="selectValue"></p_select>
                    </div>
                </div>
                <div class="apply-direct-table">
                    <process-table></process-table>
                </div>
                <div class="apply-direct-footer">
                    <div class="action-footer-item">
                        <span v-text="'申请人员：'"></span>
                        <div class="button-item-input">
                            <el-input :disabled="true" v-model="form.myUnit"></el-input>
                        </div>
                    </div>
                </div>
                <div class="apply-direct-button">
                    <el-button @click="cancelDb" data-test="button">取 消</el-button>
                    <el-button type="primary" @click="apply" data-test="button">确 定</el-button>
                </div>
            </div>
        </serviceDialog>
    </div>
</template>

<script>
    import serviceDialog from 'components/base/gailiangban'
    import p_select from 'components/base/selected'
    import processTable from '../processTable'
    import processCascader from '../processCascader'
    export default {
        name: "applyDirect",
        components: {
            serviceDialog,
            p_select,
            processTable,
            processCascader
        },
        data() {
            return {
                form:{
                    myUnit:JSON.parse(localStorage.getItem('user')).organUnitName
                },
                options: [{
                    value: '选项1',
                    label: '黄金糕'
                }, {
                    value: '选项2',
                    label: '双皮奶',
                    disabled: true
                }, {
                    value: '选项3',
                    label: '蚵仔煎'
                }, {
                    value: '选项4',
                    label: '龙须面'
                }, {
                    value: '选项5',
                    label: '北京烤鸭'
                }],
                selectButtons: [{name: '', label: '调拨流程'}, {name: '', label: '借用流程'}, {
                    name: '',
                    label: '直调流程'
                }, {name: '', label: '报废流程'}]
            }
        },
        methods: {
            apply(data) {
                console.log(data)
            },
            selectValue(data) {
                console.log(data);
            },
            show() {
                this.$refs.applyDirect.show()
            },
            cancelDb() {
                this.$refs.applyDirect.cancel();
            },
        }
    }
</script>

<style lang="scss" scoped>
    .apply-direct-box {
        height: 3.6302rem;
        position: relative;
    }
    .apply-direct-box .apply-direct-button{
        position: absolute;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        bottom: 0.224rem;
        /deep/ .el-button {
            height: 0.1667rem;
            line-height: 0px;
        }
    }
    .apply-direct-box .apply-direct-action {
        width: 100%;
        padding: 0.0833rem 0.1771rem 0.0625rem 0.1771rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .apply-direct-box .apply-direct-table{
        width: 100%;
        padding-left: 0.1771rem;
        padding-right: 0.1771rem;
    }
    .apply-direct-box .apply-direct-footer{
        width: 100%;
        margin-top: 0.0677rem;
        position: relative;
    }
    .apply-direct-footer .action-footer-item{
        position: absolute;
        right: 0.1667rem;
        display: flex;
        align-items: center;
        justify-content: center;
        /deep/ .el-input__inner {
            width: 1.1458rem;
            height: 0.1667rem;
        }
    }
    .apply-direct-action .action-button-item {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .action-button-item .button-item-input {
        /deep/ .el-input__inner {
            width: 1.1458rem;
            height: 0.1667rem;
        }
    }
</style>