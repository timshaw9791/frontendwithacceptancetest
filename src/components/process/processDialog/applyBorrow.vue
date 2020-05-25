<template>
    <div>
        <serviceDialog :title="'申请借用流程'" ref="applyBorrow" width="5.4167rem"
                       :button="false">
            <div class="apply-borrow-box">
                <div class="apply-borrow-action">
                    <div class="action-button-item">
                        <span v-text="'所在库房：'"></span>
                        <div class="button-item-input">
                            <el-input :disabled="true" v-model="applyObject.house.houseName"></el-input>
                        </div>
                    </div>
                    <div class="action-button-item">
                        <span v-text="'出库机构：'"></span>
                        <process-cascader @handleUnitChange="changeUnit"></process-cascader>
                    </div>
                    <div class="action-button-item">
                        <span v-text="'指定领导：'"></span>
                        <p_select :options="options" @selected="selectValue"></p_select>
                    </div>
                </div>
                <div class="apply-borrow-table">
                    <process-table></process-table>
                </div>
                <div class="apply-borrow-footer">
                    <div class="action-footer-item">
                        <span v-text="'申请人员：'"></span>
                        <div class="button-item-input">
                            <el-input :disabled="true" v-model="form.myUnit"></el-input>
                        </div>
                    </div>
                </div>
                <div class="apply-borrow-button">
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
        name: "applyBorrow",
        components: {
            serviceDialog,
            p_select,
            processTable,
            processCascader
        },
        props:{
            applyObject:{
                type:Object
            }
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
            changeUnit(data){
            },
            apply(data) {
                console.log(data)
            },
            selectValue(data) {
                console.log(data);
            },
            show() {
                this.$refs.applyBorrow.show()
            },
            cancelDb() {
                this.$refs.applyBorrow.cancel();
            },
        }
    }
</script>

<style lang="scss" scoped>
    .apply-borrow-box {
        height: 3.6302rem;
        position: relative;
    }
    .apply-borrow-box .apply-borrow-button{
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
    .apply-borrow-box .apply-borrow-action {
        width: 100%;
        padding: 0.0833rem 0.1771rem 0.0625rem 0.1771rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .apply-borrow-box .apply-borrow-table{
        width: 100%;
        padding-left: 0.1771rem;
        padding-right: 0.1771rem;
    }
    .apply-borrow-box .apply-borrow-footer{
        width: 100%;
        margin-top: 0.0677rem;
        position: relative;
    }
    .apply-borrow-footer .action-footer-item{
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
    .apply-borrow-action .action-button-item {
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