<template>
    <div class="service">
        <el-card shadow="never">
            <div slot="header">
                <span class="_card-title">{{$route.meta.title}}</span>
            </div>
            <div>
                <tabs :list="tabsList" :indexDefault="0" @selected="selected">
                    <el-button type="text" class="_textBt" @click="service">
                        <svg-icon icon-class="维修"/>
                        开始维修
                    </el-button>
                    <el-button type="text" class="_textBt" @click="serviceEnd">
                        <svg-icon icon-class="批量"/>
                        结束维修
                    </el-button>

                    <!--<div class="_buttons">-->
                    <!--<BosInput-->
                    <!--placeholder="装备名称/序号/编号"-->
                    <!--suffix="el-icon-search"-->
                    <!--v-model="inquire"-->
                    <!--:wrapforlike="true"-->
                    <!--style=" width:285px;">-->
                    <!--</BosInput>-->
                    <!--</div>-->
                </tabs>
                <el-table :data="list" v-loading.body="loading" element-loading-text="Loading"
                          fit highlight-current-row
                          @selection-change="handleSelectionChange" height="3.55rem">
                    <el-table-column
                            v-if="batch"
                            type="selection"
                            width="55">
                    </el-table-column>
                    <bos-table-column lable="RFID" field="rfid"></bos-table-column>
                    <bos-table-column lable="装备序号" field="serial"></bos-table-column>
                    <bos-table-column lable="装备名称" field="name"></bos-table-column>
                    <bos-table-column lable="装备型号" field="model"></bos-table-column>
                    <bos-table-column lable="装备位置"
                                      :filter="(row)=>surface(row)"></bos-table-column>
                    <bos-table-column lable="供应商" field="supplier.name"></bos-table-column>
                    <bos-table-column lable="联系人" field="supplier.person"></bos-table-column>
                    <bos-table-column lable="联系方式" field="supplier.phone"></bos-table-column>
                    <bos-table-column lable="维修时长" :filter="(row)=>repairTime(row.repairTime)"></bos-table-column>
                    <!--<bos-table-column lable="上次维修时间" field="time" :filter="(row) => this.$filterTime(row.receiveTime)"></bos-table-column>-->
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

                <!--<bos-paginator v-if="this.list!=''" :pageInfo="paginator" @bosCurrentPageChanged="changePage"/>-->
            </div>
        </el-card>

        <servicedialog title="开始维修装备清单" ref="dialog" :width="'6.921875rem'" @cancel="cancel" @confirm="repairPush(true)">
            <div class="start_table">
                <el-table :data="dialogList" max-height="2.7917rem">
                    <bos-table-column lable="装备名称" field="item.equipArg.name"></bos-table-column>
                    <bos-table-column lable="装备型号" field="item.equipArg.model"></bos-table-column>
                    <bos-table-column lable="装备位置"
                                      :filter="(row)=>surface(row.item.location)"></bos-table-column>
                    <bos-table-column lable="装备件数" :filter="(row)=>row.number"></bos-table-column>
                    <bos-table-column lable="供应商" field="item.equipArg.supplier.name"></bos-table-column>
                    <bos-table-column lable="联系人" field="item.equipArg.supplier.person"></bos-table-column>
                    <bos-table-column lable="联系方式" field="item.equipArg.supplier.phone"></bos-table-column>
                </el-table>
            </div>
        </servicedialog>
        <servicedialog title="结束维修装备清单" ref="dialogEnd" :width="'4.578125rem'" @cancel="cancel" @confirm="repairPush(false)">
            <div class="end_table">
                <el-table :data="dialogList" max-height="2.7865rem">
                    <bos-table-column lable="装备名称" field="item.equipArg.name"></bos-table-column>
                    <bos-table-column lable="装备型号" field="item.equipArg.model"></bos-table-column>
                    <bos-table-column lable="装备位置"
                                      :filter="(row)=>surface(row.item.location)"></bos-table-column>
                    <bos-table-column lable="装备件数" :filter="(row)=>row.number"></bos-table-column>
                </el-table>
            </div>
        </servicedialog>

        <field-dialog title="申请报废" ref="dialog1" @confirm="dialogConfirm">
            <form-container ref="inlineForm" :model="inlineForm">
                <field-input v-model="inlineForm.auditor" label="申请人员" width="3.5" :disabled="true"></field-input>
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
    import servicedialog from 'components/base/gailiangban'
    import api from 'gql/operation.gql'
    import {transformMixin} from 'common/js/transformMixin'
    import {
        retirementApplication,
        getEquipsList,
        equipsMaintain,
        equipsReturn,
        findrepairingEquips,
        repairEquipMaintain,
        findByRfids
    } from "api/operation";
    import {getRfidinfo} from "api/rfid";
    import {start, killProcess,modifyFileName,handheld} from 'common/js/rfidReader'
    // const cmdPath = 'C:\\Users\\Administrator';
    //const exec = window.require('child_process').exec;
    //const spawn = window.require('child_process').spawn;
    // import {killProcess} from "common/js/kill";

    export default {
        data() {
            return {
                tabsList: ['正在维修'],
                equipList: [],
                list: [],
                batch: false,
                loading: true,
                inlineForm: {
                    auditor: JSON.parse(localStorage.getItem('user')).name,
                },
                paginator: {size: 10, page: 1, totalPages: 5, totalElements: 5},
                leadershipList: [],
                unitId: JSON.parse(localStorage.getItem('user')).unitId,
                equipId: '',
                inquire: '',
                pid: '',
                dialogList: [],
                listPush: [],

                rfids:[]
            }
        },
        created() {
            // this.com = JSON.parse(localStorage.getItem('deploy'))['UHF_READ_COM'];
        },
        mounted() {
            this.getEquipServiceList()
        },

        methods: {
            selected(data) {
                console.log(data);
            },
            repairTime(repairTime) {
                let repairTimes = repairTime / 1000 / 60 / 60;
                if (repairTimes < 1) {
                    return '不足一小时'
                } else {
                    return Math.round(repairTimes) + '小时'
                }
            },
            serviceEnd(){
                this.dialogList = [];
                // let rfid=['00003645','19080011','00002','00001545','198023242222222222222222','00008','5555555555'];
                // this.rfids=rfid;
                modifyFileName('return');
                handheld((err) => this.$message.error(err)).then((data) => {
                    let json = JSON.parse(data);
                    this.rfids=json.rfid;
                    findByRfids(this.rfids).then(res=>{
                        this.classify(res);
                        this.$refs.dialogEnd.show();
                    });
                });

            },
            service() {
                this.dialogList = [];
                modifyFileName('repair.json');
                handheld((err) => this.$message.error(err)).then((data) => {
                    let json = JSON.parse(data);
                    this.rfids=json.rfid;
                    findByRfids(this.rfids).then(res=>{
                        this.classify(res);
                        this.$refs.dialog.show();
                    });
                });
                // let rfid=['00003645','19080011','00002','00001545','198023242222222222222222','00008','5555555555'];
                // findByRfids(rfid).then(res=>{
                //     this.classify(res);
                // });
                // this.rfids=rfid;


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
            repairPush(Bool) {
                repairEquipMaintain(this.rfids,Bool).then(res => {
                    this.$message.success('操作成功');
                    if(Bool){
                        this.$refs.dialog.cancel()
                    }else {
                        this.$refs.dialogEnd.cancel();
                    }
                }).catch(err=>{
                    this.$message.error(err.response.data.message)
                })
                // this.gqlMutate(api.admin_maintainEquips, {
                //     equipIdList: this.listPush
                // }, (res) => {
                //     this.callback('已经申请维修!');
                //     this.$refs.dialog.hide();
                //     //spawn("taskkill", ["/PID", this.pid, "/T", "/F"]);
                //     killProcess(this.pid)
                // })
            },
            classify(data){
                let dialogList=[];
                data.forEach(item=>{
                    if(dialogList.length===0){
                        dialogList.push({item:item,number:1});
                    }else {
                        let flag=false;
                        dialogList.forEach(dItem=>{
                            if(!flag&&item.equipArg.name===dItem.item.equipArg.name&&item.equipArg.model===dItem.item.equipArg.model
                                &&item.location.floor===dItem.item.location.floor&&item.location.number===dItem.item.location.number
                                &&item.location.section===dItem.item.location.section&&item.location.surface===dItem.item.location.surface){
                                dItem.number++;
                                flag=true
                            }
                        });
                        if(!flag){
                            dialogList.push({item:item,number:1});
                        }
                    }
                });
                this.dialogList=dialogList
                console.log(this.dialogList);
            },

            cancel() {
                killProcess(this.pid)
            },

            dialogConfirm() {
                this.$refs.inlineForm.axiosData(
                    retirementApplication({
                        equipIdList: this.equipId,
                        leaderId: this.inlineForm.leader,
                        reason: this.inlineForm.reason,
                    }).then((res) => {
                        console.log(res);
                        this.$refs.dialog1.hide();
                        this.getEquipServiceList();
                        this.callback('报废已经申请');
                    })
                )
            },
            scrapped(row) {
                this.gqlQuery(api.getUserList, {}, (res) => {
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
                    equipsReturn(this.equipList).then(res => {
                        console.log(res);
                        this.$message.success("入库成功");
                        this.equipList = [];
                        this.batch = !this.batch;
                        // 刷新列表
                        this.getEquipServiceList()
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
            getEquipServiceList() {
                // let params = {
                //     page: this.paginator.page,
                //     size: this.paginator.size,
                //     search: this.inquire,
                //     state: "MAINTAIN"
                // };
                this.loading = true;
                findrepairingEquips().then(res => {
                    let result = JSON.parse(JSON.stringify(res));
                    this.loading = false;
                    this.list = result
                    // this.paginator.totalPages = res.totalPages
                    // this.paginator.totalElements = res.totalElements
                }).catch(e => {
                    this.loading = false
                })
            },
            changePage(page) {
                this.paginator.page = page;
                this.getEquipServiceList()
            }
        },

        // apollo: {
        //     list() {
        //         return this.getEntityListWithPagintor(api.getEquipList);
        //     },
        // },
        mixins: [formRulesMixin, transformMixin],

        components: {
            equip,
            tabs,
            servicedialog
        },
        watch: {
            inquire(newVal, oldVal) {
                this.getEquipServiceList()
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
        font-size: 16px;
    }

    .start_table {
        width:6.4583rem;
        height: 2.7917rem;
        margin-left: 0.25rem;
        margin-right: 0.25rem;
        margin-top: 0.1458rem;
        background:rgba(255,255,255,1);
    }
    .end_table {
        width:4.1146rem;
        height:2.7865rem;
        margin-left: 0.25rem;
        margin-right: 0.25rem;
        margin-top: 0.1458rem;
        background:rgba(255,255,255,1);
    }
</style>
