<template>
    <div>
        <el-card shadow="never">
            <div slot="header">
                <span class="_card-title">{{$route.meta.title}}</span>
            </div>
            <div>
                <tabs :list="tabsList" :indexDefault="0" @selected="selected">
                    <el-button type="text" class="_textBt" @click="maintenanceShow" v-if="show">
                        <svg-icon icon-class="保养"/>
                        开始保养
                    </el-button>
                    <el-button type="text" class="_textBt" @click="batchstorage" v-else>
                        <svg-icon icon-class="保养"/>
                        结束保养
                    </el-button>
                </tabs>
                <div v-if="show" class="maintenance_body">
                    <div class="maintenance_body_table_box">
                        <el-table class="maintenance_table" :data="list" fit
                                  :row-class-name="tableRowClassName">
                            <bos-table-column lable="装备名称" field="equipArg.name" :align="'left'"></bos-table-column>
                            <bos-table-column lable="装备型号" field="equipArg.model" :align="'left'"></bos-table-column>
                            <bos-table-column lable="供应商" field="equipArg.supplier.name"
                                              :align="'left'"></bos-table-column>
                            <bos-table-column lable="联系人" field="equipArg.supplier.person"
                                              :align="'left'"></bos-table-column>
                            <bos-table-column lable="联系方式" field="equipArg.supplier.phone"
                                              :align="'left'"></bos-table-column>
                            <bos-table-column lable="保养周期" :filter="(row)=>milliToDay(row.equipArg.upkeepCycle)"
                                              :align="'left'"></bos-table-column>
                            <bos-table-column lable="可用/领用"
                                              :filter="(row)=>row.inHouseCount+'/'+row.receiveHouseCount"
                                              :align="'left'"></bos-table-column>
                            <bos-table-column lable="需要保养/可保养" :filter="(row)=>row.needKeepCount+'/'+row.toKeepCount"
                                              :align="'left'"></bos-table-column>

                            <el-table-column type="expand">
                                <template slot-scope="props">
                                    <div class="fold_box">
                                        <div class="fold_title">
                                            <div class="fold_title_item">装备位置</div>
                                            <div class="fold_title_item">数量</div>
                                        </div>
                                        <div class="fold_body">
                                            <div class="fold_item"
                                                 v-for="(item,index) in props.row.equipCountByLocations"
                                                 :style="index==0?'padding-left: 0.038rem;':''">
                                                <div class="fold_body_item" v-text="surface(item)"></div>
                                                <div class="fold_body_item"> {{item.count}}</div>
                                            </div>
                                        </div>
                                        <!--<div class="fold">-->
                                        <!--<div class="fold_title">-->
                                        <!--装备位置-->
                                        <!--</div>-->
                                        <!--<div class="fold_body">-->
                                        <!--<div class="fold_item" v-for="item in props.row.location">-->
                                        <!--{{item.locations}}-->
                                        <!--</div>-->
                                        <!--</div>-->
                                        <!--</div>-->
                                        <div class="fold-line"></div>
                                        <!--<div class="fold">-->
                                        <!--<div class="fold_title">-->
                                        <!--数量-->
                                        <!--</div>-->
                                        <!--<div class="fold_body">-->
                                        <!--<div class="fold_item" v-for="item in props.row.location">-->
                                        <!--{{item.number}}-->
                                        <!--</div>-->
                                        <!--</div>-->
                                        <!--</div>-->
                                    </div>
                                </template>
                            </el-table-column>
                            <!--<bos-table-column -->
                            <!--lable="架体AB面" -->
                            <!--:filter="(row)=>surface(row.equip.location?row.equip.location.surface:'暂无')"-->
                            <!--&gt;</bos-table-column>-->
                            <!--<bos-table-column lable="保养周期/天" :filter="(row)=>milliToDay(row.upkeepCycle)"></bos-table-column>-->
                            <!--<bos-table-column lable="上次保养时间" :filter="(row)=>$filterTime(row.lastUpkeepTime)"></bos-table-column>-->
                            <!--<bos-table-column-->
                            <!--lable="保养倒计时"-->
                            <!--:filter="(row)=>countdown(row.lastUpkeepTime,row.upkeepCycle)"-->
                            <!--&gt;</bos-table-column>-->
                        </el-table>
                    </div>

                    <!--<bos-paginator :pageInfo="paginator" @bosCurrentPageChanged="changePage" v-if="this.list!=''"/>-->

                    <!--<serviceDialog title="确认保养装备清单" ref="maintenanceDialog" @cancel="quit" @confirm="submit" width="5.4167rem">-->
                    <!--<el-table :data="maintenance.list" height="500" fit class="list maintenance-list-box">-->
                    <!--<el-table-column label="序号" width="60" align="center">-->
                    <!--<template scope="scope">{{ scope.$index + 1 }}</template>-->
                    <!--</el-table-column>-->
                    <!--<bos-table-column lable="RFID" field="equip.rfid"></bos-table-column>-->
                    <!--<bos-table-column lable="装备名称" field="equip.name"></bos-table-column>-->
                    <!--<bos-table-column lable="装备序号" field="equip.serial"></bos-table-column>-->
                    <!--<bos-table-column lable="架体编号" field="equip.location.number"></bos-table-column>-->
                    <!--<bos-table-column-->
                    <!--lable="架体AB面"-->
                    <!--:filter="(row)=>surface(row.equip.location?row.equip.location.surface:'暂无')"-->
                    <!--&gt;</bos-table-column>-->
                    <!--<el-table-column label width="60" align="center">-->
                    <!--<template scope="scope">-->
                    <!--<img-->
                    <!--:src="haveImg"-->
                    <!--title="点击取消保养该装备"-->
                    <!--width="16px"-->
                    <!--height="13px"-->
                    <!--@click="cancelMaintenance(scope.row)"-->
                    <!--v-show="scope.row.rfidConfirm == 1"-->
                    <!--style="cursor: pointer"-->
                    <!--/>-->
                    <!--<img-->
                    <!--:src="noneImg"-->
                    <!--width="3px"-->
                    <!--height="17px"-->
                    <!--v-show="scope.row.rfidConfirm == 0"-->
                    <!--/>-->
                    <!--</template>-->
                    <!--</el-table-column>-->
                    <!--</el-table>-->
                    <!--<div class="bottom-tip">-->
                    <!--“<img :src="haveImg" width="16px" height="13px" /> ”为确定保养装备，-->
                    <!--“ <img :src="noneImg" width="3px" height="15px" /> ”为取消保养装备-->
                    <!--</div>-->
                    <!--</serviceDialog>-->

                    <serviceDialog title="提示" ref="dialogButton" :secondary="false" @confirm="dialogConfim">
                        <div class="_dialogDiv">您确定要取消保养该装备吗？</div>
                    </serviceDialog>
                </div>

                <right :batch="batch" ref="rightTable" @cancel="cancel" @tobatch="change" v-if="!show"></right>
                <servicedialog title="开始保养装备清单" ref="maintenanceDialog" :width="'4.151rem'" @cancel="cancel"
                               @confirm="repairPush(true)">
                    <div class="maintenance_start_table">
                        <div class="maintenance__start_table_head">
                            {{`本次保养装备合计：${equipMaintenance}(件)`}}
                        </div>
                        <el-table :data="dialogList" max-height="2.7917rem">
                            <bos-table-column lable="装备名称" field="equipName"></bos-table-column>
                            <bos-table-column lable="装备型号" field="equipModel"></bos-table-column>
                            <bos-table-column lable="可保养/本次保养"
                                              :filter="(row)=>row.totalProgress+'/'+row.currentProgress"
                                              :align="'left'"></bos-table-column>
                        </el-table>
                    </div>
                </servicedialog>
                <servicedialog title="结束保养装备清单" ref="maintenanceEndDialog" :width="'4.7552rem'" @cancel="cancel"
                               @confirm="repairPush(false)">
                    <div class="maintenance_end_table">
                        <el-table :data="dialogList" max-height="2.7865rem">
                            <bos-table-column lable="装备名称" field="item.equipArg.name"></bos-table-column>
                            <bos-table-column lable="装备型号" field="item.equipArg.model"></bos-table-column>
                            <bos-table-column lable="装备位置"
                                              :filter="(row)=>surface(row.item.location)"></bos-table-column>
                            <bos-table-column lable="装备件数" field="number"></bos-table-column>
                        </el-table>
                    </div>
                </servicedialog>
            </div>
        </el-card>
    </div>
