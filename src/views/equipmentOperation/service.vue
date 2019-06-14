<template>
    <div>
        <el-card shadow="never">
            <div slot="header">
                <span class="_card-title">{{$route.meta.title}}</span>
            </div>
            <div>
                <tabs :list="tabsList" :indexDefault="0" @selected="selected">
                    <el-button type="text" class="_textBt" @click="service">
                        <svg-icon icon-class="维修"/>
                        维修
                    </el-button>
                    <el-button type="text" class="_textBt" @click="batch=!batch">
                        <svg-icon icon-class="批量"/>
                        批量入库
                    </el-button>

                    <div class="_buttons">
                        <BosInput
                                placeholder="装备/序号/编号"
                                suffix="el-icon-search"
                                v-model="inquire"
                                :wrapforlike="true"
                                style=" width:285px;">
                        </BosInput>
                    </div>
                </tabs>
                <el-table :data="list" v-loading.body="$apollo.queries.list.loading" element-loading-text="Loading"
                          fit highlight-current-row
                          @selection-change="handleSelectionChange">

                    <el-table-column
                            v-if="batch"
                            type="selection"
                            width="55">
                    </el-table-column>
                    <bos-table-column lable="装备名称" field="name"></bos-table-column>
                    <bos-table-column lable="装备序号" field="serial"></bos-table-column>
                    <bos-table-column lable="架体编号" field="location.number"></bos-table-column>
                    <bos-table-column lable="架体AB面"
                                      :filter="(row)=>surface(row.location.surface)"></bos-table-column>

                    <bos-table-column lable="上次维修时间" field="name"></bos-table-column>
                    <el-table-column label="操作" align="center" width="200">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" @click="scrapped(scope.row)">报 废</el-button>
                        </template>
                    </el-table-column>

                </el-table>

                <div class="_contentBt" v-if="batch">
                    <el-button @click="batch=false">取 消</el-button>
                    <el-button type="primary" @click="submit">提 交</el-button>
                </div>

                <bos-paginator :pageInfo="paginator" @bosCurrentPageChanged="changePage"/>
            </div>
        </el-card>
        <servicedialog title="请确认维修装备清单" ref="dialog">
            <el-table :data="list">
                <bos-table-column lable="序号" field="id"></bos-table-column>
                <bos-table-column lable="装备名称" field="name"></bos-table-column>
                <bos-table-column lable="装备序号" field="name"></bos-table-column>
                <bos-table-column lable="架体编号" field="name"></bos-table-column>
                <bos-table-column lable="架体AB面" field="name"></bos-table-column>
            </el-table>
        </servicedialog>

        <field-dialog title="申请报废" ref="dialog1" @confirm="dialogConfirm">
            <form-container ref="inlineForm" :model="inlineForm">
                <field-input v-model="inlineForm.auditor" label="申请人" width="3.5" :disabled="true"></field-input>
                <br/>
                <field-select label="审核人" v-model="inlineForm.leader" width="3.5"
                              :rules="r(true).all(R.require)"
                              prop="leader"
                              :list="leadershipList">
                </field-select>
                <br/>
                <field-input v-model="inlineForm.reason" label="申请原因" width="5" type="textarea"
                             :rules="r(true).all(R.require)" prop="reason"></field-input>
            </form-container>
        </field-dialog>


    </div>
</template>

<script>
    import equip from 'components/equipment/addEquipment'
    import tabs from 'components/base/tabs/index'
    import {formRulesMixin} from 'field/common/mixinComponent';
    import servicedialog from 'components/base/serviceDialog'
    import api from 'gql/operation.gql'
    import {transformMixin} from 'common/js/transformMixin'
    import {retirementApplication} from "api/operation";

    export default {


        data() {
            return {
                tabsList: ['正在维修'],
                equipList: [],
                batch: false,
                param: {
                    qfilter: {
                        "operator": "EQUEAL",
                        "key": "state",
                        "value": "MAINTAIN",
                    }
                },
                inlineForm: {
                    auditor: JSON.parse(localStorage.getItem('user')).name,
                },
                leadershipList: [],
                unitId: JSON.parse(localStorage.getItem('user')).unitId,
                equipId: '',
                inquire: '%%',
            }
        },
        methods: {
            selected(data) {
                console.log(data);
            },
            service() {
                this.$refs.dialog.show();
            },
            dialogConfirm() {
                this.$refs.inlineForm.axiosData(
                    retirementApplication({
                        equipIdList: this.equipId,
                        leaderId: this.inlineForm.leader,
                        reason: this.inlineForm.reason,
                    }).then((res) => {
                        console.log(res);
                        this.callback('报废已经申请');
                    })
                )
            },
            scrapped(row) {
                this.gqlQuery(api.getUserList, {
                    "qfilter": {
                        "key": "roleItems.roleEnum",
                        "value": "LEADER",
                        "operator": "EQUEAL",
                        "combinator": "AND",
                        "next": {
                            "key": "organUnit.id",
                            "value": this.unitId,
                            "operator": "EQUEAL",
                            "combinator": "OR",
                            "next": {
                                "key": "organUnit.organUnit.id",
                                "value": this.unitId,
                                "operator": "EQUEAL"
                            }
                        }
                    }
                }, (res) => {
                    let data = JSON.parse(JSON.stringify(res.data.UserList.content));
                    this.leadershipList = data.map((item) => {
                        return {key: item.name, val: item.id}
                    });
                });
                this.equipId = row.id;
                this.$refs.dialog1.show();
            },
            submit() {
                if (0 in this.equipList) {
                    this.gqlMutate(api.houseUser_returnEquip, {
                        equipIds: this.equipList,
                    }, (res) => {
                        console.log(res);
                        this.callback('入库成功!');
                        this.equipList = [];
                    })
                } else {
                    this.$message.error('未选择装备!')
                }
            },
            handleSelectionChange(val) {
                this.equipList = val.map((res) => {
                    return res.id
                });
            }
        },
        apollo: {
            list() {
                return this.getEntityListWithPagintor(api.getEquipList);
            },
        },
        mixins: [formRulesMixin, transformMixin],

        components: {
            equip,
            tabs,
            servicedialog
        },
        watch: {
            inquire(newVal, oldVal) {
                this.param['qfilter'] = {
                    "operator": "EQUEAL",
                    "key": "state",
                    "value": "MAINTAIN",
                    "combinator": "AND",
                    "next": {
                        "combinator": "OR",
                        "key": "name",
                        "operator": "LIKE",
                        value: newVal,
                        "next": {
                            "combinator": "OR",
                            "key": "serial",
                            "operator": "LIKE",
                            value: newVal,
                            "next": {
                                "key": "location.number",
                                "operator": "LIKE",
                                value: newVal,
                            }
                        }
                    }
                }

            }
        },
    }
</script>

<style lang="scss" scoped>
    .el-card {
        border: none !important;
    }

</style>