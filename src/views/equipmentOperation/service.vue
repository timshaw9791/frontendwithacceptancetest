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
                    <bos-table-column lable="rfid" field="rfid"></bos-table-column>
                    <bos-table-column lable="装备名称" field="name"></bos-table-column>
                    <bos-table-column lable="装备序号" field="serial"></bos-table-column>
                    <bos-table-column lable="架体编号" field="location.number"></bos-table-column>
                    <bos-table-column lable="架体AB面"
                                      :filter="(row)=>surface(row.location?row.location.surface:'暂无')"></bos-table-column>

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

        <servicedialog title="请确认维修装备清单" ref="dialog" @cancel="cancel" @confirm="repairPush">
            <el-table :data="dialogList">
                <el-table-column label="序号" align="center">
                    <template scope="scope">
                        {{scope.$index+1}}
                    </template>
                </el-table-column>
                <bos-table-column lable="装备名称" field="name"></bos-table-column>
                <bos-table-column lable="装备序号" field="serial"></bos-table-column>
                <bos-table-column lable="架体编号" field="location.number"></bos-table-column>
                <bos-table-column lable="架体AB面"
                                  :filter="(row)=>surface(row.location?row.location.surface:'暂无')"></bos-table-column>
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
    import {getRfidinfo} from "api/rfid";
    import { start, killProcess } from 'common/js/rfidReader'

    // const cmdPath = 'C:\\Users\\Administrator';
    //const exec = window.require('child_process').exec;
    //const spawn = window.require('child_process').spawn;
    // import {killProcess} from "common/js/kill";

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
                pid: '',
                dialogList: [],
                listPush: [],
            }
        },
        created() {
            this.com = JSON.parse(localStorage.getItem('deploy'))['UHF_READ_COM'];
        },

        methods: {
            selected(data) {
                console.log(data);
            },
            service() {
                this.$refs.dialog.show();
                this.dialogList = [];
                this.listPush = [];

                start("java -jar scan.jar", (data) => {
                    getRfidinfo([`${data}`]).then(res => {
                        if (0 in res) {
                            this.dialogList.push(res[0]);
                            this.listPush.push(res[0].id);
                        } else {
                            this.$message.error(`${data}该RFID不在库房内`);
                            index = 1;
                        }
                    })
                }, (fail) => {
                    this.$message.error(fail)
                    this.$refs.dialog.hide()
                }, (pid, err) => {pid?this.pid = pid:this.$message.error(err);this.$refs.dialog.hide()})

                // const process = exec(`java -jar scan.jar ${this.com}`, {cwd: cmdPath});
                // this.pid = process.pid;
                // let index = 0;


                // process.stderr.on('data', (err) => {
                //     console.log(err);
                //     this.$message.error('设备故障请重新插拔!插入后请重新打开维修');
                //     index = 1;
                //     killProcess();
                //     this.$refs.dialog.hide();
                // });


                // process.stdout.on('data', (data) => {
                //     console.log(data);
                //     if (index > 0) {
                //         getRfidinfo([`${data}`]).then(res => {
                //             if (0 in res) {
                //                 this.dialogList.push(res[0]);
                //                 this.listPush.push(res[0].id);
                //             } else {
                //                 this.$message.error(`${data}该RFID不在库房内`);
                //                 index = 1;
                //             }
                //         })
                //     }
                //     if (data.includes('succeed')) {
                //         index = 1;
                //     }
                // });

                // process.on('exit', (code) => {
                //     if (index === 0) {
                //         this.$message.error('设备未插入或串口号错误,插入后请重新打开维修!');
                //         this.$refs.dialog.hide();
                //     }
                //     console.log(`子进程退出，退出码 ${code}`);
                // });

            },
            cancel() {
                //killProcess();
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
            },
            repairPush() {
                this.gqlMutate(api.admin_maintainEquips, {
                    equipIdList: this.listPush
                }, (res) => {
                    this.callback('已经申请维修!');
                    this.$refs.dialog.hide();
                    //spawn("taskkill", ["/PID", this.pid, "/T", "/F"]);
                    killProcess(this.pid)
                })
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
                this.param.namelike = newVal;
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
        beforeDestroy() {
            killProcess(this.pid)
        }
    }
</script>

<style lang="scss" scoped>
    .el-card {
        border: none !important;
    }

</style>
