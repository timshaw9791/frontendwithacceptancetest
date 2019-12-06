<template>
    <div>
        <serviceDialog :title="'申请调拨流程'" ref="applyAllocation" width="5.4167rem"
                       :button="false">
            <div class="apply-allocation-box">
                <div class="apply-allocation-action">
                    <div class="action-button-item">
                        <span v-text="'所在库房：'"></span>
                        <div class="button-item-input">
                            <el-input :disabled="true" v-model="applyObject.house.houseName"></el-input>
                        </div>
                    </div>
                    <div class="action-button-item">
                        <span v-text="'出库机构：'"></span>
                        <process-cascader ref="transfer_cascader" @handleUnitChange="changeUnit"></process-cascader>
                    </div>
                    <div class="action-button-item">
                        <span v-text="'指定领导：'"></span>
                        <p_select ref="transferSelect" :options="mixinObject.leaderList"
                                  @selected="selectLeader"></p_select>
                    </div>
                </div>
                <div class="apply-allocation-table">
                    <process-table :equipArgList="form.equips" :nameList="mixinObject.equipArgs"></process-table>
                </div>
                <div class="apply-allocation-footer">
                    <div class="action-footer-item">
                        <span v-text="'申请人员：'"></span>
                        <div class="button-item-input">
                            <el-input :disabled="true" v-model="form.applicant.name"></el-input>
                        </div>
                    </div>
                </div>
                <div class="apply-allocation-button">
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
    import {applyProcessMixin} from "common/js/applyProcessMixin";
    import {transferStart} from "api/process"

    export default {
        name: "applyAllocation",
        components: {
            serviceDialog,
            p_select,
            processTable,
            processCascader
        },
        props: {
            applyObject: {
                type: Object
            }
        },
        mixins: [applyProcessMixin],
        data() {
            return {
                form: {
                    leader:{},
                    type: 'TRANSFER',
                    equips: [{equipArg: {}, equip: {}}],
                    outboundOrganUnit: {},
                    applicant: {
                        id: JSON.parse(localStorage.getItem('user')).id,
                        name: JSON.parse(localStorage.getItem('user')).name,
                        organUnitId: this.applyObject.house.organUnitId
                    }
                },
                selectButtons: [{name: '', label: '调拨流程'}, {name: '', label: '借用流程'}, {
                    name: '',
                    label: '直调流程'
                }, {name: '', label: '报废流程'}]
            }
        },
        created() {
        },
        methods: {
            changeUnit(data) {
                this.$refs.transferSelect.toEmpty();
                let params = {organUnitId: data[0].id, type: this.form.type};
                this.form.outboundOrganUnit = data[data.length - 1];
                this.mixinEquipArgs();
                this.mixiGetLeader(params);
            },
            apply() {
                let equips = [];
                this.form.equips.forEach(item => {
                    if (item.equip.name != undefined) {
                        equips.push(item.equip);
                    }
                });
                let inboundOrganUnit = {
                    id: this.applyObject.house.organUnitId,
                    name: this.applyObject.house.organUnitName
                };
                let inboundWarehouse = {
                    id: this.applyObject.house.houseId,
                    name: this.applyObject.house.houseName
                };
                let apply = {
                    applicant: this.form.applicant,
                    equips: equips,
                    inboundOrganUnit: inboundOrganUnit,
                    inboundWarehouse: inboundWarehouse,
                    outboundOrganUnit: this.form.outboundOrganUnit
                };
                transferStart(apply, this.form.leader.id, this.mixinObject.processConfigId).then(res => {
                    this.$message.success('操作成功');
                    this.$emit('applySucess',true);
                    this.cancelDb()
                })
            },
            selectLeader(data) {
                this.$set(this.form,'leader',data);
            },
            show() {
                this.$set(this.form, 'equips', [{equipArg: {}, equip: {}}]);
                this.$refs.applyAllocation.show()
            },
            cancelDb() {
                this.$refs.applyAllocation.cancel();
            },
        }
    }
</script>

<style lang="scss" scoped>
    .apply-allocation-box {
        height: 3.6302rem;
        position: relative;
    }

    .apply-allocation-box .apply-allocation-button {
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

    .apply-allocation-box .apply-allocation-action {
        width: 100%;
        padding: 0.0833rem 0.1771rem 0.0625rem 0.1771rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .apply-allocation-box .apply-allocation-table {
        width: 100%;
        padding-left: 0.1771rem;
        padding-right: 0.1771rem;
    }

    .apply-allocation-box .apply-allocation-footer {
        width: 100%;
        margin-top: 0.0677rem;
        position: relative;
    }

    .apply-allocation-footer .action-footer-item {
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

    .apply-allocation-action .action-button-item {
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