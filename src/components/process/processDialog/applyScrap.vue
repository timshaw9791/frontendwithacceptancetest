<template>
    <div>
        <serviceDialog :title="'申请报废流程'" ref="applyScrap" width="5.4167rem"
                       :button="false">
            <div class="apply-scrap-box">
                <div class="apply-scrap-action">
                    <div class="action-button-item">
                        <span v-text="'所在库房：'"></span>
                        <div class="button-item-input">
                            <el-input :disabled="true" v-model="applyObject.house.houseName"></el-input>
                        </div>
                    </div>
                    <div class="action-button-item">
                        <span v-text="'指定领导：'"></span>
                        <p_select :options="mixinObject.leaderList" @selected="selectValue"></p_select>
                    </div>
                    <div class="action-button-item">
                        <span v-text="'选择硬件：'"></span>
                        <p_select :options="options" @selected="selectValue"></p_select>
                    </div>
                </div>
                <div class="apply-reason">
                    <div style="width: 0.390625rem"><span v-text="'申请原因:'"></span></div>
                    <el-input
                            :autosize="{ minRows: 1, maxRows: 1}"
                            type="textarea"
                            placeholder="请输入内容"
                            v-model="form.reason">
                    </el-input>
                </div>
                <div class="apply-scrap-table">
                    <process-table :equipArgList="form.equips"  :processType="'scrap'"></process-table>
                </div>
                <div class="apply-scrap-footer">
                    <div class="action-footer-item">
                        <text-button style="color: #2F2F76FF!important;" :buttonName="'清空列表'" :iconClass="'删除'"></text-button>
                    </div>
                    <div class="action-footer-item">
                        <span v-text="'申请人员：'"></span>
                        <div class="button-item-input">
                            <el-input :disabled="true" v-model="form.applicant.name"></el-input>
                        </div>
                    </div>
                </div>
                <div class="apply-scrap-button">
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
    import textButton from 'components/base/textButton'
    import {applyProcessMixin} from "common/js/applyProcessMixin";
    import {transferStart} from "api/process"
    export default {
        name: "applyScrap",
        components: {
            serviceDialog,
            p_select,
            processTable,
            processCascader,
            textButton
        },
        props:{
            applyObject:{
                type:Object
            }
        },
        mixins: [applyProcessMixin],
        data() {
            return {
                form:{
                    type:'SCRAP',
                    leader:{},
                    equips:[],
                    outboundOrganUnit:{},
                    inboundOrganUnit:{
                        id: this.applyObject.house.organUnitId,
                        name: this.applyObject.house.organUnitName},
                    inboundWarehouse:{
                        id: this.applyObject.house.houseId,
                        name: this.applyObject.house.houseName
                    },
                    applicant: {
                        id: JSON.parse(localStorage.getItem('user')).id,
                        name: JSON.parse(localStorage.getItem('user')).name,
                        organUnitId: this.applyObject.house.organUnitId
                    },
                    reason:''
                },
                options: [{
                    value: '选项1',
                    label: '黄金糕'
                }, {
                    value: '选项2',
                    label: '双皮奶',
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
        created(){
            this.mixiGetLeader({organUnitId:this.applyObject.house.organUnitId,type:this.form.type});
        },
        methods: {
            apply(data) {
                console.log(data)
            },
            selectValue(data) {
                console.log(data);
            },
            apply(){

            },
            show() {
                this.$refs.applyScrap.show()
            },
            cancelDb() {
                this.$refs.applyScrap.cancel();
            },
        }
    }
</script>

<style lang="scss" scoped>
    .apply-scrap-box {
        height: 3.6302rem;
        position: relative;
    }
    .apply-scrap-box .apply-scrap-button{
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
    .apply-scrap-box .apply-reason{
        width: 100%;
        padding: 0rem 0.1771rem 0.0625rem 0.1771rem;
        display: flex;
        align-items: center;
        justify-content: left;
        /deep/ .el-textarea__inner {

        }
    }
    .apply-scrap-box .apply-scrap-action {
        width: 100%;
        padding: 0.0833rem 0.1771rem 0.0625rem 0.1771rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .apply-scrap-box .apply-scrap-table{
        width: 100%;
        padding-left: 0.1771rem;
        padding-right: 0.1771rem;
    }
    .apply-scrap-box .apply-scrap-footer{
        width: 100%;
        margin-top: 0.0677rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-left: 0.1771rem;
        padding-right: 0.1771rem;
    }
    .apply-scrap-footer .action-footer-item{
        display: flex;
        align-items: center;
        justify-content: center;
        /deep/ .el-input__inner {
            width: 1.1458rem;
            height: 0.1667rem;
        }
    }
    .apply-scrap-action .action-button-item {
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