</template>

<script>
    import tabs from "components/base/tabs/index";

    import right from "./rightMaintenance";

    import {formRulesMixin} from "field/common/mixinAxios";
    import servicedialog from "components/base/gailiangban";
    import serviceDialog from "components/base/serviceDialog";
    import {transformMixin} from "common/js/transformMixin";
    import {getNeedUpkeep, findneedkeepEquips} from "api/needs";
    import {upkeep, findByRfids} from "api/operation"

    var _ = require("lodash");
    import {start, killProcess, modifyFileName, handheld} from "common/js/rfidReader"
    //const exec = window.require('child_process').exec;
    //const spawn = window.require('child_process').spawn;
    // import {killProcess} from "common/js/kill";

    export default {
        data() {
            return {
                tabsList: ["需要保养", "正在保养"],
                type: "",
                inquire: "",
                batch: false, // 是否显示多选框(正在保养)
                show: true,
                title: "",
                equipMaintenance: 0,
                dialogList: [],
                equipList: [], // 保存确认保养的装备id
                param: {
                    property: "lastUpkeepTime",
                    direction: "ASC"
                },
                list: [], // 界面装备数据
                haveImg: require("@/assets/have.png"),
                noneImg: require("@/assets/none.png"),
                rfidList: [], // 扫描时，记录rfid
                process: {
                    pid: "",
                    index: 0 // 用以判断是否是第一条数据  {"status":"succeed"}
                },
                maintenance: {
                    list: [],
                    cancelZb: {} // 取消保养的装备
                } // 批量保养列表
            };
        },
        mixins: [formRulesMixin, transformMixin],

        methods: {
            batchstorage() {
                // this.batch = !this.batch;
                this.dialogList = [];
                modifyFileName('search.json');
                handheld((err) => this.$message.error(err)).then((data) => {
                    let json = JSON.parse(data);
                    this.rfids = json.rfid;
                    findByRfids(this.rfids).then(res => {
                        this.classify(res);
                        this.$refs.maintenanceEndDialog.show();
                    });
                });
            },
            classify(data) {
                let dialogList = [];
                data.forEach(item => {
                    if (dialogList.length === 0) {
                        dialogList.push({item: item, number: 1});
                    } else {
                        let flag = false;
                        dialogList.forEach(dItem => {
                            if (!flag && item.equipArg.name === dItem.item.equipArg.name && item.equipArg.model === dItem.item.equipArg.model
                                && item.location.floor === dItem.item.location.floor && item.location.number === dItem.item.location.number
                                && item.location.section === dItem.item.location.section && item.location.surface === dItem.item.location.surface) {
                                dItem.number++;
                                flag = true
                            }
                        });
                        if (!flag) {
                            dialogList.push({item: item, number: 1});
                        }
                    }
                });
                this.dialogList = dialogList;
            },
            selected(data) {
                this.type = data;
                if (data === "需要保养") {
                    this.show = true;
                    if (this.$route.query['name']) {
                        this.inquire = this.$route.query.name;
                    } else {
                        this.getList();
                    }
                } else if (data === "正在保养") {
                    this.show = false;
                }
                this.batch = false;
            },

            cancel(data) {
                this.batch = data;
            },

            async getList() {
                findneedkeepEquips().then(res => {
                    this.list = res
                });
                // this.list = await this.getAxiosList1(getNeedUpkeep);
                // this.list = [{
                //     name: '金属手铐',
                //     model: '装备型号',
                //     approve: 3,
                //     neckband: 1,
                //     waiting: 1,
                //     interval: 30,
                //     supplier: '浙江华安安全设备有限公司'
                //     ,
                //     liaison: '周行行',
                //     phone: '18923453436',
                //     location: [{locations: '10架/A面/2节/6层', number: 10}, {
                //         locations: '10架/A面/2节/6层',
                //         number: 10
                //     }, {locations: '10架/A面/2节/6层', number: 10}, {
                //         locations: '10架/A面/2节/6层',
                //         number: 10
                //     }, {locations: '10架/A面/2节/6层', number: 10},]
                // },
                //     {
                //         name: '金属手铐',
                //         model: '装备型号',
                //         approve: 3,
                //         neckband: 1,
                //         waiting: 1,
                //         interval: 30,
                //         supplier: '浙江华安安全设备有限公司'
                //         ,
                //         liaison: '周行行',
                //         phone: '18923453436',
                //         location: [{locations: '10架/A面/2节/6层', number: 10}, {
                //             locations: '10架/A面/2节/6层',
                //             number: 10
                //         }, {locations: '10架/A面/2节/6层', number: 10}, {
                //             locations: '10架/A面/2节/6层',
                //             number: 10
                //         }, {locations: '10架/A面/2节/6层', number: 10}]
                //     },
                //     , {
                //         name: '金属手铐',
                //         model: '装备型号',
                //         approve: 3,
                //         neckband: 1,
                //         waiting: 1,
                //         interval: 30,
                //         supplier: '浙江华安安全设备有限公司'
                //         ,
                //         liaison: '周行行',
                //         phone: '18923453436',
                //         location: [{locations: '10架/A面/2节/6层', number: 10}, {
                //             locations: '10架/A面/2节/6层',
                //             number: 10
                //         }, {locations: '10架/A面/2节/6层', number: 10}]
                //     }]
            },
            cancel() {

            },
            repairPush(Bool) {
                upkeep(this.rfids, Bool).then(res => {
                    this.$message.success('操作成功');
                    if(Bool){
                        this.getList();
                        this.$refs.maintenanceDialog.cancel()
                    }else {
                        this.$refs.rightTable.getList();
                        this.$refs.maintenanceEndDialog.cancel();
                    }
                }).catch(err=>{
                    this.$message.error(err.response.data.message)
                })
            },
            /* 显示具体的保养列表 */
            maintenanceShow() {
                this.dialogList = [];
                this.rfids=[];
                modifyFileName('keep.json');
                handheld((err) => this.$message.error(err)).then((data) => {
                    this.dialogList=JSON.parse(data).inventoryModels;
                    this.equipMaintenance = 0;
                    this.dialogList.forEach(item => {
                        this.equipMaintenance += item.currentProgress;
                        this.rfids=[...this.rfids,...item.rfids]
                    });
                    this.$refs.maintenanceDialog.show();
                });


                // start("java -jar scan.jar", (data) => {
                //         data = data.replace(/[\r\n]/g, "") // 扫描值带有 "%0A" 后缀
                //         let noHave = true;
                //         this.maintenance.list.forEach(item => {
                //             if (item.equip.rfid == data) {
                //                 item.rfidConfirm = 1;
                //                 noHave = false
                //                 this.equipList.push(item.equip.id);
                //                 this.$message({
                //                     message: "装备扫描成功！",
                //                     type: "success"
                //                 });
                //             }
                //         });
                //         if (noHave) {
                //             this.$message.error("该装备不属于装备保养清单！")
                //         }
                //     }, (fail) => {
                //         this.$message.error(fail)
                //     },
                //     (pid, err) => {
                //         pid ? this.process.pid = pid : this.$message.error(err)
                //     })

                // const process = exec(`java -jar scan.jar 4`, { cwd: "C:\\Users\\10359" });

                // this.process.pid = process.pid;

                // process.stderr.on("data", err => {
                //   console.log(err);
                //   this.$message.error("设备故障请重新插拔!插入后请重新选择装备");
                //   killProcess();
                // });

                // process.stdout.on("data", (data) => {
                //   data = data.replace(/[\r\n]/g, "") // 扫描值带有 "%0A" 后缀
                //   let noHave = true;
                //   if (this.process.index == 1) {
                //     this.maintenance.list.forEach(item => {
                //       if (item.equip.rfid == data) {
                //         item.rfidConfirm = 1;
                //         noHave = false
                // this.equipList.push(item.equip.id);
                //         this.$message({
                //           message: "装备扫描成功！",
                //           type: "success"
                //         });
                //       }
                //     });
                //     if(noHave) {
                //       this.$message.error("该装备不属于装备保养清单！")
                //     }
                //   } else {
                //     let newData = JSON.parse(data);
                //     newData.status == "succeed"
                //       ? (this.process.index = 1)
                //       : (this.process.index = 0);
                //   }
                // });

                // process.on("exit", code => {
                //   if (this.index === 0) {
                //     this.$message.error("设备未插入或串口号错误,插入后请重新选择装备!");
                //   }
                //   console.log(`子进程退出，退出码 ${code}`);
                // });
            },
            /* 点击保养列表勾 */
            cancelMaintenance(item) {
                this.maintenance.cancelZb = item;
                this.$refs.dialogButton.show();
            },
            /* 放弃本次操作 */
            quit() {
                this.equipList = [];
                //spawn("taskkill", ["/PID", this.process.pid, "/T", "/F"]);
                killProcess(this.process.pid)

            },
            tableRowClassName({row, rowIndex}) {
                return 'table-row';
            },
            /* 确认取消保养该装备 */
            dialogConfim() {
                this.maintenance.cancelZb.rfidConfirm = 0;
                _.remove(this.equipList, item => {
                    return item == this.maintenance.cancelZb.equip.id;
                });
                this.$refs.dialogButton.hide();
            },
            change() {
                this.batch = !this.batch
            },
            /* 确认保养 */
            // submit() {
            //     if (0 in this.equipList) {
            //         equipsUpkeep(this.equipList).then(res => {
            //             this.$refs.maintenanceDialog.hide();
            //             this.$message.success("保养成功");
            //             this.getList();
            //             this.equipList = [];
            //             killProcess(this.process.pid)
            //         })
            //     } else {
            //         this.$message.error("未选择装备!");
            //     }
            // },
            single(row) {
                this.$refs.dialogButton.show();
                this.equipList.push(row.equip.id);
            }
        },

        // mounted() {
        //   if (this.$route.query) {
        //     this.inquire = this.$route.query.name;
        //   }
        //   this.getList();
        // },

        watch: {
            inquire(newVal) {
                if (newVal) {
                    this.$set(this.param, "search", newVal);
                } else {
                    this.$set(this.param, 'search', null);
                }
            }
        },

        components: {
            tabs,
            right,
            servicedialog,
            serviceDialog
        },
        beforeDestroy() {
            killProcess(this.process.pid)
        }
    };
