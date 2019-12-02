<template>
    <div>
        <serviceDialog :title="'申请借用流程'" ref="applyBorrow" width="5.4167rem"
                       :button="false">
            <div class="apply-borrow-box">
                <div class="apply-borrow-action">
                    <div class="action-button-item">
                        <span v-text="'所在库房：'"></span>
                        <div class="button-item-input">
                            <el-input disabled="true" v-model="form.myUnit"></el-input>
                        </div>
                    </div>
                    <div class="action-button-item">
                        <span v-text="'出库机构：'"></span>
                        <p_select :options="options" @selected="selectValue"></p_select>
                    </div>
                    <div class="action-button-item">
                        <span v-text="'指定领导：'"></span>
                        <p_select :options="options" @selected="selectValue"></p_select>
                    </div>
                </div>
            </div>
        </serviceDialog>
    </div>
</template>

<script>
    import serviceDialog from 'components/base/gailiangban'
    import p_select from 'components/base/selected'

    export default {
        name: "applyBorrow",
        components: {
            serviceDialog,
            p_select
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
    }

    .apply-borrow-box .apply-borrow-action {
        width: 100%;
        padding: 0.0833rem 0.1771rem 0.0625rem 0.1771rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
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