</script>

<style lang="scss" scoped>
    /deep/ .el-table .table-row {
        background: #FAEEDA;
    }

    /deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
        background-color: rgba(255, 255, 255, 0) !important;
    }

    /deep/ .el-table__expanded-cell[class*=cell] {
        padding: 0px 0px;
    }

    .el-card {
        border: none !important;
        font-size: 16px;
    }

    .el-card .maintenance_body {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        margin-top: 34px
    }

    .maintenance_body .maintenance_body_table_box {
        width: 7.8698rem;
    }

    .maintenance_body_table_box .maintenance_table {
        width: 7.8698rem;
        border: 1px solid rgba(112, 112, 112, 0.13)
    }

    .maintenance_table .fold_box {
        width: 7.8698rem;
        height: 0.4323rem;
        display: flex;
        flex-direction: row;
        color: black;
        position: relative;
        background: #F5F5F5;
    }

    .fold_box .fold-line {
        height: 1px;
        width: 100%;
        background: rgba(112, 112, 112, 0.15);
        position: absolute;
        margin-top: calc(0.4323rem / 2);
    }

    .fold_box .fold {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
    }

    .fold_box .fold_title {
        min-width: calc(7.6198rem / 8);
        height: 100%;
        margin-left: 0.023rem;
    }

    .fold_title .fold_title_item {
        height: 50%;
        display: flex;
        align-items: center;
        justify-content: left;
        padding-left: 0.032rem;
    }

    .fold_box .fold_body {
        max-width: calc(7.8698rem / 8 * 7);
        min-width: calc(7.8698rem / 8 * 7);
        height: 100%;
        display: flex;
        overflow: auto;
        flex-direction: row;
        flex-wrap: nowrap;
    }

    .fold_body::-webkit-scrollbar {
        width: 2px;
        height: 5px;

    }

    .fold_body::-webkit-scrollbar-thumb {
        background-color: rgba(144, 147, 153, 0.1);
    }

    .fold_body::-webkit-scrollbar-track { /*滚动条里面轨道*/
        -webkit-box-shadow: #F5F5F5;
        box-shadow: #F5F5F5;
        border-radius: 10px;
        background: #F5F5F5;
    }

    .fold_body::-webkit-scrollbar-thumb:hover {
        background: rgba(144, 147, 153, 0.3);
    }

    .fold_item .fold_body_item {
        height: 50%;
        display: flex;
        align-items: center;
        justify-content: left;
    }

    .fold_body .fold_item {
        display: flex;
        min-width: calc(7.6198rem / 8 * 2);
        flex-direction: column;
        height: 100%;
    }

    .maintenance-list-box {
        border: 1px solid rgba(112, 112, 112, 1);
        border-radius: 5px;
    }

    .bottom-tip {
        margin-top: 0.0521rem;
        font-size: 0.0833rem;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 0.1042rem;
        color: rgba(112, 112, 112, 1);
    }
</style>

<style scoped>
    .maintenance_start_table {
        width: 3.75rem;
        height: 3.776rem;
        margin-left: 0.25rem;
        margin-right: 0.25rem;
        margin-top: 0.1458rem;
        background: rgba(255, 255, 255, 1);
    }

    .maintenance_start_table .maintenance__start_table_head {
        width: 100%;
        height: 0.34375rem;
        background: rgba(224, 224, 224, 0.32);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 400;
        font-size: 24px;
        color: #EF4545;
    }

    .maintenance_end_table {
        width: 4.349rem;
        height: 3.776rem;
        margin-left: 0.25rem;
        margin-right: 0.25rem;
        margin-top: 0.1458rem;
        background: rgba(255, 255, 255, 1);
    }

    ::-webkit-scrollbar {
        width: 6px;
        height: 10px;
    }

    ::-webkit-scrollbar-thumb {
        background: rgba(47, 47, 118, 0.27);
        border-radius: 22px;
    }

    ::-webkit-scrollbar-track {
        border-radius: 10px;
        background-color: #fff;
    }
</style>